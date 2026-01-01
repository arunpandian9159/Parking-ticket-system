/**
 * Components Index
 * Central export for all components
 *
 * Organized Structure:
 * - layout/   : Navbar, ClientLayout, Providers
 * - parking/  : ParkingMap, ParkingFloorPlan
 * - ticket/   : TicketReceipt, QRCodeGenerator, QRScanner
 * - pdf/      : PDFReceipt, PDF invoice generators
 * - search/   : GlobalSearch
 * - common/   : ErrorBoundary, RoleGuard, RevenueChart
 * - charts/   : Chart components (Heatmap, Pie, Line, etc.)
 * - ui/       : UI primitives (Button, Card, Input, etc.)
 * - auth/     : Authentication components
 */

// Layout
export * from './layout'

// Parking
export * from './parking'

// Ticket & QR
export * from './ticket'

// PDF
export * from './pdf'

// Search
export * from './search'

// Common
export * from './common'

// Charts
export * from './charts'

// UI Components
export * from './ui'

// Auth
export * from './auth'
