'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/Button'
import { Plus, Search, MapPin } from 'lucide-react'
import { Input } from '@/components/ui/Input'

export default function Dashboard() {
    const router = useRouter()
    const [tickets, setTickets] = useState([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')

    useEffect(() => {
        const checkUser = async () => {
            const { data: { session } } = await supabase.auth.getSession()
            if (!session) {
                router.push('/')
            } else {
                fetchTickets()
            }
        }
        checkUser()

    }, [router])

    const fetchTickets = async () => {
        try {
            const { data, error } = await supabase
                .from('tickets')
                .select('*')
                .order('created_at', { ascending: false })

            if (error) throw error
            setTickets(data || [])
        } catch (error) {
            console.error('Error fetching tickets:', error)
        } finally {
            setLoading(false)
        }
    }

    const filteredTickets = tickets.filter(t =>
        t.license_plate.toLowerCase().includes(search.toLowerCase()) ||
        t.customer_name.toLowerCase().includes(search.toLowerCase())
    )

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-500"></div>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
                    <p className="text-muted-foreground">Manage and view issued tickets</p>
                </div>
                <Link href="/tickets/create">
                    <Button className="w-full sm:w-auto">
                        <Plus className="w-4 h-4 mr-2" />
                        Issue New Ticket
                    </Button>
                </Link>
            </div>

            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                    placeholder="Search by license plate or name..."
                    className="pl-10"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            <div className="bg-card rounded-xl shadow-sm border border-border overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-secondary/50 border-b border-border text-xs uppercase font-semibold text-muted-foreground">
                                <th className="px-6 py-4">License Plate</th>
                                <th className="px-6 py-4">Vehicle</th>
                                <th className="px-6 py-4">Spot</th>
                                <th className="px-6 py-4">Date</th>
                                <th className="px-6 py-4">Customer</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Price</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {filteredTickets.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="px-6 py-8 text-center text-muted-foreground">
                                        No tickets found.
                                    </td>
                                </tr>
                            ) : (
                                filteredTickets.map((ticket) => (
                                    <tr
                                        key={ticket.id}
                                        className="hover:bg-secondary/50 transition-colors group cursor-pointer"
                                        onClick={() => router.push(`/tickets/${ticket.id}`)}
                                    >
                                        <td className="px-6 py-4">
                                            <div className="font-bold text-foreground">{ticket.license_plate}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-muted-foreground">{ticket.vehicle_name || '-'}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                <MapPin className="w-4 h-4 text-teal-500" />
                                                {ticket.parking_spot}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-muted-foreground">
                                                {new Date(ticket.created_at).toLocaleDateString()}
                                                <span className="ml-1 text-xs opacity-60">
                                                    {new Date(ticket.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-foreground">{ticket.customer_name}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${ticket.status === 'Paid'
                                                ? 'bg-teal-500/10 text-teal-500 border border-teal-500/20'
                                                : 'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                                                }`}>
                                                {ticket.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="font-bold text-foreground">₹{ticket.price}</div>
                                            <div className="text-xs text-muted-foreground">{ticket.hours} hours</div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
