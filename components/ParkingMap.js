'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Car, Bike, Truck } from 'lucide-react'

export default function ParkingMap({ onSelectSlot, selectedSlot, vehicleType }) {
    const [slots, setSlots] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchSlots()

    }, [])

    const fetchSlots = async () => {
        try {
            const { data, error } = await supabase
                .from('parking_slots')
                .select('*')
                .order('slot_number')

            if (error) throw error
            setSlots(data || [])
        } catch (error) {
            console.error('Error fetching slots:', error)
        } finally {
            setLoading(false)
        }
    }

    // Filter slots if a vehicle type is selected, or show all
    // For simplicity, we show all, but maybe dim incompatible ones? 
    // Let's just group them by section for now.
    const groupedSlots = slots.reduce((acc, slot) => {
        const section = slot.section
        if (!acc[section]) acc[section] = []
        acc[section].push(slot)
        return acc
    }, {})

    if (loading) return <div className="text-sm text-muted-foreground">Loading map...</div>
    if (slots.length === 0) return <div className="text-sm text-muted-foreground">No parking slots configured in Admin.</div>

    return (
        <div className="space-y-6">
            {Object.entries(groupedSlots).map(([section, sectionSlots]) => (
                <div key={section} className="bg-secondary/50 p-4 rounded-xl border border-border">
                    <h3 className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wider">Section {section}</h3>
                    <div className="grid grid-cols-5 sm:grid-cols-6 gap-3">
                        {sectionSlots.map((slot) => {
                            const isOccupied = slot.is_occupied
                            const isSelected = selectedSlot === slot.slot_number
                            const isCompatible = vehicleType ? (slot.vehicle_type_allowed === 'Any' || slot.vehicle_type_allowed === vehicleType) : true

                            return (
                                <button
                                    key={slot.id}
                                    type="button"
                                    disabled={isOccupied || !isCompatible}
                                    onClick={() => onSelectSlot(slot.slot_number)}
                                    className={`
                    relative p-1 rounded-lg flex flex-col items-center justify-center gap-1 transition-all
                    border-2
                    ${isOccupied
                                            ? 'bg-red-500/10 border-red-500/30 cursor-not-allowed opacity-60'
                                            : isSelected
                                                ? 'bg-teal-500/10 border-teal-500 ring-2 ring-teal-500/30'
                                                : isCompatible
                                                    ? 'bg-card border-border hover:border-teal-500/50 hover:shadow-sm'
                                                    : 'bg-secondary border-border opacity-50 cursor-not-allowed'
                                        }
                  `}
                                >
                                    <span className={`text-xs font-bold ${isOccupied ? 'text-red-500' : 'text-foreground'}`}>
                                        {slot.slot_number}
                                    </span>
                                    {slot.vehicle_type_allowed === 'Bike' && <Bike className="w-4 h-4 text-muted-foreground" />}
                                    {slot.vehicle_type_allowed === 'Car' && <Car className="w-4 h-4 text-muted-foreground" />}
                                    {slot.vehicle_type_allowed === 'Truck' && <Truck className="w-4 h-4 text-muted-foreground" />}

                                    {isOccupied && (
                                        <div className="absolute inset-0 flex items-center justify-center bg-red-500/10 rounded-lg">
                                            <span className="text-[10px] font-bold text-red-500 uppercase">Busy</span>
                                        </div>
                                    )}
                                </button>
                            )
                        })}
                    </div>
                </div>
            ))}
            <div className="flex gap-4 text-xs text-muted-foreground justify-center">
                <div className="flex items-center gap-1"><div className="w-3 h-3 bg-card border-2 border-border rounded"></div> Available</div>
                <div className="flex items-center gap-1"><div className="w-3 h-3 bg-teal-500/10 border-2 border-teal-500 rounded"></div> Selected</div>
                <div className="flex items-center gap-1"><div className="w-3 h-3 bg-red-500/10 border-2 border-red-500/30 rounded"></div> Occupied</div>
            </div>
        </div>
    )
}
