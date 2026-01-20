/**
 * useShifts Hook
 * Custom hook for shift management operations
 */

'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  getShifts,
  getActiveShift,
  clockIn, 
  clockOut,
  getShiftHistory,
} from '@/services/shiftService'
import { toast } from 'sonner'
import { useAuth } from './useAuth'

/**
 * Hook to get all shifts with optional filters
 */
export function useShifts(filters = {}) {
  return useQuery({
    queryKey: ['shifts', filters],
    queryFn: () =>
      getShifts(filters).then(res => {
        if (res.error) throw res.error
        return res.data
      }),
    staleTime: 30000,
  })
}

/**
 * Hook to get current active shift for the logged-in officer
 */
export function useActiveShift() {
  const { user } = useAuth()

  return useQuery({
    queryKey: ['shifts', 'active', user?.id],
    queryFn: () =>
      getActiveShift(user.id).then(res => {
        if (res.error) throw res.error
        return res.data
      }),
    enabled: !!user?.id,
    staleTime: 10000,
    refetchInterval: 60000, // Refetch every minute
  })
}

/**
 * Hook to clock in
 */
export function useClockIn() {
  const queryClient = useQueryClient()
  const { user } = useAuth()

  return useMutation({
    mutationFn: () => clockIn(user.id),
    onSuccess: result => {
      if (result.error) {
        toast.error(result.error.message || 'Failed to clock in')
        return
      }
      toast.success('Clocked in successfully! Your shift has started.')
      queryClient.invalidateQueries({ queryKey: ['shifts'] })
    },
    onError: error => {
      toast.error(error.message || 'Failed to clock in')
    },
  })
}

/**
 * Hook to clock out
 */
export function useClockOut() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ shiftId, summary }) => clockOut(shiftId, summary),
    onSuccess: result => {
      if (result.error) {
        toast.error('Failed to clock out')
        return
      }
      toast.success('Clocked out successfully! Shift ended.')
      queryClient.invalidateQueries({ queryKey: ['shifts'] })
    },
    onError: () => {
      toast.error('Failed to clock out')
    },
  })
}

/**
 * Hook to get shift history for the logged-in officer
 */
export function useShiftHistory(limit = 10) {
  const { user } = useAuth()

  return useQuery({
    queryKey: ['shifts', 'history', user?.id, limit],
    queryFn: () =>
      getShiftHistory(user.id, limit).then(res => {
        if (res.error) throw res.error
        return res.data
      }),
    enabled: !!user?.id,
  })
}
