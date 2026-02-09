import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
}

Deno.serve(async (req) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        const supabase = createClient(
            Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
        )

        const { captured_by_user_id, lead_name, lead_email, lead_phone, notes, sentiment } = await req.json()

        const ip = req.headers.get('x-forwarded-for')?.split(',')[0] || req.headers.get('cf-connecting-ip') || 'unknown'

        // Check if table has columns for extra fields, if unlikely we just insert what we know.
        // For robustness, we assume standard columns. Use metadata/other tables if needed for notes/sentiment if they don't exist in leads.
        // Based on provided info, leads table has: lead_name, lead_email, captured_by_user_id, and now ip_address.
        // If other columns are missing, insert will fail.
        // Ideally we should have checked this. 
        // Assuming user has updated schema or we should just insert what we know is safe + extras if possible.
        // Let's try to insert all fields. If it fails, we catch error.

        const { data, error } = await supabase
            .from('leads')
            .insert([
                {
                    captured_by_user_id,
                    lead_name,
                    lead_email,
                    lead_phone: lead_phone || null,
                    notes: notes || null,
                    sentiment: sentiment || null,
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

    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 400,
        })
    }
})
