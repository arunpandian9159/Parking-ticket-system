/**
 * QRCodeGenerator Component
 * Generate QR codes for tickets and passes using qrcode.react
 */

'use client'

import { QRCodeSVG, QRCodeCanvas } from 'qrcode.react'
import { cn } from '@/lib/utils'

/**
 * Base URL for QR code links
 */
const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://parking-ticket-system.vercel.app'

/**
 * Generate ticket status URL
 * @param {string} ticketId - Ticket ID
 * @returns {string}
 */
export function getTicketQRUrl(ticketId) {
  return `${BASE_URL}/status?ticket=${ticketId}`
}

/**
 * Generate pass verification URL
 * @param {string} passId - Pass ID
 * @returns {string}
 */
export function getPassQRUrl(passId) {
  return `${BASE_URL}/status?pass=${passId}`
}

/**
 * QRCodeGenerator - SVG-based QR code (recommended for most uses)
 */
export function QRCodeGenerator({
  value,
  size = 128,
  level = 'M', // L, M, Q, H (error correction level)
  includeMargin = true,
  fgColor = '#000000',
  bgColor = '#ffffff',
  className,
  imageSettings,
  ...props
}) {
  return (
    <div className={cn('rounded-lg overflow-hidden', className)} {...props}>
      <QRCodeSVG
        value={value}
        size={size}
        level={level}
        includeMargin={includeMargin}
        fgColor={fgColor}
        bgColor={bgColor}
        imageSettings={imageSettings}
      />
    </div>
  )
}

/**
 * QRCodeCanvas - Canvas-based QR code (for printing/download)
 */
export function QRCodeCanvasComponent({
  value,
  size = 128,
  level = 'M',
  includeMargin = true,
  fgColor = '#000000',
  bgColor = '#ffffff',
  className,
  id,
  ...props
}) {
  return (
    <div className={cn('rounded-lg overflow-hidden', className)} {...props}>
      <QRCodeCanvas
        id={id}
        value={value}
        size={size}
        level={level}
        includeMargin={includeMargin}
        fgColor={fgColor}
        bgColor={bgColor}
      />
    </div>
  )
}

/**
 * TicketQRCode - Pre-configured QR for tickets
 */
export function TicketQRCode({ ticketId, size = 128, className, showLabel = true }) {
  const url = getTicketQRUrl(ticketId)

  return (
    <div className={cn('flex flex-col items-center gap-2', className)}>
      <QRCodeGenerator value={url} size={size} level="M" bgColor="transparent" />
      {showLabel && (
        <span className="text-xs text-muted-foreground text-center">Scan to check status</span>
      )}
    </div>
  )
}

/**
 * PassQRCode - Pre-configured QR for monthly passes
 */
export function PassQRCode({ passId, size = 128, className, showLabel = true }) {
  const url = getPassQRUrl(passId)

  return (
    <div className={cn('flex flex-col items-center gap-2', className)}>
      <QRCodeGenerator value={url} size={size} level="M" bgColor="transparent" />
      {showLabel && (
        <span className="text-xs text-muted-foreground text-center">Monthly Pass QR</span>
      )}
    </div>
  )
}

/**
 * PrintableQRCode - For printed receipts
 */
export function PrintableQRCode({ value, size = 100, label }) {
  return (
    <div className="flex flex-col items-center p-2 bg-white">
      <QRCodeSVG value={value} size={size} level="H" includeMargin={false} />
      {label && <p className="mt-1 text-[10px] text-gray-500 text-center">{label}</p>}
    </div>
  )
}

/**
 * Download QR code as image
 * @param {string} canvasId - The canvas element id
 * @param {string} filename - Download filename
 */
export function downloadQRCode(canvasId, filename = 'qr-code.png') {
  const canvas = document.getElementById(canvasId)
  if (!canvas) return

  const url = canvas.toDataURL('image/png')
  const link = document.createElement('a')
  link.download = filename
  link.href = url
  link.click()
}

/**
 * QRCodeWithDownload - QR code with download button
 */
export function QRCodeWithDownload({ value, size = 128, filename = 'qr-code.png', className }) {
  const canvasId = `qr-${Math.random().toString(36).substr(2, 9)}`

  return (
    <div className={cn('flex flex-col items-center gap-3', className)}>
      <QRCodeCanvasComponent id={canvasId} value={value} size={size} level="H" />
      <button
        onClick={() => downloadQRCode(canvasId, filename)}
        className="text-xs text-teal-500 hover:text-teal-600 underline"
      >
        Download QR Code
      </button>
    </div>
  )
}
