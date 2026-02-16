import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// SSRF protection: block private/internal IP ranges
const BLOCKED_HOSTNAME_PATTERNS = [
  /^localhost$/i,
  /^127\./,
  /^0\.0\.0\.0$/,
  /^10\./,
  /^192\.168\./,
  /^172\.(1[6-9]|2[0-9]|3[0-1])\./,
  /^169\.254\./,
  /^::1$/,
  /^fc00:/i,
  /^fe80:/i,
  /^\[::1\]$/,
];

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ success: false, error: "Nicht autorisiert." }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return new Response(JSON.stringify({ success: false, error: "Nicht autorisiert." }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { webhook_url } = await req.json();

    if (!webhook_url || typeof webhook_url !== "string") {
      return new Response(JSON.stringify({ success: false, error: "Keine Webhook-URL angegeben." }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Validate URL
    let parsed: URL;
    try {
      parsed = new URL(webhook_url);
    } catch {
      return new Response(JSON.stringify({ success: false, error: "Ungültige URL." }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (parsed.protocol !== "https:") {
      return new Response(JSON.stringify({ success: false, error: "Nur HTTPS-URLs erlaubt." }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // SSRF protection: block private/internal addresses
    const hostname = parsed.hostname;
    if (BLOCKED_HOSTNAME_PATTERNS.some(pattern => pattern.test(hostname))) {
      return new Response(JSON.stringify({ 
        success: false, 
        error: "Webhook-URLs dürfen nicht auf private/interne Adressen verweisen." 
      }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Block raw IP addresses to prevent DNS rebinding
    if (/^\d+\.\d+\.\d+\.\d+$/.test(hostname)) {
      return new Response(JSON.stringify({ 
        success: false, 
        error: "Webhook-URLs müssen Domainnamen verwenden, keine IP-Adressen." 
      }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Send test payload
    const testPayload = {
      event: "test",
      timestamp: new Date().toISOString(),
      lead: {
        name: "Test Kontakt",
        email: "test@example.com",
        phone: "+49 123 456789",
        sentiment: "warm",
        notes: "Dies ist ein Test-Webhook von NFC Wear.",
        created_at: new Date().toISOString(),
      },
      captured_by: "Test",
    };

    const webhookResponse = await fetch(webhook_url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "User-Agent": "NFC-Wear-Webhook/1.0",
      },
      body: JSON.stringify(testPayload),
    });

    const statusCode = webhookResponse.status;
    const success = statusCode >= 200 && statusCode < 300;

    return new Response(
      JSON.stringify({ success, status_code: statusCode }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ success: false, error: (err as Error).message || "Unbekannter Fehler." }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
