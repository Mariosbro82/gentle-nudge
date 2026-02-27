import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { password } = await req.json()

    if (!password || typeof password !== 'string' || password.length > 100) {
      return new Response(JSON.stringify({ valid: false }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      })
    }

    const sitePassword = Deno.env.get('SITE_PASSWORD')
    if (!sitePassword) {
      return new Response(JSON.stringify({ valid: false, error: 'Not configured' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      })
    }

    // Constant-time comparison to prevent timing attacks
    const encoder = new TextEncoder()
    const a = encoder.encode(password)
    const b = encoder.encode(sitePassword)
    
    let valid = a.length === b.length
    const len = Math.max(a.length, b.length)
    for (let i = 0; i < len; i++) {
      if ((a[i] ?? 0) !== (b[i] ?? 0)) valid = false
    }

    return new Response(JSON.stringify({ valid }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch {
    return new Response(JSON.stringify({ valid: false }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})
