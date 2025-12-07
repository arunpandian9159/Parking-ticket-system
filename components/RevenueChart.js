'use client'

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { useTheme } from '@/lib/ThemeContext'

export default function RevenueChart({ data }) {
    const { theme } = useTheme()
    const isDark = theme === 'dark'

    if (!data || data.length === 0) {
        return (
            <div className="h-64 flex items-center justify-center text-muted-foreground bg-secondary/50 rounded-xl border border-dashed border-border">
                No data available
            </div>
        )
    }

    return (
        <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <CartesianGrid
                        strokeDasharray="3 3"
                        vertical={false}
                        stroke={isDark ? '#374151' : '#e5e7eb'}
                    />
                    <XAxis
                        dataKey="date"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: isDark ? '#9CA3AF' : '#6B7280', fontSize: 12 }}
                        dy={10}
                    />
                    <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: isDark ? '#9CA3AF' : '#6B7280', fontSize: 12 }}
                        dx={-10}
                        tickFormatter={(value) => `₹${value}`}
                    />
                    <Tooltip
                        cursor={{ fill: isDark ? 'rgba(6, 182, 212, 0.1)' : 'rgba(6, 182, 212, 0.05)' }}
                        contentStyle={{
                            borderRadius: '8px',
                            border: isDark ? '1px solid #374151' : '1px solid #e5e7eb',
                            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                            backgroundColor: isDark ? '#1f2937' : '#ffffff',
                            color: isDark ? '#fff' : '#1f2937'
                        }}
                        labelStyle={{ color: isDark ? '#9CA3AF' : '#6B7280' }}
                    />
                    <Bar
                        dataKey="revenue"
                        fill="url(#tealGradient)"
                        radius={[4, 4, 0, 0]}
                        barSize={40}
                    />
                    <defs>
                        <linearGradient id="tealGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#06b6d4" />
                            <stop offset="100%" stopColor="#0f766e" />
                        </linearGradient>
                    </defs>
                </BarChart>
            </ResponsiveContainer>
        </div>
    )
}
