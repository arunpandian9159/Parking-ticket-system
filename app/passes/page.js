'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import {
    CreditCard,
    Search,
    UserCheck,
    Calendar,
    Car,
    Phone,
    User,
    CheckCircle,
    XCircle,
    Clock,
    AlertTriangle,
    Sparkles
} from 'lucide-react'

export default function PassesPage() {
    const router = useRouter()
    const [passes, setPasses] = useState([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')
    const [statusFilter, setStatusFilter] = useState('all')

    useEffect(() => {
        const checkUser = async () => {
            const { data: { session } } = await supabase.auth.getSession()
            if (!session) {
                router.push('/')
            } else {
                fetchPasses()
            }
        }
        checkUser()
    }, [router])

    const fetchPasses = async () => {
        try {
            const { data, error } = await supabase
                .from('monthly_passes')
                .select('*')
                .order('created_at', { ascending: false })

            if (error) throw error

            // Update status based on expiry date
            const updatedPasses = (data || []).map(pass => {
                const endDate = new Date(pass.end_date)
                const today = new Date()
                const daysLeft = Math.ceil((endDate - today) / (1000 * 60 * 60 * 24))

                let computedStatus = pass.status
                if (daysLeft <= 0) {
                    computedStatus = 'Expired'
                } else if (daysLeft <= 7) {
                    computedStatus = 'Expiring Soon'
                }

                return { ...pass, computedStatus, daysLeft }
            })

            setPasses(updatedPasses)
        } catch (error) {
            console.error('Error fetching passes:', error)
        } finally {
            setLoading(false)
        }
    }

    const filteredPasses = passes.filter(pass => {
        const matchesSearch =
            pass.customer_name.toLowerCase().includes(search.toLowerCase()) ||
            pass.vehicle_number.toLowerCase().includes(search.toLowerCase()) ||
            (pass.phone_number && pass.phone_number.includes(search))

        const matchesStatus = statusFilter === 'all' ||
            (statusFilter === 'active' && pass.computedStatus === 'Active') ||
            (statusFilter === 'expiring' && pass.computedStatus === 'Expiring Soon') ||
            (statusFilter === 'expired' && pass.computedStatus === 'Expired')

        return matchesSearch && matchesStatus
    })

    // Calculate stats
    const stats = {
        total: passes.length,
        active: passes.filter(p => p.computedStatus === 'Active').length,
        expiring: passes.filter(p => p.computedStatus === 'Expiring Soon').length,
        expired: passes.filter(p => p.computedStatus === 'Expired').length
    }

    const statusTabs = [
        { id: 'all', label: 'All Passes', count: stats.total, icon: CreditCard },
        { id: 'active', label: 'Active', count: stats.active, icon: CheckCircle },
        { id: 'expiring', label: 'Expiring Soon', count: stats.expiring, icon: AlertTriangle },
        { id: 'expired', label: 'Expired', count: stats.expired, icon: XCircle },
    ]

    const getStatusStyles = (status) => {
        switch (status) {
            case 'Active':
                return 'bg-green-500/10 text-green-500 border-green-500/20'
            case 'Expiring Soon':
                return 'bg-amber-500/10 text-amber-500 border-amber-500/20'
            case 'Expired':
                return 'bg-red-500/10 text-red-500 border-red-500/20'
            default:
                return 'bg-secondary text-muted-foreground border-border'
        }
    }

    const getStatusIcon = (status) => {
        switch (status) {
            case 'Active':
                return <CheckCircle className="w-3.5 h-3.5" />
            case 'Expiring Soon':
                return <AlertTriangle className="w-3.5 h-3.5" />
            case 'Expired':
                return <XCircle className="w-3.5 h-3.5" />
            default:
                return <Clock className="w-3.5 h-3.5" />
        }
    }

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
                        <div className="p-3 bg-linear-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg shadow-purple-500/20">
                            <CreditCard className="w-7 h-7 text-white" />
                        </div>
                        Monthly Passes
                    </h1>
                    <p className="text-muted-foreground mt-2 text-lg">View and verify customer parking passes</p>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Total Passes */}
                <div className="group relative bg-card rounded-2xl border border-border p-6 hover:border-purple-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/5">
                    <div className="absolute inset-0 bg-linear-to-br from-purple-500/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="relative">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-2 bg-purple-500/10 rounded-xl">
                                <CreditCard className="w-5 h-5 text-purple-500" />
                            </div>
                            <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Total</span>
                        </div>
                        <div className="text-3xl font-bold text-foreground">{stats.total}</div>
                        <div className="text-sm text-muted-foreground mt-1">Total Passes</div>
                    </div>
                </div>

                {/* Active */}
                <div className="group relative bg-card rounded-2xl border border-border p-6 hover:border-green-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-green-500/5">
                    <div className="absolute inset-0 bg-linear-to-br from-green-500/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="relative">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-2 bg-green-500/10 rounded-xl">
                                <CheckCircle className="w-5 h-5 text-green-500" />
                            </div>
                            <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Active</span>
                        </div>
                        <div className="text-3xl font-bold text-foreground">{stats.active}</div>
                        <div className="text-sm text-muted-foreground mt-1">Active Passes</div>
                    </div>
                </div>

                {/* Expiring Soon */}
                <div className="group relative bg-card rounded-2xl border border-border p-6 hover:border-amber-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-amber-500/5">
                    <div className="absolute inset-0 bg-linear-to-br from-amber-500/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="relative">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-2 bg-amber-500/10 rounded-xl">
                                <AlertTriangle className="w-5 h-5 text-amber-500" />
                            </div>
                            <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Expiring</span>
                        </div>
                        <div className="text-3xl font-bold text-foreground">{stats.expiring}</div>
                        <div className="text-sm text-muted-foreground mt-1">Expiring Soon</div>
                    </div>
                </div>

                {/* Expired */}
                <div className="group relative bg-card rounded-2xl border border-border p-6 hover:border-red-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-red-500/5">
                    <div className="absolute inset-0 bg-linear-to-br from-red-500/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="relative">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-2 bg-red-500/10 rounded-xl">
                                <XCircle className="w-5 h-5 text-red-500" />
                            </div>
                            <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Expired</span>
                        </div>
                        <div className="text-3xl font-bold text-foreground">{stats.expired}</div>
                        <div className="text-sm text-muted-foreground mt-1">Expired Passes</div>
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
                                ? 'bg-purple-500 text-white shadow-lg shadow-purple-500/20'
                                : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                                }`}
                        >
                            <tab.icon className="w-4 h-4" />
                            <span className="hidden sm:inline">{tab.label}</span>
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
                        placeholder="Search by name, vehicle or phone..."
                        className="pl-11 pr-4 py-3 bg-secondary/50 border-border focus:border-purple-500/50 rounded-xl"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>

            {/* Passes Grid */}
            {filteredPasses.length === 0 ? (
                <div className="bg-card rounded-2xl border border-border p-16 text-center">
                    <div className="flex flex-col items-center gap-4">
                        <div className="p-4 bg-secondary/50 rounded-full">
                            <CreditCard className="w-8 h-8 text-muted-foreground" />
                        </div>
                        <div>
                            <p className="text-lg font-medium text-foreground">No passes found</p>
                            <p className="text-muted-foreground">Try adjusting your search or filters</p>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredPasses.map((pass) => (
                        <div
                            key={pass.id}
                            className="group relative bg-card rounded-2xl border border-border overflow-hidden hover:border-purple-500/30 transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/5"
                        >
                            {/* Card Header with Gradient */}
                            <div className="relative p-6 bg-linear-to-br from-purple-500/10 via-purple-500/5 to-transparent border-b border-border">
                                <div className="absolute top-4 right-4">
                                    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border ${getStatusStyles(pass.computedStatus)}`}>
                                        {getStatusIcon(pass.computedStatus)}
                                        {pass.computedStatus}
                                    </span>
                                </div>

                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-purple-500/20 rounded-xl">
                                        <CreditCard className="w-6 h-6 text-purple-500" />
                                    </div>
                                    <div>
                                        <div className="text-sm text-muted-foreground">Pass Holder</div>
                                        <div className="text-xl font-bold text-foreground">{pass.customer_name}</div>
                                    </div>
                                </div>
                            </div>

                            {/* Card Body */}
                            <div className="p-6 space-y-4">
                                {/* Vehicle Number */}
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-secondary rounded-lg">
                                        <Car className="w-4 h-4 text-muted-foreground" />
                                    </div>
                                    <div>
                                        <div className="text-xs text-muted-foreground uppercase tracking-wider">Vehicle Number</div>
                                        <div className="font-mono font-bold text-foreground tracking-wider">{pass.vehicle_number}</div>
                                    </div>
                                </div>

                                {/* Phone */}
                                {pass.phone_number && (
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-secondary rounded-lg">
                                            <Phone className="w-4 h-4 text-muted-foreground" />
                                        </div>
                                        <div>
                                            <div className="text-xs text-muted-foreground uppercase tracking-wider">Phone</div>
                                            <div className="font-medium text-foreground">{pass.phone_number}</div>
                                        </div>
                                    </div>
                                )}

                                {/* Validity */}
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-secondary rounded-lg">
                                        <Calendar className="w-4 h-4 text-muted-foreground" />
                                    </div>
                                    <div>
                                        <div className="text-xs text-muted-foreground uppercase tracking-wider">Valid Until</div>
                                        <div className="font-medium text-foreground">
                                            {new Date(pass.end_date).toLocaleDateString('en-IN', {
                                                day: 'numeric',
                                                month: 'short',
                                                year: 'numeric'
                                            })}
                                        </div>
                                    </div>
                                </div>

                                {/* Days Left Badge */}
                                <div className={`flex items-center justify-center gap-2 py-3 rounded-xl border ${pass.daysLeft > 7
                                    ? 'bg-green-500/5 border-green-500/20 text-green-500'
                                    : pass.daysLeft > 0
                                        ? 'bg-amber-500/5 border-amber-500/20 text-amber-500'
                                        : 'bg-red-500/5 border-red-500/20 text-red-500'
                                    }`}>
                                    {pass.daysLeft > 0 ? (
                                        <>
                                            <Clock className="w-4 h-4" />
                                            <span className="font-bold">{pass.daysLeft} days remaining</span>
                                        </>
                                    ) : (
                                        <>
                                            <XCircle className="w-4 h-4" />
                                            <span className="font-bold">Expired {Math.abs(pass.daysLeft)} days ago</span>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Footer Info */}
            {filteredPasses.length > 0 && (
                <div className="flex justify-between items-center text-sm text-muted-foreground">
                    <span>Showing {filteredPasses.length} of {passes.length} passes</span>
                    <span className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-purple-500" />
                        Pass validity is verified in real-time
                    </span>
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
