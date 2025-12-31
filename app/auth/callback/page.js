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
        // Get the next URL from sessionStorage or query params or default
        const next =
          sessionStorage.getItem('authRedirectTo') || searchParams.get('next') || '/dashboard'

        // Clear the stored redirect
        sessionStorage.removeItem('authRedirectTo')

        console.log('Auth callback page loaded')
        console.log('Current URL:', window.location.href)
        console.log('Hash present:', !!window.location.hash)
        console.log('Next destination:', next)

        // Check for error in URL
        const error = searchParams.get('error')
        const errorDescription = searchParams.get('error_description')

        if (error) {
          console.error('OAuth error:', error, errorDescription)
          setStatus(`Authentication error: ${errorDescription || error}`)
          setTimeout(() => router.push('/'), 3000)
          return
        }

        // Supabase client automatically detects and processes the OAuth response
        // from both hash fragments (#access_token=...) and query params (?code=...)
        // We need to give it a moment to do so

        // Listen for auth state change
        const {
          data: { subscription },
        } = supabase.auth.onAuthStateChange(async (event, session) => {
          console.log('Auth state changed:', event, session?.user?.email)

          if (event === 'SIGNED_IN' && session) {
            setStatus('Authentication successful! Redirecting...')
            // Small delay to ensure cookies are set
            setTimeout(() => {
              router.push(next)
            }, 500)
          }
        })

        // Also check for existing session (in case auth already happened)
        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession()

        console.log('Initial session check:', {
          hasSession: !!session,
          userEmail: session?.user?.email,
          error: sessionError?.message,
        })

        if (session) {
          setStatus('Authentication successful! Redirecting...')
          subscription.unsubscribe()
          router.push(next)
          return
        }

        // If no session after 5 seconds, redirect to home
        setTimeout(() => {
          console.log('Auth timeout - no session detected')
          subscription.unsubscribe()
          setStatus('Authentication timed out. Redirecting...')
          router.push('/')
        }, 5000)
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
