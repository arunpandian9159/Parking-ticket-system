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

    if (loading) return <div className="text-sm text-gray-500">Loading map...</div>
    if (slots.length === 0) return <div className="text-sm text-gray-500">No parking slots configured in Admin.</div>

    return (
        <div className="space-y-6">
            {Object.entries(groupedSlots).map(([section, sectionSlots]) => (
                <div key={section} className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                    <h3 className="text-sm font-semibold text-gray-500 mb-3 uppercase tracking-wider">Section {section}</h3>
                    <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
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
                    relative p-3 rounded-lg flex flex-col items-center justify-center gap-1 transition-all
                    border-2
                    ${isOccupied
                                            ? 'bg-red-50 border-red-100 cursor-not-allowed opacity-60'
                                            : isSelected
                                                ? 'bg-blue-50 border-blue-500 ring-2 ring-blue-200'
                                                : isCompatible
                                                    ? 'bg-white border-gray-200 hover:border-blue-300 hover:shadow-sm'
                                                    : 'bg-gray-100 border-gray-200 opacity-50 cursor-not-allowed'
                                        }
                  `}
                                >
                                    <span className={`text-xs font-bold ${isOccupied ? 'text-red-500' : 'text-gray-700'}`}>
                                        {slot.slot_number}
                                    </span>
                                    {slot.vehicle_type_allowed === 'Bike' && <Bike className="w-4 h-4 text-gray-400" />}
                                    {slot.vehicle_type_allowed === 'Car' && <Car className="w-4 h-4 text-gray-400" />}
                                    {slot.vehicle_type_allowed === 'Truck' && <Truck className="w-4 h-4 text-gray-400" />}

                                    {isOccupied && (
                                        <div className="absolute inset-0 flex items-center justify-center bg-red-50/50 rounded-lg">
                                            <span className="text-[10px] font-bold text-red-600 uppercase">Busy</span>
                                        </div>
                                    )}
                                </button>
                            )
                        })}
                    </div>
                </div>
            ))}
            <div className="flex gap-4 text-xs text-gray-500 justify-center">
                <div className="flex items-center gap-1"><div className="w-3 h-3 bg-white border-2 border-gray-200 rounded"></div> Available</div>
                <div className="flex items-center gap-1"><div className="w-3 h-3 bg-blue-50 border-2 border-blue-500 rounded"></div> Selected</div>
                <div className="flex items-center gap-1"><div className="w-3 h-3 bg-red-50 border-2 border-red-100 rounded"></div> Occupied</div>
            </div>
        </div>
    )
}
