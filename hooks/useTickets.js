/**
 * useTickets Hook
 * Custom hook for ticket operations using TanStack Query
 */

'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  getTickets,
  getTicketById,
  createTicket,
  updateTicket,
  markTicketPaid,
  deleteTicket,
  searchTickets,
} from '@/services/ticketService'
import { toast } from 'sonner'

/**
 * Hook to fetch all tickets with optional filters
 */
export function useTickets(filters = {}) {
  return useQuery({
    queryKey: ['tickets', filters],
    queryFn: () =>
      getTickets(filters).then(res => {
        if (res.error) throw res.error
        return res.data
      }),
    staleTime: 30000, // 30 seconds
  })
}

/**
 * Hook to fetch a single ticket by ID
 */
export function useTicket(id) {
  return useQuery({
    queryKey: ['ticket', id],
    queryFn: () =>
      getTicketById(id).then(res => {
        if (res.error) throw res.error
        return res.data
      }),
    enabled: !!id,
  })
}

/**
 * Hook to create a new ticket
 */
export function useCreateTicket() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createTicket,
    onSuccess: result => {
      if (result.error) {
        toast.error('Failed to create ticket')
        return
      }
      toast.success('Ticket created successfully')
      queryClient.invalidateQueries({ queryKey: ['tickets'] })
    },
    onError: () => {
      toast.error('Failed to create ticket')
    },
  })
}

/**
 * Hook to update a ticket
 */
export function useUpdateTicket() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, updates }) => updateTicket(id, updates),
    onSuccess: (result, variables) => {
      if (result.error) {
        toast.error('Failed to update ticket')
        return
      }
      toast.success('Ticket updated successfully')
      queryClient.invalidateQueries({ queryKey: ['tickets'] })
      queryClient.invalidateQueries({ queryKey: ['ticket', variables.id] })
    },
    onError: () => {
      toast.error('Failed to update ticket')
    },
  })
}

/**
 * Hook to mark a ticket as paid
 */
export function useMarkTicketPaid() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, fineAmount }) => markTicketPaid(id, fineAmount),
    onSuccess: result => {
      if (result.error) {
        toast.error('Failed to mark ticket as paid')
        return
      }
      toast.success('Ticket marked as paid')
      queryClient.invalidateQueries({ queryKey: ['tickets'] })
    },
    onError: () => {
      toast.error('Failed to mark ticket as paid')
    },
  })
}

/**
 * Hook to delete a ticket
 */
export function useDeleteTicket() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteTicket,
    onSuccess: result => {
      if (result.error) {
        toast.error('Failed to delete ticket')
        return
      }
      toast.success('Ticket deleted successfully')
      queryClient.invalidateQueries({ queryKey: ['tickets'] })
    },
    onError: () => {
      toast.error('Failed to delete ticket')
    },
  })
}

/**
 * Hook for searching tickets
 */
export function useSearchTickets(searchTerm) {
  return useQuery({
    queryKey: ['tickets', 'search', searchTerm],
    queryFn: () =>
      searchTickets(searchTerm).then(res => {
        if (res.error) throw res.error
        return res.data
      }),
    enabled: searchTerm.length >= 2,
    staleTime: 10000,
  })
}
