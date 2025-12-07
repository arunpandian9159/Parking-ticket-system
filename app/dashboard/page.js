'use client'

import Link from 'next/link'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { FadeIn, SpotlightCard } from '@/components/ui/ReactBits'
import {
    UserCog, Shield, ArrowRight, Car, CreditCard,
    Activity, ChevronRight, Sparkles, Zap, Calendar,
    Users, BarChart3, Ticket, ParkingCircle, Bell, Settings
} from 'lucide-react'
import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

// Animated Counter Component
function AnimatedCounter({ end, duration = 2000, suffix = '', prefix = '' }) {
    const [count, setCount] = useState(0)
    const countRef = useRef(null)
    const [isVisible, setIsVisible] = useState(false)

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true)
                }
            },
            { threshold: 0.1 }
        )

        if (countRef.current) {
            observer.observe(countRef.current)
        }

        return () => observer.disconnect()
    }, [])

    useEffect(() => {
        if (!isVisible) return

        let startTime
        const animate = (currentTime) => {
            if (!startTime) startTime = currentTime
            const progress = Math.min((currentTime - startTime) / duration, 1)
            setCount(Math.floor(progress * end))
            if (progress < 1) {
                requestAnimationFrame(animate)
            }
        }
        requestAnimationFrame(animate)
    }, [isVisible, end, duration])

    return (
        <span ref={countRef} className="tabular-nums">
            {prefix}{count.toLocaleString()}{suffix}
        </span>
    )
}

// Time-based greeting
function getGreeting() {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good Morning'
    if (hour < 17) return 'Good Afternoon'
    return 'Good Evening'
}

// Role Card Component
function RoleCard({ href, icon: Icon, title, description, color, features }) {
    const colorClasses = {
        teal: {
            bg: 'bg-teal-500/10',
            bgHover: 'group-hover:bg-teal-500/20',
            text: 'text-teal-500',
            border: 'hover:border-teal-500/30',
            shadow: 'hover:shadow-teal-500/10',
            gradient: 'from-teal-500 to-emerald-400',
            spotlight: 'rgba(20, 184, 166, 0.15)'
        },
        cyan: {
            bg: 'bg-cyan-500/10',
            bgHover: 'group-hover:bg-cyan-500/20',
            text: 'text-cyan-500',
            border: 'hover:border-cyan-500/30',
            shadow: 'hover:shadow-cyan-500/10',
            gradient: 'from-cyan-500 to-blue-400',
            spotlight: 'rgba(6, 182, 212, 0.15)'
        }
    }

    const styles = colorClasses[color]

    return (
        <Link href={href} className="group block h-full">
            <SpotlightCard
                className={`h-full transition-all duration-300 ${styles.border} ${styles.shadow} hover:shadow-xl cursor-pointer`}
                spotlightColor={styles.spotlight}
            >
                <div className="p-8 flex flex-col h-full relative z-10">
                    {/* Icon with animated gradient background */}
                    <div className="relative mb-6">
                        <div className={`absolute inset-0 bg-linear-to-br ${styles.gradient} rounded-2xl blur-xl opacity-0 group-hover:opacity-50 transition-opacity duration-500`} />
                        <div className={`relative w-20 h-20 ${styles.bg} ${styles.bgHover} rounded-2xl flex items-center justify-center transition-all duration-300 group-hover:scale-110`}>
                            <Icon className={`w-10 h-10 ${styles.text}`} />
                        </div>
                    </div>

                    {/* Title */}
                    <h2 className="text-2xl font-bold text-foreground mb-3">{title}</h2>

                    {/* Description */}
                    <p className="text-muted-foreground mb-6 flex-1 leading-relaxed">
                        {description}
                    </p>

                    {/* Features list */}
                    <ul className="space-y-2 mb-6">
                        {features.map((feature, index) => (
                            <li key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
                                <div className={`w-1.5 h-1.5 rounded-full bg-linear-to-r ${styles.gradient}`} />
                                {feature}
                            </li>
                        ))}
                    </ul>

                    {/* CTA */}
                    <div className={`${styles.text} font-semibold flex items-center gap-2 group-hover:gap-3 transition-all duration-300`}>
                        Enter {title.split(' ')[0]}
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </div>
                </div>
            </SpotlightCard>
        </Link>
    )
}

