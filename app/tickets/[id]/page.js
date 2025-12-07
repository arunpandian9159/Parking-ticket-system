'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { ArrowLeft, Printer, CheckCircle, Clock, AlertTriangle } from 'lucide-react'
import Link from 'next/link'
import TicketReceipt from '@/components/TicketReceipt'

export default function TicketDetailsPage() {
    const params = useParams()
    const router = useRouter()
    const [ticket, setTicket] = useState(null)
    const [loading, setLoading] = useState(true)

    const [fine, setFine] = useState(0)
    const [overdueHours, setOverdueHours] = useState(0)

    useEffect(() => {
        fetchTicket()
    }, [params.id])

    useEffect(() => {
        if (ticket && ticket.status === 'Active') {
            const entryTime = new Date(ticket.created_at)
            const exitTime = new Date()
            const diffMs = exitTime - entryTime
            const diffHours = diffMs / (1000 * 60 * 60)

            const allowedHours = Number(ticket.hours)
            if (diffHours > allowedHours) {
                const extra = diffHours - allowedHours
                setOverdueHours(extra.toFixed(1))
                // Fine policy: ₹50 penalty + ₹20 for every extra hour
                const calculatedFine = 50 + (Math.ceil(extra) * 20)
                setFine(calculatedFine)
            }
        }
    }, [ticket])

    const fetchTicket = async () => {
        try {
            const { data, error } = await supabase
                .from('tickets')
                .select('*')
                .eq('id', params.id)
                .single()

            if (error) throw error
            setTicket(data)
        } catch (error) {
            console.error('Error fetching ticket:', error)
            router.push('/')
        } finally {
            setLoading(false)
        }
    }

    const handlePrint = () => {
        window.print()
    }

    const handleMarkPaid = async () => {
        const confirmMsg = fine > 0
            ? `Ticket is OVERDUE by ${overdueHours} hrs.\nTotal Fine: ₹${fine}.\n\nMark as PAID (Total: ₹${ticket.price + fine})?`
            : 'Mark this ticket as PAID?'

        if (!confirm(confirmMsg)) return

        try {
            const { error } = await supabase
                .from('tickets')
                .update({
                    status: 'Paid',
                    actual_exit_time: new Date().toISOString(),
                    fine_amount: fine
                })
                .eq('id', ticket.id)

            if (error) throw error

            // Free up the slot
            await supabase
                .from('parking_slots')
                .update({ is_occupied: false })
                .eq('slot_number', ticket.parking_spot)

            alert('Ticket marked as Paid!')
            router.push('/')
        } catch (error) {
            alert('Error updating ticket: ' + error.message)
        }
    }

    if (loading) return <div className="p-8 text-center text-gray-500">Loading ticket...</div>
    if (!ticket) return null

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/">
                        <Button variant="ghost" className="!p-2">
                            <ArrowLeft className="w-5 h-5" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Ticket Details</h1>
                        <p className="text-sm text-gray-500">ID: {ticket.id}</p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={handlePrint}>
                        <Printer className="w-4 h-4 mr-2" />
                        Print
                    </Button>
                    {ticket.status !== 'Paid' && (
                        <Button onClick={handleMarkPaid} className="bg-green-600 hover:bg-green-700 text-white">
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Mark Paid
                        </Button>
                    )}
                </div>
            </div>

            <Card className="p-8 space-y-8">
                {/* Status Badge */}
                <div className="flex justify-between items-start">
                    <div className={`
                        inline-flex items-center px-3 py-1 rounded-full text-sm font-medium
                        ${ticket.status === 'Paid' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}
                    `}>
                        {ticket.status === 'Paid' ? <CheckCircle className="w-4 h-4 mr-2" /> : <Clock className="w-4 h-4 mr-2" />}
                        {ticket.status}
                    </div>
                    <div className="text-right">
                        <div className="text-3xl font-bold text-gray-900">₹{ticket.price}</div>
                        <div className="text-sm text-gray-500">{ticket.hours} hours</div>
                    </div>
                </div>

                {/* Fine/Overdue Alert */}
                {fine > 0 && ticket.status === 'Active' && (
                    <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
                        <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5" />
                        <div>
                            <h4 className="font-bold text-red-700">Ticket Overdue!</h4>
                            <p className="text-sm text-red-600">
                                Vehicle exceeded time by <strong>{overdueHours} hours</strong>.
                                <br />
                                Additional Fine: <strong>₹{fine}</strong>
                            </p>
                        </div>
                    </div>
                )}

                <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                        <h3 className="font-semibold text-gray-900 border-b pb-2">Vehicle</h3>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-gray-500">Plate:</span>
                                <span className="font-mono font-bold">{ticket.license_plate}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500">Type:</span>
                                <span>{ticket.vehicle_type || 'N/A'}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500">Details:</span>
                                <span>{ticket.vehicle_name} - {ticket.vehicle_color}</span>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h3 className="font-semibold text-gray-900 border-b pb-2">Parking</h3>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-gray-500">Spot:</span>
                                <span className="font-bold">{ticket.parking_spot}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500">Entry:</span>
                                <span>{new Date(ticket.created_at).toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500">Customer:</span>
                                <span>{ticket.customer_name}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500">Phone:</span>
                                <span>{ticket.customer_phone}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </Card>

            {/* Hidden Receipt Component */}
            <TicketReceipt ticket={ticket} />
        </div>
    )
}
