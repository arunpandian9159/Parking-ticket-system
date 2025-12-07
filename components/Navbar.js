'use client'

import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { useState, useEffect, useRef } from 'react'
import { Car, LogOut, Plus, LayoutDashboard, User, Settings, ChevronDown } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { Button } from './ui/Button'

export default function Navbar() {
    const router = useRouter()
    const pathname = usePathname()
    const [isOpen, setIsOpen] = useState(false)
    const [user, setUser] = useState(null)
    const dropdownRef = useRef(null)

    useEffect(() => {
        const getUser = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            setUser(user)
        }
        getUser()

        // Close dropdown when clicking outside
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const handleLogout = async () => {
        await supabase.auth.signOut()
        router.push('/login')
    }

    // Don't show navbar on login page
    if (pathname === '/login') return null

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    <div className="flex items-center gap-2">
                        <div className="p-2 bg-blue-600 rounded-lg">
                            <Car className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                            ParkSystem
                        </span>
                    </div>

                    <div className="hidden md:flex items-center gap-6">
                        <Link
                            href="/"
                            className={`flex items-center gap-2 text-sm font-medium transition-colors ${pathname === '/' ? 'text-blue-600' : 'text-gray-600 hover:text-gray-900'
                                }`}
                        >
                            <LayoutDashboard className="w-4 h-4" />
                            Dashboard
                        </Link>
                        <Link
                            href="/tickets/create"
                            className={`flex items-center gap-2 text-sm font-medium transition-colors ${pathname === '/tickets/create' ? 'text-blue-600' : 'text-gray-600 hover:text-gray-900'
                                }`}
                        >
                            <Plus className="w-4 h-4" />
                            New Ticket
                        </Link>
                    </div>

                    <div className="flex items-center gap-4" ref={dropdownRef}>
                        <div className="relative">
                            <button
                                onClick={() => setIsOpen(!isOpen)}
                                className="flex items-center gap-2 p-1.5 rounded-full hover:bg-gray-100 transition-colors border border-transparent hover:border-gray-200"
                            >
                                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white shadow-sm">
                                    <User className="w-4 h-4" />
                                </div>
                                <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
                            </button>

                            {isOpen && (
                                <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-100 py-2 animate-in fade-in slide-in-from-top-2">
                                    <div className="px-4 py-3 border-b border-gray-50">
                                        <p className="text-sm font-medium text-gray-900">
                                            {user?.user_metadata?.full_name || user?.user_metadata?.name || 'User'}
                                        </p>
                                        <p className="text-xs text-gray-500 truncate mt-0.5">{user?.email}</p>
                                    </div>

                                    <div className="py-1">
                                        <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                                            <Settings className="w-4 h-4 text-gray-400" />
                                            Settings
                                        </button>
                                    </div>

                                    <div className="border-t border-gray-50 py-1">
                                        <button
                                            onClick={handleLogout}
                                            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                                        >
                                            <LogOut className="w-4 h-4" />
                                            Sign out
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    )
}
