/**
 * Application Constants
 * Centralized configuration for magic numbers and app settings
 */

// Pricing Configuration
export const PRICING = {
    DEFAULT_HOURLY_RATE: 20, // ₹20 per hour default
    OVERDUE_BASE_FINE: 50,   // ₹50 base penalty for overstaying
    OVERDUE_HOURLY_FINE: 20, // ₹20 per extra hour
}

// App Configuration
export const APP_CONFIG = {
    NAME: 'PARTIM',
    DESCRIPTION: 'Modern parking management solution',
    CURRENCY: '₹',
    CURRENT_YEAR: new Date().getFullYear(),
}

// Status Labels
export const TICKET_STATUS = {
    ACTIVE: 'Active',
    PAID: 'Paid',
    EXPIRED: 'Expired',
}

// Pass Status Labels
export const PASS_STATUS = {
    ACTIVE: 'Active',
    EXPIRED: 'Expired',
    REVOKED: 'Revoked',
}

// Vehicle Types (fallback if DB is empty)
export const DEFAULT_VEHICLE_TYPES = [
    { vehicle_type: 'Car', hourly_rate: 40 },
    { vehicle_type: 'Bike', hourly_rate: 20 },
    { vehicle_type: 'Truck', hourly_rate: 60 },
]
