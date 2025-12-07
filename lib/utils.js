/**
 * Utility Functions
 * Common helper functions used across the application
 */

import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { PRICING } from './constants'

/**
 * Merge Tailwind CSS classes with proper precedence
 * @param {...string} inputs - CSS class strings to merge
 * @returns {string} - Merged class string
 */
export function cn(...inputs) {
    return twMerge(clsx(inputs))
}

/**
 * Format currency with Indian Rupee symbol
 * @param {number} amount - Amount to format
 * @returns {string} - Formatted currency string
 */
export function formatCurrency(amount) {
    return `₹${Number(amount).toLocaleString('en-IN')}`
}

/**
 * Format date to locale string
 * @param {string|Date} date - Date to format
 * @param {object} options - Intl.DateTimeFormat options
 * @returns {string} - Formatted date string
 */
export function formatDate(date, options = {}) {
    const defaultOptions = {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        ...options
    }
    return new Date(date).toLocaleDateString('en-IN', defaultOptions)
}

/**
 * Format time to locale string
 * @param {string|Date} date - Date to format
 * @returns {string} - Formatted time string
 */
export function formatTime(date) {
    return new Date(date).toLocaleTimeString('en-IN', {
        hour: '2-digit',
        minute: '2-digit'
    })
}

/**
 * Calculate parking fine for overstay
 * @param {number} allowedHours - Hours allowed on ticket
 * @param {Date|string} entryTime - Entry timestamp
 * @returns {object} - { fine: number, overdueHours: number }
 */
export function calculateFine(allowedHours, entryTime) {
    const entry = new Date(entryTime)
    const now = new Date()
    const diffHours = (now - entry) / (1000 * 60 * 60)

    if (diffHours <= allowedHours) {
        return { fine: 0, overdueHours: 0 }
    }

    const overdueHours = diffHours - allowedHours
    const fine = PRICING.OVERDUE_BASE_FINE + (Math.ceil(overdueHours) * PRICING.OVERDUE_HOURLY_FINE)

    return { fine, overdueHours: Number(overdueHours.toFixed(1)) }
}

/**
 * Calculate parking price based on hours and rate
 * @param {number} hours - Duration in hours
 * @param {number} hourlyRate - Rate per hour
 * @returns {number} - Total price
 */
export function calculatePrice(hours, hourlyRate = PRICING.DEFAULT_HOURLY_RATE) {
    return Math.ceil(hours * hourlyRate)
}

/**
 * Debounce function to limit execution rate
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in ms
 * @returns {Function} - Debounced function
 */
export function debounce(func, wait = 300) {
    let timeout
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout)
            func(...args)
        }
        clearTimeout(timeout)
        timeout = setTimeout(later, wait)
    }
}

/**
 * Truncate string with ellipsis
 * @param {string} str - String to truncate
 * @param {number} length - Max length
 * @returns {string} - Truncated string
 */
export function truncate(str, length = 30) {
    if (!str) return ''
    return str.length > length ? str.substring(0, length) + '...' : str
}
