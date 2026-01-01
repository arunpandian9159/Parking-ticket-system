/**
 * ConfirmDialog Component
 * Styled confirmation dialog to replace browser confirm()
 */

'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { X, AlertTriangle, Trash2, CheckCircle } from 'lucide-react'

/**
 * ConfirmDialog - Modal confirmation dialog
 */
export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirm Action',
  message = 'Are you sure you want to proceed?',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'danger', // 'danger' | 'warning' | 'success'
  loading = false,
}) {
  if (!isOpen) return null

  const variantStyles = {
    danger: {
      icon: Trash2,
      iconBg: 'bg-red-500/10',
      iconColor: 'text-red-500',
      confirmBg: 'bg-red-500 hover:bg-red-600',
    },
    warning: {
      icon: AlertTriangle,
      iconBg: 'bg-amber-500/10',
      iconColor: 'text-amber-500',
      confirmBg: 'bg-amber-500 hover:bg-amber-600',
    },
    success: {
      icon: CheckCircle,
      iconBg: 'bg-teal-500/10',
      iconColor: 'text-teal-500',
      confirmBg: 'bg-teal-500 hover:bg-teal-600',
    },
  }

  const style = variantStyles[variant]
  const Icon = style.icon

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      {/* Dialog */}
      <div className="relative bg-card rounded-2xl border border-border shadow-2xl w-full max-w-md mx-4 overflow-hidden animate-in zoom-in-95 fade-in duration-200">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-lg hover:bg-secondary transition-colors"
        >
          <X className="w-4 h-4 text-muted-foreground" />
        </button>

        {/* Content */}
        <div className="p-6 pt-8 text-center">
          {/* Icon */}
          <div
            className={`w-16 h-16 mx-auto rounded-full ${style.iconBg} flex items-center justify-center mb-4`}
          >
            <Icon className={`w-8 h-8 ${style.iconColor}`} />
          </div>

          {/* Title */}
          <h3 className="text-xl font-bold text-foreground mb-2">{title}</h3>

          {/* Message */}
          <p className="text-muted-foreground text-sm mb-6">{message}</p>

          {/* Actions */}
          <div className="flex gap-3">
            <Button
              onClick={onClose}
              className="flex-1 bg-secondary text-foreground hover:bg-secondary/80"
              disabled={loading}
            >
              {cancelText}
            </Button>
            <Button
              onClick={onConfirm}
              className={`flex-1 text-white ${style.confirmBg}`}
              disabled={loading}
            >
              {loading ? 'Processing...' : confirmText}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

/**
 * Hook to use confirm dialog
 */
export function useConfirmDialog() {
  const [isOpen, setIsOpen] = useState(false)
  const [config, setConfig] = useState({})
  const [resolver, setResolver] = useState(null)

  const confirm = (options = {}) => {
    return new Promise(resolve => {
      setConfig(options)
      setResolver(() => resolve)
      setIsOpen(true)
    })
  }

  const handleConfirm = () => {
    setIsOpen(false)
    resolver?.(true)
  }

  const handleClose = () => {
    setIsOpen(false)
    resolver?.(false)
  }

  const DialogComponent = (
    <ConfirmDialog isOpen={isOpen} onClose={handleClose} onConfirm={handleConfirm} {...config} />
  )

  return {
    confirm,
    ConfirmDialogComponent: DialogComponent,
  }
}
