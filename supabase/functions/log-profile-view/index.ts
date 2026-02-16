import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
}

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

Deno.serve(async (req) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        const supabase = createClient(
            Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
        )

        const { user_id, device_type, user_agent, referrer } = await req.json()

        // Validate user_id is a valid UUID
        if (!user_id || !UUID_REGEX.test(user_id)) {
            return new Response(JSON.stringify({ error: 'Invalid or missing user_id' }), {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                status: 400,
            })
        }

        // Enforce length limits on text fields
        const sanitizedDeviceType = device_type ? String(device_type).substring(0, 50) : 'unknown';
        const sanitizedUserAgent = user_agent ? String(user_agent).substring(0, 500) : 'unknown';
        const sanitizedReferrer = referrer ? String(referrer).substring(0, 500) : '';

        // Get IP address
        const ip = req.headers.get('x-forwarded-for')?.split(',')[0] || req.headers.get('cf-connecting-ip') || 'unknown'

        // Geo-IP lookup
        let country = 'Unknown'
        if (ip !== 'unknown' && ip !== '127.0.0.1' && ip !== 'localhost' && !ip.startsWith('192.168.') && !ip.startsWith('10.')) {
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
            p_device_type: sanitizedDeviceType,
            p_user_agent: sanitizedUserAgent,
            p_referrer: sanitizedReferrer,
            p_country: country
        })

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
