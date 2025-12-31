import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/dashboard'

  console.log('Auth callback received:', { origin, code: code ? 'present' : 'missing', next })

  if (code) {
    const cookieStore = await cookies()

    // We need to collect cookies to set them on the response
    const cookiesToSet = []

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll()
          },
          setAll(cookies) {
            cookies.forEach(cookie => {
              cookiesToSet.push(cookie)
            })
          },
        },
      }
    )

    const { data, error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error && data.session) {
      console.log('Auth successful, user:', data.session.user.email)
      console.log(
        'Setting cookies:',
        cookiesToSet.map(c => c.name)
      )

      // Create redirect response
      const redirectUrl = `${origin}${next}`
      const response = NextResponse.redirect(redirectUrl)

      // Set all the auth cookies on the response
      cookiesToSet.forEach(({ name, value, options }) => {
        response.cookies.set(name, value, options)
      })

      console.log('Redirecting to:', redirectUrl)
      return response
    }

    console.error('Auth callback error:', error?.message || 'No session returned')
  }

  // Return to home if there's an error
  console.log('Auth failed, redirecting to home')
  return NextResponse.redirect(`${origin}/?error=auth_callback_error`)
}
