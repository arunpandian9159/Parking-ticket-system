'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Trash2, Plus, Save } from 'lucide-react'

export default function ParkingRates() {
    const [rates, setRates] = useState([])
    const [loading, setLoading] = useState(true)
    const [newRate, setNewRate] = useState({ vehicle_type: '', hourly_rate: '' })

    useEffect(() => {
        fetchRates()

    }, [])

    const fetchRates = async () => {
        try {
            const { data, error } = await supabase
                .from('parking_rates')
                .select('*')
                .order('vehicle_type')

            if (error) throw error
            setRates(data || [])
        } catch (error) {
            console.error('Error fetching rates:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleUpdateRate = async (id, newPrice) => {
        try {
            const { error } = await supabase
                .from('parking_rates')
                .update({ hourly_rate: newPrice })
                .eq('id', id)

            if (error) throw error
            fetchRates()
            alert('Rate updated successfully')
        } catch (error) {
            console.error('Error updating rate:', error)
            alert('Failed to update rate')
        }
    }

    const handleAddRate = async () => {
        if (!newRate.vehicle_type || !newRate.hourly_rate) return

        try {
            const { error } = await supabase
                .from('parking_rates')
                .insert([{
                    vehicle_type: newRate.vehicle_type,
                    hourly_rate: Number(newRate.hourly_rate)
                }])

            if (error) throw error
            setNewRate({ vehicle_type: '', hourly_rate: '' })
            fetchRates()
        } catch (error) {
            console.error('Error adding rate:', error)
            alert('Failed to add rate')
        }
    }

    const handleDeleteRate = async (id) => {
        if (!confirm('Are you sure you want to delete this rate?')) return

        try {
            const { error } = await supabase
                .from('parking_rates')
                .delete()
                .eq('id', id)

            if (error) throw error
            fetchRates()
        } catch (error) {
            console.error('Error deleting rate:', error)
        }
    }

    if (loading) return <div className="p-8 text-muted-foreground">Loading rates...</div>

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-foreground">Parking Rates Configuration</h1>
                <p className="text-muted-foreground">Set hourly rates for different vehicle types.</p>
            </div>

            <div className="bg-card rounded-xl shadow-sm border border-border p-6">
                <h2 className="text-lg font-semibold mb-4 text-foreground">Current Rates</h2>
                <div className="grid gap-4">
                    {rates.map((rate) => (
                        <div key={rate.id} className="flex items-center gap-4 p-4 bg-secondary/50 rounded-lg">
                            <div className="w-1/3">
                                <span className="font-medium text-foreground">{rate.vehicle_type}</span>
                            </div>
                            <div className="flex-1 flex items-center gap-2">
                                <span className="text-muted-foreground">₹</span>
                                <Input
                                    type="number"
                                    defaultValue={rate.hourly_rate}
                                    onBlur={(e) => handleUpdateRate(rate.id, e.target.value)}
                                    className="w-24"
                                />
                                <span className="text-muted-foreground">/ hour</span>
                            </div>
                            <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => handleDeleteRate(rate.id)}
                                className="bg-red-500/10 text-red-500 hover:bg-red-500/20 border border-red-500/20 shadow-none"
                            >
                                <Trash2 className="w-4 h-4" />
                            </Button>
                        </div>
                    ))}

                    {rates.length === 0 && (
                        <p className="text-muted-foreground text-center py-4">No rates configured yet.</p>
                    )}
                </div>
            </div>

            <div className="bg-card rounded-xl shadow-sm border border-border p-6">
                <h2 className="text-lg font-semibold mb-4 text-foreground">Add New Vehicle Type</h2>
                <div className="flex gap-4 items-end">
                    <div className="flex-1 space-y-2">
                        <label className="text-sm font-medium text-foreground">Vehicle Type</label>
                        <Input
                            placeholder="e.g. Electric Scooter"
                            value={newRate.vehicle_type}
                            onChange={(e) => setNewRate({ ...newRate, vehicle_type: e.target.value })}
                        />
                    </div>
                    <div className="w-32 space-y-2">
                        <label className="text-sm font-medium text-foreground">Rate (₹/hr)</label>
                        <Input
                            type="number"
                            placeholder="0"
                            value={newRate.hourly_rate}
                            onChange={(e) => setNewRate({ ...newRate, hourly_rate: e.target.value })}
                        />
                    </div>
                    <Button onClick={handleAddRate}>
                        <Plus className="w-4 h-4 mr-2" />
                        Add
                    </Button>
                </div>
            </div>
        </div>
    )
}
