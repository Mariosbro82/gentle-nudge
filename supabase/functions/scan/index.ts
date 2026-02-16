
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

// Setup Supabase client
const supabaseUrl = Deno.env.get('SUPABASE_URL')!
const supabaseServiceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
const supabase = createClient(supabaseUrl, supabaseServiceRoleKey)

// CORS headers
const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
    // Handle CORS
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        const url = new URL(req.url)

        // 1. Get Chip UID from query param or path
        // Example: /scan?uid=123 or /scan/123
        let chipUid = url.searchParams.get('uid')
        if (!chipUid) {
            // Try to parse from path if not query param
            const pathParts = url.pathname.split('/')
            // Assuming path is /functions/v1/scan/[uid]
            if (pathParts.length > 0) {
                chipUid = pathParts[pathParts.length - 1]
            }
        }

        if (!chipUid) {
            return new Response(JSON.stringify({ error: 'Missing UID' }), {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                status: 400
            })
        }

        // 2. Lookup Chip in Database
        const { data: chip, error: chipError } = await supabase
            .from('chips')
            .select(`
        *,
        company:companies(name),
        assigned_user:users(slug)
      `)
            .eq('uid', chipUid)
            .single()

        if (chipError || !chip) {
            console.error('Chip lookup error:', chipError)
            // Chip not found -> Generic Fallback (e.g., Homepage or "Activate this chip")
            // For now, let's redirect to a generic "Chip Not Found" or Home
            return Response.redirect('https://nfcwear.de/?error=chip_not_found', 302)
        }

        // 3. Analytics: Log Scan
        const userAgent = req.headers.get('user-agent') || 'unknown'
        const ipAddress = req.headers.get('x-forwarded-for') || 'unknown'

        // Simple device type detection
        let deviceType = 'desktop'
        if (/mobile/i.test(userAgent)) deviceType = 'mobile'
        else if (/tablet/i.test(userAgent)) deviceType = 'tablet'

        await supabase.from('scans').insert({
            chip_id: chip.id,
            scanned_at: new Date().toISOString(),
            ip_address: ipAddress,
            user_agent: userAgent,
            device_type: deviceType,
            mode_at_scan: chip.active_mode
        })

        // 4. Routing Logic
        // Default fallback
        let redirectUrl = 'https://nfcwear.de'

        if (chip.active_mode === 'lost') {
            // LOST MODE -> Finder Page
            redirectUrl = `https://nfcwear.de/lost?chip=${chipUid}`
        } else if (!chip.assigned_user_id) {
            // UNASSIGNED -> Onboarding
            redirectUrl = `https://nfcwear.de/onboarding?chip=${chipUid}`
        } else if (chip.active_mode === 'corporate') {
            // CORPORATE -> User Profile
            if (chip.assigned_user?.slug) {
                redirectUrl = `https://nfcwear.de/p/${chip.assigned_user.slug}`
            } else {
                // Fallback if slug missing but assigned
                redirectUrl = `https://nfcwear.de/p/${chip.assigned_user_id}`
            }
        } else if (chip.active_mode === 'hospitality') {
            // HOSPITALITY -> Menu/Link
            // TODO: check if database has specific URL for hospitality, otherwise maybe use target_url
            if (chip.menu_data?.url) {
                redirectUrl = chip.menu_data.url
            } else if (chip.target_url) {
                redirectUrl = chip.target_url
            }
        } else if (chip.active_mode === 'campaign') {
            // CAMPAIGN -> Target URL
            if (chip.target_url) {
                redirectUrl = chip.target_url
            }
        } else {
            // Default generic handler for other modes or fallbacks
            if (chip.target_url) {
                redirectUrl = chip.target_url
            }
        }

        // Perform Redirect
        return Response.redirect(redirectUrl, 302)

    } catch (error: unknown) {
        console.error('Scan function error:', error)
        const message = error instanceof Error ? error.message : 'Unknown error';
        return new Response(JSON.stringify({ error: message }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 500,
        })
    }
})
