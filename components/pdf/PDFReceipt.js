/**
 * PDF Receipt Generator
 * Generate PDF receipts and invoices using @react-pdf/renderer
 */

'use client'

import dynamic from 'next/dynamic'
import { Document, Page, Text, View, StyleSheet, PDFDownloadLink, Font } from '@react-pdf/renderer'
import { formatCurrency, formatDate, formatTime } from '@/lib/utils'

// Register fonts (optional, for better typography)
// Font.register({ family: 'Inter', src: '/fonts/Inter-Regular.ttf' })

// PDF Styles
const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: 'Helvetica',
    fontSize: 10,
    backgroundColor: '#ffffff',
  },
  header: {
    marginBottom: 20,
    paddingBottom: 15,
    borderBottom: '2px dashed #e5e7eb',
    textAlign: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    letterSpacing: 2,
    color: '#1f2937',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 10,
    color: '#6b7280',
  },
  section: {
    marginBottom: 15,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
    paddingVertical: 4,
  },
  label: {
    color: '#6b7280',
    fontSize: 10,
  },
  value: {
    fontWeight: 'bold',
    color: '#1f2937',
    fontSize: 10,
  },
  divider: {
    borderBottom: '1px dashed #e5e7eb',
    marginVertical: 15,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 10,
  },
  totalLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0f766e', // teal-700
  },
  footer: {
    marginTop: 30,
    paddingTop: 15,
    borderTop: '1px dashed #e5e7eb',
    textAlign: 'center',
  },
  footerText: {
    fontSize: 9,
    color: '#9ca3af',
    marginBottom: 3,
  },
  badge: {
    backgroundColor: '#d1fae5', // green-100
    color: '#047857', // green-700
    padding: '4 12',
    borderRadius: 10,
    fontSize: 9,
    fontWeight: 'bold',
  },
  badgeActive: {
    backgroundColor: '#fef3c7', // amber-100
    color: '#b45309', // amber-700
  },
  vehicleInfo: {
    backgroundColor: '#f3f4f6',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
  },
  vehicleInfoTitle: {
    fontSize: 8,
    color: '#6b7280',
    marginBottom: 3,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  vehicleInfoValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  taxRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
    fontSize: 9,
  },
  taxLabel: {
    color: '#6b7280',
  },
  taxValue: {
    color: '#1f2937',
  },
})

/**
 * Ticket Receipt PDF Document
 */
export function TicketReceiptPDF({ ticket, showTax = false, gstRate = 18 }) {
  if (!ticket) return null

  const baseAmount = showTax ? Math.round(ticket.price / (1 + gstRate / 100)) : ticket.price
  const gstAmount = showTax ? ticket.price - baseAmount : 0

  return (
    <Document>
      <Page size="A6" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>PARKING RECEIPT</Text>
          <Text style={styles.subtitle}>{formatDate(ticket.created_at)}</Text>
        </View>

        {/* Ticket Info */}
        <View style={styles.section}>
          <View style={styles.row}>
            <Text style={styles.label}>Ticket ID</Text>
            <Text style={styles.value}>{ticket.id.slice(0, 8).toUpperCase()}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Status</Text>
            <Text style={[styles.badge, ticket.status === 'Active' && styles.badgeActive]}>
              {ticket.status}
            </Text>
          </View>
        </View>

        {/* Vehicle Info Box */}
        <View style={styles.vehicleInfo}>
          <Text style={styles.vehicleInfoTitle}>Vehicle Number</Text>
          <Text style={styles.vehicleInfoValue}>{ticket.license_plate}</Text>
        </View>

        {/* Details */}
        <View style={styles.section}>
          <View style={styles.row}>
            <Text style={styles.label}>Parking Spot</Text>
            <Text style={styles.value}>{ticket.parking_spot}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Vehicle Type</Text>
            <Text style={styles.value}>{ticket.vehicle_type || 'Car'}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Entry Time</Text>
            <Text style={styles.value}>{formatTime(ticket.created_at)}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Duration</Text>
            <Text style={styles.value}>{ticket.hours} hour(s)</Text>
          </View>
        </View>

        <View style={styles.divider} />

        {/* Tax breakdown (if enabled) */}
        {showTax && (
          <View style={styles.section}>
            <View style={styles.taxRow}>
              <Text style={styles.taxLabel}>Base Amount</Text>
              <Text style={styles.taxValue}>₹{baseAmount}</Text>
            </View>
            <View style={styles.taxRow}>
              <Text style={styles.taxLabel}>GST ({gstRate}%)</Text>
              <Text style={styles.taxValue}>₹{gstAmount}</Text>
            </View>
          </View>
        )}

        {/* Total */}
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Total Amount</Text>
          <Text style={styles.totalValue}>₹{ticket.price}</Text>
        </View>

        {ticket.fine_amount > 0 && (
          <View style={styles.row}>
            <Text style={styles.label}>Fine Applied</Text>
            <Text style={[styles.value, { color: '#dc2626' }]}>+₹{ticket.fine_amount}</Text>
          </View>
        )}

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Thank you for parking with us!</Text>
          <Text style={styles.footerText}>Please retain this receipt for your records.</Text>
          <Text style={[styles.footerText, { marginTop: 10 }]}>
            parking-ticket-system.vercel.app
          </Text>
        </View>
      </Page>
    </Document>
  )
}

