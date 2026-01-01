/**
 * RoleGuard Component
 * Wrapper component for role-protected content
 */

'use client'

import { useRole } from '@/hooks/useRole'
import { hasPermission, hasAnyPermission } from '@/lib/rbac'
import { Shield, Lock, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'

/**
 * RoleGuard - Protects content based on role/permissions
 */
export function RoleGuard({
  children,
  permission,
  permissions,
  requireAll = false,
  fallback = null,
  showError = false,
}) {
  const { role, loading } = useRole()

  // Show loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-pulse flex items-center gap-2 text-muted-foreground">
          <Shield className="w-5 h-5" />
          <span>Checking permissions...</span>
        </div>
      </div>
    )
  }

  // Check permissions
  let hasAccess = false

  if (!role) {
    hasAccess = false
  } else if (permission) {
    hasAccess = hasPermission(role.name, permission)
  } else if (permissions && permissions.length > 0) {
    if (requireAll) {
      hasAccess = permissions.every(p => hasPermission(role.name, p))
    } else {
      hasAccess = hasAnyPermission(role.name, permissions)
    }
  } else {
    // No permission specified, just check if user has a role
    hasAccess = !!role
  }

  if (hasAccess) {
    return children
  }

  // Show fallback or error
  if (fallback) {
    return fallback
  }

  if (showError) {
    return <AccessDenied />
  }

  return null
}

/**
 * RequireRole - Simpler role-based guard
 */
export function RequireRole({ children, role: requiredRole, fallback = null }) {
  const { roleName, loading } = useRole()

  if (loading) {
    return null
  }

  if (roleName === requiredRole || roleName === 'Admin') {
    return children
  }

  return fallback
}

/**
 * RequireAdmin - Guard for admin-only content
 */
export function RequireAdmin({ children, fallback = null, showError = false }) {
  const { isAdmin, loading } = useRole()

  if (loading) return null

  if (isAdmin) {
    return children
  }

  if (showError) {
    return <AccessDenied message="This section requires administrator access." />
  }

  return fallback
}

/**
 * RequireManager - Guard for manager+ content
 */
export function RequireManager({ children, fallback = null, showError = false }) {
  const { isManager, loading } = useRole()

  if (loading) return null

  if (isManager) {
    return children
  }

  if (showError) {
    return <AccessDenied message="This section requires manager access or higher." />
  }

  return fallback
}

/**
 * AccessDenied - Error display for unauthorized access
 */
export function AccessDenied({ message = "You don't have permission to access this content." }) {
  return (
    <div className="min-h-[300px] flex items-center justify-center p-8">
      <div className="bg-card rounded-2xl border border-border shadow-lg max-w-md w-full p-8 text-center">
        {/* Icon */}
        <div className="w-16 h-16 mx-auto rounded-full bg-red-500/10 flex items-center justify-center mb-6">
          <Lock className="w-8 h-8 text-red-500" />
        </div>

        {/* Title */}
        <h2 className="text-xl font-bold text-foreground mb-2">Access Denied</h2>

        {/* Message */}
        <p className="text-muted-foreground mb-6">{message}</p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/dashboard">
            <Button className="bg-teal-500 text-white hover:bg-teal-600">Go to Dashboard</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

/**
 * PermissionBadge - Display current role badge
 */
export function PermissionBadge() {
  const { roleName, loading } = useRole()

  if (loading || !roleName) return null

  const badgeStyles = {
    Admin: 'bg-violet-500/10 text-violet-500 border-violet-500/30',
    Manager: 'bg-amber-500/10 text-amber-500 border-amber-500/30',
    Officer: 'bg-teal-500/10 text-teal-500 border-teal-500/30',
  }

  return (
    <span
      className={`px-2 py-1 text-xs font-medium rounded-full border ${
        badgeStyles[roleName] || badgeStyles.Officer
      }`}
    >
      {roleName}
    </span>
  )
}
