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

    if (loading) return <div className="p-8 text-gray-400">Loading analytics...</div>

    return (
        <div className="max-w-5xl mx-auto space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-white">Revenue Analytics</h1>
                <p className="text-gray-400">Overview of earnings and performance</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="p-6">
                    <h3 className="text-sm font-medium text-gray-400 mb-1">Total Revenue</h3>
                    <div className="text-3xl font-bold text-white">₹{totalRevenue}</div>
                </Card>
                <Card className="p-6">
                    <h3 className="text-sm font-medium text-gray-400 mb-1">Today's Revenue</h3>
                    <div className="text-3xl font-bold text-teal-400">₹{todayRevenue}</div>
                </Card>
                <Card className="p-6">
                    <h3 className="text-sm font-medium text-gray-400 mb-1">Active Tickets</h3>
                    <div className="text-3xl font-bold text-cyan-400">-</div>
                    {/* Could fetch active count separately if needed */}
                </Card>
            </div>

            <Card className="p-6">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-semibold text-white">Revenue Trend (Last 7 Days)</h2>
                    <div className="p-2 bg-charcoal-700 rounded-lg">
                        <ListFilter className="w-4 h-4 text-gray-400" />
                    </div>
                </div>
                <RevenueChart data={chartData} />
            </Card>
        </div>
    )
}
