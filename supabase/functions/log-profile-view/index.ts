import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
    // Handle CORS preflight requests
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        const supabase = createClient(
            Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
        )

        const { user_id, device_type, user_agent, referrer } = await req.json()

        // Get IP address
        const ip = req.headers.get('x-forwarded-for')?.split(',')[0] || req.headers.get('cf-connecting-ip') || 'unknown'

        // Geo-IP lookup
        let country = 'Unknown'
        if (ip !== 'unknown' && ip !== '127.0.0.1' && ip !== 'localhost') {
            try {
                const geoResponse = await fetch(`http://ip-api.com/json/${ip}`)
                const geoData = await geoResponse.json()
                if (geoData.status === 'success') {
                    country = geoData.country
                }
            } catch (e) {
                console.error('Geo-IP lookup failed:', e)
            }
        }

        // Call DB function
        const { data, error } = await supabase.rpc('log_profile_view', {
            p_user_id: user_id,
            p_ip_address: ip,
            p_device_type: device_type,
            p_user_agent: user_agent,
            p_referrer: referrer,
            p_country: country
        })

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
