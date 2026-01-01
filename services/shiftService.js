/**
 * Shift Service
 * API operations for shift management
 */

import { supabase } from '@/lib/supabase'

/**
 * Get all shifts with optional filters
 * @param {Object} filters - Filter options
 * @returns {Promise<{data: Array, error: Error|null}>}
 */
export async function getShifts(filters = {}) {
  try {
    let query = supabase.from('shifts').select('*').order('start_time', { ascending: false })

    if (filters.officerId) {
      query = query.eq('officer_id', filters.officerId)
    }

    if (filters.isActive) {
      query = query.is('end_time', null)
    }

    if (filters.dateFrom) {
      query = query.gte('start_time', filters.dateFrom)
    }

    if (filters.dateTo) {
      query = query.lte('start_time', filters.dateTo)
    }

    if (filters.limit) {
      query = query.limit(filters.limit)
    }

    const { data, error } = await query

    if (error) throw error
    return { data, error: null }
  } catch (error) {
    console.error('Error fetching shifts:', error)
    return { data: null, error }
  }
}

/**
 * Get current active shift for an officer
 * @param {string} officerId - Officer user ID
 * @returns {Promise<{data: Object|null, error: Error|null}>}
 */
export async function getActiveShift(officerId) {
  try {
    const { data, error } = await supabase
      .from('shifts')
      .select('*')
      .eq('officer_id', officerId)
      .is('end_time', null)
      .single()

    if (error && error.code !== 'PGRST116') throw error // PGRST116 = no rows returned
    return { data: data || null, error: null }
  } catch (error) {
    console.error('Error fetching active shift:', error)
    return { data: null, error }
  }
}

/**
 * Clock in - Start a new shift
 * @param {string} officerId - Officer user ID
 * @returns {Promise<{data: Object, error: Error|null}>}
 */
export async function clockIn(officerId) {
  try {
    // First check if there's already an active shift
    const { data: existingShift } = await getActiveShift(officerId)
    if (existingShift) {
      return { data: null, error: new Error('You already have an active shift') }
    }

    const { data, error } = await supabase
      .from('shifts')
      .insert([
        {
          officer_id: officerId,
          start_time: new Date().toISOString(),
        },
      ])
      .select()
      .single()

    if (error) throw error
    return { data, error: null }
  } catch (error) {
    console.error('Error clocking in:', error)
    return { data: null, error }
  }
}

/**
 * Clock out - End a shift
 * @param {string} shiftId - Shift ID
 * @param {Object} summary - Shift summary data
 * @returns {Promise<{data: Object, error: Error|null}>}
 */
export async function clockOut(shiftId, summary = {}) {
  try {
    const { data, error } = await supabase
      .from('shifts')
      .update({
        end_time: new Date().toISOString(),
        cash_collected: summary.cashCollected || 0,
        tickets_issued: summary.ticketsIssued || 0,
        notes: summary.notes || null,
      })
      .eq('id', shiftId)
      .select()
      .single()

    if (error) throw error
    return { data, error: null }
  } catch (error) {
    console.error('Error clocking out:', error)
    return { data: null, error }
  }
}

/**
 * Update shift statistics (called when ticket is created/paid)
 * @param {string} shiftId - Shift ID
 * @param {Object} updates - Stats to add
 * @returns {Promise<{success: boolean, error: Error|null}>}
 */
export async function updateShiftStats(shiftId, updates) {
  try {
    // Get current shift
    const { data: shift, error: fetchError } = await supabase
      .from('shifts')
      .select('tickets_issued, cash_collected')
      .eq('id', shiftId)
      .single()

    if (fetchError) throw fetchError

    const { error } = await supabase
      .from('shifts')
      .update({
        tickets_issued: (shift.tickets_issued || 0) + (updates.ticketsIssued || 0),
        cash_collected: (shift.cash_collected || 0) + (updates.cashCollected || 0),
      })
      .eq('id', shiftId)

    if (error) throw error
    return { success: true, error: null }
  } catch (error) {
    console.error('Error updating shift stats:', error)
    return { success: false, error }
  }
}

/**
 * Get shift history for an officer
 * @param {string} officerId - Officer user ID
 * @param {number} limit - Number of shifts to fetch
 * @returns {Promise<{data: Array, error: Error|null}>}
 */
export async function getShiftHistory(officerId, limit = 10) {
  try {
    const { data, error } = await supabase
      .from('shifts')
      .select('*')
      .eq('officer_id', officerId)
      .order('start_time', { ascending: false })
      .limit(limit)

    if (error) throw error
    return { data, error: null }
  } catch (error) {
    console.error('Error fetching shift history:', error)
    return { data: null, error }
  }
}
