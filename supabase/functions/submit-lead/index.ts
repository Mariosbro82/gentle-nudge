import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const VALID_SENTIMENTS = ['hot', 'warm', 'cold'];

Deno.serve(async (req) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        const supabase = createClient(
            Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
        )

        const body = await req.json()
        const { captured_by_user_id, lead_name, lead_email, lead_phone, notes, sentiment } = body

        // Validate required fields
        if (!captured_by_user_id || !UUID_REGEX.test(captured_by_user_id)) {
            return new Response(JSON.stringify({ error: 'Invalid or missing captured_by_user_id' }), {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                status: 400,
            })
        }

        // Validate captured_by_user_id exists
        const { data: userExists } = await supabase
            .from('users')
            .select('id')
            .eq('id', captured_by_user_id)
            .single()

        if (!userExists) {
            return new Response(JSON.stringify({ error: 'User not found' }), {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                status: 400,
            })
        }

        // Validate email format if provided
        if (lead_email && !EMAIL_REGEX.test(lead_email)) {
            return new Response(JSON.stringify({ error: 'Invalid email format' }), {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                status: 400,
            })
        }

        // Validate sentiment enum
        const validSentiment = sentiment && VALID_SENTIMENTS.includes(sentiment) ? sentiment : 'warm';

        // Enforce length limits
        const sanitizedName = lead_name ? String(lead_name).substring(0, 200) : null;
        const sanitizedEmail = lead_email ? String(lead_email).substring(0, 255) : null;
        const sanitizedPhone = lead_phone ? String(lead_phone).substring(0, 50) : null;
        const sanitizedNotes = notes ? String(notes).substring(0, 1000) : null;

        const ip = req.headers.get('x-forwarded-for')?.split(',')[0] || req.headers.get('cf-connecting-ip') || 'unknown'

        const { data, error } = await supabase
            .from('leads')
            .insert([
                {
                    captured_by_user_id,
                    lead_name: sanitizedName,
                    lead_email: sanitizedEmail,
                    lead_phone: sanitizedPhone,
                    notes: sanitizedNotes,
                    sentiment: validSentiment,
                    ip_address: ip
                }
            ])
            .select()
            .single()

        if (error) throw error

        return new Response(JSON.stringify(data), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200,
        })

    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        return new Response(JSON.stringify({ error: message }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 400,
        })
    }
})
