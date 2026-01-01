/**
 * RBAC (Role-Based Access Control) Utilities
 * Functions for checking permissions and roles
 */

import { ROLE_PERMISSIONS, ROLES } from './roles'

/**
 * Check if a role has a specific permission
 * @param {string} roleName - Role name
 * @param {string} permission - Permission to check
 * @returns {boolean}
 */
export function hasPermission(roleName, permission) {
  const role = ROLE_PERMISSIONS[roleName]
  if (!role) return false

  // Admin has all permissions
  if (role.all) return true

  return role.permissions.includes(permission)
}

/**
 * Check if a role has any of the specified permissions
 * @param {string} roleName - Role name
 * @param {string[]} permissions - Permissions to check
 * @returns {boolean}
 */
export function hasAnyPermission(roleName, permissions) {
  return permissions.some(permission => hasPermission(roleName, permission))
}

/**
 * Check if a role has all of the specified permissions
 * @param {string} roleName - Role name
 * @param {string[]} permissions - Permissions to check
 * @returns {boolean}
 */
export function hasAllPermissions(roleName, permissions) {
  return permissions.every(permission => hasPermission(roleName, permission))
}

/**
 * Get all permissions for a role
 * @param {string} roleName - Role name
 * @returns {string[]}
 */
export function getPermissions(roleName) {
  const role = ROLE_PERMISSIONS[roleName]
  if (!role) return []

  if (role.all) {
    // Return all possible permissions for admin
    return Object.values(require('./roles').PERMISSIONS)
  }

  return role.permissions
}

/**
 * Check if user is admin
 * @param {string} roleName - Role name
 * @returns {boolean}
 */
export function isAdmin(roleName) {
  return roleName === ROLES.ADMIN
}

/**
 * Check if user is at least a manager (admin or manager)
 * @param {string} roleName - Role name
 * @returns {boolean}
 */
export function isAtLeastManager(roleName) {
  return roleName === ROLES.ADMIN || roleName === ROLES.MANAGER
}

/**
 * Check if user is at least an officer (any authenticated role)
 * @param {string} roleName - Role name
 * @returns {boolean}
 */
export function isAtLeastOfficer(roleName) {
  return Object.values(ROLES).includes(roleName)
}

/**
 * Filter navigation items based on role permissions
 * @param {Array} navItems - Navigation items
 * @param {string} roleName - Role name
 * @returns {Array}
 */
export function filterNavByRole(navItems, roleName) {
  return navItems.filter(item => {
    if (!item.requiredPermission) return true
    return hasPermission(roleName, item.requiredPermission)
  })
}

/**
 * Create permission checker function for a specific role
 * @param {string} roleName - Role name
 * @returns {Function}
 */
export function createPermissionChecker(roleName) {
  return permission => hasPermission(roleName, permission)
}

/**
 * Role hierarchy - higher index = higher privilege
 */
export const ROLE_HIERARCHY = [ROLES.OFFICER, ROLES.MANAGER, ROLES.ADMIN]

/**
 * Check if roleA has higher or equal privilege than roleB
 * @param {string} roleA - First role
 * @param {string} roleB - Second role
 * @returns {boolean}
 */
export function hasHigherOrEqualPrivilege(roleA, roleB) {
  const indexA = ROLE_HIERARCHY.indexOf(roleA)
  const indexB = ROLE_HIERARCHY.indexOf(roleB)
  return indexA >= indexB
}
