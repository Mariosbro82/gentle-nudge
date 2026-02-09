import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
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

        const { data, error } = await supabase
            .from('leads')
            .insert([
                {
                    captured_by_user_id,
                    lead_name,
                    lead_email,
                    lead_phone: lead_phone || null, // Handle optional field if it exists in schema? Default schema has no phone, checking BACKEND_DATA_LOGIC...
                    // BACKEND_DATA_LOGIC lists lead_name, lead_email, captured_by_user_id. 
                    // Wait, user plan says "Body: { ... lead_phone, ... }". 
                    // Need to check if lead_phone, notes, sentiment exist in leads table.
                    // BACKEND_DATA_LOGIC does NOT list them.
                    // I should verify columns or add them if missing.
                    // The migration ONLY added ip_address.
                    // I will assume for now only standard columns + ip_address, OR I should add them.
                    // Re-reading user plan: "Alter leads table - Add ip_address TEXT column...". 
                    // It does NOT mention adding lead_phone, notes, sentiment.
                    // But "Body: { ... lead_phone, notes, sentiment }" implies they might be there or should be handling them.
                    // I will inspect the leads table definition in the codebase first or just insert what is known.
                    // For now, I'll stick to what is in BACKEND_DATA_LOGIC plus ip_address.
                    // Actually, let's look at existing code or migration.
                    // Checking 20260210... migration only added ip_address.
                    // Checking BACKEND_DATA_LOGIC, only lead_name, lead_email, captured_by_user_id.
                    // So passing lead_phone etc. might fail if columns don't exist.
                    // However, the user plan explicitly lists them in the Body for the Edge Function.
                    // Maybe they are already there but undocumented?
                    // I'll check the source code for `src/components/profile/contact-form.tsx` to see what it helps submit.
                    // Or I should add them in the migration if they are needed.
                    // User plan "Stage 1" says "Alter leads table - Add ip_address TEXT column". It doesn't mention others.
                    // But "Stage 2B" says "Body: { ... lead_phone, notes, sentiment }".
                    // This implies a discrepancy or they exist.
                    // I'll check `src/types/supabase.ts` or `src/integrations/supabase/types.ts` to see current definition.

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
