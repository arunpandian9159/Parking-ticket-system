'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function AuthCallbackPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [status, setStatus] = useState('Processing authentication...')

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Get the next URL from query params
        const next = searchParams.get('next') || '/dashboard'

        console.log('Auth callback page loaded')
        console.log('Current URL:', window.location.href)
        console.log('Next destination:', next)

        // Check if there's a hash (implicit flow)
        if (window.location.hash) {
          console.log('Hash detected, Supabase will handle automatically')
        }

        // Check for error in URL
        const error = searchParams.get('error')
        const errorDescription = searchParams.get('error_description')

        if (error) {
          console.error('OAuth error:', error, errorDescription)
          setStatus(`Authentication error: ${errorDescription || error}`)
          setTimeout(() => router.push('/'), 3000)
          return
        }

        // Wait a moment for Supabase to process the session
        // Supabase client library automatically handles the hash fragment
        await new Promise(resolve => setTimeout(resolve, 500))

        // Check if we now have a session
        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession()

        console.log('Session check:', {
          hasSession: !!session,
          userEmail: session?.user?.email,
          error: sessionError?.message,
        })

        if (session) {
          setStatus('Authentication successful! Redirecting...')
          console.log('Session found, redirecting to:', next)
          router.push(next)
        } else {
          // Try to exchange code if present in URL
          const code = searchParams.get('code')
          if (code) {
            console.log('Code found in URL, exchanging for session...')
            const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)

            if (exchangeError) {
              console.error('Code exchange error:', exchangeError)
              setStatus('Authentication failed. Redirecting...')
              setTimeout(() => router.push('/'), 2000)
              return
            }

            // Session should now be set
            setStatus('Authentication successful! Redirecting...')
            router.push(next)
          } else {
            console.log('No session and no code found')
            setStatus('No authentication session found. Redirecting...')
            setTimeout(() => router.push('/'), 2000)
          }
        }
      } catch (err) {
        console.error('Callback error:', err)
        setStatus('An error occurred. Redirecting...')
        setTimeout(() => router.push('/'), 2000)
      }
    }

    handleCallback()
  }, [router, searchParams])

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-linear-to-br from-teal-500 to-cyan-600 animate-pulse" />
        <h1 className="text-xl font-semibold text-foreground mb-2">{status}</h1>
        <p className="text-muted-foreground text-sm">Please wait...</p>
      </div>
    </div>
  )
}
