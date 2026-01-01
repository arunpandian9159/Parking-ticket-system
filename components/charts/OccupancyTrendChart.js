/**
 * Occupancy Trend Chart
 * Line chart for occupancy rate over time
 */

'use client'

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from 'recharts'
import { useTheme } from '@/lib/ThemeContext'

export function OccupancyTrendChart({ data = [] }) {
  const { theme } = useTheme()
  const isDark = theme === 'dark'

  if (!data || data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-muted-foreground bg-secondary/50 rounded-xl border border-dashed border-border">
        No occupancy data available
      </div>
    )
  }

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="occupancyGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#06b6d4" stopOpacity={0.3} />
              <stop offset="100%" stopColor="#06b6d4" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid
            strokeDasharray="3 3"
            vertical={false}
            stroke={isDark ? '#374151' : '#e5e7eb'}
          />
          <XAxis
            dataKey="time"
            axisLine={false}
            tickLine={false}
            tick={{ fill: isDark ? '#9CA3AF' : '#6B7280', fontSize: 11 }}
            dy={10}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: isDark ? '#9CA3AF' : '#6B7280', fontSize: 11 }}
            dx={-10}
            tickFormatter={value => `${value}%`}
            domain={[0, 100]}
          />
          <Tooltip
            contentStyle={{
              borderRadius: '8px',
              border: isDark ? '1px solid #374151' : '1px solid #e5e7eb',
              backgroundColor: isDark ? '#1f2937' : '#ffffff',
              color: isDark ? '#fff' : '#1f2937',
            }}
            formatter={value => [`${value}%`, 'Occupancy']}
          />
          <Area
            type="monotone"
            dataKey="occupancy"
            stroke="#06b6d4"
            strokeWidth={2}
            fill="url(#occupancyGradient)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}

/**
 * Revenue Comparison Chart
 * Compare revenue across different time periods
 */
export function RevenueComparisonChart({ data = [] }) {
  const { theme } = useTheme()
  const isDark = theme === 'dark'

  if (!data || data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-muted-foreground bg-secondary/50 rounded-xl border border-dashed border-border">
        No revenue data available
      </div>
    )
  }

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <CartesianGrid
            strokeDasharray="3 3"
            vertical={false}
            stroke={isDark ? '#374151' : '#e5e7eb'}
          />
          <XAxis
            dataKey="period"
            axisLine={false}
            tickLine={false}
            tick={{ fill: isDark ? '#9CA3AF' : '#6B7280', fontSize: 11 }}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: isDark ? '#9CA3AF' : '#6B7280', fontSize: 11 }}
            tickFormatter={value => `₹${value / 1000}k`}
          />
          <Tooltip
            contentStyle={{
              borderRadius: '8px',
              border: isDark ? '1px solid #374151' : '1px solid #e5e7eb',
              backgroundColor: isDark ? '#1f2937' : '#ffffff',
              color: isDark ? '#fff' : '#1f2937',
            }}
            formatter={(value, name) => [`₹${value}`, name]}
          />
          <Line
            type="monotone"
            dataKey="current"
            stroke="#06b6d4"
            strokeWidth={2}
            dot={{ fill: '#06b6d4', r: 4 }}
            name="This Period"
          />
          <Line
            type="monotone"
            dataKey="previous"
            stroke="#8b5cf6"
            strokeWidth={2}
            strokeDasharray="5 5"
            dot={{ fill: '#8b5cf6', r: 4 }}
            name="Last Period"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
