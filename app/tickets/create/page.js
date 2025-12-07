'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card } from '@/components/ui/Card'
import { ArrowLeft, Save, Map } from 'lucide-react'
import Link from 'next/link'
import ParkingMap from '@/components/ParkingMap'

export default function CreateTicketPage() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [rates, setRates] = useState([])
    const [showMap, setShowMap] = useState(false)
    const [passHolder, setPassHolder] = useState(null)

    const [formData, setFormData] = useState({
        customer_name: '',
        customer_phone: '',
        license_plate: '',
        vehicle_type: '',
        vehicle_name: '',
        vehicle_color: '',
        parking_spot: '',
        hours: '',
        price: 0
    })

    // Fetch rates on mount
    useEffect(() => {
        const fetchRates = async () => {
            const { data } = await supabase.from('parking_rates').select('*')
            if (data) setRates(data)
        }
        fetchRates()
         
    }, [])

    // Check for monthly pass when license plate changes
    useEffect(() => {
        const checkPass = async () => {
            if (formData.license_plate.length < 5) {
                setPassHolder(null)
                return
            }

            const { data } = await supabase
                .from('monthly_passes')
                .select('*')
                .eq('vehicle_number', formData.license_plate.toUpperCase())
                .eq('status', 'Active')
                .gte('end_date', new Date().toISOString())
                .single()

            if (data) {
                setPassHolder(data)
            } else {
                setPassHolder(null)
            }
        }

        const timeoutId = setTimeout(checkPass, 500)
        return () => clearTimeout(timeoutId)
    }, [formData.license_plate])

    // Calculate price when hours or specific rate changes
    useEffect(() => {
        if (passHolder) {
            setFormData(prev => ({ ...prev, price: 0 }))
            return
        }

        const hours = parseFloat(formData.hours) || 0
        const selectedRate = rates.find(r => r.vehicle_type === formData.vehicle_type)
        const hourlyPrice = selectedRate ? selectedRate.hourly_rate : 20 // Default fallback

        setFormData(prev => ({
            ...prev,
            price: hours * hourlyPrice
        }))
    }, [formData.hours, formData.vehicle_type, rates, passHolder])

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleSlotSelect = (slotNumber) => {
        setFormData(prev => ({ ...prev, parking_spot: slotNumber }))
        setShowMap(false)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)

        try {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) throw new Error('Not authenticated')

            const { error } = await supabase
                .from('tickets')
                .insert([{
                    officer_id: user.id,
                    customer_name: formData.customer_name,
                    customer_phone: formData.customer_phone,
                    license_plate: formData.license_plate,
                    vehicle_type: formData.vehicle_type,
                    vehicle_name: formData.vehicle_name,
                    vehicle_color: formData.vehicle_color,
                    parking_spot: formData.parking_spot,
                    hours: parseFloat(formData.hours),
                    price: formData.price,
                    status: 'Active',
                    is_pass_holder: !!passHolder
                }])

            if (error) throw error

            // Mark slot as occupied (if it exists in slots table)
            await supabase
                .from('parking_slots')
                .update({ is_occupied: true })
                .eq('slot_number', formData.parking_spot)

            router.push('/officer')
        } catch (error) {
            alert('Error creating ticket: ' + error.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex items-center gap-4">
                <Link href="/officer">
                    <Button variant="ghost" className="!p-2">
                        <ArrowLeft className="w-5 h-5" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Issue New Ticket</h1>
                    <p className="text-gray-500">Enter vehicle and parking details</p>
                </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
                <div className="md:col-span-2">
                    <Card className="p-8">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="space-y-6">
                                    <h3 className="font-semibold text-gray-900 border-b pb-2">Customer Details</h3>
                                    <Input
                                        label="Full Name"
                                        name="customer_name"
                                        value={formData.customer_name}
                                        onChange={handleChange}
                                        required
                                        placeholder="John Doe"
                                    />
                                    <Input
                                        label="Phone Number"
                                        name="customer_phone"
                                        value={formData.customer_phone}
                                        onChange={handleChange}
                                        required
                                        placeholder="+91 98765 43210"
                                    />
                                </div>

                                <div className="space-y-6">
                                    <h3 className="font-semibold text-gray-900 border-b pb-2">Parking Details</h3>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-700">Parking Spot</label>
                                        <div className="flex gap-2">
                                            <Input
                                                name="parking_spot"
                                                value={formData.parking_spot}
                                                onChange={handleChange}
                                                required
                                                placeholder="A-1"
                                                className="flex-1"
                                            />
                                            <Button
                                                type="button"
                                                variant="outline"
                                                onClick={() => setShowMap(!showMap)}
                                                className="px-3"
                                            >
                                                <Map className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <Input
                                            label="Hours"
                                            name="hours"
                                            type="number"
                                            min="0.5"
                                            step="0.5"
                                            value={formData.hours}
                                            onChange={handleChange}
                                            required
                                            placeholder="2"
                                        />
                                        <div>
                                            <label className="text-sm font-medium text-gray-700 mb-1 block">Total Price</label>
                                            <div className={`
                                                h-10 px-3 flex items-center rounded-lg bg-gray-50 border border-gray-200 font-bold text-blue-600
                                                ${!formData.vehicle_type && 'opacity-50'}
                                            `}>
                                                ₹{formData.price}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <h3 className="font-semibold text-gray-900 border-b pb-2">Vehicle Details</h3>
                                <div className="grid md:grid-cols-2 gap-6">
                                    <Input
                                        label="License Plate"
                                        name="license_plate"
                                        value={formData.license_plate}
                                        onChange={handleChange}
                                        required
                                        placeholder="MH 12 AB 1234"
                                        className="uppercase"
                                    />
                                    {passHolder && (
                                        <div className="text-sm text-green-600 font-medium bg-green-50 p-2 rounded-lg border border-green-100 flex items-center gap-2">
                                            <span>✓ Valid Monthly Pass Applied</span>
                                        </div>
                                    )}

                                    <div className="space-y-1">
                                        <label className="text-sm font-medium text-gray-700">Vehicle Type</label>
                                        <select
                                            name="vehicle_type"
                                            value={formData.vehicle_type}
                                            onChange={handleChange}
                                            required
                                            className="w-full h-10 px-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                                        >
                                            <option value="">Select Type</option>
                                            {rates.map(rate => (
                                                <option key={rate.id} value={rate.vehicle_type}>
                                                    {rate.vehicle_type} (₹{rate.hourly_rate}/hr)
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <Input
                                        label="Vehicle Name"
                                        name="vehicle_name"
                                        value={formData.vehicle_name}
                                        onChange={handleChange}
                                        placeholder="Honda City"
                                    />
                                    <Input
                                        label="Color"
                                        name="vehicle_color"
                                        value={formData.vehicle_color}
                                        onChange={handleChange}
                                        placeholder="White"
                                    />
                                </div>
                            </div>

                            <div className="pt-4 flex justify-end">
                                <Button type="submit" className="w-full md:w-auto px-8" disabled={loading}>
                                    {loading ? 'Issuing Ticket...' : (
                                        <>
                                            <Save className="w-4 h-4 mr-2" />
                                            Issue Ticket
                                        </>
                                    )}
                                </Button>
                            </div>
                        </form>
                    </Card>
                </div>

                {/* Map Sidebar / Modal could act as a drawer, but for now putting it in column if toggled or on desktop */}
                <div className={`md:block ${showMap ? 'block' : 'hidden'} order-first md:order-last`}>
                    <Card className="p-4 sticky top-6">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-semibold text-gray-900">Select Spot</h3>
                            <button onClick={() => setShowMap(false)} className="md:hidden text-gray-500">Close</button>
                        </div>
                        <ParkingMap
                            onSelectSlot={handleSlotSelect}
                            selectedSlot={formData.parking_spot}
                            vehicleType={formData.vehicle_type}
                        />
                    </Card>
                </div>
            </div>
        </div>
    )
}
