'use client'

import Link from 'next/link'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { FadeIn, SpotlightCard } from '@/components/ui/ReactBits'
import {
    UserCog, Shield, ArrowRight, Car, CreditCard,
    Activity, ChevronRight, Sparkles, Zap, Calendar,
    Users, BarChart3, Ticket, ParkingCircle, Bell, Settings,
    X, Moon, Sun, User, Mail, LogOut, Check, Smartphone
} from 'lucide-react'
import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { useTheme } from '@/lib/ThemeContext'

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
                <div className="p-4 sm:p-6 lg:p-8 flex flex-col h-full relative z-10">
                    {/* Icon with animated gradient background */}
                    <div className="relative mb-4 sm:mb-6">
                        <div className={`absolute inset-0 bg-linear-to-br ${styles.gradient} rounded-2xl blur-xl opacity-0 group-hover:opacity-50 transition-opacity duration-500`} />
                        <div className={`relative w-14 h-14 sm:w-16 sm:h-16 lg:w-20 lg:h-20 ${styles.bg} ${styles.bgHover} rounded-xl sm:rounded-2xl flex items-center justify-center transition-all duration-300 group-hover:scale-110`}>
                            <Icon className={`w-7 h-7 sm:w-8 sm:h-8 lg:w-10 lg:h-10 ${styles.text}`} />
                        </div>
                    </div>

                    {/* Title */}
                    <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-foreground mb-2 sm:mb-3">{title}</h2>

                    {/* Description */}
                    <p className="text-xs sm:text-sm text-muted-foreground mb-4 sm:mb-6 flex-1 leading-relaxed">
                        {description}
                    </p>

                    {/* Features list */}
                    <ul className="space-y-1.5 sm:space-y-2 mb-4 sm:mb-6">
                        {features.map((feature, index) => (
                            <li key={index} className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
                                <div className={`w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-linear-to-r ${styles.gradient}`} />
                                {feature}
                            </li>
                        ))}
                    </ul>

                    {/* CTA */}
                    <div className={`${styles.text} font-semibold text-sm sm:text-base flex items-center gap-2 group-hover:gap-3 transition-all duration-300`}>
                        Enter {title.split(' ')[0]}
                        <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
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
        <div className={`bg-linear-to-br ${colorClasses[color]} border rounded-xl p-3 sm:p-4 lg:p-5 hover:scale-[1.02] transition-transform duration-300`}>
            <div className="flex items-center justify-between mb-2 sm:mb-3">
                <span className="text-muted-foreground text-xs sm:text-sm font-medium">{label}</span>
                <Icon className={`w-4 h-4 sm:w-5 sm:h-5 ${iconColors[color]}`} />
            </div>
            <p className="text-lg sm:text-xl lg:text-2xl font-bold text-foreground mb-0.5 sm:mb-1">
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
        <div className="flex items-center gap-3 sm:gap-4 p-2 sm:p-3 rounded-lg hover:bg-secondary/50 transition-colors group cursor-pointer">
            <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl ${bgColors[color]} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                <Icon className={`w-4 h-4 sm:w-5 sm:h-5 ${textColors[color]}`} />
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm font-medium text-foreground truncate">{title}</p>
                <p className="text-[10px] sm:text-xs text-muted-foreground">{time}</p>
            </div>
            <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
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
            <button className={`w-full flex items-center gap-2 sm:gap-3 p-3 sm:p-4 rounded-xl border border-border bg-card/50 text-muted-foreground ${colorClasses[color]} transition-all duration-300 group`}>
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-secondary flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <span className="font-medium text-xs sm:text-sm">{label}</span>
                <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
        </Link>
    )
}

