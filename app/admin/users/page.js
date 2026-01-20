/**
 * User Management Panel
 * Admin page for managing users and their roles
 */

'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase' 
import { useAuth } from '@/hooks/useAuth'
import { useRole, useRoleAssignment } from '@/hooks/useRole'
import { RequireAdmin, AccessDenied } from '@/components/common/RoleGuard'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { ListSkeleton } from '@/components/ui/Skeleton'
import { toast } from 'sonner'
import {
  Users,
  Search,
  Shield,
  ChevronDown,
  Check,
  Crown,
  Briefcase,
  UserCheck,
  MoreVertical,
  Mail,
  Calendar,
  RefreshCw,
} from 'lucide-react'
import { ROLES } from '@/lib/roles'

export default function UsersPage() {
  const router = useRouter()
  const { user, loading: authLoading } = useAuth({ requireAuth: true, redirectTo: '/' })
  const { isAdmin, loading: roleLoading } = useRole()
  const [users, setUsers] = useState([])
  const [roles, setRoles] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedUser, setSelectedUser] = useState(null)
  const [showRoleDropdown, setShowRoleDropdown] = useState(null)
  const { assignRole, loading: assigningRole } = useRoleAssignment()

  useEffect(() => {
    if (!authLoading && !roleLoading && isAdmin) {
      fetchUsers()
      fetchRoles()
    }
  }, [authLoading, roleLoading, isAdmin])

  const fetchUsers = async () => {
    try {
      // Note: In production, you'd need a server-side function to list users
      // For now, we'll show users who have roles assigned
      const { data, error } = await supabase
        .from('user_roles')
        .select(
          `
                    user_id,
                    assigned_at,
                    roles (
                        id,
                        name
                    )
                `
        )
        .order('assigned_at', { ascending: false })

      if (error) throw error
      setUsers(data || [])
    } catch (error) {
      console.error('Error fetching users:', error)
      toast.error('Failed to load users')
    } finally {
      setLoading(false)
    }
  }

  const fetchRoles = async () => {
    try {
      const { data, error } = await supabase.from('roles').select('*').order('name')

      if (error) throw error
      setRoles(data || [])
    } catch (error) {
      console.error('Error fetching roles:', error)
    }
  }

  const handleAssignRole = async (userId, roleId) => {
    const result = await assignRole(userId, roleId)
    if (result.success) {
      toast.success('Role assigned successfully')
      fetchUsers()
    } else {
      toast.error('Failed to assign role')
    }
    setShowRoleDropdown(null)
  }

  const getRoleIcon = roleName => {
    switch (roleName) {
      case ROLES.ADMIN:
        return Crown
      case ROLES.MANAGER:
        return Briefcase
      case ROLES.OFFICER:
        return UserCheck
      default:
        return Shield
    }
  }

  const getRoleBadgeStyle = roleName => {
    switch (roleName) {
      case ROLES.ADMIN:
        return 'bg-violet-500/10 text-violet-500 border-violet-500/30'
      case ROLES.MANAGER:
        return 'bg-amber-500/10 text-amber-500 border-amber-500/30'
      case ROLES.OFFICER:
        return 'bg-teal-500/10 text-teal-500 border-teal-500/30'
      default:
        return 'bg-gray-500/10 text-gray-500 border-gray-500/30'
    }
  }

  if (authLoading || roleLoading) {
    return (
      <div className="max-w-5xl mx-auto space-y-6 p-4">
        <ListSkeleton items={5} />
      </div>
    )
  }

  if (!isAdmin) {
    return <AccessDenied message="Only administrators can manage users." />
  }

  const filteredUsers = users.filter(u =>
    u.user_id?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground flex items-center gap-3">
            <div className="p-2 bg-violet-500/10 rounded-xl">
              <Users className="w-6 h-6 text-violet-500" />
            </div>
            User Management
          </h1>
          <p className="text-muted-foreground text-sm mt-1">Manage user roles and permissions</p>
        </div>
        <Button onClick={fetchUsers} className="bg-secondary text-foreground hover:bg-secondary/80">
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Search */}
      <Card className="p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search users by ID..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-foreground">{users.length}</div>
          <div className="text-xs text-muted-foreground">Total Users</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-violet-500">
            {users.filter(u => u.roles?.name === ROLES.ADMIN).length}
          </div>
          <div className="text-xs text-muted-foreground">Admins</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-amber-500">
            {users.filter(u => u.roles?.name === ROLES.MANAGER).length}
          </div>
          <div className="text-xs text-muted-foreground">Managers</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-teal-500">
            {users.filter(u => u.roles?.name === ROLES.OFFICER).length}
          </div>
          <div className="text-xs text-muted-foreground">Officers</div>
        </Card>
      </div>

      {/* Users List */}
      <Card className="overflow-hidden">
        <div className="p-4 border-b border-border">
          <h2 className="font-semibold text-foreground">Users with Roles</h2>
        </div>

        {loading ? (
          <div className="p-4">
            <ListSkeleton items={5} />
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">
            <Users className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No users found</p>
            <p className="text-sm mt-1">Users will appear here after roles table is set up</p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {filteredUsers.map(userRole => {
              const RoleIcon = getRoleIcon(userRole.roles?.name)
              return (
                <div
                  key={userRole.user_id}
                  className="p-4 flex items-center justify-between hover:bg-secondary/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-linear-to-br from-teal-500 to-cyan-500 flex items-center justify-center text-white font-bold">
                      {userRole.user_id?.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <div className="font-medium text-foreground text-sm">
                        {userRole.user_id?.slice(0, 8)}...
                      </div>
                      <div className="text-xs text-muted-foreground flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(userRole.assigned_at).toLocaleDateString()}
                      </div>
                    </div>
                  </div>

                  <div className="relative">
                    <button
                      onClick={() =>
                        setShowRoleDropdown(
                          showRoleDropdown === userRole.user_id ? null : userRole.user_id
                        )
                      }
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-sm font-medium transition-colors ${getRoleBadgeStyle(
                        userRole.roles?.name
                      )}`}
                    >
                      <RoleIcon className="w-3.5 h-3.5" />
                      {userRole.roles?.name || 'No Role'}
                      <ChevronDown className="w-3.5 h-3.5" />
                    </button>

                    {/* Role Dropdown */}
                    {showRoleDropdown === userRole.user_id && (
                      <div className="absolute right-0 top-full mt-2 w-40 bg-card border border-border rounded-xl shadow-lg z-10 overflow-hidden">
                        {roles.map(role => {
                          const Icon = getRoleIcon(role.name)
                          const isSelected = role.id === userRole.roles?.id
                          return (
                            <button
                              key={role.id}
                              onClick={() => handleAssignRole(userRole.user_id, role.id)}
                              disabled={assigningRole}
                              className={`w-full flex items-center gap-2 px-4 py-2 text-sm hover:bg-secondary transition-colors ${
                                isSelected ? 'bg-secondary' : ''
                              }`}
                            >
                              <Icon className="w-4 h-4" />
                              <span className="flex-1 text-left">{role.name}</span>
                              {isSelected && <Check className="w-4 h-4 text-teal-500" />}
                            </button>
                          )
                        })}
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </Card>

      {/* Info Card */}
      <Card className="p-4 bg-blue-500/5 border-blue-500/20">
        <div className="flex items-start gap-3">
          <Shield className="w-5 h-5 text-blue-500 mt-0.5" />
          <div>
            <h3 className="font-medium text-foreground">Role Hierarchy</h3>
            <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <Crown className="w-3.5 h-3.5 text-violet-500" />
                <strong>Admin:</strong> Full access to all features
              </li>
              <li className="flex items-center gap-2">
                <Briefcase className="w-3.5 h-3.5 text-amber-500" />
                <strong>Manager:</strong> Analytics, rates, passes, and shift oversight
              </li>
              <li className="flex items-center gap-2">
                <UserCheck className="w-3.5 h-3.5 text-teal-500" />
                <strong>Officer:</strong> Ticket creation, own shifts, basic access
              </li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  )
}
