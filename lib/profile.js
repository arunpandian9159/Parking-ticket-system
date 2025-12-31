'use client'

import { supabase } from './supabase'

/**
 * Fetches the user's profile from the profiles table
 * @param {string} userId - The user's ID
 * @returns {Promise<{data: object|null, error: Error|null}>}
 */
export async function getProfile(userId) {
  const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).single()

  return { data, error }
}

/**
 * Updates the user's profile
 * @param {string} userId - The user's ID
 * @param {object} updates - The profile updates
 * @returns {Promise<{data: object|null, error: Error|null}>}
 */
export async function updateProfile(userId, updates) {
  const { data, error } = await supabase
    .from('profiles')
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq('id', userId)
    .select()
    .single()

  return { data, error }
}

/**
 * Gets user display information combining auth and profile data
 * @param {object} user - The auth user object
 * @param {object} profile - The profile object (optional)
 * @returns {object} - Display info with fallbacks
 */
export function getUserDisplayInfo(user, profile = null) {
  return {
    name:
      profile?.full_name ||
      user?.user_metadata?.full_name ||
      user?.user_metadata?.name ||
      user?.email?.split('@')[0] ||
      'User',
    email: user?.email || profile?.email || '',
    avatarUrl:
      profile?.avatar_url ||
      user?.user_metadata?.avatar_url ||
      user?.user_metadata?.picture ||
      null,
    initials: getInitials(
      profile?.full_name ||
        user?.user_metadata?.full_name ||
        user?.user_metadata?.name ||
        user?.email ||
        'U'
    ),
    provider: profile?.provider || user?.app_metadata?.provider || 'email',
  }
}

/**
 * Gets initials from a name or email
 * @param {string} nameOrEmail
 * @returns {string} - Initials (1-2 characters)
 */
function getInitials(nameOrEmail) {
  if (!nameOrEmail) return 'U'

  // If it's an email, use first letter
  if (nameOrEmail.includes('@')) {
    return nameOrEmail[0].toUpperCase()
  }

  // Split name and get initials
  const parts = nameOrEmail.trim().split(/\s+/)
  if (parts.length === 1) {
    return parts[0][0].toUpperCase()
  }
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}
