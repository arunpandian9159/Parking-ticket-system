'use client'

import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { Car, LogOut, Plus, LayoutDashboard } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { Button } from './ui/Button'

export default function Navbar() {
    const router = useRouter()
    const pathname = usePathname()

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

                    <div className="flex items-center gap-4">
                        <Button variant="ghost" onClick={handleLogout} className="!p-2">
                            <LogOut className="w-5 h-5" />
                        </Button>
                    </div>
                </div>
            </div>
        </nav>
    )
}
