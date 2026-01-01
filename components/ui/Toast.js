/**
 * Toast Component
 * Toast notification wrapper using Sonner
 */

'use client'

import { Toaster as SonnerToaster } from 'sonner'
import { useTheme } from '@/lib/ThemeContext'

export function Toaster() {
  const { theme } = useTheme()

  return (
    <SonnerToaster
      theme={theme}
      position="top-right"
      expand={true}
      richColors
      closeButton
      toastOptions={{
        style: {
          borderRadius: '12px',
          border: '1px solid var(--border)',
        },
        classNames: {
          toast: 'group toast',
          title: 'text-foreground font-semibold',
          description: 'text-muted-foreground',
          actionButton: 'bg-primary text-primary-foreground',
          cancelButton: 'bg-secondary text-secondary-foreground',
        },
      }}
    />
  )
}

// Re-export toast for convenience
export { toast } from 'sonner'