/**
 * Monthly Pass Invoice PDF
 */
export function PassInvoicePDF({ pass, showTax = false, gstRate = 18 }) {
  if (!pass) return null

  const amount = 3000 // Example monthly pass price
  const baseAmount = showTax ? Math.round(amount / (1 + gstRate / 100)) : amount
  const gstAmount = showTax ? amount - baseAmount : 0

  return (
    <Document>
      <Page size="A5" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>MONTHLY PASS</Text>
          <Text style={styles.subtitle}>Tax Invoice</Text>
        </View>

        {/* Pass Holder Info */}
        <View style={styles.vehicleInfo}>
          <Text style={styles.vehicleInfoTitle}>Pass Holder</Text>
          <Text style={styles.vehicleInfoValue}>{pass.customer_name}</Text>
        </View>

        {/* Details */}
        <View style={styles.section}>
          <View style={styles.row}>
            <Text style={styles.label}>Pass ID</Text>
            <Text style={styles.value}>{pass.id.slice(0, 8).toUpperCase()}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Vehicle Number</Text>
            <Text style={styles.value}>{pass.vehicle_number}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Valid From</Text>
            <Text style={styles.value}>{formatDate(pass.start_date)}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Valid Until</Text>
            <Text style={styles.value}>{formatDate(pass.end_date)}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Status</Text>
            <Text style={[styles.badge, pass.status === 'Expired' && styles.badgeActive]}>
              {pass.status}
            </Text>
          </View>
        </View>

        <View style={styles.divider} />

        {/* Tax breakdown */}
        {showTax && (
          <View style={styles.section}>
            <View style={styles.taxRow}>
              <Text style={styles.taxLabel}>Base Amount</Text>
              <Text style={styles.taxValue}>₹{baseAmount}</Text>
            </View>
            <View style={styles.taxRow}>
              <Text style={styles.taxLabel}>CGST ({gstRate / 2}%)</Text>
              <Text style={styles.taxValue}>₹{Math.round(gstAmount / 2)}</Text>
            </View>
            <View style={styles.taxRow}>
              <Text style={styles.taxLabel}>SGST ({gstRate / 2}%)</Text>
              <Text style={styles.taxValue}>₹{Math.round(gstAmount / 2)}</Text>
            </View>
          </View>
        )}

        {/* Total */}
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Total Amount</Text>
          <Text style={styles.totalValue}>₹{amount}</Text>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>This is a computer-generated invoice.</Text>
          <Text style={styles.footerText}>No signature required.</Text>
        </View>
      </Page>
    </Document>
  )
}

/**
 * Download Button Component with dynamic import (needed for SSR)
 */
export function DownloadReceiptButton({ ticket, children, className }) {
  return (
    <PDFDownloadLink
      document={<TicketReceiptPDF ticket={ticket} showTax />}
      fileName={`receipt-${ticket.id.slice(0, 8)}.pdf`}
      className={className}
    >
      {({ loading }) => (loading ? 'Generating...' : children || 'Download Receipt')}
    </PDFDownloadLink>
  )
}

/**
 * Download Pass Invoice Button
 */
export function DownloadPassInvoiceButton({ pass, children, className }) {
  return (
    <PDFDownloadLink
      document={<PassInvoicePDF pass={pass} showTax />}
      fileName={`pass-invoice-${pass.id.slice(0, 8)}.pdf`}
      className={className}
    >
      {({ loading }) => (loading ? 'Generating...' : children || 'Download Invoice')}
    </PDFDownloadLink>
  )
}
