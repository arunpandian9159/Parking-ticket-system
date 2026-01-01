/**
 * Officer Performance Chart
 * Display officer performance metrics
 */

'use client'

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'
import { useTheme } from '@/lib/ThemeContext'
import { Card } from '@/components/ui/Card'
import { Trophy, TrendingUp, Ticket, Clock } from 'lucide-react'

export function OfficerPerformanceChart({ data = [] }) {
  const { theme } = useTheme()
  const isDark = theme === 'dark'

  if (!data || data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-muted-foreground bg-secondary/50 rounded-xl border border-dashed border-border">
        No performance data available
      </div>
    )
  }

  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 10, right: 30, left: 60, bottom: 10 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            horizontal={true}
            vertical={false}
            stroke={isDark ? '#374151' : '#e5e7eb'}
          />
          <XAxis
            type="number"
            axisLine={false}
            tickLine={false}
            tick={{ fill: isDark ? '#9CA3AF' : '#6B7280', fontSize: 11 }}
          />
          <YAxis
            type="category"
            dataKey="name"
            axisLine={false}
            tickLine={false}
            tick={{ fill: isDark ? '#9CA3AF' : '#6B7280', fontSize: 11 }}
            width={50}
          />
          <Tooltip
            contentStyle={{
              borderRadius: '8px',
              border: isDark ? '1px solid #374151' : '1px solid #e5e7eb',
              backgroundColor: isDark ? '#1f2937' : '#ffffff',
              color: isDark ? '#fff' : '#1f2937',
            }}
          />
          <Legend />
          <Bar dataKey="tickets" fill="#06b6d4" name="Tickets Issued" radius={[0, 4, 4, 0]} />
          <Bar dataKey="revenue" fill="#8b5cf6" name="Revenue (₹)" radius={[0, 4, 4, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

/**
 * Officer Leaderboard Component
 */
export function OfficerLeaderboard({ officers = [] }) {
  if (officers.length === 0) {
    return <div className="text-center text-muted-foreground py-8">No officer data available</div>
  }

  const sortedOfficers = [...officers].sort((a, b) => b.tickets - a.tickets)

  return (
    <div className="space-y-3">
      {sortedOfficers.map((officer, index) => (
        <div
          key={officer.id || index}
          className={`flex items-center gap-4 p-3 rounded-xl transition-colors ${
            index === 0
              ? 'bg-amber-500/10 border border-amber-500/30'
              : index === 1
              ? 'bg-gray-500/10 border border-gray-500/30'
              : index === 2
              ? 'bg-orange-500/10 border border-orange-500/30'
              : 'bg-secondary'
          }`}
        >
          {/* Rank */}
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
              index === 0
                ? 'bg-amber-500 text-white'
                : index === 1
                ? 'bg-gray-400 text-white'
                : index === 2
                ? 'bg-orange-600 text-white'
                : 'bg-secondary text-muted-foreground'
            }`}
          >
            {index < 3 ? <Trophy className="w-4 h-4" /> : index + 1}
          </div>

          {/* Officer Name */}
          <div className="flex-1">
            <p className="font-medium text-foreground">{officer.name}</p>
            <p className="text-xs text-muted-foreground">{officer.shifts || 0} shifts this month</p>
          </div>

          {/* Stats */}
          <div className="text-right">
            <p className="font-bold text-foreground">{officer.tickets} tickets</p>
            <p className="text-xs text-teal-500">₹{officer.revenue}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

/**
 * Performance Stats Cards
 */
export function PerformanceStats({ stats = {} }) {
  const items = [
    {
      icon: Ticket,
      label: 'Avg Tickets/Day',
      value: stats.avgTicketsPerDay || 0,
      color: 'teal',
    },
    {
      icon: TrendingUp,
      label: 'Avg Revenue/Day',
      value: `₹${stats.avgRevenuePerDay || 0}`,
      color: 'violet',
    },
    {
      icon: Clock,
      label: 'Avg Duration',
      value: `${stats.avgDuration || 0} hrs`,
      color: 'amber',
    },
    {
      icon: Trophy,
      label: 'Top Performer',
      value: stats.topPerformer || '-',
      color: 'cyan',
    },
  ]

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
      {items.map((item, i) => {
        const Icon = item.icon
        return (
          <Card key={i} className="p-4">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg bg-${item.color}-500/10`}>
                <Icon className={`w-4 h-4 text-${item.color}-500`} />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">{item.label}</p>
                <p className="font-bold text-foreground">{item.value}</p>
              </div>
            </div>
          </Card>
        )
      })}
    </div>
  )
}
