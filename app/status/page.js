'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Search, AlertTriangle, CheckCircle } from 'lucide-react'
import Link from 'next/link'

export default function StatusPage() {
    const [search, setSearch] = useState('')
    const [ticket, setTicket] = useState(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [liveBill, setLiveBill] = useState(0)

    const handleSearch = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError('')
        setTicket(null)

        try {
            const { data, error } = await supabase
                .from('tickets')
                .select('*')
                .eq('license_plate', search.toUpperCase())
                .eq('status', 'Active')
                .single()

            if (error) throw error

            if (data) {
                setTicket(data)
                calculateLiveBill(data)
            }
        } catch {
            setError('No active ticket found for this vehicle.')
        } finally {
            setLoading(false)
        }
    }

    const calculateLiveBill = (ticketData) => {
        const entryTime = new Date(ticketData.created_at)
        const now = new Date()
        const diffHours = (now - entryTime) / (1000 * 60 * 60)
        const basePrice = Number(ticketData.price)
        const allowedHours = Number(ticketData.hours)

        let fine = 0
        if (diffHours > allowedHours) {
            const extra = diffHours - allowedHours
            fine = 50 + (Math.ceil(extra) * 20)
        }

        setLiveBill(basePrice + fine)
    }

    return (
        <div className="min-h-screen bg-neutral-950 flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-md space-y-8">
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-white">Check Parking Status</h1>
                    <p className="text-gray-400 mt-2">Enter your vehicle number to check current bill.</p>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <form onSubmit={handleSearch} className="space-y-4">
                        <Input
                            placeholder="Vehicle Number (e.g. MH 12 AB 1234)"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="text-center uppercase text-lg tracking-widest"
                            required
                        />
                        <Button type="submit" className="w-full" disabled={loading}>
                            {loading ? 'Searching...' : (
                                <>
                                    <Search className="w-4 h-4 mr-2" />
                                    Check Status
                                </>
                            )}
                        </Button>
                    </form>

                    {error && (
                        <div className="mt-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg text-center">
                            {error}
                        </div>
                    )}
                </div>

                {ticket && (
                    <div className="bg-white p-6 rounded-2xl shadow-lg border border-blue-100 animate-in fade-in slide-in-from-bottom-4">
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h2 className="text-xl font-bold text-gray-900">{ticket.license_plate}</h2>
                                <p className="text-sm text-gray-500">{ticket.vehicle_name}</p>
                            </div>
                            <div className="text-right">
                                <div className="text-sm text-gray-500">Current Bill</div>
                                <div className="text-3xl font-bold text-blue-600">₹{liveBill}</div>
                            </div>
                        </div>

                        <div className="space-y-4 text-sm border-t border-gray-100 pt-4">
                            <div className="flex justify-between">
                                <span className="text-gray-500">Parking Spot</span>
                                <span className="font-semibold">{ticket.parking_spot}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500">Entry Time</span>
                                <span>{new Date(ticket.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500">Duration</span>
                                <span>{((new Date() - new Date(ticket.created_at)) / (1000 * 60 * 60)).toFixed(1)} hrs</span>
                            </div>

                            {ticket.is_pass_holder && (
                                <div className="bg-green-50 text-green-700 p-2 rounded text-center font-medium text-xs">
                                    <CheckCircle className="w-3 h-3 inline mr-1" /> Monthly Pass Active
                                </div>
                            )}

                            {liveBill > ticket.price && (
                                <div className="bg-amber-50 text-amber-700 p-2 rounded text-center font-medium text-xs flex items-center justify-center gap-1">
                                    <AlertTriangle className="w-3 h-3" /> Overdue Charges Applied
                                </div>
                            )}
                        </div>
                    </div>
                )}

                <div className="text-center">
                    <Link href="/" className="text-sm text-gray-400 hover:text-gray-600">
                        Officer Login
                    </Link>
                </div>
            </div>
        </div>
    )
}
