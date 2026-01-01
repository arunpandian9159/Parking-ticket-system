/**
 * Skeleton Components
 * Loading skeleton components for better UX
 */

'use client'

import { cn } from '@/lib/utils'

/**
 * Base Skeleton component
 */
export function Skeleton({ className, ...props }) {
  return <div className={cn('animate-pulse rounded-md bg-muted/50', className)} {...props} />
}

/**
 * Card Skeleton for loading states
 */
export function CardSkeleton({ className }) {
  return (
    <div className={cn('bg-card rounded-xl border border-border p-6 space-y-4', className)}>
      <Skeleton className="h-4 w-2/3" />
      <Skeleton className="h-8 w-1/3" />
      <div className="space-y-2">
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-4/5" />
      </div>
    </div>
  )
}

/**
 * Table Row Skeleton
 */
export function TableRowSkeleton({ columns = 5 }) {
  return (
    <tr className="border-b border-border">
      {Array.from({ length: columns }).map((_, i) => (
        <td key={i} className="p-4">
          <Skeleton className="h-4 w-full" />
        </td>
      ))}
    </tr>
  )
}

/**
 * Ticket Card Skeleton
 */
export function TicketCardSkeleton() {
  return (
    <div className="bg-card rounded-xl border border-border p-4 space-y-3">
      <div className="flex items-center justify-between">
        <Skeleton className="h-6 w-24" />
        <Skeleton className="h-6 w-16 rounded-full" />
      </div>
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-4 rounded" />
          <Skeleton className="h-4 w-32" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-4 rounded" />
          <Skeleton className="h-4 w-24" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-4 rounded" />
          <Skeleton className="h-4 w-20" />
        </div>
      </div>
      <div className="flex gap-2 pt-2">
        <Skeleton className="h-8 w-full rounded-lg" />
        <Skeleton className="h-8 w-full rounded-lg" />
      </div>
    </div>
  )
}

/**
 * Stats Card Skeleton
 */
export function StatsCardSkeleton() {
  return (
    <div className="bg-card rounded-xl border border-border p-4 sm:p-6 space-y-2">
      <Skeleton className="h-3 w-24" />
      <Skeleton className="h-8 w-20" />
    </div>
  )
}

/**
 * Chart Skeleton
 */
export function ChartSkeleton({ className }) {
  return (
    <div className={cn('bg-card rounded-xl border border-border p-6', className)}>
      <div className="flex justify-between items-center mb-4">
        <Skeleton className="h-5 w-48" />
        <Skeleton className="h-8 w-8 rounded-lg" />
      </div>
      <div className="h-64 flex items-end justify-around gap-2 pt-4">
        {Array.from({ length: 7 }).map((_, i) => (
          <Skeleton
            key={i}
            className="w-10 rounded-t-md"
            style={{ height: `${Math.random() * 60 + 20}%` }}
          />
        ))}
      </div>
    </div>
  )
}

/**
 * Parking Map Skeleton
 */
export function ParkingMapSkeleton() {
  return (
    <div className="space-y-6">
      <div className="bg-secondary/50 p-4 rounded-xl border border-border">
        <Skeleton className="h-4 w-24 mb-4" />
        <div className="grid grid-cols-5 sm:grid-cols-6 gap-3">
          {Array.from({ length: 12 }).map((_, i) => (
            <Skeleton key={i} className="aspect-square rounded-lg" />
          ))}
        </div>
      </div>
      <div className="flex gap-4 justify-center">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-4 w-20" />
      </div>
    </div>
  )
}

/**
 * Profile Skeleton
 */
export function ProfileSkeleton() {
  return (
    <div className="flex items-center gap-3">
      <Skeleton className="h-10 w-10 rounded-full" />
      <div className="space-y-1">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-3 w-16" />
      </div>
    </div>
  )
}

/**
 * List Skeleton
 */
export function ListSkeleton({ items = 5 }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: items }).map((_, i) => (
        <div key={i} className="flex items-center gap-3">
          <Skeleton className="h-10 w-10 rounded-lg" />
          <div className="flex-1 space-y-1">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        </div>
      ))}
    </div>
  )
}
