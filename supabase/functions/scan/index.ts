
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const supabaseUrl = Deno.env.get('SUPABASE_URL')!
const supabaseServiceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
const supabase = createClient(supabaseUrl, supabaseServiceRoleKey)

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        const url = new URL(req.url)
        const accept = req.headers.get('accept') || ''
        const wantsJson = accept.includes('application/json')

        let chipUid = url.searchParams.get('uid')
        if (!chipUid) {
            const pathParts = url.pathname.split('/')
            if (pathParts.length > 0) {
                chipUid = pathParts[pathParts.length - 1]
            }
        }

        if (!chipUid) {
            if (wantsJson) {
                return new Response(JSON.stringify({ error: 'Missing UID' }), {
                    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                    status: 400
                })
            }
            return Response.redirect('https://nfcwear.de/?error=missing_uid', 302)
        }

        const { data: chip, error: chipError } = await supabase
            .from('chips')
            .select(`*, company:companies(name), assigned_user:users(slug, id, ghost_mode, ghost_mode_until)`)
            .eq('uid', chipUid)
            .single()

        if (chipError || !chip) {
            console.error('Chip lookup error:', chipError)
            if (wantsJson) {
                return new Response(JSON.stringify({ error: 'chip_not_found' }), {
                    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                    status: 404
                })
            }
            return Response.redirect('https://nfcwear.de/?error=chip_not_found', 302)
        }

        // Log scan
        const userAgent = req.headers.get('user-agent') || 'unknown'
        const ipAddress = req.headers.get('x-forwarded-for') || 'unknown'
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

        // Build route path (relative, no domain)
        let routePath = '/'
        const assignedUser = chip.assigned_user as any

        // Ghost mode check
        if (assignedUser?.ghost_mode) {
            const ghostUntil = assignedUser.ghost_mode_until
            const isStillGhosted = !ghostUntil || new Date(ghostUntil) > new Date()
            if (isStillGhosted) {
                routePath = assignedUser.slug ? `/p/${assignedUser.slug}` : `/p/${assignedUser.id}`
                return jsonOrRedirect(wantsJson, routePath, corsHeaders)
            }
        }

        switch (chip.active_mode) {
            case 'corporate':
                if (assignedUser?.slug) {
                    routePath = `/p/${assignedUser.slug}`
                } else if (chip.assigned_user_id) {
                    routePath = `/p/${chip.assigned_user_id}`
                } else {
                    routePath = `/claim/${chipUid}`
                }
                break
            case 'hospitality':
                if (chip.menu_data?.url) {
                    // External URL
                    if (wantsJson) {
                        return new Response(JSON.stringify({ redirect: chip.menu_data.url, external: true }), {
                            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
                        })
                    }
                    return Response.redirect(chip.menu_data.url, 302)
                } else if (chip.target_url) {
                    if (wantsJson) {
                        return new Response(JSON.stringify({ redirect: chip.target_url, external: true }), {
                            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
                        })
                    }
                    return Response.redirect(chip.target_url, 302)
                } else if (chip.company_id) {
                    routePath = `/review/${chip.company_id}`
                } else if (assignedUser) {
                    routePath = assignedUser.slug ? `/p/${assignedUser.slug}` : `/p/${assignedUser.id}`
                }
                break
            case 'campaign':
                if (chip.target_url) {
                    if (wantsJson) {
                        return new Response(JSON.stringify({ redirect: chip.target_url, external: true }), {
                            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
                        })
                    }
                    return Response.redirect(chip.target_url, 302)
                } else if (chip.company_id) {
                    routePath = `/campaign/${chip.company_id}`
                } else if (assignedUser) {
                    routePath = assignedUser.slug ? `/p/${assignedUser.slug}` : `/p/${assignedUser.id}`
                }
                break
            case 'lost':
                if (assignedUser) {
                    routePath = assignedUser.slug ? `/p/${assignedUser.slug}` : `/p/${assignedUser.id}`
                }
                break
            default:
                if (assignedUser) {
                    routePath = assignedUser.slug ? `/p/${assignedUser.slug}` : `/p/${assignedUser.id}`
                } else if (!chip.assigned_user_id) {
                    routePath = `/claim/${chipUid}`
                }
        }

        return jsonOrRedirect(wantsJson, routePath, corsHeaders)

    } catch (error: unknown) {
        console.error('Scan function error:', error)
        const message = error instanceof Error ? error.message : 'Unknown error'
        return new Response(JSON.stringify({ error: message }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 500,
        })
    }
})

function jsonOrRedirect(wantsJson: boolean, routePath: string, corsHeaders: Record<string, string>) {
    if (wantsJson) {
        return new Response(JSON.stringify({ redirect: routePath, external: false }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
    }
    return Response.redirect(`https://nfcwear.de${routePath}`, 302)
}
