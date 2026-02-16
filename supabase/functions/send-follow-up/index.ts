import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const SUPABASE_URL = "https://owxuoejwnxspzuleeyqi.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im93eHVvZWp3bnhzcHp1bGVleXFpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA2NzM4NDgsImV4cCI6MjA4NjI0OTg0OH0.snwR-UPW1Qrm_pqT6qSWVmAYHR5nsL1-xaxwz9LZotA";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
    if (!RESEND_API_KEY) {
      throw new Error("RESEND_API_KEY not configured");
    }

    const SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    if (!SERVICE_ROLE_KEY) {
      throw new Error("SUPABASE_SERVICE_ROLE_KEY not configured");
    }

    const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

    // Two modes: "send" (cron/manual trigger) or "schedule" (user schedules a follow-up)
    const body = await req.json().catch(() => ({}));
    const mode = body.mode || "send";

    if (mode === "schedule") {
      // Schedule a follow-up for a specific lead
      const authHeader = req.headers.get("Authorization");
      if (!authHeader) {
        return new Response(
          JSON.stringify({ error: "Unauthorized" }),
          { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      const userClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
        global: { headers: { Authorization: authHeader } },
      });

      const { data: { user } } = await userClient.auth.getUser();
      if (!user) {
        return new Response(
          JSON.stringify({ error: "Unauthorized" }),
          { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Get user's profile ID
      const { data: profile } = await supabase
        .from("users")
        .select("id")
        .eq("auth_user_id", user.id)
        .single();

      if (!profile) {
        return new Response(
          JSON.stringify({ error: "Profile not found" }),
          { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      const { lead_id, subject, body_html, delay_hours } = body;
      if (!lead_id || !subject || !body_html) {
        return new Response(
          JSON.stringify({ error: "lead_id, subject, and body_html are required" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      const scheduledAt = new Date(Date.now() + (delay_hours || 24) * 60 * 60 * 1000).toISOString();

      const { data: followUp, error } = await supabase
        .from("follow_up_emails")
        .insert({
          lead_id,
          user_id: profile.id,
          subject,
          body_html,
          delay_hours: delay_hours || 24,
          scheduled_at: scheduledAt,
          status: "pending",
        })
        .select()
        .single();

      if (error) {
        return new Response(
          JSON.stringify({ error: error.message }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      return new Response(
        JSON.stringify({ success: true, follow_up: followUp }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Mode: "send" — process pending follow-ups (called by cron or manually)
    const now = new Date().toISOString();

    const { data: pendingEmails, error: fetchErr } = await supabase
      .from("follow_up_emails")
      .select(`
        id, subject, body_html, lead_id, user_id,
        leads!inner(lead_name, lead_email),
        users!inner(name, email, reply_to_email, reply_to_name, company_name)
      `)
      .eq("status", "pending")
      .lte("scheduled_at", now)
      .limit(50);

    if (fetchErr) {
      throw new Error(`Fetch error: ${fetchErr.message}`);
    }

    if (!pendingEmails || pendingEmails.length === 0) {
      return new Response(
        JSON.stringify({ processed: 0 }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    let sent = 0;
    let failed = 0;

    for (const email of pendingEmails) {
      const lead = email.leads as any;
      const sender = email.users as any;

      if (!lead?.lead_email) {
        await supabase
          .from("follow_up_emails")
          .update({ status: "failed", error_message: "Lead has no email", sent_at: now })
          .eq("id", email.id);
        failed++;
        continue;
      }

      // Replace placeholders in subject and body
      const replacements: Record<string, string> = {
        "{lead_name}": lead.lead_name || "there",
        "{lead_email}": lead.lead_email || "",
        "{sender_name}": sender.name || "",
        "{sender_email}": sender.email || "",
        "{company_name}": sender.company_name || "",
      };

      let finalSubject = email.subject;
      let finalBody = email.body_html;
      for (const [key, val] of Object.entries(replacements)) {
        finalSubject = finalSubject.replaceAll(key, val);
        finalBody = finalBody.replaceAll(key, val);
      }

      // Determine reply-to
      const replyToEmail = sender.reply_to_email || sender.email;
      const replyToName = sender.reply_to_name || sender.name || "";

      try {
        const resendRes = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${RESEND_API_KEY}`,
          },
          body: JSON.stringify({
            from: "NFCwear <noreply@severmore.de>",
            reply_to: replyToName ? `${replyToName} <${replyToEmail}>` : replyToEmail,
            to: [lead.lead_email],
            subject: finalSubject,
            html: finalBody,
          }),
        });

        const resendData = await resendRes.json();

        if (resendRes.ok) {
          await supabase
            .from("follow_up_emails")
            .update({ status: "sent", sent_at: new Date().toISOString() })
            .eq("id", email.id);
          sent++;
        } else {
          await supabase
            .from("follow_up_emails")
            .update({
              status: "failed",
              error_message: resendData.message || JSON.stringify(resendData),
              sent_at: new Date().toISOString(),
            })
            .eq("id", email.id);
          failed++;
        }
      } catch (sendErr: any) {
        await supabase
          .from("follow_up_emails")
          .update({
            status: "failed",
            error_message: sendErr.message,
            sent_at: new Date().toISOString(),
          })
          .eq("id", email.id);
        failed++;
      }
    }

    return new Response(
      JSON.stringify({ processed: pendingEmails.length, sent, failed }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err: any) {
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
