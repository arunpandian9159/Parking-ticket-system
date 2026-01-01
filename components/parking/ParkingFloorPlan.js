'use client'

import { useEffect, useState, useMemo } from 'react'
import { supabase } from '@/lib/supabase'
import {
  Car,
  Bike,
  Truck,
  Zap,
  Accessibility,
  ArrowRight,
  ArrowDown,
  MapPin,
  Navigation,
  Building2,
  ChevronDown,
  Search,
} from 'lucide-react'
import { Input } from '@/components/ui/Input'

/**
 * 2D Floor Plan Visualization
 * A visual parking lot layout with roads, lanes, and parking rows
 */
export default function ParkingFloorPlan({
  onSelectSlot,
  selectedSlot,
  vehicleType,
  showControls = true,
}) {
  const [slots, setSlots] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedFloor, setSelectedFloor] = useState('Ground')
  const [searchQuery, setSearchQuery] = useState('')
  const [highlightedSlot, setHighlightedSlot] = useState(null)
  const [hoveredSlot, setHoveredSlot] = useState(null)

  useEffect(() => {
    fetchSlots()

    // Realtime subscription
    const channel = supabase
      .channel('floor_plan_slots')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'parking_slots' }, () =>
        fetchSlots()
      )
      .subscribe()

    return () => supabase.removeChannel(channel)
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
    return Array.from(floorSet).sort()
  }, [slots])

  // Filter slots by floor
  const floorSlots = useMemo(() => {
    return slots.filter(s => (s.floor || 'Ground') === selectedFloor)
  }, [slots, selectedFloor])

  // Group slots by section for layout
  const sections = useMemo(() => {
    const grouped = {}
    floorSlots.forEach(slot => {
      const section = slot.section || 'A'
      if (!grouped[section]) grouped[section] = []
      grouped[section].push(slot)
    })
    // Sort sections alphabetically
    return Object.keys(grouped)
      .sort()
      .map(key => ({
        name: key,
        slots: grouped[key].sort((a, b) => {
          const numA = parseInt(a.slot_number.replace(/\D/g, '')) || 0
          const numB = parseInt(b.slot_number.replace(/\D/g, '')) || 0
          return numA - numB
        }),
      }))
  }, [floorSlots])

  // Occupancy stats
  const stats = useMemo(() => {
    const total = floorSlots.length
    const occupied = floorSlots.filter(s => s.is_occupied).length
    return { total, occupied, available: total - occupied }
  }, [floorSlots])

  // Search functionality
  const handleSearch = query => {
    setSearchQuery(query)
    if (query.length >= 2) {
      const found = floorSlots.find(
        s =>
          s.slot_number.toLowerCase().includes(query.toLowerCase()) ||
          s.current_vehicle_plate?.toLowerCase().includes(query.toLowerCase())
      )
      if (found) {
        setHighlightedSlot(found.slot_number)
        setTimeout(() => setHighlightedSlot(null), 3000)
      }
    }
  }

  // Get slot styling
  const getSlotStyle = slot => {
    const isOccupied = slot.is_occupied
    const isSelected = selectedSlot === slot.slot_number
    const isHighlighted = highlightedSlot === slot.slot_number
    const isHovered = hoveredSlot === slot.slot_number
    const isCompatible = vehicleType
      ? slot.vehicle_type_allowed === 'Any' || slot.vehicle_type_allowed === vehicleType
      : true

    if (isHighlighted) {
      return 'bg-amber-500 border-amber-400 shadow-lg shadow-amber-500/30 animate-pulse'
    }
    if (isSelected) {
      return 'bg-teal-500/30 border-teal-500 shadow-lg shadow-teal-500/20'
    }
    if (isOccupied) {
      return 'bg-red-500/20 border-red-500/50'
    }
    if (!isCompatible) {
      return 'bg-gray-500/10 border-gray-500/30 opacity-50'
    }
    if (isHovered) {
      return 'bg-teal-500/10 border-teal-500/50 shadow-md'
    }
    return 'bg-emerald-500/10 border-emerald-500/30 hover:border-teal-500/50'
  }

  // Get vehicle icon
  const VehicleIcon = ({ type, className }) => {
    switch (type) {
      case 'Bike':
        return <Bike className={className} />
      case 'Truck':
        return <Truck className={className} />
      default:
        return <Car className={className} />
    }
  }

  if (loading) {
    return (
      <div className="aspect-video bg-secondary/50 rounded-2xl animate-pulse flex items-center justify-center">
        <div className="text-muted-foreground">Loading floor plan...</div>
      </div>
    )
  }

  if (slots.length === 0) {
    return (
      <div className="aspect-video bg-secondary/50 rounded-2xl flex items-center justify-center border-2 border-dashed border-border">
        <div className="text-center text-muted-foreground">
          <MapPin className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>No parking slots configured</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Controls */}
      {showControls && (
        <div className="flex flex-wrap gap-3">
          {/* Floor selector */}
          {floors.length > 1 && (
            <div className="relative">
              <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <select
                value={selectedFloor}
                onChange={e => setSelectedFloor(e.target.value)}
                className="pl-10 pr-8 py-2 bg-card border border-border rounded-lg text-sm appearance-none cursor-pointer focus:ring-2 focus:ring-teal-500/50"
              >
                {floors.map(floor => (
                  <option key={floor} value={floor}>
                    {floor}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            </div>
          )}

          {/* Search */}
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search slot or vehicle..."
              value={searchQuery}
              onChange={e => handleSearch(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Stats */}
          <div className="flex items-center gap-4 px-4 py-2 bg-secondary/50 rounded-lg text-sm">
            <span className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-emerald-500" />
              <span className="font-medium text-foreground">{stats.available}</span>
              <span className="text-muted-foreground hidden sm:inline">Free</span>
            </span>
            <span className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <span className="font-medium text-foreground">{stats.occupied}</span>
              <span className="text-muted-foreground hidden sm:inline">Busy</span>
            </span>
          </div>
        </div>
      )}

      {/* Floor Plan Container */}
      <div className="relative bg-linear-to-br from-slate-900 to-slate-800 rounded-2xl p-6 overflow-hidden">
        {/* Background grid pattern */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `
                            linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
                        `,
            backgroundSize: '20px 20px',
          }}
        />

        {/* Entry/Exit Points */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 flex items-center gap-2 px-4 py-2 bg-teal-500/20 rounded-lg border border-teal-500/30">
          <Navigation className="w-4 h-4 text-teal-400" />
          <span className="text-xs font-medium text-teal-400 uppercase tracking-wide">Entry</span>
          <ArrowDown className="w-4 h-4 text-teal-400" />
        </div>

        {/* Main Road */}
        <div className="relative mt-12 mb-6">
          <div className="h-12 bg-gray-700/50 rounded-lg border-2 border-dashed border-gray-600 flex items-center justify-center">
            <div className="flex items-center gap-2 text-gray-400">
              <ArrowRight className="w-4 h-4" />
              <span className="text-xs uppercase tracking-widest">Main Lane</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>
        </div>

        {/* Parking Sections */}
        <div className="space-y-8">
          {sections.map((section, sectionIndex) => (
            <div key={section.name} className="relative">
              {/* Section Label */}
              <div className="absolute -left-2 top-1/2 -translate-y-1/2 -rotate-90 origin-center">
                <span className="px-3 py-1 bg-violet-500/20 text-violet-400 text-xs font-bold rounded uppercase tracking-wide">
                  Section {section.name}
                </span>
              </div>

              {/* Parking Row Container */}
              <div className="ml-8">
                {/* Top Row */}
                <div className="flex gap-1 mb-2">
                  {section.slots.slice(0, Math.ceil(section.slots.length / 2)).map(slot => (
                    <ParkingSlot
                      key={slot.id}
                      slot={slot}
                      isSelected={selectedSlot === slot.slot_number}
                      isHighlighted={highlightedSlot === slot.slot_number}
                      isHovered={hoveredSlot === slot.slot_number}
                      vehicleType={vehicleType}
                      onClick={() => !slot.is_occupied && onSelectSlot?.(slot.slot_number)}
                      onHover={setHoveredSlot}
                      getSlotStyle={getSlotStyle}
                      VehicleIcon={VehicleIcon}
                      rotation="bottom"
                    />
                  ))}
                </div>

                {/* Lane between rows */}
                <div className="h-8 bg-gray-700/30 rounded flex items-center justify-center mb-2">
                  <div className="flex items-center gap-4">
                    <ArrowRight className="w-3 h-3 text-gray-500" />
                    <div className="w-20 h-0.5 bg-gray-600 border-t-2 border-dashed border-yellow-500/50" />
                    <ArrowRight className="w-3 h-3 text-gray-500" />
                  </div>
                </div>

                {/* Bottom Row */}
                <div className="flex gap-1">
                  {section.slots.slice(Math.ceil(section.slots.length / 2)).map(slot => (
                    <ParkingSlot
                      key={slot.id}
                      slot={slot}
                      isSelected={selectedSlot === slot.slot_number}
                      isHighlighted={highlightedSlot === slot.slot_number}
                      isHovered={hoveredSlot === slot.slot_number}
                      vehicleType={vehicleType}
                      onClick={() => !slot.is_occupied && onSelectSlot?.(slot.slot_number)}
                      onHover={setHoveredSlot}
                      getSlotStyle={getSlotStyle}
                      VehicleIcon={VehicleIcon}
                      rotation="top"
                    />
                  ))}
                </div>
              </div>

              {/* Section Divider */}
              {sectionIndex < sections.length - 1 && (
                <div className="mt-6 h-10 bg-gray-700/30 rounded-lg border border-gray-700 flex items-center justify-center">
                  <div className="flex items-center gap-2 text-gray-500">
                    <ArrowRight className="w-3 h-3" />
                    <span className="text-[10px] uppercase tracking-widest">Access Lane</span>
                    <ArrowRight className="w-3 h-3" />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Exit Point */}
        <div className="mt-6 flex justify-center">
          <div className="flex items-center gap-2 px-4 py-2 bg-orange-500/20 rounded-lg border border-orange-500/30">
            <ArrowDown className="w-4 h-4 text-orange-400 rotate-180" />
            <span className="text-xs font-medium text-orange-400 uppercase tracking-wide">
              Exit
            </span>
            <Navigation className="w-4 h-4 text-orange-400 rotate-180" />
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 justify-center text-xs text-muted-foreground">
        <div className="flex items-center gap-1.5">
          <div className="w-4 h-4 rounded bg-emerald-500/20 border border-emerald-500/40" />
          <span>Available</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-4 h-4 rounded bg-teal-500/30 border border-teal-500" />
          <span>Selected</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-4 h-4 rounded bg-red-500/20 border border-red-500/50" />
          <span>Occupied</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Zap className="w-4 h-4 text-green-500" />
          <span>EV Charging</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Accessibility className="w-4 h-4 text-blue-500" />
          <span>Accessible</span>
        </div>
      </div>

      {/* Hovered Slot Info Tooltip */}
      {hoveredSlot && <SlotTooltip slot={floorSlots.find(s => s.slot_number === hoveredSlot)} />}
    </div>
  )
}

/**
 * Individual Parking Slot Component
 */
function ParkingSlot({
  slot,
  isSelected,
  isHighlighted,
  isHovered,
  vehicleType,
  onClick,
  onHover,
  getSlotStyle,
  VehicleIcon,
  rotation = 'bottom',
}) {
  const isOccupied = slot.is_occupied
  const isCompatible = vehicleType
    ? slot.vehicle_type_allowed === 'Any' || slot.vehicle_type_allowed === vehicleType
    : true

  return (
    <button
      type="button"
      disabled={isOccupied || !isCompatible}
      onClick={onClick}
      onMouseEnter={() => onHover(slot.slot_number)}
      onMouseLeave={() => onHover(null)}
      className={`
                relative w-16 h-20 rounded-md border-2 transition-all duration-200
                flex flex-col items-center justify-center gap-1
                ${getSlotStyle(slot)}
                ${!isOccupied && isCompatible ? 'cursor-pointer' : 'cursor-not-allowed'}
            `}
    >
      {/* Slot Number */}
      <span
        className={`text-[10px] font-bold ${isOccupied ? 'text-red-400' : 'text-foreground/80'}`}
      >
        {slot.slot_number}
      </span>

      {/* Vehicle Icon */}
      <div
        className={`
                transition-transform duration-200 
                ${rotation === 'top' ? 'rotate-180' : ''}
            `}
      >
        <VehicleIcon
          type={slot.is_occupied ? slot.current_vehicle_type : slot.vehicle_type_allowed}
          className={`w-6 h-6 ${isOccupied ? 'text-red-400' : 'text-foreground/60'}`}
        />
      </div>

      {/* Special Indicators */}
      <div className="absolute top-1 right-1 flex gap-0.5">
        {slot.is_ev_charging && (
          <div className="w-3.5 h-3.5 rounded-full bg-green-500/30 flex items-center justify-center">
            <Zap className="w-2 h-2 text-green-400" />
          </div>
        )}
        {slot.is_handicap && (
          <div className="w-3.5 h-3.5 rounded-full bg-blue-500/30 flex items-center justify-center">
            <Accessibility className="w-2 h-2 text-blue-400" />
          </div>
        )}
      </div>

      {/* Occupied Vehicle Plate */}
      {isOccupied && slot.current_vehicle_plate && (
        <span className="absolute bottom-1 text-[8px] font-mono text-red-400/70">
          {slot.current_vehicle_plate.slice(-4)}
        </span>
      )}

      {/* Parking Lines */}
      <div
        className={`absolute left-0 right-0 h-0.5 bg-yellow-500/30 ${
          rotation === 'top' ? 'top-0' : 'bottom-0'
        }`}
      />
    </button>
  )
}

/**
 * Tooltip showing slot details
 */
function SlotTooltip({ slot }) {
  if (!slot) return null

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-bottom-2">
      <div className="bg-card border border-border rounded-xl shadow-xl px-4 py-3 flex items-center gap-4">
        <div className="p-2 bg-secondary rounded-lg">
          {slot.is_occupied ? (
            <Car className="w-5 h-5 text-red-500" />
          ) : (
            <Car className="w-5 h-5 text-teal-500" />
          )}
        </div>
        <div>
          <p className="font-bold text-foreground">{slot.slot_number}</p>
          <p className="text-xs text-muted-foreground">
            {slot.is_occupied
              ? `Occupied • ${slot.current_vehicle_plate || 'Unknown'}`
              : `Available • ${slot.vehicle_type_allowed || 'Any'} allowed`}
          </p>
        </div>
        {slot.is_ev_charging && (
          <div className="px-2 py-1 bg-green-500/10 text-green-500 text-xs rounded-full">EV</div>
        )}
        {slot.is_handicap && (
          <div className="px-2 py-1 bg-blue-500/10 text-blue-500 text-xs rounded-full">♿</div>
        )}
      </div>
    </div>
  )
}
