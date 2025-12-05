'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Plus, Search, Calendar, MapPin, Clock } from 'lucide-react'
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
                router.push('/login')
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
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                    <p className="text-gray-500">Manage and view issued tickets</p>
                </div>
                <Link href="/tickets/create">
                    <Button className="w-full sm:w-auto">
                        <Plus className="w-4 h-4 mr-2" />
                        Issue New Ticket
                    </Button>
                </Link>
            </div>

            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                    placeholder="Search by license plate or name..."
                    className="pl-10"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filteredTickets.length === 0 ? (
                    <div className="col-span-full text-center py-12 text-gray-500">
                        No tickets found.
                    </div>
                ) : (
                    filteredTickets.map((ticket) => (
                        <Card key={ticket.id} className="cursor-pointer hover:shadow-2xl transition-shadow relative overflow-hidden group">
                            <div className="absolute top-0 left-0 w-1 h-full bg-blue-600 group-hover:bg-blue-500 transition-colors"></div>

                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="font-bold text-lg text-gray-900">{ticket.license_plate}</h3>
                                    <p className="text-sm text-gray-500">{ticket.vehicle_name || 'Unknown Vehicle'}</p>
                                </div>
                                <div className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-bold">
                                    ₹{ticket.price}
                                </div>
                            </div>

                            <div className="space-y-2 text-sm text-gray-600">
                                <div className="flex items-center gap-2">
                                    <MapPin className="w-4 h-4 text-gray-400" />
                                    {ticket.parking_spot}
                                </div>
                                <div className="flex items-center gap-2">
                                    <Clock className="w-4 h-4 text-gray-400" />
                                    {ticket.hours} hours
                                </div>
                                <div className="flex items-center gap-2">
                                    <Calendar className="w-4 h-4 text-gray-400" />
                                    {new Date(ticket.created_at).toLocaleDateString()}
                                </div>
                            </div>

                            <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center text-sm">
                                <span className="text-gray-500">{ticket.customer_name}</span>
                                <span className={`font-medium ${ticket.status === 'Paid' ? 'text-green-600' : 'text-amber-600'}`}>
                                    {ticket.status}
                                </span>
                            </div>
                        </Card>
                    ))
                )}
            </div>
        </div>
    )
}
