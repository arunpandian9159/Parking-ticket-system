/**
 * Vehicle History Page
 * Track vehicle visits and manage loyalty program
 */

'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/hooks/useAuth'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { ListSkeleton, StatsCardSkeleton } from '@/components/ui/Skeleton'
import { toast } from 'sonner'
import {
  Car,
  Search,
  History,
  Star,
  Award,
  TrendingUp,
  Calendar,
  DollarSign,
  Gift,
  ChevronRight,
  Crown,
  Medal,
  ShieldCheck,
  Sparkles,
} from 'lucide-react'
import { calculateLoyaltyPoints, getLoyaltyTier, LOYALTY_TIERS } from '@/services/vehicleService'

export default function VehiclesPage() {
  const { user, loading: authLoading } = useAuth({ requireAuth: true, redirectTo: '/' })
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [selectedVehicle, setSelectedVehicle] = useState(null)
  const [vehicleHistory, setVehicleHistory] = useState([])
  const [loading, setLoading] = useState(false)
  const [historyLoading, setHistoryLoading] = useState(false)
  const [stats, setStats] = useState(null)

  const handleSearch = async () => {
    if (!searchQuery.trim() || searchQuery.length < 2) {
      toast.error('Please enter at least 2 characters')
      return
    }

    setLoading(true)
    try {
      // Search tickets by license plate
      const { data, error } = await supabase
        .from('tickets')
        .select('license_plate, vehicle_type, created_at, price, status')
        .ilike('license_plate', `%${searchQuery}%`)
        .order('created_at', { ascending: false })
        .limit(50)

      if (error) throw error

      // Group by vehicle
      const vehicles = {}
      data.forEach(ticket => {
        if (!vehicles[ticket.license_plate]) {
          vehicles[ticket.license_plate] = {
            license_plate: ticket.license_plate,
            vehicle_type: ticket.vehicle_type,
            visit_count: 0,
            total_spent: 0,
            last_visit: ticket.created_at,
          }
        }
        vehicles[ticket.license_plate].visit_count++
        vehicles[ticket.license_plate].total_spent += ticket.price || 0
      })

      // Calculate loyalty points and tiers
      const vehicleList = Object.values(vehicles).map(v => {
        const points = calculateLoyaltyPoints(v.total_spent)
        const tier = getLoyaltyTier(points)
        return { ...v, points, tier }
      })

      setSearchResults(vehicleList)
    } catch (error) {
      console.error('Error searching vehicles:', error)
      toast.error('Search failed')
    } finally {
      setLoading(false)
    }
  }

  const selectVehicle = async vehicle => {
    setSelectedVehicle(vehicle)
    setHistoryLoading(true)

    try {
      // Fetch full history for this vehicle
      const { data, error } = await supabase
        .from('tickets')
        .select('*')
        .eq('license_plate', vehicle.license_plate)
        .order('created_at', { ascending: false })

      if (error) throw error
      setVehicleHistory(data || [])

      // Calculate stats
      const totalSpent = data.reduce((sum, t) => sum + (t.price || 0), 0)
      const points = calculateLoyaltyPoints(totalSpent)
      const tier = getLoyaltyTier(points)

      setStats({
        totalVisits: data.length,
        totalSpent,
        points,
        tier,
        avgSpend: data.length > 0 ? Math.round(totalSpent / data.length) : 0,
        firstVisit: data.length > 0 ? data[data.length - 1].created_at : null,
        lastVisit: data.length > 0 ? data[0].created_at : null,
      })
    } catch (error) {
      console.error('Error fetching vehicle history:', error)
      toast.error('Failed to load vehicle history')
    } finally {
      setHistoryLoading(false)
    }
  }

  const getTierIcon = tierName => {
    switch (tierName) {
      case 'Platinum':
        return Crown
      case 'Gold':
        return Medal
      case 'Silver':
        return ShieldCheck
      default:
        return Star
    }
  }

  const getTierStyle = tierName => {
    const tier = LOYALTY_TIERS.find(t => t.name === tierName) || LOYALTY_TIERS[0]
    return {
      bg: `${tier.color}/10`,
      text: tier.color,
      border: `${tier.color}/30`,
    }
  }

  if (authLoading) {
    return (
      <div className="max-w-5xl mx-auto space-y-6">
        <ListSkeleton items={5} />
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground flex items-center gap-3">
          <div className="p-2 bg-violet-500/10 rounded-xl">
            <Car className="w-6 h-6 text-violet-500" />
          </div>
          Vehicle History & Loyalty
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          Track vehicle visits and manage loyalty rewards
        </p>
      </div>

      {/* Search Bar */}
      <Card className="p-4">
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by license plate..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value.toUpperCase())}
              onKeyDown={e => e.key === 'Enter' && handleSearch()}
              className="pl-10 uppercase"
            />
          </div>
          <Button
            onClick={handleSearch}
            disabled={loading}
            className="bg-teal-500 text-white hover:bg-teal-600"
          >
            {loading ? 'Searching...' : 'Search'}
          </Button>
        </div>
      </Card>

      {/* Loyalty Tiers Info */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {LOYALTY_TIERS.map(tier => {
          const Icon = getTierIcon(tier.name)
          return (
            <div
              key={tier.name}
              className="p-3 rounded-xl border border-border bg-card text-center"
            >
              <Icon className={`w-6 h-6 mx-auto mb-1`} style={{ color: tier.color }} />
              <p className="font-semibold text-foreground text-sm">{tier.name}</p>
              <p className="text-xs text-muted-foreground">
                {tier.minPoints.toLocaleString()}+ pts
              </p>
              <p className="text-xs mt-1" style={{ color: tier.color }}>
                {tier.discount}% off
              </p>
            </div>
          )
        })}
      </div>

      {/* Two Column Layout */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Search Results */}
        <Card className="overflow-hidden">
          <div className="p-4 border-b border-border">
            <h2 className="font-semibold text-foreground flex items-center gap-2">
              <Search className="w-4 h-4" />
              Search Results
            </h2>
          </div>

          {searchResults.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              <Car className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>Search for a vehicle to view history</p>
            </div>
          ) : (
            <div className="divide-y divide-border max-h-[400px] overflow-y-auto">
              {searchResults.map(vehicle => {
                const TierIcon = getTierIcon(vehicle.tier.name)
                return (
                  <button
                    key={vehicle.license_plate}
                    onClick={() => selectVehicle(vehicle)}
                    className={`w-full p-4 flex items-center justify-between hover:bg-secondary/50 transition-colors text-left ${
                      selectedVehicle?.license_plate === vehicle.license_plate ? 'bg-secondary' : ''
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-secondary rounded-lg">
                        <Car className="w-4 h-4 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="font-bold text-foreground">{vehicle.license_plate}</p>
                        <p className="text-xs text-muted-foreground">
                          {vehicle.visit_count} visits • ₹{vehicle.total_spent} spent
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div
                        className="px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1"
                        style={{
                          backgroundColor: `${vehicle.tier.color}20`,
                          color: vehicle.tier.color,
                        }}
                      >
                        <TierIcon className="w-3 h-3" />
                        {vehicle.tier.name}
                      </div>
                      <ChevronRight className="w-4 h-4 text-muted-foreground" />
                    </div>
                  </button>
                )
              })}
            </div>
          )}
        </Card>

        {/* Vehicle Details */}
        <Card className="overflow-hidden">
          <div className="p-4 border-b border-border">
            <h2 className="font-semibold text-foreground flex items-center gap-2">
              <History className="w-4 h-4" />
              Vehicle Details
            </h2>
          </div>

          {!selectedVehicle ? (
            <div className="p-8 text-center text-muted-foreground">
              <History className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>Select a vehicle to view details</p>
            </div>
          ) : historyLoading ? (
            <div className="p-4">
              <ListSkeleton items={3} />
            </div>
          ) : (
            <div className="p-4 space-y-4">
              {/* Vehicle Header with Tier */}
              <div className="text-center pb-4 border-b border-border">
                <div
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-2"
                  style={{
                    backgroundColor: `${stats?.tier?.color}20`,
                    color: stats?.tier?.color,
                  }}
                >
                  {(() => {
                    const TierIcon = getTierIcon(stats?.tier?.name)
                    return <TierIcon className="w-4 h-4" />
                  })()}
                  <span className="font-medium">{stats?.tier?.name} Member</span>
                </div>
                <h3 className="text-2xl font-bold text-foreground">
                  {selectedVehicle.license_plate}
                </h3>
                <p className="text-muted-foreground text-sm">{selectedVehicle.vehicle_type}</p>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-secondary rounded-xl text-center">
                  <div className="flex items-center justify-center gap-1 text-muted-foreground mb-1">
                    <Calendar className="w-3 h-3" />
                    <span className="text-xs">Visits</span>
                  </div>
                  <p className="text-xl font-bold text-foreground">{stats?.totalVisits}</p>
                </div>
                <div className="p-3 bg-secondary rounded-xl text-center">
                  <div className="flex items-center justify-center gap-1 text-muted-foreground mb-1">
                    <DollarSign className="w-3 h-3" />
                    <span className="text-xs">Total Spent</span>
                  </div>
                  <p className="text-xl font-bold text-teal-500">₹{stats?.totalSpent}</p>
                </div>
                <div className="p-3 bg-secondary rounded-xl text-center">
                  <div className="flex items-center justify-center gap-1 text-muted-foreground mb-1">
                    <Star className="w-3 h-3" />
                    <span className="text-xs">Points</span>
                  </div>
                  <p className="text-xl font-bold text-amber-500">{stats?.points}</p>
                </div>
                <div className="p-3 bg-secondary rounded-xl text-center">
                  <div className="flex items-center justify-center gap-1 text-muted-foreground mb-1">
                    <Gift className="w-3 h-3" />
                    <span className="text-xs">Discount</span>
                  </div>
                  <p className="text-xl font-bold text-violet-500">{stats?.tier?.discount}%</p>
                </div>
              </div>

              {/* Recent Visits */}
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-2">Recent Visits</h4>
                <div className="space-y-2 max-h-[200px] overflow-y-auto">
                  {vehicleHistory.slice(0, 5).map(ticket => (
                    <div
                      key={ticket.id}
                      className="p-2 bg-secondary/50 rounded-lg flex items-center justify-between text-sm"
                    >
                      <div>
                        <p className="text-foreground font-medium">
                          {new Date(ticket.created_at).toLocaleDateString()}
                        </p>
                        <p className="text-xs text-muted-foreground">Spot: {ticket.parking_spot}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-teal-500">₹{ticket.price}</p>
                        <p
                          className={`text-xs ${
                            ticket.status === 'Paid' ? 'text-green-500' : 'text-amber-500'
                          }`}
                        >
                          {ticket.status}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}