// Quick Stat Card
function QuickStatCard({ icon: Icon, label, value, suffix = '', trend, trendUp = true, color }) {
    const colorClasses = {
        teal: 'from-teal-500/20 to-teal-500/5 border-teal-500/20',
        cyan: 'from-cyan-500/20 to-cyan-500/5 border-cyan-500/20',
        emerald: 'from-emerald-500/20 to-emerald-500/5 border-emerald-500/20',
        amber: 'from-amber-500/20 to-amber-500/5 border-amber-500/20'
    }

    const iconColors = {
        teal: 'text-teal-500',
        cyan: 'text-cyan-500',
        emerald: 'text-emerald-500',
        amber: 'text-amber-500'
    }

    return (
        <div className={`bg-linear-to-br ${colorClasses[color]} border rounded-xl p-5 hover:scale-[1.02] transition-transform duration-300`}>
            <div className="flex items-center justify-between mb-3">
                <span className="text-muted-foreground text-sm font-medium">{label}</span>
                <Icon className={`w-5 h-5 ${iconColors[color]}`} />
            </div>
            <p className="text-2xl font-bold text-foreground mb-1">
                <AnimatedCounter end={value} suffix={suffix} duration={1500} />
            </p>
            {trend && (
                <p className={`text-xs ${trendUp ? 'text-emerald-500' : 'text-red-500'}`}>
                    {trendUp ? '↑' : '↓'} {trend}
                </p>
            )}
        </div>
    )
}

