/**
 * Shift Management Page
 * Clock in/out and shift tracking for officers
 */

'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/hooks/useAuth'
import { useShifts } from '@/hooks/useShifts'
import { useRole } from '@/hooks/useRole'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { StatsCardSkeleton, ListSkeleton } from '@/components/ui/Skeleton'
import { toast } from 'sonner'
import {
  Clock,
  Play,
  Square,
  Calendar,
  TrendingUp,
  Ticket,
  DollarSign,
  AlertCircle,
  CheckCircle,
  ChevronRight,
  Timer,
  User,
} from 'lucide-react'

export default function ShiftsPage() {
  const { user, loading: authLoading } = useAuth({ requireAuth: true, redirectTo: '/' })
  const { isManager, loading: roleLoading } = useRole()
  const { activeShift, shiftHistory, isLoading, clockIn, clockOut, isClockingIn, isClockingOut } =
    useShifts()

  const [currentTime, setCurrentTime] = useState(new Date())
  const [shiftDuration, setShiftDuration] = useState('00:00:00')

  // Update current time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  // Calculate shift duration
  useEffect(() => {
    if (activeShift?.clock_in) {
      const calculateDuration = () => {
        const start = new Date(activeShift.clock_in)
        const now = new Date()
        const diff = now - start
        const hours = Math.floor(diff / (1000 * 60 * 60))
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
        const seconds = Math.floor((diff % (1000 * 60)) / 1000)
        setShiftDuration(
          `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds
            .toString()
            .padStart(2, '0')}`
        )
      }
      calculateDuration()
      const timer = setInterval(calculateDuration, 1000)
      return () => clearInterval(timer)
    }
  }, [activeShift])

  const handleClockIn = async () => {
    try {
      await clockIn()
      toast.success('Clocked in successfully!')
    } catch (error) {
      toast.error('Failed to clock in')
    }
  }

  const handleClockOut = async () => {
    try {
      await clockOut()
      toast.success('Clocked out successfully!')
    } catch (error) {
      toast.error('Failed to clock out')
    }
  }

  // Calculate stats from shift history
  const stats = {
    totalShifts: shiftHistory?.length || 0,
    totalHours:
      shiftHistory
        ?.reduce((acc, shift) => {
          if (shift.clock_out) {
            const diff = new Date(shift.clock_out) - new Date(shift.clock_in)
            return acc + diff / (1000 * 60 * 60)
          }
          return acc
        }, 0)
        .toFixed(1) || 0,
    totalTickets: shiftHistory?.reduce((acc, shift) => acc + (shift.tickets_issued || 0), 0) || 0,
    totalRevenue:
      shiftHistory?.reduce((acc, shift) => acc + (shift.revenue_collected || 0), 0) || 0,
  }

  if (authLoading || roleLoading || isLoading) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <StatsCardSkeleton key={i} />
          ))}
        </div>
        <ListSkeleton items={5} />
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground flex items-center gap-3">
            <div className="p-2 bg-teal-500/10 rounded-xl">
              <Clock className="w-6 h-6 text-teal-500" />
            </div>
            Shift Management
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            {currentTime.toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
        </div>
        <div className="text-right">
          <p className="text-3xl font-mono font-bold text-foreground">
            {currentTime.toLocaleTimeString()}
          </p>
        </div>
      </div>

      {/* Clock In/Out Card */}
      <Card className="p-6 sm:p-8">
        <div className="text-center">
          {activeShift ? (
            <>
              {/* Active Shift */}
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/10 text-green-500 rounded-full mb-6">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="font-medium">Shift Active</span>
              </div>

              <p className="text-muted-foreground mb-2">Current Duration</p>
              <p className="text-5xl sm:text-6xl font-mono font-bold text-foreground mb-6">
                {shiftDuration}
              </p>

              <div className="flex justify-center gap-8 mb-8">
                <div className="text-center">
                  <p className="text-2xl font-bold text-foreground">
                    {activeShift.tickets_issued || 0}
                  </p>
                  <p className="text-xs text-muted-foreground">Tickets</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-teal-500">
                    ₹{activeShift.revenue_collected || 0}
                  </p>
                  <p className="text-xs text-muted-foreground">Revenue</p>
                </div>
              </div>

              <Button
                onClick={handleClockOut}
                disabled={isClockingOut}
                className="px-8 py-3 bg-red-500 text-white hover:bg-red-600"
              >
                <Square className="w-5 h-5 mr-2" />
                {isClockingOut ? 'Clocking Out...' : 'Clock Out'}
              </Button>
            </>
          ) : (
            <>
              {/* No Active Shift */}
              <div className="w-24 h-24 mx-auto rounded-full bg-secondary flex items-center justify-center mb-6">
                <Timer className="w-12 h-12 text-muted-foreground" />
              </div>

              <h2 className="text-xl font-semibold text-foreground mb-2">Ready to Start?</h2>
              <p className="text-muted-foreground mb-8">Clock in to begin tracking your shift</p>

              <Button
                onClick={handleClockIn}
                disabled={isClockingIn}
                className="px-8 py-3 bg-teal-500 text-white hover:bg-teal-600"
              >
                <Play className="w-5 h-5 mr-2" />
                {isClockingIn ? 'Clocking In...' : 'Clock In'}
              </Button>
            </>
          )}
        </div>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-violet-500/10 rounded-lg">
              <Calendar className="w-4 h-4 text-violet-500" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Total Shifts</p>
              <p className="text-xl font-bold text-foreground">{stats.totalShifts}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-cyan-500/10 rounded-lg">
              <Clock className="w-4 h-4 text-cyan-500" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Hours Worked</p>
              <p className="text-xl font-bold text-foreground">{stats.totalHours}h</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-500/10 rounded-lg">
              <Ticket className="w-4 h-4 text-amber-500" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Tickets Issued</p>
              <p className="text-xl font-bold text-foreground">{stats.totalTickets}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-500/10 rounded-lg">
              <DollarSign className="w-4 h-4 text-green-500" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Revenue</p>
              <p className="text-xl font-bold text-teal-500">₹{stats.totalRevenue}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Shift History */}
      <Card className="overflow-hidden">
        <div className="p-4 border-b border-border flex items-center justify-between">
          <h2 className="font-semibold text-foreground">Recent Shifts</h2>
          <span className="text-xs text-muted-foreground">Last 10 shifts</span>
        </div>

        {!shiftHistory || shiftHistory.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">
            <Calendar className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No shift history yet</p>
            <p className="text-sm mt-1">Your completed shifts will appear here</p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {shiftHistory.slice(0, 10).map(shift => {
              const clockIn = new Date(shift.clock_in)
              const clockOut = shift.clock_out ? new Date(shift.clock_out) : null
              const duration = clockOut
                ? ((clockOut - clockIn) / (1000 * 60 * 60)).toFixed(1)
                : 'Active'

              return (
                <div
                  key={shift.id}
                  className="p-4 flex items-center justify-between hover:bg-secondary/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`p-2 rounded-lg ${
                        clockOut ? 'bg-green-500/10' : 'bg-amber-500/10'
                      }`}
                    >
                      {clockOut ? (
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-amber-500" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-foreground">
                        {clockIn.toLocaleDateString('en-US', {
                          weekday: 'short',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {clockIn.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        {clockOut &&
                          ` - ${clockOut.toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}`}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6 text-sm">
                    <div className="text-center">
                      <p className="font-medium text-foreground">{duration}h</p>
                      <p className="text-xs text-muted-foreground">Duration</p>
                    </div>
                    <div className="text-center">
                      <p className="font-medium text-foreground">{shift.tickets_issued || 0}</p>
                      <p className="text-xs text-muted-foreground">Tickets</p>
                    </div>
                    <div className="text-center">
                      <p className="font-medium text-teal-500">₹{shift.revenue_collected || 0}</p>
                      <p className="text-xs text-muted-foreground">Revenue</p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </Card>
    </div>
  )
}
