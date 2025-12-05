'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card } from '@/components/ui/Card'
import { ArrowLeft, Save } from 'lucide-react'
import Link from 'next/link'

export default function CreateTicketPage() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)

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

    // Calculate price when hours change
    useEffect(() => {
        const hours = parseFloat(formData.hours) || 0
        setFormData(prev => ({
            ...prev,
            price: hours * 20
        }))
    }, [formData.hours])

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
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
                    status: 'Active'
                }])

            if (error) throw error
            router.push('/')
        } catch (error) {
            alert('Error creating ticket: ' + error.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <div className="flex items-center gap-4">
                <Link href="/">
                    <Button variant="ghost" className="!p-2">
                        <ArrowLeft className="w-5 h-5" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Issue New Ticket</h1>
                    <p className="text-gray-500">Enter vehicle and parking details</p>
                </div>
            </div>

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
                            <Input
                                label="Parking Spot"
                                name="parking_spot"
                                value={formData.parking_spot}
                                onChange={handleChange}
                                required
                                placeholder="Floor 1 C7"
                            />
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
                                <Input
                                    label="Price (₹)"
                                    name="price"
                                    value={formData.price}
                                    readOnly
                                    className="bg-gray-50 font-bold text-blue-600"
                                />
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
                            <Input
                                label="Vehicle Name"
                                name="vehicle_name"
                                value={formData.vehicle_name}
                                onChange={handleChange}
                                placeholder="Honda City"
                            />
                            <Input
                                label="Vehicle Type"
                                name="vehicle_type"
                                value={formData.vehicle_type}
                                onChange={handleChange}
                                placeholder="Sedan"
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
    )
}
