'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import RevenueChart from '@/components/RevenueChart'
import { Card } from '@/components/ui/Card'
import { ListFilter } from 'lucide-react'

export default function AnalyticsPage() { 
    const [chartData, setChartData] = useState([])
    const [loading, setLoading] = useState(true)
    const [totalRevenue, setTotalRevenue] = useState(0)
    const [todayRevenue, setTodayRevenue] = useState(0)

    useEffect(() => {
        fetchData()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const fetchData = async () => {
        try {
            // Fetch all paid tickets
            const { data, error } = await supabase
                .from('tickets')
                .select('price, created_at')
                .eq('status', 'Paid')
                .order('created_at', { ascending: true })

            if (error) throw error

            processChartData(data || [])
        } catch (error) {
            console.error('Error fetching analytics:', error)
        } finally {
            setLoading(false)
        }
    }

    const processChartData = (tickets) => {
        const dailyRevenue = {}
        let total = 0
        let today = 0
        const todayStr = new Date().toLocaleDateString()

        tickets.forEach(ticket => {
            const date = new Date(ticket.created_at).toLocaleDateString()
            const amount = Number(ticket.price)

            if (!dailyRevenue[date]) {
                dailyRevenue[date] = 0
            }
            dailyRevenue[date] += amount
            total += amount

            if (date === todayStr) {
                today += amount
            }
        })

        // Convert to array and sort by date (simple string sort might fail for D/M/Y, strictly should parse)
        // For simplicity reusing the map keys. Ideally use ISO date keys 'YYYY-MM-DD' for sorting.
        // Let's re-process with consistent sorting.

        const sortedDates = Object.keys(dailyRevenue).sort((a, b) => new Date(a) - new Date(b))

        // Take last 7 days for the chart
        const recentDates = sortedDates.slice(-7)

        const chartData = recentDates.map(date => ({
            date: date.split('/').slice(0, 2).join('/'), // Show DD/MM
            revenue: dailyRevenue[date]
        }))

        setChartData(chartData)
        setTotalRevenue(total)
        setTodayRevenue(today)
    }

    if (loading) return <div className="p-8 text-muted-foreground">Loading analytics...</div>

    return (
        <div className="max-w-5xl mx-auto space-y-6 sm:space-y-8">
            <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Revenue Analytics</h1>
                <p className="text-muted-foreground text-sm sm:text-base">Overview of earnings and performance</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
                <Card className="p-4 sm:p-6">
                    <h3 className="text-xs sm:text-sm font-medium text-muted-foreground mb-1">Total Revenue</h3>
                    <div className="text-2xl sm:text-3xl font-bold text-foreground">₹{totalRevenue}</div>
                </Card>
                <Card className="p-4 sm:p-6">
                    <h3 className="text-xs sm:text-sm font-medium text-muted-foreground mb-1">Today's Revenue</h3>
                    <div className="text-2xl sm:text-3xl font-bold text-teal-500">₹{todayRevenue}</div>
                </Card>
                <Card className="p-4 sm:p-6">
                    <h3 className="text-xs sm:text-sm font-medium text-muted-foreground mb-1">Active Tickets</h3>
                    <div className="text-2xl sm:text-3xl font-bold text-cyan-500">-</div>
                    {/* Could fetch active count separately if needed */}
                </Card>
            </div>

            <Card className="p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 sm:mb-6 gap-2">
                    <h2 className="text-base sm:text-lg font-semibold text-foreground">Revenue Trend (Last 7 Days)</h2>
                    <div className="p-2 bg-secondary rounded-lg">
                        <ListFilter className="w-4 h-4 text-muted-foreground" />
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <RevenueChart data={chartData} />
                </div>
            </Card>
        </div>
    )
}
