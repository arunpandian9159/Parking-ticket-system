'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card } from '@/components/ui/Card'
import { ArrowLeft, Save, User, Phone, Car, Palette, Clock, MapPin, CreditCard, Sparkles, AlertTriangle } from 'lucide-react'
import Link from 'next/link'
import ParkingMap from '@/components/ParkingMap'

export default function CreateTicketPage() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [rates, setRates] = useState([])
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



    const isFormValid = formData.customer_name && formData.customer_phone &&
        formData.license_plate && formData.vehicle_type &&
        formData.parking_spot && formData.hours

    return (
        <div className="max-w-6xl mx-auto space-y-8 animate-fadeIn">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <Link href="/officer">
                        <Button variant="ghost" className="p-2.5 rounded-xl hover:bg-teal-500/10">
                            <ArrowLeft className="w-5 h-5" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
                            <div className="p-2.5 bg-linear-to-br from-teal-500 to-teal-600 rounded-xl shadow-lg shadow-teal-500/20">
                                <CreditCard className="w-6 h-6 text-white" />
                            </div>
                            Issue New Ticket
                        </h1>
                        <p className="text-muted-foreground mt-1">Create a new parking ticket for a customer</p>
                    </div>
                </div>
            </div>



            {/* Pass Holder Alert */}
            {passHolder && (
                <div className="bg-teal-500/10 border border-teal-500/30 rounded-2xl p-4 flex items-center gap-4 animate-slideIn">
                    <div className="p-3 bg-teal-500/20 rounded-xl">
                        <Sparkles className="w-6 h-6 text-teal-500" />
                    </div>
                    <div className="flex-1">
                        <h3 className="font-bold text-teal-500">Monthly Pass Holder Detected!</h3>
                        <p className="text-sm text-teal-500/80">
                            {passHolder.customer_name} has an active pass until {new Date(passHolder.end_date).toLocaleDateString()}.
                            No parking fee will be charged.
                        </p>
                    </div>
                    <div className="text-right">
                        <div className="text-2xl font-bold text-teal-500">₹0</div>
                        <div className="text-xs text-teal-500/70">Pass Applied</div>
                    </div>
                </div>
            )}

            <div className="grid lg:grid-cols-3 gap-6">
                {/* Main Form */}
                <div className="lg:col-span-2">
                    <Card className="p-8 shadow-xl">
                        <form onSubmit={handleSubmit} className="space-y-8">
                            {/* Customer Section */}
                            <div className="space-y-5">
                                <div className="flex items-center gap-3 pb-2 border-b border-border">
                                    <div className="p-2 bg-teal-500/10 rounded-lg">
                                        <User className="w-5 h-5 text-teal-500" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-foreground">Customer Information</h3>
                                        <p className="text-xs text-muted-foreground">Enter the customer's details</p>
                                    </div>
                                </div>
                                <div className="grid md:grid-cols-2 gap-5">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-foreground flex items-center gap-2">
                                            <User className="w-4 h-4 text-muted-foreground" />
                                            Full Name
                                        </label>
                                        <Input
                                            name="customer_name"
                                            value={formData.customer_name}
                                            onChange={handleChange}
                                            required
                                            placeholder="John Doe"
                                            className="h-12 bg-secondary/50"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-foreground flex items-center gap-2">
                                            <Phone className="w-4 h-4 text-muted-foreground" />
                                            Phone Number
                                        </label>
                                        <Input
                                            name="customer_phone"
                                            value={formData.customer_phone}
                                            onChange={handleChange}
                                            required
                                            placeholder="+91 98765 43210"
                                            className="h-12 bg-secondary/50"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Vehicle Section */}
                            <div className="space-y-5">
                                <div className="flex items-center gap-3 pb-2 border-b border-border">
                                    <div className="p-2 bg-cyan-500/10 rounded-lg">
                                        <Car className="w-5 h-5 text-cyan-500" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-foreground">Vehicle Information</h3>
                                        <p className="text-xs text-muted-foreground">Enter the vehicle details</p>
                                    </div>
                                </div>
                                <div className="grid md:grid-cols-2 gap-5">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-foreground flex items-center gap-2">
                                            <CreditCard className="w-4 h-4 text-muted-foreground" />
                                            License Plate
                                        </label>
                                        <Input
                                            name="license_plate"
                                            value={formData.license_plate}
                                            onChange={handleChange}
                                            required
                                            placeholder="MH 12 AB 1234"
                                            className="uppercase h-12 bg-secondary/50 font-mono font-bold tracking-wider"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-foreground flex items-center gap-2">
                                            <Car className="w-4 h-4 text-muted-foreground" />
                                            Vehicle Type
                                        </label>
                                        <select
                                            name="vehicle_type"
                                            value={formData.vehicle_type}
                                            onChange={handleChange}
                                            required
                                            className="w-full h-12 px-4 rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-teal-500 bg-secondary/50 text-foreground"
                                        >
                                            <option value="">Select Type</option>
                                            {rates.map(rate => (
                                                <option key={rate.id} value={rate.vehicle_type}>
                                                    {rate.vehicle_type} (₹{rate.hourly_rate}/hr)
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-foreground flex items-center gap-2">
                                            <Car className="w-4 h-4 text-muted-foreground" />
                                            Vehicle Name/Model
                                        </label>
                                        <Input
                                            name="vehicle_name"
                                            value={formData.vehicle_name}
                                            onChange={handleChange}
                                            placeholder="Honda City"
                                            className="h-12 bg-secondary/50"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-foreground flex items-center gap-2">
                                            <Palette className="w-4 h-4 text-muted-foreground" />
                                            Color
                                        </label>
                                        <Input
                                            name="vehicle_color"
                                            value={formData.vehicle_color}
                                            onChange={handleChange}
                                            placeholder="White"
                                            className="h-12 bg-secondary/50"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Parking Section */}
                            <div className="space-y-5">
                                <div className="flex items-center gap-3 pb-2 border-b border-border">
                                    <div className="p-2 bg-purple-500/10 rounded-lg">
                                        <MapPin className="w-5 h-5 text-purple-500" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-foreground">Parking Details</h3>
                                        <p className="text-xs text-muted-foreground">Assign a parking spot and duration</p>
                                    </div>
                                </div>
                                <div className="grid md:grid-cols-2 gap-5">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-foreground flex items-center gap-2">
                                            <MapPin className="w-4 h-4 text-muted-foreground" />
                                            Parking Spot
                                        </label>
                                        <Input
                                            name="parking_spot"
                                            value={formData.parking_spot}
                                            onChange={handleChange}
                                            required
                                            placeholder="A-1"
                                            className="h-12 bg-secondary/50 font-bold"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-foreground flex items-center gap-2">
                                            <Clock className="w-4 h-4 text-muted-foreground" />
                                            Duration (Hours)
                                        </label>
                                        <Input
                                            name="hours"
                                            type="number"
                                            min="0.5"
                                            step="0.5"
                                            value={formData.hours}
                                            onChange={handleChange}
                                            required
                                            placeholder="2"
                                            className="h-12 bg-secondary/50"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Submit Button */}
                            <div className="pt-4">
                                <Button
                                    type="submit"
                                    disabled={loading || !isFormValid}
                                    className="w-full h-14 text-base bg-linear-to-r from-teal-500 to-teal-600 hover:from-teal-400 hover:to-teal-500 shadow-lg shadow-teal-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loading ? (
                                        <div className="flex items-center gap-3">
                                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            Issuing Ticket...
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-3">
                                            <Save className="w-5 h-5" />
                                            Issue Ticket
                                            {formData.price > 0 && ` - ₹${formData.price}`}
                                        </div>
                                    )}
                                </Button>
                            </div>
                        </form>
                    </Card>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Price Summary Card */}
                    <Card className="p-6 sticky top-6 shadow-xl overflow-hidden">
                        <div className="absolute inset-0 bg-linear-to-br from-teal-500/5 via-transparent to-cyan-500/5" />
                        <div className="relative space-y-6">
                            <div className="flex items-center justify-between">
                                <h3 className="font-bold text-foreground flex items-center gap-2">
                                    <CreditCard className="w-5 h-5 text-teal-500" />
                                    Price Summary
                                </h3>
                                {passHolder && (
                                    <span className="px-2 py-1 bg-teal-500/10 text-teal-500 text-xs font-bold rounded-full border border-teal-500/20">
                                        Pass Applied
                                    </span>
                                )}
                            </div>

                            <div className="space-y-4">
                                {formData.vehicle_type && (
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-muted-foreground">Vehicle Type</span>
                                        <span className="font-medium text-foreground">{formData.vehicle_type}</span>
                                    </div>
                                )}

                                {formData.hours && (
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-muted-foreground">Duration</span>
                                        <span className="font-medium text-foreground">{formData.hours} hours</span>
                                    </div>
                                )}

                                {formData.vehicle_type && rates.find(r => r.vehicle_type === formData.vehicle_type) && (
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-muted-foreground">Rate</span>
                                        <span className="font-medium text-foreground">
                                            ₹{rates.find(r => r.vehicle_type === formData.vehicle_type)?.hourly_rate}/hr
                                        </span>
                                    </div>
                                )}

                                <div className="h-px bg-border" />

                                <div className="flex justify-between items-center">
                                    <span className="font-bold text-foreground">Total Amount</span>
                                    <div className="text-right">
                                        <div className={`text-3xl font-bold ${passHolder ? 'text-teal-500' : 'text-foreground'}`}>
                                            ₹{formData.price}
                                        </div>
                                        {passHolder && (
                                            <div className="text-xs text-teal-500">Pass holder discount</div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {!isFormValid && (
                                <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-3 flex items-start gap-3">
                                    <AlertTriangle className="w-4 h-4 text-amber-500 mt-0.5" />
                                    <p className="text-xs text-amber-500">
                                        Please fill in all required fields to issue the ticket.
                                    </p>
                                </div>
                            )}
                        </div>
                    </Card>

                    {/* Parking Map */}
                    <Card className="p-4 shadow-xl">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-bold text-foreground flex items-center gap-2">
                                <MapPin className="w-5 h-5 text-purple-500" />
                                Select Spot
                            </h3>
                        </div>
                        <ParkingMap
                            onSelectSlot={handleSlotSelect}
                            selectedSlot={formData.parking_spot}
                            vehicleType={formData.vehicle_type}
                        />
                    </Card>
                </div>
            </div>

            <style jsx>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fadeIn {
                    animation: fadeIn 0.3s ease-out forwards;
                }
                @keyframes slideIn {
                    from { opacity: 0; transform: translateX(10px); }
                    to { opacity: 1; transform: translateX(0); }
                }
                .animate-slideIn {
                    animation: slideIn 0.3s ease-out forwards;
                }
            `}</style>
        </div>
    )
}
