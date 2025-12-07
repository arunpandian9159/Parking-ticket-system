'use client'

import React, { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { supabase } from '@/lib/supabase'
import { useTheme } from '@/lib/ThemeContext'
import { Home, Ticket, Search, LogOut, Menu, X, Sun, Moon } from 'lucide-react'
import { Button } from '@/components/ui/Button'

// Theme Toggle Button Component
function ThemeToggle() {
    const { theme, toggleTheme } = useTheme()
    const [isAnimating, setIsAnimating] = useState(false)

    const handleToggle = () => {
        setIsAnimating(true)
        toggleTheme()
        setTimeout(() => setIsAnimating(false), 500)
    }

    return (
        <button
            onClick={handleToggle}
            className={`
                relative p-2 rounded-xl transition-all duration-300
                bg-secondary/50 hover:bg-secondary border border-border
                hover:border-teal-500/30 hover:shadow-lg hover:shadow-teal-500/10
                ${isAnimating ? 'animate-theme-switch' : ''}
            `}
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
        >
            <div className="relative w-5 h-5">
                {/* Sun Icon */}
                <Sun
                    className={`
                        absolute inset-0 w-5 h-5 text-amber-500
                        transition-all duration-300 ease-in-out
                        ${theme === 'light'
                            ? 'opacity-100 rotate-0 scale-100'
                            : 'opacity-0 -rotate-90 scale-75'
                        }
                    `}
                />
                {/* Moon Icon */}
                <Moon
                    className={`
                        absolute inset-0 w-5 h-5 text-teal-400
                        transition-all duration-300 ease-in-out
                        ${theme === 'dark'
                            ? 'opacity-100 rotate-0 scale-100'
                            : 'opacity-0 rotate-90 scale-75'
                        }
                    `}
                />
            </div>
        </button>
    )
}

export default function Navbar({ onLoginClick }) {
    const router = useRouter()
    const pathname = usePathname()
    const [user, setUser] = useState(null)
    const [isMenuOpen, setIsMenuOpen] = useState(false)

    useEffect(() => {
        const getUser = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            setUser(user)
        }
        getUser()
    }, [])

    const handleLogout = async () => {
        await supabase.auth.signOut()
        router.push('/')
    }

    // Landing page navigation items
    const landingNavItems = [
        { label: 'Features', href: '#features' },
        { label: 'How It Works', href: '#how-it-works' },
        { label: 'Testimonials', href: '#testimonials' },
        { label: 'Pricing', href: '#pricing' },
    ]

    // App navigation items (for logged-in users)
    const appNavItems = [
        { label: 'Home', href: '/', icon: Home },
        { label: 'Dashboard', href: '/dashboard', icon: Ticket },
        { label: 'New Ticket', href: '/tickets/create', icon: Ticket },
        { label: 'Check Status', href: '/status', icon: Search },
    ]

    // Render landing page navigation
    if (pathname === '/') {
        return (
            <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        {/* Logo */}
                        <div className="flex items-center gap-3">
                            <Image
                                src="/logo1.png"
                                alt="ParkSmart Logo"
                                width={50}
                                height={50}
                                className="rounded-full"
                            />
                            <span className="text-xl font-bold bg-gradient-to-r from-teal-400 to-teal-200 bg-clip-text text-transparent">
                                ParkSmart
                            </span>
                        </div>

                        {/* Desktop Navigation */}
                        <div className="hidden md:flex items-center gap-8">
                            {landingNavItems.map((item) => (
                                <a
                                    key={item.href}
                                    href={item.href}
                                    className="text-muted-foreground hover:text-teal-500 transition-colors text-sm font-medium"
                                >
                                    {item.label}
                                </a>
                            ))}
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center gap-3">
                            {/* Theme Toggle */}
                            <ThemeToggle />

                            <Link href="/status" className="hidden sm:block">
                                <Button variant="ghost" className="text-muted-foreground hover:text-teal-500 hover:bg-teal-500/10 text-sm">
                                    Check Status
                                </Button>
                            </Link>
                            <Button
                                onClick={onLoginClick}
                                className="bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-400 hover:to-teal-500 text-sm px-5"
                            >
                                Login
                            </Button>

                            {/* Mobile Menu Button */}
                            <button
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                                className="md:hidden p-2 rounded-lg text-foreground hover:text-teal-500 hover:bg-secondary transition-colors"
                            >
                                {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                            </button>
                        </div>
                    </div>

                    {/* Mobile Navigation */}
                    {isMenuOpen && (
                        <div className="md:hidden py-4 border-t border-border">
                            <div className="flex flex-col gap-1">
                                {landingNavItems.map((item) => (
                                    <a
                                        key={item.href}
                                        href={item.href}
                                        onClick={() => setIsMenuOpen(false)}
                                        className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-foreground hover:text-teal-500 hover:bg-secondary transition-all duration-200"
                                    >
                                        {item.label}
                                    </a>
                                ))}
                                <div className="border-t border-border mt-2 pt-2">
                                    <Link
                                        href="/status"
                                        onClick={() => setIsMenuOpen(false)}
                                        className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-foreground hover:text-teal-500 hover:bg-secondary transition-all duration-200"
                                    >
                                        Check Status
                                    </Link>
                                    <button
                                        onClick={() => {
                                            setIsMenuOpen(false)
                                            onLoginClick?.()
                                        }}
                                        className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium bg-gradient-to-r from-teal-500 to-teal-600 text-white transition-all duration-200"
                                    >
                                        Login
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </nav>
        )
    }

    // Render app navigation (for other pages)
    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-xl border-b border-border">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-3">
                        <Image
                            src="/logo1.png"
                            alt="ParkSmart Logo"
                            width={50}
                            height={50}
                            className="rounded-lg"
                        />
                        <span className="text-lg font-bold bg-gradient-to-r from-teal-400 to-teal-200 bg-clip-text text-transparent hidden sm:block">ParkSmart</span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-1">
                        {appNavItems.map((item) => {
                            const isActive = pathname === item.href
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${isActive
                                        ? 'bg-teal-600 text-white'
                                        : 'text-muted-foreground hover:text-teal-500 hover:bg-secondary'
                                        }`}
                                >
                                    <item.icon className="w-4 h-4" />
                                    {item.label}
                                </Link>
                            )
                        })}
                    </div>

                    {/* User Menu */}
                    <div className="flex items-center gap-3">
                        {/* Theme Toggle */}
                        <ThemeToggle />

                        {user && (
                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-teal-500 hover:bg-secondary transition-all duration-200"
                            >
                                <LogOut className="w-4 h-4" />
                                <span className="hidden sm:inline">Logout</span>
                            </button>
                        )}

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="md:hidden p-2 rounded-lg text-foreground hover:text-teal-500 hover:bg-secondary transition-colors"
                        >
                            {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                        </button>
                    </div>
                </div>

                {/* Mobile Navigation */}
                {isMenuOpen && (
                    <div className="md:hidden py-4 border-t border-border">
                        <div className="flex flex-col gap-1">
                            {appNavItems.map((item) => {
                                const isActive = pathname === item.href
                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        onClick={() => setIsMenuOpen(false)}
                                        className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${isActive
                                            ? 'bg-teal-600 text-white'
                                            : 'text-foreground hover:text-teal-500 hover:bg-secondary'
                                            }`}
                                    >
                                        <item.icon className="w-5 h-5" />
                                        {item.label}
                                    </Link>
                                )
                            })}
                        </div>
                    </div>
                )}
            </div>
        </nav>
    )
}
