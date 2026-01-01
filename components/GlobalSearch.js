/**
 * Global Search Component
 * Smart search with filters, recent searches, and presets
 */

'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { useDebounce, useSearch, useFilterPresets } from '@/hooks/useSearch'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import {
  Search,
  X,
  Clock,
  Filter,
  ChevronDown,
  Ticket,
  Car,
  CreditCard,
  Calendar,
  Tag,
  Star,
  ArrowRight,
  History,
  Bookmark,
  Sparkles,
} from 'lucide-react'

/**
 * GlobalSearch - Full-featured search component
 */
export function GlobalSearch({ onClose }) {
  const router = useRouter()
  const inputRef = useRef(null)
  const [query, setQuery] = useState('')
  const [results, setResults] = useState({ tickets: [], passes: [] })
  const [loading, setLoading] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState({
    type: 'all', // all, tickets, passes
    status: 'all', // all, Active, Paid, Expired
    dateFrom: '',
    dateTo: '',
  })

  const { recentSearches, addToRecent, clearRecent } = useSearch()
  const { presets, savePreset, deletePreset } = useFilterPresets()
  const debouncedQuery = useDebounce(query, 300)

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  // Search when query changes
  useEffect(() => {
    if (debouncedQuery.length >= 2) {
      performSearch()
    } else {
      setResults({ tickets: [], passes: [] })
    }
  }, [debouncedQuery, filters])

  const performSearch = async () => {
    setLoading(true)
    try {
      const searchPromises = []

      // Search tickets
      if (filters.type === 'all' || filters.type === 'tickets') {
        let ticketQuery = supabase
          .from('tickets')
          .select('id, license_plate, parking_spot, status, price, vehicle_type, created_at')
          .or(`license_plate.ilike.%${debouncedQuery}%,parking_spot.ilike.%${debouncedQuery}%`)
          .order('created_at', { ascending: false })
          .limit(10)

        if (filters.status !== 'all') {
          ticketQuery = ticketQuery.eq('status', filters.status)
        }
        if (filters.dateFrom) {
          ticketQuery = ticketQuery.gte('created_at', filters.dateFrom)
        }
        if (filters.dateTo) {
          ticketQuery = ticketQuery.lte('created_at', filters.dateTo)
        }

        searchPromises.push(ticketQuery.then(({ data }) => ({ type: 'tickets', data: data || [] })))
      }

      // Search passes
      if (filters.type === 'all' || filters.type === 'passes') {
        let passQuery = supabase
          .from('monthly_passes')
          .select('id, customer_name, vehicle_number, status, start_date, end_date')
          .or(`customer_name.ilike.%${debouncedQuery}%,vehicle_number.ilike.%${debouncedQuery}%`)
          .order('created_at', { ascending: false })
          .limit(10)

        if (filters.status !== 'all') {
          passQuery = passQuery.eq('status', filters.status)
        }

        searchPromises.push(passQuery.then(({ data }) => ({ type: 'passes', data: data || [] })))
      }

      const searchResults = await Promise.all(searchPromises)

      const newResults = { tickets: [], passes: [] }
      searchResults.forEach(result => {
        newResults[result.type] = result.data
      })

      setResults(newResults)

      // Add to recent searches
      if (debouncedQuery.length >= 2) {
        addToRecent(debouncedQuery)
      }
    } catch (error) {
      console.error('Search error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleResultClick = (type, id) => {
    if (type === 'ticket') {
      router.push(`/tickets/${id}`)
    } else if (type === 'pass') {
      router.push(`/passes?id=${id}`)
    }
    onClose?.()
  }

  const handleRecentClick = searchTerm => {
    setQuery(searchTerm)
  }

  const applyPreset = preset => {
    setFilters(preset.filters)
    setShowFilters(true)
  }

  const totalResults = results.tickets.length + results.passes.length

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[10vh] px-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      {/* Search Modal */}
      <div className="relative bg-card rounded-2xl border border-border shadow-2xl w-full max-w-2xl overflow-hidden animate-in slide-in-from-top-4 fade-in duration-200">
        {/* Search Input */}
        <div className="flex items-center gap-3 p-4 border-b border-border">
          <Search className="w-5 h-5 text-muted-foreground" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search tickets, passes, vehicles..."
            className="flex-1 bg-transparent text-foreground text-lg outline-none placeholder:text-muted-foreground"
          />
          {query && (
            <button onClick={() => setQuery('')} className="p-1 hover:bg-secondary rounded-md">
              <X className="w-4 h-4 text-muted-foreground" />
            </button>
          )}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`p-2 rounded-lg transition-colors ${
              showFilters
                ? 'bg-teal-500/10 text-teal-500'
                : 'hover:bg-secondary text-muted-foreground'
            }`}
          >
            <Filter className="w-4 h-4" />
          </button>
          <button
            onClick={onClose}
            className="p-2 hover:bg-secondary rounded-lg text-muted-foreground"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="p-4 border-b border-border bg-secondary/30">
            <div className="flex flex-wrap gap-3">
              {/* Type Filter */}
              <select
                value={filters.type}
                onChange={e => setFilters({ ...filters, type: e.target.value })}
                className="px-3 py-1.5 bg-card border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/50"
              >
                <option value="all">All Types</option>
                <option value="tickets">Tickets Only</option>
                <option value="passes">Passes Only</option>
              </select>

              {/* Status Filter */}
              <select
                value={filters.status}
                onChange={e => setFilters({ ...filters, status: e.target.value })}
                className="px-3 py-1.5 bg-card border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/50"
              >
                <option value="all">All Status</option>
                <option value="Active">Active</option>
                <option value="Paid">Paid</option>
                <option value="Expired">Expired</option>
              </select>

              {/* Date Range */}
              <input
                type="date"
                value={filters.dateFrom}
                onChange={e => setFilters({ ...filters, dateFrom: e.target.value })}
                className="px-3 py-1.5 bg-card border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/50"
                placeholder="From"
              />
              <input
                type="date"
                value={filters.dateTo}
                onChange={e => setFilters({ ...filters, dateTo: e.target.value })}
                className="px-3 py-1.5 bg-card border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/50"
                placeholder="To"
              />

              {/* Save Preset */}
              <button
                onClick={() => {
                  const name = prompt('Enter preset name:')
                  if (name) savePreset(name, filters)
                }}
                className="px-3 py-1.5 bg-teal-500/10 text-teal-500 rounded-lg text-sm hover:bg-teal-500/20"
              >
                <Bookmark className="w-3 h-3 inline mr-1" />
                Save
              </button>
            </div>

            {/* Saved Presets */}
            {presets.length > 0 && (
              <div className="mt-3 flex gap-2 flex-wrap">
                <span className="text-xs text-muted-foreground">Saved:</span>
                {presets.map((preset, i) => (
                  <button
                    key={i}
                    onClick={() => applyPreset(preset)}
                    className="px-2 py-0.5 bg-secondary text-xs rounded hover:bg-secondary/80"
                  >
                    {preset.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Content Area */}
        <div className="max-h-[50vh] overflow-y-auto">
          {/* Loading State */}
          {loading && (
            <div className="p-8 text-center text-muted-foreground">
              <div className="w-6 h-6 border-2 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
              Searching...
            </div>
          )}

          {/* No Query - Show Recent */}
          {!query && !loading && (
            <div className="p-4">
              {recentSearches.length > 0 ? (
                <>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs text-muted-foreground uppercase tracking-wide flex items-center gap-1">
                      <History className="w-3 h-3" />
                      Recent Searches
                    </span>
                    <button
                      onClick={clearRecent}
                      className="text-xs text-muted-foreground hover:text-foreground"
                    >
                      Clear all
                    </button>
                  </div>
                  <div className="space-y-1">
                    {recentSearches.map((term, i) => (
                      <button
                        key={i}
                        onClick={() => handleRecentClick(term)}
                        className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-secondary text-left"
                      >
                        <Clock className="w-4 h-4 text-muted-foreground" />
                        <span className="text-foreground">{term}</span>
                      </button>
                    ))}
                  </div>
                </>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Sparkles className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p>Start typing to search</p>
                </div>
              )}
            </div>
          )}

          {/* No Results */}
          {query && !loading && totalResults === 0 && (
            <div className="p-8 text-center text-muted-foreground">
              <Search className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p>No results found for "{query}"</p>
            </div>
          )}

          {/* Results */}
          {!loading && totalResults > 0 && (
            <div className="p-2">
              {/* Tickets */}
              {results.tickets.length > 0 && (
                <div className="mb-4">
                  <p className="text-xs text-muted-foreground uppercase tracking-wide px-2 mb-2 flex items-center gap-1">
                    <Ticket className="w-3 h-3" />
                    Tickets ({results.tickets.length})
                  </p>
                  {results.tickets.map(ticket => (
                    <button
                      key={ticket.id}
                      onClick={() => handleResultClick('ticket', ticket.id)}
                      className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-secondary text-left"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-teal-500/10 rounded-lg">
                          <Car className="w-4 h-4 text-teal-500" />
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{ticket.license_plate}</p>
                          <p className="text-xs text-muted-foreground">
                            Spot {ticket.parking_spot} •{' '}
                            {new Date(ticket.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-2 py-0.5 text-xs rounded-full ${
                            ticket.status === 'Paid'
                              ? 'bg-green-500/10 text-green-500'
                              : ticket.status === 'Active'
                              ? 'bg-amber-500/10 text-amber-500'
                              : 'bg-gray-500/10 text-gray-500'
                          }`}
                        >
                          {ticket.status}
                        </span>
                        <ArrowRight className="w-4 h-4 text-muted-foreground" />
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {/* Passes */}
              {results.passes.length > 0 && (
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide px-2 mb-2 flex items-center gap-1">
                    <CreditCard className="w-3 h-3" />
                    Monthly Passes ({results.passes.length})
                  </p>
                  {results.passes.map(pass => (
                    <button
                      key={pass.id}
                      onClick={() => handleResultClick('pass', pass.id)}
                      className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-secondary text-left"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-violet-500/10 rounded-lg">
                          <CreditCard className="w-4 h-4 text-violet-500" />
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{pass.customer_name}</p>
                          <p className="text-xs text-muted-foreground">
                            {pass.vehicle_number} • Valid until{' '}
                            {new Date(pass.end_date).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-muted-foreground" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-border bg-secondary/30 flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-4">
            <span>
              <kbd className="px-1.5 py-0.5 bg-secondary rounded text-[10px]">↵</kbd> to select
            </span>
            <span>
              <kbd className="px-1.5 py-0.5 bg-secondary rounded text-[10px]">ESC</kbd> to close
            </span>
          </div>
          {totalResults > 0 && (
            <span>
              {totalResults} result{totalResults !== 1 ? 's' : ''}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

/**
 * SearchButton - Trigger for global search
 */
export function SearchButton({ className }) {
  const [isOpen, setIsOpen] = useState(false)

  // Keyboard shortcut
  useEffect(() => {
    const handleKeyDown = e => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setIsOpen(true)
      }
      if (e.key === 'Escape') {
        setIsOpen(false)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className={`flex items-center gap-2 px-3 py-2 bg-secondary border border-border rounded-lg hover:bg-secondary/80 transition-colors ${className}`}
      >
        <Search className="w-4 h-4 text-muted-foreground" />
        <span className="text-sm text-muted-foreground">Search...</span>
        <kbd className="hidden sm:inline-block px-1.5 py-0.5 bg-background text-[10px] text-muted-foreground rounded ml-4">
          ⌘K
        </kbd>
      </button>

      {isOpen && <GlobalSearch onClose={() => setIsOpen(false)} />}
    </>
  )
}