// Activity Item Component
function ActivityItem({ icon: Icon, title, time, color }) {
    const bgColors = {
        teal: 'bg-teal-500/10',
        cyan: 'bg-cyan-500/10',
        emerald: 'bg-emerald-500/10',
        amber: 'bg-amber-500/10'
    }

    const textColors = {
        teal: 'text-teal-500',
        cyan: 'text-cyan-500',
        emerald: 'text-emerald-500',
        amber: 'text-amber-500'
    }

    return (
        <div className="flex items-center gap-4 p-3 rounded-lg hover:bg-secondary/50 transition-colors group cursor-pointer">
            <div className={`w-10 h-10 rounded-xl ${bgColors[color]} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                <Icon className={`w-5 h-5 ${textColors[color]}`} />
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{title}</p>
                <p className="text-xs text-muted-foreground">{time}</p>
            </div>
            <ChevronRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
    )
}

// Quick Action Button
function QuickAction({ icon: Icon, label, href, color = 'teal' }) {
    const colorClasses = {
        teal: 'hover:bg-teal-500/10 hover:border-teal-500/30 hover:text-teal-500',
        cyan: 'hover:bg-cyan-500/10 hover:border-cyan-500/30 hover:text-cyan-500'
    }

    return (
        <Link href={href}>
            <button className={`w-full flex items-center gap-3 p-4 rounded-xl border border-border bg-card/50 text-muted-foreground ${colorClasses[color]} transition-all duration-300 group`}>
                <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Icon className="w-5 h-5" />
                </div>
                <span className="font-medium text-sm">{label}</span>
                <ArrowRight className="w-4 h-4 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
        </Link>
    )
}

export default function ChoiceDashboard() {
    const router = useRouter()
    const [loading, setLoading] = useState(true)
    const [user, setUser] = useState(null)
    const [currentTime, setCurrentTime] = useState(new Date())

    useEffect(() => {
        const checkUser = async () => {
            const { data: { session } } = await supabase.auth.getSession()
            if (!session) {
                router.push('/')
            } else {
                setUser(session.user)
            }
            setLoading(false)
        }
        checkUser()
    }, [router])

    // Update time every minute
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date())
        }, 60000)
        return () => clearInterval(timer)
    }, [])

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-linear-to-br from-teal-500 to-cyan-600 animate-pulse" />
                    <div className="h-4 w-32 bg-secondary rounded-full animate-pulse" />
                </div>
            </div>
        )
    }

    const stats = [
        { icon: Car, label: 'Active Vehicles', value: 42, color: 'teal', trend: '+8 today' },
        { icon: CreditCard, label: "Today's Revenue", value: 24500, suffix: '', color: 'cyan', trend: '+12% vs yesterday', prefix: '₹' },
        { icon: Ticket, label: 'Tickets Issued', value: 156, color: 'emerald', trend: '+23 today' },
        { icon: ParkingCircle, label: 'Available Slots', value: 18, color: 'amber' }
    ]

    const recentActivity = [
        { icon: Car, title: 'Vehicle TN01AB1234 checked in', time: '2 minutes ago', color: 'teal' },
        { icon: CreditCard, title: 'Payment received - ₹150', time: '5 minutes ago', color: 'cyan' },
        { icon: Ticket, title: 'Ticket #4521 issued', time: '12 minutes ago', color: 'emerald' },
        { icon: Activity, title: 'Vehicle TN02CD5678 checked out', time: '18 minutes ago', color: 'amber' }
    ]

    const formattedDate = currentTime.toLocaleDateString('en-IN', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    })

    const userName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User'

    return (
        <div className="min-h-screen bg-background pb-12">
            {/* Background decoration */}
            <div className="fixed inset-0 -z-10 overflow-hidden">
                <div className="absolute top-0 right-0 w-[800px] h-[800px] rounded-full bg-teal-500/5 blur-[120px]" />
                <div className="absolute bottom-0 left-0 w-[600px] h-[600px] rounded-full bg-cyan-500/5 blur-[120px]" />
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
                {/* Welcome Section */}
                <FadeIn className="mb-10">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/20">
                                    <Sparkles className="w-4 h-4 text-teal-500" />
                                    <span className="text-xs font-medium text-teal-500">Dashboard</span>
                                </div>
                            </div>
                            <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">
                                {getGreeting()}, <span className="bg-linear-to-r from-teal-400 to-cyan-400 bg-clip-text text-transparent">{userName}</span>!
                            </h1>
                            <p className="text-muted-foreground flex items-center gap-2">
                                <Calendar className="w-4 h-4" />
                                {formattedDate}
                            </p>
                        </div>
                        <div className="flex items-center gap-3">
                            <Button
                                variant="outline"
                                className="border-border hover:border-teal-500/30 hover:bg-teal-500/10"
                            >
                                <Bell className="w-4 h-4 mr-2" />
                                Notifications
                            </Button>
                            <Button
                                variant="outline"
                                className="border-border hover:border-cyan-500/30 hover:bg-cyan-500/10"
                            >
                                <Settings className="w-4 h-4 mr-2" />
                                Settings
                            </Button>
                        </div>
                    </div>
                </FadeIn>

                {/* Quick Stats */}
                <FadeIn delay={0.1} className="mb-10">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        {stats.map((stat, index) => (
                            <QuickStatCard key={index} {...stat} />
                        ))}
                    </div>
                </FadeIn>

                {/* Main Content Grid */}
                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Role Selection Cards */}
                    <FadeIn delay={0.2} className="lg:col-span-2">
                        <div className="mb-6">
                            <h2 className="text-xl font-semibold text-foreground mb-1">Select Your Workspace</h2>
                            <p className="text-sm text-muted-foreground">Choose a portal based on your role and tasks</p>
                        </div>
                        <div className="grid md:grid-cols-2 gap-6">
                            <RoleCard
                                href="/officer"
                                icon={UserCog}
                                title="Officer Portal"
                                description="Manage day-to-day parking operations with powerful tools for field staff."
                                color="teal"
                                features={[
                                    'Issue & manage tickets',
                                    'Vehicle entry/exit tracking',
                                    'Parking slot management',
                                    'Payment processing'
                                ]}
                            />
                            <RoleCard
                                href="/admin/analytics"
                                icon={Shield}
                                title="Admin Console"
                                description="Access administrative controls and analytics for strategic decision making."
                                color="cyan"
                                features={[
                                    'Revenue analytics',
                                    'Rate configuration',
                                    'Monthly passes',
                                    'Staff management'
                                ]}
                            />
                        </div>
                    </FadeIn>

                    {/* Sidebar */}
                    <FadeIn delay={0.3} className="space-y-6">
                        {/* Quick Actions */}
                        <Card className="p-6">
                            <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                                <Zap className="w-5 h-5 text-teal-500" />
                                Quick Actions
                            </h3>
                            <div className="space-y-3">
                                <QuickAction icon={Ticket} label="Issue New Ticket" href="/officer" color="teal" />
                                <QuickAction icon={BarChart3} label="View Analytics" href="/admin/analytics" color="cyan" />
                                <QuickAction icon={Users} label="Manage Passes" href="/passes" color="teal" />
                            </div>
                        </Card>

                        {/* Recent Activity */}
                        <Card className="p-6">
                            <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                                <Activity className="w-5 h-5 text-cyan-500" />
                                Recent Activity
                            </h3>
                            <div className="space-y-1">
                                {recentActivity.map((item, index) => (
                                    <ActivityItem key={index} {...item} />
                                ))}
                            </div>
                            <button className="w-full mt-4 text-sm text-teal-500 hover:text-teal-400 font-medium flex items-center justify-center gap-1 transition-colors">
                                View all activity
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        </Card>

                        {/* System Status */}
                        <Card className="p-6 bg-linear-to-br from-teal-500/5 to-cyan-500/5">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
                                <span className="text-sm font-medium text-foreground">System Status</span>
                            </div>
                            <p className="text-xs text-muted-foreground mb-2">All systems operational</p>
                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                <span className="flex items-center gap-1">
                                    <div className="w-2 h-2 rounded-full bg-emerald-500" />
                                    API
                                </span>
                                <span className="flex items-center gap-1">
                                    <div className="w-2 h-2 rounded-full bg-emerald-500" />
                                    Database
                                </span>
                                <span className="flex items-center gap-1">
                                    <div className="w-2 h-2 rounded-full bg-emerald-500" />
                                    Payments
                                </span>
                            </div>
                        </Card>
                    </FadeIn>
                </div>
            </div>
        </div>
    )
}