// Settings Modal Component
function SettingsModal({ isOpen, onClose, user }) {
    const router = useRouter()
    const { theme, toggleTheme } = useTheme()
    const [activeTab, setActiveTab] = useState('general')
    const [notifications, setNotifications] = useState({
        email: true,
        push: true,
        summary: false
    })

    if (!isOpen) return null

    const tabs = [
        { id: 'general', label: 'General', icon: Settings },
        { id: 'notifications', label: 'Notifications', icon: Bell },
        { id: 'account', label: 'Account', icon: User },
    ]

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
            <div className="w-full max-w-2xl bg-card border border-border rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="flex items-center justify-between p-4 sm:p-6 border-b border-border bg-secondary/30">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                        <Settings className="w-5 h-5 text-teal-500" />
                        Settings
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-full hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="flex flex-col sm:flex-row h-[500px] sm:h-[400px]">
                    {/* Sidebar */}
                    <div className="w-full sm:w-48 border-b sm:border-b-0 sm:border-r border-border bg-secondary/10 p-2 sm:p-4 gap-1 flex sm:flex-col overflow-x-auto sm:overflow-visible">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap
                                    ${activeTab === tab.id
                                        ? 'bg-teal-500/10 text-teal-500 shadow-xs'
                                        : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
                                    }`}
                            >
                                <tab.icon className="w-4 h-4" />
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    {/* Content */}
                    <div className="flex-1 p-4 sm:p-6 overflow-y-auto">
                        {activeTab === 'general' && (
                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-lg font-semibold mb-4">Appearance</h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        <button
                                            onClick={() => theme === 'light' && toggleTheme()}
                                            className={`p-4 rounded-xl border-2 transition-all duration-200 flex flex-col items-center gap-3
                                                ${theme === 'dark'
                                                    ? 'border-teal-500 bg-teal-500/5'
                                                    : 'border-border hover:border-border/80'
                                                }`}
                                        >
                                            <div className="w-full aspect-video rounded-lg bg-[#0f172a] border border-slate-700/50 relative overflow-hidden group">
                                                <div className="absolute inset-0 bg-linear-to-br from-teal-500/10 to-transparent opacity-50" />
                                                <div className="absolute top-2 left-2 w-16 h-4 bg-slate-800 rounded-md" />
                                                <div className="absolute top-8 left-2 right-2 bottom-2 bg-slate-900/50 rounded-md" />
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Moon className={`w-4 h-4 ${theme === 'dark' ? 'text-teal-500' : 'text-muted-foreground'}`} />
                                                <span className={`text-sm font-medium ${theme === 'dark' && 'text-teal-500'}`}>Dark Mode</span>
                                            </div>
                                        </button>

                                        <button
                                            onClick={() => theme === 'dark' && toggleTheme()}
                                            className={`p-4 rounded-xl border-2 transition-all duration-200 flex flex-col items-center gap-3
                                                ${theme === 'light'
                                                    ? 'border-teal-500 bg-teal-500/5'
                                                    : 'border-border hover:border-border/80'
                                                }`}
                                        >
                                            <div className="w-full aspect-video rounded-lg bg-white border border-slate-200 relative overflow-hidden group">
                                                <div className="absolute inset-0 bg-linear-to-br from-teal-500/5 to-transparent opacity-50" />
                                                <div className="absolute top-2 left-2 w-16 h-4 bg-slate-100 rounded-md" />
                                                <div className="absolute top-8 left-2 right-2 bottom-2 bg-slate-50 rounded-md" />
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Sun className={`w-4 h-4 ${theme === 'light' ? 'text-teal-500' : 'text-muted-foreground'}`} />
                                                <span className={`text-sm font-medium ${theme === 'light' && 'text-teal-500'}`}>Light Mode</span>
                                            </div>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'notifications' && (
                            <div className="space-y-6">
                                <h3 className="text-lg font-semibold mb-4">Notification Preferences</h3>
                                <div className="space-y-4">
                                    {[
                                        { id: 'email', label: 'Email Notifications', desc: 'Receive updates via email', icon: Mail },
                                        { id: 'push', label: 'Push Notifications', desc: 'Receive notifications on your device', icon: Smartphone },
                                        { id: 'summary', label: 'Weekly Summary', desc: 'Get a weekly report of your activity', icon: Calendar }
                                    ].map((item) => (
                                        <div key={item.id} className="flex items-center justify-between p-4 rounded-xl border border-border bg-card">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-muted-foreground">
                                                    <item.icon className="w-5 h-5" />
                                                </div>
                                                <div>
                                                    <p className="font-medium text-sm sm:text-base">{item.label}</p>
                                                    <p className="text-xs text-muted-foreground">{item.desc}</p>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => setNotifications(prev => ({ ...prev, [item.id]: !prev[item.id] }))}
                                                className={`w-12 h-6 rounded-full transition-colors duration-200 relative ${notifications[item.id] ? 'bg-teal-500' : 'bg-secondary'}`}
                                            >
                                                <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform duration-200 shadow-sm ${notifications[item.id] ? 'left-7' : 'left-1'}`} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {activeTab === 'account' && (
                            <div className="space-y-6">
                                <h3 className="text-lg font-semibold mb-4">Account Information</h3>
                                <div className="p-4 rounded-xl border border-border bg-card space-y-4">
                                    <div className="flex items-center gap-4">
                                        <div className="w-16 h-16 rounded-full bg-teal-500/10 flex items-center justify-center text-teal-500 text-2xl font-bold">
                                            {user?.email?.[0].toUpperCase()}
                                        </div>
                                        <div>
                                            <p className="font-semibold text-lg">{user?.user_metadata?.full_name || 'User'}</p>
                                            <p className="text-muted-foreground text-sm">{user?.email}</p>
                                            <div className="mt-2 inline-flex items-center px-2 py-1 rounded-full bg-emerald-500/10 text-emerald-500 text-xs font-medium border border-emerald-500/20">
                                                <Check className="w-3 h-3 mr-1" />
                                                Active Account
                                            </div>
                                        </div>
                                    </div>
                                    <div className="pt-4 border-t border-border">
                                        <button
                                            onClick={async () => {
                                                await supabase.auth.signOut()
                                                router.push('/')
                                            }}
                                            className="text-red-500 hover:text-red-400 text-sm font-medium flex items-center gap-2 transition-colors"
                                        >
                                            <LogOut className="w-4 h-4" />
                                            Sign Out
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
                {/* Footer */}
                <div className="p-4 border-t border-border bg-secondary/30 flex justify-end">
                    <Button onClick={onClose} className="bg-teal-500 hover:bg-teal-600">
                        Done
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default function ChoiceDashboard() {
    const router = useRouter()
    const [loading, setLoading] = useState(true)
    const [user, setUser] = useState(null)
    const [currentTime, setCurrentTime] = useState(new Date())
    const [showSettings, setShowSettings] = useState(false)

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
        <div className="min-h-screen bg-background pb-8 sm:pb-12 overflow-x-hidden">
            <SettingsModal isOpen={showSettings} onClose={() => setShowSettings(false)} user={user} />
            {/* Background decoration */}
            <div className="fixed inset-0 -z-10 overflow-hidden">
                <div className="absolute top-0 right-0 w-[400px] sm:w-[800px] h-[400px] sm:h-[800px] rounded-full bg-teal-500/5 blur-[120px]" />
                <div className="absolute bottom-0 left-0 w-[300px] sm:w-[600px] h-[300px] sm:h-[600px] rounded-full bg-cyan-500/5 blur-[120px]" />
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-8">
                {/* Welcome Section */}
                <FadeIn className="mb-6 sm:mb-10">
                    <div className="flex items-start sm:items-center justify-between gap-3 sm:gap-6">
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 sm:gap-3 mb-2">
                                <div className="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full bg-teal-500/10 border border-teal-500/20">
                                    <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-teal-500" />
                                    <span className="text-xs font-medium text-teal-500">Dashboard</span>
                                </div>
                            </div>
                            <h1 className="text-xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-1 sm:mb-2">
                                {getGreeting()}, <span className="bg-linear-to-r from-teal-400 to-cyan-400 bg-clip-text text-transparent">{userName}</span>!
                            </h1>
                            <p className="text-muted-foreground flex items-center gap-2 text-xs sm:text-base">
                                <Calendar className="w-3 h-3 sm:w-4 sm:h-4 shrink-0" />
                                <span className="truncate">{formattedDate}</span>
                            </p>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button
                                variant="outline"
                                className="p-2 sm:px-4 sm:py-2 border-border hover:border-teal-500/30 hover:bg-teal-500/10 text-sm"
                            >
                                <Bell className="w-4 h-4 sm:mr-2" />
                                <span className="hidden sm:inline">Notifications</span>
                            </Button>
                            <Button
                                variant="outline"
                                onClick={() => setShowSettings(true)}
                                className="p-2 sm:px-4 sm:py-2 border-border hover:border-cyan-500/30 hover:bg-cyan-500/10 text-sm"
                            >
                                <Settings className="w-4 h-4 sm:mr-2" />
                                <span className="hidden sm:inline">Settings</span>
                            </Button>
                        </div>
                    </div>
                </FadeIn>

                {/* Quick Stats */}
                <FadeIn delay={0.1} className="mb-6 sm:mb-10">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                        {stats.map((stat, index) => (
                            <QuickStatCard key={index} {...stat} />
                        ))}
                    </div>
                </FadeIn>

                {/* Main Content Grid */}
                <div className="grid lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
                    {/* Role Selection Cards */}
                    <FadeIn delay={0.2} className="lg:col-span-2">
                        <div className="mb-4 sm:mb-6">
                            <h2 className="text-lg sm:text-xl font-semibold text-foreground mb-1">Select Your Workspace</h2>
                            <p className="text-xs sm:text-sm text-muted-foreground">Choose a portal based on your role and tasks</p>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 lg:gap-6">
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
                    <FadeIn delay={0.3} className="space-y-4 sm:space-y-6">
                        {/* Quick Actions */}
                        <Card className="p-4 sm:p-6">
                            <h3 className="text-base sm:text-lg font-semibold text-foreground mb-3 sm:mb-4 flex items-center gap-2">
                                <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-teal-500" />
                                Quick Actions
                            </h3>
                            <div className="space-y-2 sm:space-y-3">
                                <QuickAction icon={Ticket} label="Issue New Ticket" href="/officer" color="teal" />
                                <QuickAction icon={BarChart3} label="View Analytics" href="/admin/analytics" color="cyan" />
                                <QuickAction icon={Users} label="Manage Passes" href="/passes" color="teal" />
                            </div>
                        </Card>

                        {/* Recent Activity */}
                        <Card className="p-4 sm:p-6">
                            <h3 className="text-base sm:text-lg font-semibold text-foreground mb-3 sm:mb-4 flex items-center gap-2">
                                <Activity className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-500" />
                                Recent Activity
                            </h3>
                            <div className="space-y-0.5 sm:space-y-1">
                                {recentActivity.map((item, index) => (
                                    <ActivityItem key={index} {...item} />
                                ))}
                            </div>
                            <button className="w-full mt-3 sm:mt-4 text-xs sm:text-sm text-teal-500 hover:text-teal-400 font-medium flex items-center justify-center gap-1 transition-colors">
                                View all activity
                                <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                            </button>
                        </Card>

                        {/* System Status */}
                        <Card className="p-4 sm:p-6 bg-linear-to-br from-teal-500/5 to-cyan-500/5">
                            <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                                <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-emerald-500 animate-pulse" />
                                <span className="text-xs sm:text-sm font-medium text-foreground">System Status</span>
                            </div>
                            <p className="text-[10px] sm:text-xs text-muted-foreground mb-2">All systems operational</p>
                            <div className="flex items-center gap-3 sm:gap-4 text-[10px] sm:text-xs text-muted-foreground">
                                <span className="flex items-center gap-1">
                                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-emerald-500" />
                                    API
                                </span>
                                <span className="flex items-center gap-1">
                                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-emerald-500" />
                                    Database
                                </span>
                                <span className="flex items-center gap-1">
                                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-emerald-500" />
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
