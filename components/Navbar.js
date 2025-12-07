'use client'

import React, { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import PillNav from './ui/PillNav'

export default function Navbar() {
    const router = useRouter()
    const pathname = usePathname()
    const [user, setUser] = useState(null)

    useEffect(() => {
        const getUser = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            setUser(user)
        }
        getUser()
    }, [])

    const handleLogout = async () => {
        await supabase.auth.signOut()
        router.push('/login')
    }

    // Don't show navbar on login page or landing page (which has its own nav)
    if (pathname === '/login' || pathname === '/') return null

    const navItems = [
        { label: 'Home', href: '/' },
        { label: 'Dashboard', href: '/dashboard' },
        { label: 'New Ticket', href: '/tickets/create' },
        { label: 'Check Status', href: '/status' },
    ]

    return (
        <div className="w-full flex justify-center pt-4">
            <PillNav
                logo="https://cdn-icons-png.flaticon.com/512/3202/3202926.png"
                logoAlt="ParkSystem"
                items={navItems}
                activeHref={pathname}
                baseColor="#171717"
                pillColor="#2563EB"
                hoveredPillTextColor="#ffffff"
                pillTextColor="#ffffff"
            />
        </div>
    )
}

