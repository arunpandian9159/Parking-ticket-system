'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/Button'
import { Plus, Search, MapPin, Ticket, Clock, CheckCircle, AlertCircle, Filter, Eye, Calendar, Car } from 'lucide-react'
import { Input } from '@/components/ui/Input'

export default function OfficerTicketsPage() {
    const router = useRouter()
    const [tickets, setTickets] = useState([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')
    const [statusFilter, setStatusFilter] = useState('all')

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

    const filteredTickets = tickets.filter(t => {
        const matchesSearch = t.license_plate.toLowerCase().includes(search.toLowerCase()) ||
            t.customer_name.toLowerCase().includes(search.toLowerCase())
        const matchesStatus = statusFilter === 'all' || t.status.toLowerCase() === statusFilter.toLowerCase()
        return matchesSearch && matchesStatus
    })

    // Calculate stats
    const stats = {
        total: tickets.length,
        pending: tickets.filter(t => t.status === 'Pending').length,
        paid: tickets.filter(t => t.status === 'Paid').length,
        todayRevenue: tickets
            .filter(t => {
                const today = new Date().toDateString()
                return new Date(t.created_at).toDateString() === today && t.status === 'Paid'
            })
            .reduce((acc, t) => acc + (t.price || 0), 0)
    }

    const statusTabs = [
        { id: 'all', label: 'All Tickets', count: stats.total, icon: Ticket },
        { id: 'pending', label: 'Pending', count: stats.pending, icon: Clock },
        { id: 'paid', label: 'Paid', count: stats.paid, icon: CheckCircle },
    ]

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="relative">
                    <div className="w-16 h-16 border-4 border-teal-500/20 rounded-full"></div>
                    <div className="absolute top-0 left-0 w-16 h-16 border-4 border-teal-500 rounded-full animate-spin border-t-transparent"></div>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-8 animate-fadeIn">
            {/* Header */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                <div>
                    <h1 className="text-4xl font-bold text-foreground flex items-center gap-3">
                        <div className="p-3 bg-linear-to-br from-teal-500 to-teal-600 rounded-xl shadow-lg shadow-teal-500/20">
                            <Ticket className="w-7 h-7 text-white" />
                        </div>
                        Tickets Management
                    </h1>
                    <p className="text-muted-foreground mt-2 text-lg">Monitor and manage all parking tickets</p>
                </div>
                <Link href="/tickets/create">
                    <Button className="bg-linear-to-r from-teal-500 to-teal-600 hover:from-teal-400 hover:to-teal-500 shadow-lg shadow-teal-500/20 px-6 py-3 text-base">
                        <Plus className="w-5 h-5 mr-2" />
                        Issue New Ticket
                    </Button>
                </Link>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Total Tickets */}
                <div className="group relative bg-card rounded-2xl border border-border p-6 hover:border-teal-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-teal-500/5">
                    <div className="absolute inset-0 bg-linear-to-br from-teal-500/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="relative">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-2 bg-teal-500/10 rounded-xl">
                                <Ticket className="w-5 h-5 text-teal-500" />
                            </div>
                            <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Total</span>
                        </div>
                        <div className="text-3xl font-bold text-foreground">{stats.total}</div>
                        <div className="text-sm text-muted-foreground mt-1">Total Tickets</div>
                    </div>
                </div>

                {/* Pending */}
                <div className="group relative bg-card rounded-2xl border border-border p-6 hover:border-amber-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-amber-500/5">
                    <div className="absolute inset-0 bg-linear-to-br from-amber-500/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="relative">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-2 bg-amber-500/10 rounded-xl">
                                <Clock className="w-5 h-5 text-amber-500" />
                            </div>
                            <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Pending</span>
                        </div>
                        <div className="text-3xl font-bold text-foreground">{stats.pending}</div>
                        <div className="text-sm text-muted-foreground mt-1">Awaiting Payment</div>
                    </div>
                </div>

                {/* Paid */}
                <div className="group relative bg-card rounded-2xl border border-border p-6 hover:border-green-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-green-500/5">
                    <div className="absolute inset-0 bg-linear-to-br from-green-500/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="relative">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-2 bg-green-500/10 rounded-xl">
                                <CheckCircle className="w-5 h-5 text-green-500" />
                            </div>
                            <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Completed</span>
                        </div>
                        <div className="text-3xl font-bold text-foreground">{stats.paid}</div>
                        <div className="text-sm text-muted-foreground mt-1">Paid Tickets</div>
                    </div>
                </div>

                {/* Today's Revenue */}
                <div className="group relative bg-card rounded-2xl border border-border p-6 hover:border-purple-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/5">
                    <div className="absolute inset-0 bg-linear-to-br from-purple-500/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="relative">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-2 bg-purple-500/10 rounded-xl">
                                <Calendar className="w-5 h-5 text-purple-500" />
                            </div>
                            <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Today</span>
                        </div>
                        <div className="text-3xl font-bold text-foreground">₹{stats.todayRevenue}</div>
                        <div className="text-sm text-muted-foreground mt-1">Today's Revenue</div>
                    </div>
                </div>
            </div>

            {/* Filters Section */}
            <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
                {/* Status Tabs */}
                <div className="flex flex-wrap gap-2 p-1 bg-secondary/50 rounded-xl border border-border">
                    {statusTabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setStatusFilter(tab.id)}
                            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${statusFilter === tab.id
                                ? 'bg-teal-500 text-white shadow-lg shadow-teal-500/20'
                                : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                                }`}
                        >
                            <tab.icon className="w-4 h-4" />
                            {tab.label}
                            <span className={`ml-1 px-2 py-0.5 rounded-full text-xs ${statusFilter === tab.id
                                ? 'bg-white/20 text-white'
                                : 'bg-secondary text-muted-foreground'
                                }`}>
                                {tab.count}
                            </span>
                        </button>
                    ))}
                </div>

                {/* Search */}
                <div className="relative w-full lg:w-80">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                        placeholder="Search by plate or name..."
                        className="pl-11 pr-4 py-3 bg-secondary/50 border-border focus:border-teal-500/50 rounded-xl"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>

            {/* Tickets Table */}
            <div className="bg-card rounded-2xl shadow-xl border border-border overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-linear-to-r from-secondary/80 to-secondary/50 border-b border-border">
                                <th className="px-6 py-5 text-xs uppercase font-bold text-muted-foreground tracking-wider">License Plate</th>
                                <th className="px-6 py-5 text-xs uppercase font-bold text-muted-foreground tracking-wider">Vehicle</th>
                                <th className="px-6 py-5 text-xs uppercase font-bold text-muted-foreground tracking-wider">Spot</th>
                                <th className="px-6 py-5 text-xs uppercase font-bold text-muted-foreground tracking-wider">Date & Time</th>
                                <th className="px-6 py-5 text-xs uppercase font-bold text-muted-foreground tracking-wider">Customer</th>
                                <th className="px-6 py-5 text-xs uppercase font-bold text-muted-foreground tracking-wider">Status</th>
                                <th className="px-6 py-5 text-xs uppercase font-bold text-muted-foreground tracking-wider text-right">Amount</th>
                                <th className="px-6 py-5 text-xs uppercase font-bold text-muted-foreground tracking-wider text-center">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {filteredTickets.length === 0 ? (
                                <tr>
                                    <td colSpan="8" className="px-6 py-16 text-center">
                                        <div className="flex flex-col items-center gap-4">
                                            <div className="p-4 bg-secondary/50 rounded-full">
                                                <Ticket className="w-8 h-8 text-muted-foreground" />
                                            </div>
                                            <div>
                                                <p className="text-lg font-medium text-foreground">No tickets found</p>
                                                <p className="text-muted-foreground">Try adjusting your search or filters</p>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                filteredTickets.map((ticket) => (
                                    <tr
                                        key={ticket.id}
                                        className="group hover:bg-secondary/30 transition-all duration-200 cursor-pointer"
                                        onClick={() => router.push(`/tickets/${ticket.id}`)}
                                    >
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-teal-500/10 rounded-lg group-hover:bg-teal-500/20 transition-colors">
                                                    <Car className="w-4 h-4 text-teal-500" />
                                                </div>
                                                <span className="font-bold text-foreground text-base tracking-wider">{ticket.license_plate}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="text-sm text-muted-foreground">{ticket.vehicle_name || '-'}</div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-2">
                                                <MapPin className="w-4 h-4 text-teal-500" />
                                                <span className="text-sm font-medium text-foreground">{ticket.parking_spot}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="text-sm text-foreground font-medium">
                                                {new Date(ticket.created_at).toLocaleDateString()}
                                            </div>
                                            <div className="text-xs text-muted-foreground mt-0.5">
                                                {new Date(ticket.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="text-sm font-medium text-foreground">{ticket.customer_name}</div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold ${ticket.status === 'Paid'
                                                ? 'bg-green-500/10 text-green-500 border border-green-500/20'
                                                : 'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                                                }`}>
                                                {ticket.status === 'Paid' ? (
                                                    <CheckCircle className="w-3 h-3" />
                                                ) : (
                                                    <Clock className="w-3 h-3" />
                                                )}
                                                {ticket.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-5 text-right">
                                            <div className="font-bold text-lg text-foreground">₹{ticket.price}</div>
                                            <div className="text-xs text-muted-foreground">{ticket.hours} hrs</div>
                                        </td>
                                        <td className="px-6 py-5 text-center">
                                            <button
                                                className="p-2.5 rounded-lg text-muted-foreground hover:text-teal-500 hover:bg-teal-500/10 transition-all duration-200"
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    router.push(`/tickets/${ticket.id}`)
                                                }}
                                            >
                                                <Eye className="w-5 h-5" />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Footer Info */}
            {filteredTickets.length > 0 && (
                <div className="flex justify-between items-center text-sm text-muted-foreground">
                    <span>Showing {filteredTickets.length} of {tickets.length} tickets</span>
                    <span>Click on a row to view ticket details</span>
                </div>
            )}

            <style jsx>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fadeIn {
                    animation: fadeIn 0.3s ease-out forwards;
                }
            `}</style>
        </div>
    )
}
