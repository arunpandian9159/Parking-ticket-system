/**
 * Tax Calculation Utilities
 * GST/Tax calculations for receipts and invoices
 */

// Default GST rates in India
export const TAX_RATES = {
  PARKING: 18, // 18% GST on parking services
  MONTHLY_PASS: 18,
}

// Tax types
export const TAX_TYPES = {
  GST: 'GST',
  CGST: 'CGST',
  SGST: 'SGST',
  IGST: 'IGST',
}

/**
 * Calculate tax from inclusive amount
 * @param {number} inclusiveAmount - Amount including tax
 * @param {number} taxRate - Tax rate percentage
 * @returns {Object} - { baseAmount, taxAmount, totalAmount }
 */
export function calculateTaxFromInclusive(inclusiveAmount, taxRate = TAX_RATES.PARKING) {
  const baseAmount = Math.round(inclusiveAmount / (1 + taxRate / 100))
  const taxAmount = inclusiveAmount - baseAmount

  return {
    baseAmount,
    taxAmount,
    totalAmount: inclusiveAmount,
    taxRate,
  }
}

/**
 * Calculate tax from exclusive amount
 * @param {number} exclusiveAmount - Amount excluding tax
 * @param {number} taxRate - Tax rate percentage
 * @returns {Object} - { baseAmount, taxAmount, totalAmount }
 */
export function calculateTaxFromExclusive(exclusiveAmount, taxRate = TAX_RATES.PARKING) {
  const taxAmount = Math.round((exclusiveAmount * taxRate) / 100)
  const totalAmount = exclusiveAmount + taxAmount

  return {
    baseAmount: exclusiveAmount,
    taxAmount,
    totalAmount,
    taxRate,
  }
}

/**
 * Split GST into CGST and SGST (for intrastate)
 * @param {number} gstAmount - Total GST amount
 * @param {number} gstRate - Total GST rate
 * @returns {Object} - { cgst, sgst, cgstRate, sgstRate }
 */
export function splitGST(gstAmount, gstRate = TAX_RATES.PARKING) {
  const halfRate = gstRate / 2
  const cgst = Math.round(gstAmount / 2)
  const sgst = gstAmount - cgst // Handle rounding

  return {
    cgst,
    sgst,
    cgstRate: halfRate,
    sgstRate: halfRate,
  }
}

/**
 * Calculate IGST (for interstate)
 * @param {number} amount - Base amount
 * @param {number} rate - IGST rate
 * @returns {Object} - { igst, igstRate }
 */
export function calculateIGST(amount, rate = TAX_RATES.PARKING) {
  return {
    igst: Math.round((amount * rate) / 100),
    igstRate: rate,
  }
}

/**
 * Generate tax invoice number
 * @param {string} prefix - Invoice prefix
 * @returns {string} - Invoice number
 */
export function generateInvoiceNumber(prefix = 'INV') {
  const date = new Date()
  const year = date.getFullYear().toString().slice(-2)
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const random = Math.floor(Math.random() * 10000)
    .toString()
    .padStart(4, '0')

  return `${prefix}${year}${month}${random}`
}

/**
 * Format tax breakdown for display
 * @param {number} amount - Total amount
 * @param {number} taxRate - Tax rate
 * @param {boolean} isInterstate - Whether IGST applies
 * @returns {Object} - Tax breakdown object
 */
export function getTaxBreakdown(amount, taxRate = TAX_RATES.PARKING, isInterstate = false) {
  const { baseAmount, taxAmount, totalAmount } = calculateTaxFromInclusive(amount, taxRate)

  if (isInterstate) {
    return {
      baseAmount,
      taxes: [{ type: TAX_TYPES.IGST, rate: taxRate, amount: taxAmount }],
      totalTax: taxAmount,
      totalAmount,
    }
  }

  const { cgst, sgst, cgstRate, sgstRate } = splitGST(taxAmount, taxRate)

  return {
    baseAmount,
    taxes: [
      { type: TAX_TYPES.CGST, rate: cgstRate, amount: cgst },
      { type: TAX_TYPES.SGST, rate: sgstRate, amount: sgst },
    ],
    totalTax: taxAmount,
    totalAmount,
  }
}

/**
 * Format amount with tax info
 * @param {number} amount - Amount
 * @param {boolean} showBreakdown - Show tax breakdown
 * @returns {string} - Formatted string
 */
export function formatWithTax(amount, showBreakdown = false) {
  if (!showBreakdown) {
    return `₹${amount}`
  }

  const { baseAmount, totalTax } = calculateTaxFromInclusive(amount, TAX_RATES.PARKING)
  return `₹${amount} (incl. ₹${totalTax} GST)`
}

/**
 * Check if business needs GST registration
 * Threshold limit in India is 20 lakhs (40 lakhs for goods)
 * @param {number} annualTurnover - Annual turnover in rupees
 * @returns {boolean}
 */
export function needsGSTRegistration(annualTurnover) {
  const THRESHOLD = 2000000 // 20 lakhs
  return annualTurnover >= THRESHOLD
}

/**
 * Validate GSTIN format
 * Format: 22AAAAA0000A1Z5
 * @param {string} gstin - GSTIN to validate
 * @returns {boolean}
 */
export function validateGSTIN(gstin) {
  if (!gstin || typeof gstin !== 'string') return false
  const gstinRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/
  return gstinRegex.test(gstin.toUpperCase())
}
