'use client'

import React, { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { Car, Home, Ticket, Search, LogOut, Menu, X } from 'lucide-react'

export default function Navbar() {
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

    // Don't show navbar on landing page (which has its own nav)
    if (pathname === '/') return null

    const navItems = [
        { label: 'Home', href: '/', icon: Home },
        { label: 'Dashboard', href: '/dashboard', icon: Ticket },
        { label: 'New Ticket', href: '/tickets/create', icon: Ticket },
        { label: 'Check Status', href: '/status', icon: Search },
    ]

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-neutral-900/95 backdrop-blur-xl border-b border-white/10">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                            <Car className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-lg font-bold text-white hidden sm:block">ParkSmart</span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-1">
                        {navItems.map((item) => {
                            const isActive = pathname === item.href
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${isActive
                                        ? 'bg-blue-600 text-white'
                                        : 'text-gray-300 hover:text-white hover:bg-white/10'
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
                        {user && (
                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-gray-300 hover:text-white hover:bg-white/10 transition-all duration-200"
                            >
                                <LogOut className="w-4 h-4" />
                                <span className="hidden sm:inline">Logout</span>
                            </button>
                        )}

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="md:hidden p-2 rounded-lg text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
                        >
                            {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                        </button>
                    </div>
                </div>

                {/* Mobile Navigation */}
                {isMenuOpen && (
                    <div className="md:hidden py-4 border-t border-white/10">
                        <div className="flex flex-col gap-1">
                            {navItems.map((item) => {
                                const isActive = pathname === item.href
                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        onClick={() => setIsMenuOpen(false)}
                                        className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${isActive
                                            ? 'bg-blue-600 text-white'
                                            : 'text-gray-300 hover:text-white hover:bg-white/10'
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
