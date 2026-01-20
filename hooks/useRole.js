/**
 * useRole Hook
 * Enhanced hook for role-based access control
 */

'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from './useAuth'
import { ROLES, PERMISSIONS, ROLE_PERMISSIONS, NAV_ITEMS, DEFAULT_ROLE } from '@/lib/roles'
import {
  hasPermission,
  filterNavByRole,
  isAdmin as checkIsAdmin,
  isAtLeastManager, 
} from '@/lib/rbac'

/**
 * Hook to get user role and permissions
 */
export function useRole() {
  const { user, loading: authLoading } = useAuth()
  const [roleData, setRoleData] = useState(null)
  const [roleLoading, setRoleLoading] = useState(true)

  useEffect(() => {
    const fetchRole = async () => {
      if (!user) {
        setRoleData(null)
        setRoleLoading(false)
        return
      }

      try {
        console.log('Fetching role for user:', user.id)

        // Fetch user role from user_roles table with roles join
        const { data, error } = await supabase
          .from('user_roles')
          .select(
            `
            role_id,
            roles (
              id,
              name,
              permissions
            )
          `
          )
          .eq('user_id', user.id)
          .maybeSingle() // Use maybeSingle instead of single to avoid error when no row found

        console.log('Role fetch result:', { data, error })

        if (error) {
          console.error('Error fetching role:', error)
          // Still try to set default role
        }

        if (data?.roles) {
          console.log('Role found:', data.roles.name)
          setRoleData({
            name: data.roles.name,
            id: data.roles.id,
            permissions:
              data.roles.permissions || ROLE_PERMISSIONS[data.roles.name]?.permissions || [],
          })
        } else {
          console.log('No role found, defaulting to:', DEFAULT_ROLE)
          // Default to Officer role if no role assigned
          setRoleData({
            name: DEFAULT_ROLE,
            id: null,
            permissions: ROLE_PERMISSIONS[DEFAULT_ROLE]?.permissions || [],
          })
        }
      } catch (error) {
        console.error('Error in fetchRole:', error)
        // Default fallback
        setRoleData({
          name: DEFAULT_ROLE,
          id: null,
          permissions: ROLE_PERMISSIONS[DEFAULT_ROLE]?.permissions || [],
        })
      } finally {
        setRoleLoading(false)
      }
    }

    if (!authLoading) {
      fetchRole()
    }
  }, [user, authLoading])

  // Memoized permission checker
  const checkPermission = useCallback(
    permission => {
      if (!roleData) return false
      return hasPermission(roleData.name, permission)
    },
    [roleData]
  )

  // Memoized navigation items filtered by role
  const allowedNavItems = useMemo(() => {
    if (!roleData) return []
    return filterNavByRole(NAV_ITEMS, roleData.name)
  }, [roleData])

  // Role checks
  const isAdminUser = roleData?.name === ROLES.ADMIN
  const isManagerUser = roleData?.name === ROLES.MANAGER || roleData?.name === ROLES.ADMIN
  const isOfficerUser = !!roleData?.name

  return {
    role: roleData,
    roleName: roleData?.name || null,
    loading: authLoading || roleLoading,
    hasPermission: checkPermission,
    allowedNavItems,
    isAdmin: isAdminUser,
    isManager: isManagerUser,
    isOfficer: isOfficerUser,
    // Expose constants for convenience
    ROLES,
    PERMISSIONS,
  }
}

/**
 * Hook for role assignment (admin only)
 */
export function useRoleAssignment() {
  const { isAdmin } = useRole()
  const [loading, setLoading] = useState(false)

  const assignRole = useCallback(
    async (userId, roleId) => {
      if (!isAdmin) {
        return { success: false, error: new Error('Insufficient permissions') }
      }

      setLoading(true)
      try {
        // Check if user already has a role
        const { data: existing } = await supabase
          .from('user_roles')
          .select('*')
          .eq('user_id', userId)
          .maybeSingle()

        if (existing) {
          // Update existing role
          const { error } = await supabase
            .from('user_roles')
            .update({ role_id: roleId })
            .eq('user_id', userId)

          if (error) throw error
        } else {
          // Insert new role assignment
          const { error } = await supabase
            .from('user_roles')
            .insert([{ user_id: userId, role_id: roleId }])

          if (error) throw error
        }

        return { success: true, error: null }
      } catch (error) {
        console.error('Error assigning role:', error)
        return { success: false, error }
      } finally {
        setLoading(false)
      }
    },
    [isAdmin]
  )

  const removeRole = useCallback(
    async userId => {
      if (!isAdmin) {
        return { success: false, error: new Error('Insufficient permissions') }
      }

      setLoading(true)
      try {
        const { error } = await supabase.from('user_roles').delete().eq('user_id', userId)

        if (error) throw error
        return { success: true, error: null }
      } catch (error) {
        console.error('Error removing role:', error)
        return { success: false, error }
      } finally {
        setLoading(false)
      }
    },
    [isAdmin]
  )

  return {
    assignRole,
    removeRole,
    loading,
  }
}
