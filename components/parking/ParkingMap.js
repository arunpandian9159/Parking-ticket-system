'use client'

import { useEffect, useState, useMemo } from 'react'
import { supabase } from '@/lib/supabase'
import { Input } from '@/components/ui/Input'
import {
  Car,
  Bike,
  Truck,
  Search,
  Zap,
  Accessibility,
  ChevronDown,
  MapPin,
  Building2,
} from 'lucide-react'

export default function ParkingMap({
  onSelectSlot,
  selectedSlot,
  vehicleType,
  showSearch = true,
  showFloorSelector = true,
  showOccupancyCounter = true,
}) {
  const [slots, setSlots] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedFloor, setSelectedFloor] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [highlightedSlot, setHighlightedSlot] = useState(null)

  useEffect(() => {
    fetchSlots()

    // Set up realtime subscription for slot updates
    const channel = supabase
      .channel('parking_slots_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'parking_slots' }, () =>
        fetchSlots()
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  const fetchSlots = async () => {
    try {
      const { data, error } = await supabase.from('parking_slots').select('*').order('slot_number')

      if (error) throw error
      setSlots(data || [])
    } catch (error) {
      console.error('Error fetching slots:', error)
    } finally {
      setLoading(false)
    }
  }

  // Get unique floors
  const floors = useMemo(() => {
    const floorSet = new Set(slots.map(s => s.floor || 'Ground'))
    return ['all', ...Array.from(floorSet)]
  }, [slots])

  // Filter slots by floor
  const filteredSlots = useMemo(() => {
    let result = slots
    if (selectedFloor !== 'all') {
      result = result.filter(s => (s.floor || 'Ground') === selectedFloor)
    }
    return result
  }, [slots, selectedFloor])

  // Group slots by section
  const groupedSlots = useMemo(() => {
    return filteredSlots.reduce((acc, slot) => {
      const section = slot.section
      if (!acc[section]) acc[section] = []
      acc[section].push(slot)
      return acc
    }, {})
  }, [filteredSlots])

  // Calculate occupancy stats
  const occupancyStats = useMemo(() => {
    const total = filteredSlots.length
    const occupied = filteredSlots.filter(s => s.is_occupied).length
    const available = total - occupied
    const percentage = total > 0 ? Math.round((occupied / total) * 100) : 0
    return { total, occupied, available, percentage }
  }, [filteredSlots])

  // Search functionality
  const handleSearch = query => {
    setSearchQuery(query)
    if (query.length >= 2) {
      // Search by vehicle plate in occupied slots
      const found = slots.find(
        s =>
          s.current_vehicle_plate?.toLowerCase().includes(query.toLowerCase()) ||
          s.slot_number.toLowerCase().includes(query.toLowerCase())
      )
      if (found) {
        setHighlightedSlot(found.slot_number)
        // Auto-select the floor if found
        if (found.floor && found.floor !== selectedFloor) {
          setSelectedFloor(found.floor)
        }
        setTimeout(() => setHighlightedSlot(null), 3000)
      }
    }
  }

  // Get vehicle icon for occupied slots
  const getVehicleIcon = type => {
    switch (type) {
      case 'Bike':
        return Bike
      case 'Truck':
        return Truck
      default:
        return Car
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="animate-pulse flex gap-2">
          <div className="h-10 bg-secondary rounded-lg flex-1" />
          <div className="h-10 w-24 bg-secondary rounded-lg" />
        </div>
        <div className="grid grid-cols-5 gap-3">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="h-16 bg-secondary rounded-lg animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  if (slots.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <MapPin className="w-12 h-12 mx-auto mb-3 opacity-50" />
        <p>No parking slots configured in Admin.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Controls Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search */}
        {showSearch && (
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by vehicle or slot..."
              value={searchQuery}
              onChange={e => handleSearch(e.target.value)}
              className="pl-10"
            />
          </div>
        )}

        {/* Floor Selector */}
        {showFloorSelector && floors.length > 2 && (
          <div className="relative">
            <select
              value={selectedFloor}
              onChange={e => setSelectedFloor(e.target.value)}
              className="appearance-none bg-card border border-border rounded-lg px-4 py-2 pr-8 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/50"
            >
              {floors.map(floor => (
                <option key={floor} value={floor}>
                  {floor === 'all' ? 'All Floors' : `Floor: ${floor}`}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
          </div>
        )}
      </div>

      {/* Occupancy Counter */}
      {showOccupancyCounter && (
        <div className="flex items-center justify-between p-3 bg-secondary/50 rounded-xl border border-border">
          <div className="flex items-center gap-3">
            <Building2 className="w-5 h-5 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              {selectedFloor === 'all' ? 'All Floors' : selectedFloor}
            </span>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-teal-500" />
              <span className="text-foreground font-medium">{occupancyStats.available}</span>
              <span className="text-muted-foreground">Free</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <span className="text-foreground font-medium">{occupancyStats.occupied}</span>
              <span className="text-muted-foreground">Busy</span>
            </div>
            <div className="px-2 py-0.5 rounded-full bg-secondary text-muted-foreground text-xs">
              {occupancyStats.percentage}% full
            </div>
          </div>
        </div>
      )}

      {/* Slot Grid by Section */}
      {Object.entries(groupedSlots).map(([section, sectionSlots]) => (
        <div key={section} className="bg-secondary/50 p-4 rounded-xl border border-border">
          <h3 className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wider flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            Section {section}
            <span className="text-xs font-normal ml-auto">
              {sectionSlots.filter(s => !s.is_occupied).length}/{sectionSlots.length} available
            </span>
          </h3>
          <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-8 gap-2">
            {sectionSlots.map(slot => {
              const isOccupied = slot.is_occupied
              const isSelected = selectedSlot === slot.slot_number
              const isHighlighted = highlightedSlot === slot.slot_number
              const isCompatible = vehicleType
                ? slot.vehicle_type_allowed === 'Any' || slot.vehicle_type_allowed === vehicleType
                : true
              const isEV = slot.is_ev_charging
              const isHandicap = slot.is_handicap
              const VehicleIcon = getVehicleIcon(
                slot.current_vehicle_type || slot.vehicle_type_allowed
              )

              return (
                <button
                  key={slot.id}
                  type="button"
                  disabled={isOccupied || !isCompatible}
                  onClick={() => onSelectSlot?.(slot.slot_number)}
                  className={`
                                        relative p-2 rounded-lg flex flex-col items-center justify-center gap-0.5 transition-all
                                        border-2 min-h-[60px]
                                        ${
                                          isHighlighted
                                            ? 'ring-4 ring-amber-500/50 border-amber-500'
                                            : isOccupied
                                            ? 'bg-red-500/10 border-red-500/30 cursor-not-allowed'
                                            : isSelected
                                            ? 'bg-teal-500/10 border-teal-500 ring-2 ring-teal-500/30'
                                            : isCompatible
                                            ? 'bg-card border-border hover:border-teal-500/50 hover:shadow-sm cursor-pointer'
                                            : 'bg-secondary border-border opacity-50 cursor-not-allowed'
                                        }
                                    `}
                  title={
                    isOccupied ? `${slot.current_vehicle_plate || 'Occupied'}` : slot.slot_number
                  }
                >
                  {/* Slot number */}
                  <span
                    className={`text-xs font-bold ${
                      isOccupied ? 'text-red-500' : 'text-foreground'
                    }`}
                  >
                    {slot.slot_number}
                  </span>

                  {/* Vehicle icon */}
                  <VehicleIcon
                    className={`w-4 h-4 ${isOccupied ? 'text-red-500' : 'text-muted-foreground'}`}
                  />

                  {/* Special indicators */}
                  <div className="absolute top-0.5 right-0.5 flex gap-0.5">
                    {isEV && (
                      <div
                        className="w-4 h-4 rounded-full bg-green-500/20 flex items-center justify-center"
                        title="EV Charging"
                      >
                        <Zap className="w-2.5 h-2.5 text-green-500" />
                      </div>
                    )}
                    {isHandicap && (
                      <div
                        className="w-4 h-4 rounded-full bg-blue-500/20 flex items-center justify-center"
                        title="Accessible"
                      >
                        <Accessibility className="w-2.5 h-2.5 text-blue-500" />
                      </div>
                    )}
                  </div>

                  {/* Occupied overlay */}
                  {isOccupied && (
                    <div className="absolute inset-0 flex items-center justify-center bg-red-500/5 rounded-lg">
                      {slot.current_vehicle_plate && (
                        <span className="text-[8px] font-bold text-red-500/70 absolute bottom-0.5">
                          {slot.current_vehicle_plate.slice(-4)}
                        </span>
                      )}
                    </div>
                  )}
                </button>
              )
            })}
          </div>
        </div>
      ))}

      {/* Legend */}
      <div className="flex flex-wrap gap-4 text-xs text-muted-foreground justify-center pt-2">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-card border-2 border-border rounded" />
          Available
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-teal-500/10 border-2 border-teal-500 rounded" />
          Selected
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-red-500/10 border-2 border-red-500/30 rounded" />
          Occupied
        </div>
        <div className="flex items-center gap-1">
          <Zap className="w-3 h-3 text-green-500" />
          EV Charging
        </div>
        <div className="flex items-center gap-1">
          <Accessibility className="w-3 h-3 text-blue-500" />
          Accessible
        </div>
      </div>
    </div>
  )
}
