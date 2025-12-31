'use client'

import Image from 'next/image'
import { User } from 'lucide-react'

/**
 * Avatar component that displays user avatar with fallback to initials
 */
export function Avatar({ src, alt = 'User avatar', initials = 'U', size = 'md', className = '' }) {
  const sizeClasses = {
    xs: 'w-6 h-6 text-[10px]',
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
    xl: 'w-16 h-16 text-xl',
    '2xl': 'w-20 h-20 text-2xl',
  }

  const baseClasses = `${sizeClasses[size]} rounded-full flex items-center justify-center overflow-hidden ${className}`

  if (src) {
    return (
      <div className={`${baseClasses} relative`}>
        <Image src={src} alt={alt} fill className="object-cover" referrerPolicy="no-referrer" />
      </div>
    )
  }

  // Fallback to initials with gradient background
  return (
    <div
      className={`${baseClasses} bg-linear-to-br from-teal-500 to-cyan-600 text-white font-semibold`}
    >
      {initials}
    </div>
  )
}

/**
 * Avatar with status indicator (online/offline/away)
 */
export function AvatarWithStatus({
  src,
  alt,
  initials,
  size = 'md',
  status = 'online',
  className = '',
}) {
  const statusColors = {
    online: 'bg-emerald-500',
    offline: 'bg-gray-400',
    away: 'bg-amber-500',
    busy: 'bg-red-500',
  }

  const statusSizes = {
    xs: 'w-1.5 h-1.5',
    sm: 'w-2 h-2',
    md: 'w-2.5 h-2.5',
    lg: 'w-3 h-3',
    xl: 'w-3.5 h-3.5',
    '2xl': 'w-4 h-4',
  }

  return (
    <div className={`relative inline-block ${className}`}>
      <Avatar src={src} alt={alt} initials={initials} size={size} />
      <span
        className={`absolute bottom-0 right-0 ${statusSizes[size]} ${statusColors[status]} rounded-full border-2 border-background`}
      />
    </div>
  )
}

/**
 * User info display with avatar, name, and optional subtitle
 */
export function UserInfo({ avatarUrl, name, subtitle, initials, size = 'md', className = '' }) {
  const textSizes = {
    xs: { name: 'text-xs', subtitle: 'text-[10px]' },
    sm: { name: 'text-sm', subtitle: 'text-xs' },
    md: { name: 'text-sm', subtitle: 'text-xs' },
    lg: { name: 'text-base', subtitle: 'text-sm' },
    xl: { name: 'text-lg', subtitle: 'text-sm' },
    '2xl': { name: 'text-xl', subtitle: 'text-base' },
  }

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <Avatar src={avatarUrl} alt={name} initials={initials} size={size} />
      <div className="min-w-0">
        <p className={`font-medium text-foreground truncate ${textSizes[size].name}`}>{name}</p>
        {subtitle && (
          <p className={`text-muted-foreground truncate ${textSizes[size].subtitle}`}>{subtitle}</p>
        )}
      </div>
    </div>
  )
}
