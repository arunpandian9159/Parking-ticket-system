/**
 * useAuth Hook
 * Authentication hook with role checking
 */

'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { getProfile } from '@/lib/profile'

/**
 * Hook to get current user and authentication status
 */
export function useAuth(options = {}) {
  const { requireAuth = false, redirectTo = '/' } = options
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const checkUser = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser()

        if (user) {
          setUser(user)
          const profileData = await getProfile(user)
          setProfile(profileData)
        } else if (requireAuth) {
          router.push(redirectTo)
        }
      } catch (error) {
        console.error('Auth error:', error)
        if (requireAuth) {
          router.push(redirectTo)
        }
      } finally {
        setLoading(false)
      }
    }

    checkUser()

    // Listen for auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        setUser(session.user)
        const profileData = await getProfile(session.user)
        setProfile(profileData)
      } else {
        setUser(null)
        setProfile(null)
        if (requireAuth) {
          router.push(redirectTo)
        }
      }
    })

    return () => subscription.unsubscribe()
  }, [requireAuth, redirectTo, router])

  const signOut = useCallback(async () => {
    await supabase.auth.signOut()
    setUser(null)
    setProfile(null)
    router.push('/')
  }, [router])

  return {
    user,
    profile,
    loading,
    isAuthenticated: !!user,
    signOut,
  }
}

/**
 * Hook to get user role (will be enhanced when roles table exists)
 */
export function useRole() {
  const { user, loading } = useAuth()
  const [role, setRole] = useState(null)
  const [roleLoading, setRoleLoading] = useState(true)

  useEffect(() => {
    const fetchRole = async () => {
      if (!user) {
        setRole(null)
        setRoleLoading(false)
        return
      }

      try {
        // Fetch user role from user_roles table
        const { data, error } = await supabase
          .from('user_roles')
          .select('role_id, roles(name, permissions)')
          .eq('user_id', user.id)
          .single()

        if (error && error.code !== 'PGRST116') {
          console.error('Error fetching role:', error)
        }

        if (data?.roles) {
          setRole({
            name: data.roles.name,
            permissions: data.roles.permissions || {},
          })
        } else {
          // Default to Officer role if no role assigned
          setRole({
            name: 'Officer',
            permissions: { tickets: true, status: true },
          })
        }
      } catch (error) {
        console.error('Error fetching role:', error)
        setRole({ name: 'Officer', permissions: { tickets: true, status: true } })
      } finally {
        setRoleLoading(false)
      }
    }

    if (!loading) {
      fetchRole()
    }
  }, [user, loading])

  const hasPermission = useCallback(
    permission => {
      if (!role) return false
      if (role.permissions?.all) return true
      return !!role.permissions?.[permission]
    },
    [role]
  )

  const isAdmin = role?.name === 'Admin'
  const isManager = role?.name === 'Manager' || isAdmin
  const isOfficer = role?.name === 'Officer' || isManager

  return {
    role,
    loading: loading || roleLoading,
    hasPermission,
    isAdmin,
    isManager,
    isOfficer,
  }
}
