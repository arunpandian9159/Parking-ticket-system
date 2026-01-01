/**
 * Vehicle Distribution Chart
 * Pie chart showing vehicle type distribution
 */

'use client'

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts'
import { useTheme } from '@/lib/ThemeContext'
import { Car, Bike, Truck } from 'lucide-react'

const COLORS = {
  Car: '#06b6d4', // cyan-500
  Bike: '#8b5cf6', // violet-500
  Truck: '#f59e0b', // amber-500
  Other: '#6b7280', // gray-500
}

const ICONS = {
  Car: Car,
  Bike: Bike,
  Truck: Truck,
}

export function VehicleDistributionChart({ data = [] }) {
  const { theme } = useTheme()
  const isDark = theme === 'dark'

  if (!data || data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-muted-foreground bg-secondary/50 rounded-xl border border-dashed border-border">
        No vehicle data available
      </div>
    )
  }

  const chartData = data.map(item => ({
    ...item,
    color: COLORS[item.name] || COLORS.Other,
  }))

  const total = chartData.reduce((sum, item) => sum + item.value, 0)

  return (
    <div className="h-80 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            paddingAngle={2}
            dataKey="value"
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            labelLine={false}
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              borderRadius: '8px',
              border: isDark ? '1px solid #374151' : '1px solid #e5e7eb',
              backgroundColor: isDark ? '#1f2937' : '#ffffff',
              color: isDark ? '#fff' : '#1f2937',
            }}
            formatter={value => [`${value} vehicles`, 'Count']}
          />
          <Legend
            verticalAlign="bottom"
            height={36}
            formatter={value => <span className="text-foreground text-sm">{value}</span>}
          />
        </PieChart>
      </ResponsiveContainer>

      {/* Stats below chart */}
      <div className="flex justify-center gap-6 mt-4">
        {chartData.map(item => {
          const Icon = ICONS[item.name] || Car
          const percentage = ((item.value / total) * 100).toFixed(1)
          return (
            <div key={item.name} className="text-center">
              <div
                className="w-10 h-10 mx-auto rounded-lg flex items-center justify-center mb-1"
                style={{ backgroundColor: `${item.color}20` }}
              >
                <Icon className="w-5 h-5" style={{ color: item.color }} />
              </div>
              <p className="text-xs text-muted-foreground">{item.name}</p>
              <p className="font-bold text-foreground">{item.value}</p>
            </div>
          )
        })}
      </div>
    </div>
  )
}
