/**
 * Ticket Service
 * API operations for ticket management
 */

import { supabase } from '@/lib/supabase'

/**
 * Fetch all tickets with optional filters
 * @param {Object} filters - Filter options
 * @returns {Promise<{data: Array, error: Error|null}>}
 */
export async function getTickets(filters = {}) {
  try {
    let query = supabase.from('tickets').select('*').order('created_at', { ascending: false })

    if (filters.status) {
      query = query.eq('status', filters.status)
    }

    if (filters.dateFrom) {
      query = query.gte('created_at', filters.dateFrom)
    }

    if (filters.dateTo) {
      query = query.lte('created_at', filters.dateTo)
    }

    if (filters.vehicleType) {
      query = query.eq('vehicle_type', filters.vehicleType)
    }

    if (filters.licensePlate) {
      query = query.ilike('license_plate', `%${filters.licensePlate}%`)
    }

    if (filters.limit) {
      query = query.limit(filters.limit)
    }

    const { data, error } = await query

    if (error) throw error
    return { data, error: null }
  } catch (error) {
    console.error('Error fetching tickets:', error)
    return { data: null, error }
  }
}

/**
 * Get a single ticket by ID
 * @param {string} id - Ticket ID
 * @returns {Promise<{data: Object, error: Error|null}>}
 */
export async function getTicketById(id) {
  try {
    const { data, error } = await supabase.from('tickets').select('*').eq('id', id).single()

    if (error) throw error
    return { data, error: null }
  } catch (error) {
    console.error('Error fetching ticket:', error)
    return { data: null, error }
  }
}

/**
 * Create a new ticket
 * @param {Object} ticketData - Ticket data
 * @returns {Promise<{data: Object, error: Error|null}>}
 */
export async function createTicket(ticketData) {
  try {
    const { data, error } = await supabase.from('tickets').insert([ticketData]).select().single()

    if (error) throw error
    return { data, error: null }
  } catch (error) {
    console.error('Error creating ticket:', error)
    return { data: null, error }
  }
}

/**
 * Update a ticket
 * @param {string} id - Ticket ID
 * @param {Object} updates - Fields to update
 * @returns {Promise<{data: Object, error: Error|null}>}
 */
export async function updateTicket(id, updates) {
  try {
    const { data, error } = await supabase
      .from('tickets')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return { data, error: null }
  } catch (error) {
    console.error('Error updating ticket:', error)
    return { data: null, error }
  }
}

/**
 * Mark a ticket as paid
 * @param {string} id - Ticket ID
 * @param {number} fineAmount - Optional fine amount
 * @returns {Promise<{data: Object, error: Error|null}>}
 */
export async function markTicketPaid(id, fineAmount = 0) {
  return updateTicket(id, {
    status: 'Paid',
    fine_amount: fineAmount,
    actual_exit_time: new Date().toISOString(),
  })
}

/**
 * Delete a ticket
 * @param {string} id - Ticket ID
 * @returns {Promise<{success: boolean, error: Error|null}>}
 */
export async function deleteTicket(id) {
  try {
    const { error } = await supabase.from('tickets').delete().eq('id', id)

    if (error) throw error
    return { success: true, error: null }
  } catch (error) {
    console.error('Error deleting ticket:', error)
    return { success: false, error }
  }
}

/**
 * Search tickets across multiple fields
 * @param {string} searchTerm - Search term
 * @returns {Promise<{data: Array, error: Error|null}>}
 */
export async function searchTickets(searchTerm) {
  try {
    const { data, error } = await supabase
      .from('tickets')
      .select('*')
      .or(
        `license_plate.ilike.%${searchTerm}%,customer_name.ilike.%${searchTerm}%,customer_phone.ilike.%${searchTerm}%`
      )
      .order('created_at', { ascending: false })
      .limit(20)

    if (error) throw error
    return { data, error: null }
  } catch (error) {
    console.error('Error searching tickets:', error)
    return { data: null, error }
  }
}
