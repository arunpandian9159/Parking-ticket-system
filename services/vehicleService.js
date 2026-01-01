/**
 * Vehicle Service
 * API operations for vehicle history and loyalty tracking
 */

import { supabase } from '@/lib/supabase'

// Loyalty tiers configuration
export const LOYALTY_TIERS = {
  Regular: { minPoints: 0, discount: 0, color: 'gray' },
  Silver: { minPoints: 100, discount: 5, color: 'silver' },
  Gold: { minPoints: 500, discount: 10, color: 'amber' },
  Platinum: { minPoints: 1000, discount: 15, color: 'violet' },
}

// Points per ₹10 spent
export const POINTS_PER_10_RUPEES = 1

/**
 * Calculate loyalty points from amount
 * @param {number} amount - Amount in rupees
 * @returns {number} - Points earned
 */
export function calculatePoints(amount) {
  return Math.floor(amount / 10) * POINTS_PER_10_RUPEES
}

/**
 * Get tier from points
 * @param {number} points - Total points
 * @returns {string} - Tier name
 */
export function getTierFromPoints(points) {
  if (points >= LOYALTY_TIERS.Platinum.minPoints) return 'Platinum'
  if (points >= LOYALTY_TIERS.Gold.minPoints) return 'Gold'
  if (points >= LOYALTY_TIERS.Silver.minPoints) return 'Silver'
  return 'Regular'
}

/**
 * Get vehicle history by license plate
 * @param {string} licensePlate - License plate number
 * @returns {Promise<{data: Object|null, error: Error|null}>}
 */
export async function getVehicleHistory(licensePlate) {
  try {
    const { data, error } = await supabase
      .from('vehicle_history')
      .select('*')
      .eq('license_plate', licensePlate.toUpperCase())
      .single()

    if (error && error.code !== 'PGRST116') throw error
    return { data: data || null, error: null }
  } catch (error) {
    console.error('Error fetching vehicle history:', error)
    return { data: null, error }
  }
}

/**
 * Update or create vehicle history record
 * @param {string} licensePlate - License plate number
 * @param {number} amountSpent - Amount spent in this visit
 * @returns {Promise<{data: Object, error: Error|null}>}
 */
export async function updateVehicleHistory(licensePlate, amountSpent) {
  try {
    const plate = licensePlate.toUpperCase()
    const pointsEarned = calculatePoints(amountSpent)

    // Check if record exists
    const { data: existing } = await getVehicleHistory(plate)

    if (existing) {
      // Update existing record
      const newPoints = (existing.loyalty_points || 0) + pointsEarned
      const newTier = getTierFromPoints(newPoints)

      const { data, error } = await supabase
        .from('vehicle_history')
        .update({
          visit_count: existing.visit_count + 1,
          total_spent: existing.total_spent + amountSpent,
          last_visit: new Date().toISOString(),
          loyalty_points: newPoints,
          tier: newTier,
        })
        .eq('license_plate', plate)
        .select()
        .single()

      if (error) throw error
      return { data, error: null }
    } else {
      // Create new record
      const tier = getTierFromPoints(pointsEarned)

      const { data, error } = await supabase
        .from('vehicle_history')
        .insert([
          {
            license_plate: plate,
            visit_count: 1,
            total_spent: amountSpent,
            first_visit: new Date().toISOString(),
            last_visit: new Date().toISOString(),
            loyalty_points: pointsEarned,
            tier: tier,
          },
        ])
        .select()
        .single()

      if (error) throw error
      return { data, error: null }
    }
  } catch (error) {
    console.error('Error updating vehicle history:', error)
    return { data: null, error }
  }
}

/**
 * Get top loyal customers
 * @param {number} limit - Number of customers to fetch
 * @returns {Promise<{data: Array, error: Error|null}>}
 */
export async function getTopCustomers(limit = 10) {
  try {
    const { data, error } = await supabase
      .from('vehicle_history')
      .select('*')
      .order('loyalty_points', { ascending: false })
      .limit(limit)

    if (error) throw error
    return { data, error: null }
  } catch (error) {
    console.error('Error fetching top customers:', error)
    return { data: null, error }
  }
}

/**
 * Get frequent parkers (visit count based)
 * @param {number} minVisits - Minimum visits to qualify
 * @returns {Promise<{data: Array, error: Error|null}>}
 */
export async function getFrequentParkers(minVisits = 5) {
  try {
    const { data, error } = await supabase
      .from('vehicle_history')
      .select('*')
      .gte('visit_count', minVisits)
      .order('visit_count', { ascending: false })

    if (error) throw error
    return { data, error: null }
  } catch (error) {
    console.error('Error fetching frequent parkers:', error)
    return { data: null, error }
  }
}

/**
 * Apply discount based on loyalty tier
 * @param {number} amount - Original amount
 * @param {string} tier - Loyalty tier
 * @returns {Object} - { discount, finalAmount }
 */
export function applyLoyaltyDiscount(amount, tier) {
  const tierInfo = LOYALTY_TIERS[tier] || LOYALTY_TIERS.Regular
  const discount = (amount * tierInfo.discount) / 100
  return {
    discount: Math.round(discount),
    finalAmount: Math.round(amount - discount),
    discountPercent: tierInfo.discount,
  }
}

/**
 * Search vehicles by partial plate number
 * @param {string} searchTerm - Partial plate number
 * @returns {Promise<{data: Array, error: Error|null}>}
 */
export async function searchVehicles(searchTerm) {
  try {
    const { data, error } = await supabase
      .from('vehicle_history')
      .select('*')
      .ilike('license_plate', `%${searchTerm.toUpperCase()}%`)
      .limit(20)

    if (error) throw error
    return { data, error: null }
  } catch (error) {
    console.error('Error searching vehicles:', error)
    return { data: null, error }
  }
}
