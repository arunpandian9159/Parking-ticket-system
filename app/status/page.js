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
        <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4 py-8">
            <div className="w-full max-w-md space-y-6 sm:space-y-8">
                <div className="text-center">
                    <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Check Parking Status</h1>
                    <p className="text-muted-foreground mt-2 text-sm sm:text-base">Enter your vehicle number to check current bill.</p>
                </div>

                <div className="bg-card p-4 sm:p-6 rounded-2xl shadow-sm border border-border">
                    <form onSubmit={handleSearch} className="space-y-3 sm:space-y-4">
                        <Input
                            placeholder="Vehicle Number (e.g. MH 12 AB 1234)"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="text-center uppercase text-base sm:text-lg tracking-widest"
                            required
                        />
                        <Button type="submit" className="w-full h-11 sm:h-12" disabled={loading}>
                            {loading ? 'Searching...' : (
                                <>
                                    <Search className="w-4 h-4 mr-2" />
                                    Check Status
                                </>
                            )}
                        </Button>
                    </form>

                    {error && (
                        <div className="mt-4 p-3 bg-red-500/10 text-red-500 text-xs sm:text-sm rounded-lg text-center border border-red-500/20">
                            {error}
                        </div>
                    )}
                </div>

                {ticket && (
                    <div className="bg-card p-4 sm:p-6 rounded-2xl shadow-lg border border-teal-500/20 animate-in fade-in slide-in-from-bottom-4">
                        <div className="flex justify-between items-start mb-4 sm:mb-6">
                            <div>
                                <h2 className="text-lg sm:text-xl font-bold text-foreground">{ticket.license_plate}</h2>
                                <p className="text-xs sm:text-sm text-muted-foreground">{ticket.vehicle_name}</p>
                            </div>
                            <div className="text-right">
                                <div className="text-xs sm:text-sm text-muted-foreground">Current Bill</div>
                                <div className="text-2xl sm:text-3xl font-bold text-teal-500">₹{liveBill}</div>
                            </div>
                        </div>

                        <div className="space-y-4 text-sm border-t border-border pt-4">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Parking Spot</span>
                                <span className="font-semibold text-foreground">{ticket.parking_spot}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Entry Time</span>
                                <span className="text-foreground">{new Date(ticket.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Duration</span>
                                <span className="text-foreground">{((new Date() - new Date(ticket.created_at)) / (1000 * 60 * 60)).toFixed(1)} hrs</span>
                            </div>

                            {ticket.is_pass_holder && (
                                <div className="bg-teal-500/10 text-teal-500 p-2 rounded text-center font-medium text-xs border border-teal-500/20">
                                    <CheckCircle className="w-3 h-3 inline mr-1" /> Monthly Pass Active
                                </div>
                            )}

                            {liveBill > ticket.price && (
                                <div className="bg-amber-500/10 text-amber-500 p-2 rounded text-center font-medium text-xs flex items-center justify-center gap-1 border border-amber-500/20">
                                    <AlertTriangle className="w-3 h-3" /> Overdue Charges Applied
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
