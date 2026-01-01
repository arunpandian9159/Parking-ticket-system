/**
 * Heatmap Chart
 * Peak hours analysis visualization
 */

'use client'

import { useTheme } from '@/lib/ThemeContext'

const HOURS = ['12AM', '3AM', '6AM', '9AM', '12PM', '3PM', '6PM', '9PM']
const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

export function HeatmapChart({ data = [] }) {
  const { theme } = useTheme()
  const isDark = theme === 'dark'

  // Generate sample data if none provided
  const heatmapData = data.length > 0 ? data : generateSampleData()

  // Find max value for scaling
  const maxValue = Math.max(...heatmapData.flatMap(row => row.values))

  const getColor = value => {
    const intensity = value / maxValue
    if (intensity === 0) return isDark ? '#1f2937' : '#f3f4f6'
    if (intensity < 0.25) return isDark ? '#134e4a' : '#ccfbf1'
    if (intensity < 0.5) return isDark ? '#0f766e' : '#5eead4'
    if (intensity < 0.75) return isDark ? '#0d9488' : '#14b8a6'
    return '#06b6d4'
  }

  return (
    <div className="w-full overflow-x-auto">
      <div className="min-w-[500px]">
        {/* Hour labels */}
        <div className="flex items-center gap-1 mb-2 pl-12">
          {HOURS.map(hour => (
            <div key={hour} className="flex-1 text-xs text-muted-foreground text-center">
              {hour}
            </div>
          ))}
        </div>

        {/* Grid */}
        <div className="space-y-1">
          {heatmapData.map((row, rowIndex) => (
            <div key={row.day} className="flex items-center gap-1">
              {/* Day label */}
              <div className="w-10 text-xs text-muted-foreground text-right pr-2">{row.day}</div>

              {/* Cells */}
              {row.values.map((value, colIndex) => (
                <div
                  key={colIndex}
                  className="flex-1 h-8 rounded-md cursor-pointer transition-all hover:ring-2 hover:ring-teal-500/50 group relative"
                  style={{ backgroundColor: getColor(value) }}
                  title={`${row.day} ${HOURS[colIndex]}: ${value} tickets`}
                >
                  {/* Tooltip */}
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-card border border-border rounded text-xs text-foreground whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 shadow-lg">
                    {value} tickets
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center gap-2 mt-4">
          <span className="text-xs text-muted-foreground">Less</span>
          <div className="flex gap-1">
            {[0, 0.25, 0.5, 0.75, 1].map((intensity, i) => (
              <div
                key={i}
                className="w-6 h-4 rounded"
                style={{ backgroundColor: getColor(intensity * maxValue) }}
              />
            ))}
          </div>
          <span className="text-xs text-muted-foreground">More</span>
        </div>
      </div>
    </div>
  )
}

function generateSampleData() {
  return DAYS.map(day => ({
    day,
    values: HOURS.map(() => Math.floor(Math.random() * 50)),
  }))
}

/**
 * Compact heatmap for dashboard widgets
 */
export function MiniHeatmap({ data = [], title = 'Peak Hours' }) {
  const heatmapData = data.length > 0 ? data : generateSampleData().slice(0, 3)
  const maxValue = Math.max(...heatmapData.flatMap(row => row.values), 1)

  const getColor = value => {
    const intensity = value / maxValue
    if (intensity < 0.33) return 'bg-teal-500/20'
    if (intensity < 0.66) return 'bg-teal-500/50'
    return 'bg-teal-500'
  }

  return (
    <div className="space-y-2">
      <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{title}</h4>
      <div className="space-y-1">
        {heatmapData.map(row => (
          <div key={row.day} className="flex items-center gap-1">
            <span className="w-8 text-[10px] text-muted-foreground">{row.day}</span>
            <div className="flex gap-0.5 flex-1">
              {row.values.map((value, i) => (
                <div
                  key={i}
                  className={`flex-1 h-3 rounded-sm ${getColor(value)}`}
                  title={`${value} tickets`}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
