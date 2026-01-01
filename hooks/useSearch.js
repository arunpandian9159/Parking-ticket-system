/**
 * useSearch Hook
 * Debounced search with recent items tracking
 */

'use client'

import { useState, useEffect, useCallback } from 'react'
import { debounce } from '@/lib/utils'

const RECENT_SEARCHES_KEY = 'parking_recent_searches'
const MAX_RECENT_ITEMS = 5

/**
 * Hook for debounced search with recent items
 */
export function useSearch(searchFn, delay = 300) {
  const [query, setQuery] = useState('')
  const [debouncedQuery, setDebouncedQuery] = useState('')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [recentSearches, setRecentSearches] = useState([])

  // Load recent searches from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(RECENT_SEARCHES_KEY)
      if (stored) {
        try {
          setRecentSearches(JSON.parse(stored))
        } catch (e) {
          console.error('Error parsing recent searches:', e)
        }
      }
    }
  }, [])

  // Debounce the query
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(query)
    }, delay)

    return () => clearTimeout(handler)
  }, [query, delay])

  // Search when debounced query changes
  useEffect(() => {
    const performSearch = async () => {
      if (debouncedQuery.length < 2) {
        setResults([])
        return
      }

      setLoading(true)
      try {
        const searchResults = await searchFn(debouncedQuery)
        setResults(searchResults.data || [])
      } catch (error) {
        console.error('Search error:', error)
        setResults([])
      } finally {
        setLoading(false)
      }
    }

    performSearch()
  }, [debouncedQuery, searchFn])

  // Add to recent searches
  const addToRecent = useCallback(item => {
    setRecentSearches(prev => {
      const filtered = prev.filter(r => r.id !== item.id)
      const updated = [item, ...filtered].slice(0, MAX_RECENT_ITEMS)

      if (typeof window !== 'undefined') {
        localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated))
      }

      return updated
    })
  }, [])

  // Clear recent searches
  const clearRecent = useCallback(() => {
    setRecentSearches([])
    if (typeof window !== 'undefined') {
      localStorage.removeItem(RECENT_SEARCHES_KEY)
    }
  }, [])

  return {
    query,
    setQuery,
    results,
    loading,
    recentSearches,
    addToRecent,
    clearRecent,
  }
}

/**
 * Hook for filter presets
 */
export function useFilterPresets() {
  const PRESETS_KEY = 'parking_filter_presets'
  const [presets, setPresets] = useState([])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(PRESETS_KEY)
      if (stored) {
        try {
          setPresets(JSON.parse(stored))
        } catch (e) {
          console.error('Error parsing filter presets:', e)
        }
      }
    }
  }, [])

  const savePreset = useCallback((name, filters) => {
    const newPreset = {
      id: Date.now().toString(),
      name,
      filters,
      createdAt: new Date().toISOString(),
    }

    setPresets(prev => {
      const updated = [...prev, newPreset]
      if (typeof window !== 'undefined') {
        localStorage.setItem(PRESETS_KEY, JSON.stringify(updated))
      }
      return updated
    })

    return newPreset
  }, [])

  const deletePreset = useCallback(id => {
    setPresets(prev => {
      const updated = prev.filter(p => p.id !== id)
      if (typeof window !== 'undefined') {
        localStorage.setItem(PRESETS_KEY, JSON.stringify(updated))
      }
      return updated
    })
  }, [])

  return {
    presets,
    savePreset,
    deletePreset,
  }
}
