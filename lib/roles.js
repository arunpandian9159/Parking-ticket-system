/**
 * Roles Configuration
 * Role constants and permission definitions
 */

// Role names
export const ROLES = {
  ADMIN: 'Admin',
  MANAGER: 'Manager',
  OFFICER: 'Officer',
}

// Permission definitions
export const PERMISSIONS = {
  // Ticket management
  TICKETS_VIEW: 'tickets.view',
  TICKETS_CREATE: 'tickets.create',
  TICKETS_UPDATE: 'tickets.update',
  TICKETS_DELETE: 'tickets.delete',

  // Pass management
  PASSES_VIEW: 'passes.view',
  PASSES_CREATE: 'passes.create',
  PASSES_UPDATE: 'passes.update',
  PASSES_DELETE: 'passes.delete',

  // Analytics
  ANALYTICS_VIEW: 'analytics.view',
  ANALYTICS_EXPORT: 'analytics.export',

  // Rates management
  RATES_VIEW: 'rates.view',
  RATES_UPDATE: 'rates.update',

  // User management
  USERS_VIEW: 'users.view',
  USERS_CREATE: 'users.create',
  USERS_UPDATE: 'users.update',
  USERS_DELETE: 'users.delete',

  // Shift management
  SHIFTS_VIEW: 'shifts.view',
  SHIFTS_MANAGE: 'shifts.manage',
  SHIFTS_ALL: 'shifts.all', // View all officers' shifts

  // Parking map
  MAP_VIEW: 'map.view',
  MAP_MANAGE: 'map.manage',

  // Vehicle history
  VEHICLES_VIEW: 'vehicles.view',
  VEHICLES_MANAGE: 'vehicles.manage',

  // System settings
  SETTINGS_VIEW: 'settings.view',
  SETTINGS_UPDATE: 'settings.update',

  // Audit logs
  AUDIT_VIEW: 'audit.view',
}

// Role permission mappings
export const ROLE_PERMISSIONS = {
  [ROLES.ADMIN]: {
    all: true, // Admin has access to everything
    permissions: Object.values(PERMISSIONS),
  },
  [ROLES.MANAGER]: {
    all: false,
    permissions: [
      // Tickets - full access
      PERMISSIONS.TICKETS_VIEW,
      PERMISSIONS.TICKETS_CREATE,
      PERMISSIONS.TICKETS_UPDATE,
      PERMISSIONS.TICKETS_DELETE,

      // Passes - full access
      PERMISSIONS.PASSES_VIEW,
      PERMISSIONS.PASSES_CREATE,
      PERMISSIONS.PASSES_UPDATE,
      PERMISSIONS.PASSES_DELETE,

      // Analytics - full access
      PERMISSIONS.ANALYTICS_VIEW,
      PERMISSIONS.ANALYTICS_EXPORT,

      // Rates - full access
      PERMISSIONS.RATES_VIEW,
      PERMISSIONS.RATES_UPDATE,

      // Shifts - view all
      PERMISSIONS.SHIFTS_VIEW,
      PERMISSIONS.SHIFTS_MANAGE,
      PERMISSIONS.SHIFTS_ALL,

      // Map & Vehicles
      PERMISSIONS.MAP_VIEW,
      PERMISSIONS.MAP_MANAGE,
      PERMISSIONS.VEHICLES_VIEW,
      PERMISSIONS.VEHICLES_MANAGE,

      // Audit
      PERMISSIONS.AUDIT_VIEW,
    ],
  },
  [ROLES.OFFICER]: {
    all: false,
    permissions: [
      // Tickets - create and view
      PERMISSIONS.TICKETS_VIEW,
      PERMISSIONS.TICKETS_CREATE,
      PERMISSIONS.TICKETS_UPDATE,

      // Passes - view only
      PERMISSIONS.PASSES_VIEW,

      // Shifts - own only
      PERMISSIONS.SHIFTS_VIEW,
      PERMISSIONS.SHIFTS_MANAGE,

      // Map - view only
      PERMISSIONS.MAP_VIEW,

      // Vehicles - view only
      PERMISSIONS.VEHICLES_VIEW,
    ],
  },
}

// Navigation items with role permissions
export const NAV_ITEMS = [
  {
    label: 'Dashboard',
    href: '/dashboard',
    requiredPermission: null, // All authenticated users
    icon: 'LayoutDashboard',
  },
  {
    label: 'Officer Portal',
    href: '/officer',
    requiredPermission: PERMISSIONS.TICKETS_VIEW,
    icon: 'Ticket',
  },
  {
    label: 'Create Ticket',
    href: '/tickets/create',
    requiredPermission: PERMISSIONS.TICKETS_CREATE,
    icon: 'Plus',
  },
  {
    label: 'Monthly Passes',
    href: '/passes',
    requiredPermission: PERMISSIONS.PASSES_VIEW,
    icon: 'CreditCard',
  },
  {
    label: 'Shifts',
    href: '/shifts',
    requiredPermission: PERMISSIONS.SHIFTS_VIEW,
    icon: 'Clock',
  },
  {
    label: 'Vehicles',
    href: '/vehicles',
    requiredPermission: PERMISSIONS.VEHICLES_VIEW,
    icon: 'Car',
  },
  {
    label: 'Analytics',
    href: '/admin/analytics',
    requiredPermission: PERMISSIONS.ANALYTICS_VIEW,
    icon: 'BarChart3',
  },
  {
    label: 'Rates',
    href: '/admin/rates',
    requiredPermission: PERMISSIONS.RATES_VIEW,
    icon: 'DollarSign',
  },
  {
    label: 'Users',
    href: '/admin/users',
    requiredPermission: PERMISSIONS.USERS_VIEW,
    icon: 'Users',
  },
]

// Default role for new users
export const DEFAULT_ROLE = ROLES.OFFICER
