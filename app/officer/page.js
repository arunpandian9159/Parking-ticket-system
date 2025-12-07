'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/Button'
import { Plus, Search, MapPin, Ticket, Clock, CheckCircle, AlertCircle, Filter, Eye, Calendar, Car, X, Printer, Trash2, Edit2, CreditCard, Phone, User, AlertTriangle } from 'lucide-react'
import { Input } from '@/components/ui/Input'

// Ticket View Modal Component
function TicketModal({ ticket, isOpen, onClose, onMarkPaid, onDelete }) {
    const [fine, setFine] = useState(0)
    const [overdueHours, setOverdueHours] = useState(0)

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
            } else {
                setFine(0)
                setOverdueHours(0)
            }
        } else {
            setFine(0)
            setOverdueHours(0)
        }
    }, [ticket])

    const handlePrint = () => {
        window.print()
    }

    if (!isOpen || !ticket) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative bg-card border border-border rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden animate-modalIn max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="relative p-6 bg-linear-to-br from-teal-500/10 via-teal-500/5 to-transparent border-b border-border">
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>

                    <div className="flex items-center justify-between pr-12">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-teal-500/20 rounded-xl">
                                <Ticket className="w-6 h-6 text-teal-500" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-foreground">Ticket Details</h2>
                                <p className="text-sm text-muted-foreground">ID: {ticket.id.slice(0, 8)}...</p>
                            </div>
                        </div>

                        <div className={`
                            inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium
                            ${ticket.status === 'Paid'
                                ? 'bg-green-500/10 text-green-500 border border-green-500/20'
                                : 'bg-amber-500/10 text-amber-500 border border-amber-500/20'}
                        `}>
                            {ticket.status === 'Paid' ? <CheckCircle className="w-4 h-4 mr-2" /> : <Clock className="w-4 h-4 mr-2" />}
                            {ticket.status}
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                    {/* Fine/Overdue Alert */}
                    {fine > 0 && ticket.status === 'Active' && (
                        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex items-start gap-3">
                            <AlertTriangle className="w-5 h-5 text-red-500 mt-0.5" />
                            <div>
                                <h4 className="font-bold text-red-500">Ticket Overdue!</h4>
                                <p className="text-sm text-red-500/80">
                                    Vehicle exceeded time by <strong>{overdueHours} hours</strong>.
                                    <br />
                                    Additional Fine: <strong>₹{fine}</strong>
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Price Banner */}
                    <div className="bg-linear-to-br from-teal-500/10 to-cyan-500/10 rounded-xl p-4 flex items-center justify-between border border-teal-500/20">
                        <div>
                            <div className="text-sm text-muted-foreground">Total Amount</div>
                            <div className="text-3xl font-bold text-teal-500">₹{ticket.price + (ticket.status === 'Active' ? fine : 0)}</div>
                        </div>
                        <div className="text-right">
                            <div className="text-sm text-muted-foreground">Duration</div>
                            <div className="text-xl font-bold text-foreground">{ticket.hours} hrs</div>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        {/* Customer Info */}
                        <div className="space-y-4">
                            <h3 className="font-semibold text-foreground border-b border-border pb-2 flex items-center gap-2">
                                <User className="w-4 h-4 text-teal-500" />
                                Customer Details
                            </h3>
                            <div className="space-y-3">
                                <div className="flex items-center gap-3 p-3 bg-secondary/50 rounded-lg">
                                    <User className="w-4 h-4 text-muted-foreground" />
                                    <div>
                                        <div className="text-xs text-muted-foreground">Name</div>
                                        <div className="font-medium text-foreground">{ticket.customer_name}</div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 p-3 bg-secondary/50 rounded-lg">
                                    <Phone className="w-4 h-4 text-muted-foreground" />
                                    <div>
                                        <div className="text-xs text-muted-foreground">Phone</div>
                                        <div className="font-medium text-foreground">{ticket.customer_phone}</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Vehicle Info */}
                        <div className="space-y-4">
                            <h3 className="font-semibold text-foreground border-b border-border pb-2 flex items-center gap-2">
                                <Car className="w-4 h-4 text-teal-500" />
                                Vehicle Details
                            </h3>
                            <div className="space-y-3">
                                <div className="flex items-center gap-3 p-3 bg-secondary/50 rounded-lg">
                                    <CreditCard className="w-4 h-4 text-muted-foreground" />
                                    <div>
                                        <div className="text-xs text-muted-foreground">License Plate</div>
                                        <div className="font-mono font-bold text-foreground tracking-wider">{ticket.license_plate}</div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 p-3 bg-secondary/50 rounded-lg">
                                    <Car className="w-4 h-4 text-muted-foreground" />
                                    <div>
                                        <div className="text-xs text-muted-foreground">Vehicle</div>
                                        <div className="font-medium text-foreground">
                                            {ticket.vehicle_name || ticket.vehicle_type || 'N/A'}
                                            {ticket.vehicle_color && ` - ${ticket.vehicle_color}`}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Parking Info */}
                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="flex items-center gap-3 p-4 bg-secondary/50 rounded-xl border border-border">
                            <div className="p-2 bg-teal-500/10 rounded-lg">
                                <MapPin className="w-5 h-5 text-teal-500" />
                            </div>
                            <div>
                                <div className="text-xs text-muted-foreground uppercase tracking-wider">Parking Spot</div>
                                <div className="text-lg font-bold text-foreground">{ticket.parking_spot}</div>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 p-4 bg-secondary/50 rounded-xl border border-border">
                            <div className="p-2 bg-cyan-500/10 rounded-lg">
                                <Calendar className="w-5 h-5 text-cyan-500" />
                            </div>
                            <div>
                                <div className="text-xs text-muted-foreground uppercase tracking-wider">Entry Time</div>
                                <div className="text-sm font-bold text-foreground">
                                    {new Date(ticket.created_at).toLocaleString('en-IN', {
                                        day: 'numeric',
                                        month: 'short',
                                        year: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="p-6 bg-secondary/30 border-t border-border flex flex-wrap gap-3">
                    <Button
                        variant="outline"
                        onClick={handlePrint}
                        className="flex-1 min-w-[120px]"
                    >
                        <Printer className="w-4 h-4 mr-2" />
                        Print
                    </Button>

                    <Button
                        variant="outline"
                        onClick={() => onDelete(ticket.id)}
                        className="flex-1 min-w-[120px] border-red-500/30 text-red-500 hover:bg-red-500/10"
                    >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                    </Button>

                    {ticket.status !== 'Paid' && (
                        <Button
                            onClick={() => onMarkPaid(ticket, fine, overdueHours)}
                            className="flex-1 min-w-[120px] bg-linear-to-r from-teal-500 to-teal-600 hover:from-teal-400 hover:to-teal-500"
                        >
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Mark Paid {fine > 0 && `(₹${ticket.price + fine})`}
                        </Button>
                    )}
                </div>
            </div>
        </div>
    )
}

export default function OfficerTicketsPage() {
    const router = useRouter()
    const [tickets, setTickets] = useState([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')
    const [statusFilter, setStatusFilter] = useState('all')
    const [selectedTicket, setSelectedTicket] = useState(null)
    const [showModal, setShowModal] = useState(false)

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

    const handleViewTicket = (ticket) => {
        setSelectedTicket(ticket)
        setShowModal(true)
    }

    const handleCloseModal = () => {
        setShowModal(false)
        setSelectedTicket(null)
    }

    const handleMarkPaid = async (ticket, fine, overdueHours) => {
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

            handleCloseModal()
            fetchTickets()
        } catch (error) {
            alert('Error updating ticket: ' + error.message)
        }
    }

    const handleDeleteTicket = async (ticketId) => {
        console.log('Delete initiated for ticket:', ticketId)

        if (!confirm('Are you sure you want to delete this ticket? This action cannot be undone.')) {
            console.log('User cancelled delete')
            return
        }

        try {
            // Get the ticket first to free up the slot
            const ticket = tickets.find(t => t.id === ticketId)
            console.log('Found ticket:', ticket)

            if (!ticket) {
                alert('Ticket not found in local state')
                return
            }

            console.log('Attempting to delete from Supabase...')
            const { data, error, status, statusText } = await supabase
                .from('tickets')
                .delete()
                .eq('id', ticketId)
                .select()

            console.log('Delete response:', { data, error, status, statusText })

            if (error) {
                console.error('Supabase delete error:', error)
                throw error
            }

            // Check if anything was actually deleted
            if (!data || data.length === 0) {
                console.warn('No rows were deleted - might be RLS policy issue')
                alert('Could not delete ticket. This might be due to permission settings. Please check Supabase RLS policies.')
                return
            }

            console.log('Ticket deleted successfully:', data)

            // Free up the slot if ticket was active
            if (ticket && ticket.status !== 'Paid') {
                console.log('Freeing up parking slot:', ticket.parking_spot)
                const { error: slotError } = await supabase
                    .from('parking_slots')
                    .update({ is_occupied: false })
                    .eq('slot_number', ticket.parking_spot)

                if (slotError) {
                    console.error('Error freeing slot:', slotError)
                }
            }

            handleCloseModal()
            fetchTickets()
            console.log('Delete completed successfully')
        } catch (error) {
            console.error('Delete error:', error)
            alert('Error deleting ticket: ' + (error.message || JSON.stringify(error)))
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
        pending: tickets.filter(t => t.status === 'Pending' || t.status === 'Active').length,
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
        { id: 'active', label: 'Active', count: stats.pending, icon: Clock },
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
        <div className="space-y-6 sm:space-y-8 animate-fadeIn">
            {/* Ticket View Modal */}
            <TicketModal
                ticket={selectedTicket}
                isOpen={showModal}
                onClose={handleCloseModal}
                onMarkPaid={handleMarkPaid}
                onDelete={handleDeleteTicket}
            />

            {/* Header */}
            <div className="flex flex-col gap-4 sm:gap-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-2xl sm:text-4xl font-bold text-foreground flex items-center gap-2 sm:gap-3">
                            <div className="p-2 sm:p-3 bg-linear-to-br from-teal-500 to-teal-600 rounded-xl shadow-lg shadow-teal-500/20">
                                <Ticket className="w-5 h-5 sm:w-7 sm:h-7 text-white" />
                            </div>
                            <span className="hidden sm:inline">Tickets Management</span>
                            <span className="sm:hidden">Tickets</span>
                        </h1>
                        <p className="text-muted-foreground mt-1 sm:mt-2 text-sm sm:text-lg">Monitor and manage parking tickets</p>
                    </div>
                    <Link href="/tickets/create" className="w-full sm:w-auto">
                        <Button className="w-full sm:w-auto bg-linear-to-r from-teal-500 to-teal-600 hover:from-teal-400 hover:to-teal-500 shadow-lg shadow-teal-500/20 px-4 sm:px-6 py-2.5 sm:py-3 text-sm sm:text-base">
                            <Plus className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                            Issue New Ticket
                        </Button>
                    </Link>
                </div>
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
                            <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Active</span>
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
            <div className="flex flex-col gap-4">
                {/* Search - Mobile first */}
                <div className="relative w-full lg:hidden">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                        placeholder="Search by plate or name..."
                        className="pl-11 pr-4 py-3 bg-secondary/50 border-border focus:border-teal-500/50 rounded-xl"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
                    {/* Status Tabs */}
                    <div className="flex flex-wrap gap-1.5 sm:gap-2 p-1 bg-secondary/50 rounded-xl border border-border w-full lg:w-auto overflow-x-auto">
                        {statusTabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setStatusFilter(tab.id)}
                                className={`flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-4 py-2 sm:py-2.5 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 whitespace-nowrap ${statusFilter === tab.id
                                    ? 'bg-teal-500 text-white shadow-lg shadow-teal-500/20'
                                    : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                                    }`}
                            >
                                <tab.icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                <span className="hidden sm:inline">{tab.label}</span>
                                <span className="sm:hidden">{tab.id === 'all' ? 'All' : tab.label.split(' ')[0]}</span>
                                <span className={`ml-0.5 sm:ml-1 px-1.5 sm:px-2 py-0.5 rounded-full text-xs ${statusFilter === tab.id
                                    ? 'bg-white/20 text-white'
                                    : 'bg-secondary text-muted-foreground'
                                    }`}>
                                    {tab.count}
                                </span>
                            </button>
                        ))}
                    </div>

                    {/* Search - Desktop */}
                    <div className="relative w-80 hidden lg:block">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                            placeholder="Search by plate or name..."
                            className="pl-11 pr-4 py-3 bg-secondary/50 border-border focus:border-teal-500/50 rounded-xl"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {/* Tickets - Desktop Table / Mobile Cards */}
            {filteredTickets.length === 0 ? (
                <div className="bg-card rounded-2xl shadow-xl border border-border p-8 sm:p-16 text-center">
                    <div className="flex flex-col items-center gap-4">
                        <div className="p-4 bg-secondary/50 rounded-full">
                            <Ticket className="w-8 h-8 text-muted-foreground" />
                        </div>
                        <div>
                            <p className="text-lg font-medium text-foreground">No tickets found</p>
                            <p className="text-muted-foreground">Try adjusting your search or filters</p>
                        </div>
                        <Link href="/tickets/create">
                            <Button className="mt-2">
                                <Plus className="w-4 h-4 mr-2" />
                                Issue First Ticket
                            </Button>
                        </Link>
                    </div>
                </div>
            ) : (
                <>
                    {/* Desktop Table View */}
                    <div className="hidden md:block bg-card rounded-2xl shadow-xl border border-border overflow-hidden">
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
                                        <th className="px-6 py-5 text-xs uppercase font-bold text-muted-foreground tracking-wider text-center">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border">
                                    {filteredTickets.map((ticket) => (
                                        <tr
                                            key={ticket.id}
                                            className="group hover:bg-secondary/30 transition-all duration-200"
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
                                            <td className="px-6 py-5">
                                                <div className="flex items-center justify-center gap-2">
                                                    <button
                                                        className="p-2.5 rounded-lg text-muted-foreground hover:text-teal-500 hover:bg-teal-500/10 transition-all duration-200"
                                                        onClick={(e) => {
                                                            e.stopPropagation()
                                                            handleViewTicket(ticket)
                                                        }}
                                                        title="View Details"
                                                    >
                                                        <Eye className="w-5 h-5" />
                                                    </button>
                                                    {ticket.status !== 'Paid' && (
                                                        <button
                                                            className="p-2.5 rounded-lg text-muted-foreground hover:text-green-500 hover:bg-green-500/10 transition-all duration-200"
                                                            onClick={(e) => {
                                                                e.stopPropagation()
                                                                handleMarkPaid(ticket, 0, 0)
                                                            }}
                                                            title="Mark as Paid"
                                                        >
                                                            <CheckCircle className="w-5 h-5" />
                                                        </button>
                                                    )}
                                                    <button
                                                        className="p-2.5 rounded-lg text-muted-foreground hover:text-red-500 hover:bg-red-500/10 transition-all duration-200"
                                                        onClick={(e) => {
                                                            e.stopPropagation()
                                                            handleDeleteTicket(ticket.id)
                                                        }}
                                                        title="Delete Ticket"
                                                    >
                                                        <Trash2 className="w-5 h-5" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Mobile Card View */}
                    <div className="md:hidden space-y-4">
                        {filteredTickets.map((ticket) => (
                            <div
                                key={ticket.id}
                                className="bg-card rounded-2xl border border-border p-4 space-y-4"
                            >
                                {/* Header */}
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-teal-500/10 rounded-lg">
                                            <Car className="w-4 h-4 text-teal-500" />
                                        </div>
                                        <div>
                                            <span className="font-bold text-foreground tracking-wider">{ticket.license_plate}</span>
                                            <div className="text-xs text-muted-foreground">{ticket.vehicle_name || ticket.vehicle_type}</div>
                                        </div>
                                    </div>
                                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${ticket.status === 'Paid'
                                        ? 'bg-green-500/10 text-green-500 border border-green-500/20'
                                        : 'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                                        }`}>
                                        {ticket.status === 'Paid' ? <CheckCircle className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                                        {ticket.status}
                                    </span>
                                </div>

                                {/* Details Grid */}
                                <div className="grid grid-cols-2 gap-3 text-sm">
                                    <div className="bg-secondary/50 rounded-lg p-3">
                                        <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Customer</div>
                                        <div className="font-medium text-foreground truncate">{ticket.customer_name}</div>
                                    </div>
                                    <div className="bg-secondary/50 rounded-lg p-3">
                                        <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Spot</div>
                                        <div className="font-medium text-foreground flex items-center gap-1">
                                            <MapPin className="w-3 h-3 text-teal-500" />
                                            {ticket.parking_spot}
                                        </div>
                                    </div>
                                    <div className="bg-secondary/50 rounded-lg p-3">
                                        <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Date</div>
                                        <div className="font-medium text-foreground">
                                            {new Date(ticket.created_at).toLocaleDateString()}
                                        </div>
                                    </div>
                                    <div className="bg-secondary/50 rounded-lg p-3">
                                        <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Amount</div>
                                        <div className="font-bold text-foreground">₹{ticket.price}</div>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex gap-2 pt-2 border-t border-border">
                                    <button
                                        className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:text-teal-500 hover:bg-teal-500/10 border border-border transition-all"
                                        onClick={() => handleViewTicket(ticket)}
                                    >
                                        <Eye className="w-4 h-4" />
                                        View
                                    </button>
                                    {ticket.status !== 'Paid' && (
                                        <button
                                            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:text-green-500 hover:bg-green-500/10 border border-border transition-all"
                                            onClick={() => handleMarkPaid(ticket, 0, 0)}
                                        >
                                            <CheckCircle className="w-4 h-4" />
                                            Paid
                                        </button>
                                    )}
                                    <button
                                        className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:text-red-500 hover:bg-red-500/10 border border-border transition-all"
                                        onClick={() => handleDeleteTicket(ticket.id)}
                                    >
                                        <Trash2 className="w-4 h-4" />
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            )}

            {/* Footer Info */}
            {filteredTickets.length > 0 && (
                <div className="flex justify-between items-center text-sm text-muted-foreground">
                    <span>Showing {filteredTickets.length} of {tickets.length} tickets</span>
                    <span>Click the eye icon to view ticket details</span>
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
                @keyframes modalIn {
                    from { opacity: 0; transform: scale(0.95) translateY(10px); }
                    to { opacity: 1; transform: scale(1) translateY(0); }
                }
                .animate-modalIn {
                    animation: modalIn 0.2s ease-out forwards;
                }
            `}</style>
        </div>
    )
}
