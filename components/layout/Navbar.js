'use client'

import React, { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { supabase } from '@/lib/supabase'
import { useTheme } from '@/lib/ThemeContext'
import { useRole } from '@/hooks/useRole'
import { NAV_ITEMS, ROLES, ROLE_PERMISSIONS } from '@/lib/roles'
import {
  Home,
  Ticket,
  Search,
  LogOut,
  Menu,
  X,
  Sun,
  Moon,
  CreditCard,
  LayoutDashboard,
  Plus,
  Clock,
  Car,
  BarChart3,
  DollarSign,
  Users,
  QrCode,
  Shield,
  ChevronDown,
} from 'lucide-react'
import { Button } from '@/components/ui/Button'

// Icon mapping
const iconMap = {
  LayoutDashboard,
  Ticket,
  Plus,
  CreditCard,
  Clock,
  Car,
  BarChart3,
  DollarSign,
  Users,
  QrCode,
  Home,
  Search,
  Shield,
}

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
        <Sun
          className={`
                        absolute inset-0 w-5 h-5 text-amber-500
                        transition-all duration-300 ease-in-out
                        ${
                          theme === 'light'
                            ? 'opacity-100 rotate-0 scale-100'
                            : 'opacity-0 -rotate-90 scale-75'
                        }
                    `}
        />
        <Moon
          className={`
                        absolute inset-0 w-5 h-5 text-teal-400
                        transition-all duration-300 ease-in-out
                        ${
                          theme === 'dark'
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
  const [showAdminMenu, setShowAdminMenu] = useState(false)
  const { role, roleName, isAdmin, isManager, hasPermission, loading: roleLoading } = useRole()

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
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

  // Filter navigation items based on user role
  const getFilteredNavItems = () => {
    // Base items for all users
    const baseItems = [
      { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
      { label: 'Tickets', href: '/officer', icon: Ticket },
      { label: 'New Ticket', href: '/tickets/create', icon: Plus },
      { label: 'Passes', href: '/passes', icon: CreditCard },
      { label: 'Scan', href: '/scan', icon: QrCode },
    ]

    // Add role-specific items
    if (isAdmin || isManager) {
      baseItems.push(
        { label: 'Shifts', href: '/shifts', icon: Clock },
        { label: 'Vehicles', href: '/vehicles', icon: Car }
      )
    }

    return baseItems
  }

  // Admin/Manager menu items
  const adminMenuItems = [
    { label: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
    { label: 'Rates', href: '/admin/rates', icon: DollarSign },
  ]

  // Admin-only items
  const adminOnlyItems = [{ label: 'Users', href: '/admin/users', icon: Users }]

  // Render landing page navigation
  if (pathname === '/') {
    return (
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border">
        <div className="mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16">
            {/* Logo */}
            <div className="flex items-center gap-2 sm:gap-3 shrink-0">
              <Image
                src="/logo2.png"
                alt="PARKINGTICKET Logo"
                width={40}
                height={40}
                className="rounded-full"
                style={{ width: 'auto', height: 'auto' }}
              />
              <span className="hidden sm:inline text-base sm:text-xl font-bold bg-linear-to-r from-teal-400 to-teal-200 bg-clip-text text-transparent">
                PARKINGTICKET
              </span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              {landingNavItems.map(item => (
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
            <div className="flex items-center gap-2 sm:gap-3">
              <ThemeToggle />

              <Link href="/status" className="hidden sm:block">
                <Button
                  variant="ghost"
                  className="text-muted-foreground hover:text-teal-500 hover:bg-teal-500/10 text-sm"
                >
                  Check Status
                </Button>
              </Link>
              <Button
                onClick={onLoginClick}
                className="bg-linear-to-r from-teal-500 to-teal-600 hover:from-teal-400 hover:to-teal-500 text-xs sm:text-sm px-3 sm:px-5 py-2"
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
                {landingNavItems.map(item => (
                  <a
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-foreground hover:text-teal-500 hover:bg-secondary transition-all duration-200"
                  >
                    {item.label}
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </nav>
    )
  }

  const navItems = getFilteredNavItems()

  // Render app navigation (for other pages)
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-xl border-b border-border">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/dashboard" className="flex items-center gap-3">
            <Image
              src="/logo2.png"
              alt="PARKINGTICKET Logo"
              width={40}
              height={40}
              className="rounded-lg"
              style={{ width: 'auto', height: 'auto' }}
            />
            <span className="text-lg font-bold bg-linear-to-r from-teal-400 to-teal-200 bg-clip-text text-transparent hidden sm:block">
              PARKINGTICKET
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map(item => {
              const isActive = pathname === item.href
              const Icon = item.icon
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-teal-600 text-white'
                      : 'text-muted-foreground hover:text-teal-500 hover:bg-secondary'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </Link>
              )
            })}

            {/* Admin/Manager Dropdown */}
            {(isAdmin || isManager) && (
              <div className="relative">
                <button
                  onClick={() => setShowAdminMenu(!showAdminMenu)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    pathname.startsWith('/admin')
                      ? 'bg-violet-600 text-white'
                      : 'text-muted-foreground hover:text-violet-500 hover:bg-secondary'
                  }`}
                >
                  <Shield className="w-4 h-4" />
                  Admin
                  <ChevronDown
                    className={`w-3 h-3 transition-transform ${showAdminMenu ? 'rotate-180' : ''}`}
                  />
                </button>

                {/* Dropdown Menu */}
                {showAdminMenu && (
                  <div className="absolute right-0 top-full mt-2 w-48 bg-card border border-border rounded-xl shadow-xl overflow-hidden z-50">
                    {adminMenuItems.map(item => {
                      const Icon = item.icon
                      const isActive = pathname === item.href
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setShowAdminMenu(false)}
                          className={`flex items-center gap-3 px-4 py-3 text-sm hover:bg-secondary transition-colors ${
                            isActive ? 'bg-secondary text-teal-500' : 'text-foreground'
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                          {item.label}
                        </Link>
                      )
                    })}

                    {/* Admin-only items */}
                    {isAdmin && (
                      <>
                        <div className="border-t border-border" />
                        {adminOnlyItems.map(item => {
                          const Icon = item.icon
                          const isActive = pathname === item.href
                          return (
                            <Link
                              key={item.href}
                              href={item.href}
                              onClick={() => setShowAdminMenu(false)}
                              className={`flex items-center gap-3 px-4 py-3 text-sm hover:bg-secondary transition-colors ${
                                isActive ? 'bg-secondary text-violet-500' : 'text-foreground'
                              }`}
                            >
                              <Icon className="w-4 h-4" />
                              {item.label}
                            </Link>
                          )
                        })}
                      </>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* User Menu */}
          <div className="flex items-center gap-3">
            {/* Role Badge */}
            {roleName && !roleLoading && (
              <span
                className={`hidden sm:flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                  roleName === ROLES.ADMIN
                    ? 'bg-violet-500/10 text-violet-500'
                    : roleName === ROLES.MANAGER
                    ? 'bg-amber-500/10 text-amber-500'
                    : 'bg-teal-500/10 text-teal-500'
                }`}
              >
                <Shield className="w-3 h-3" />
                {roleName}
              </span>
            )}

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
              {navItems.map(item => {
                const isActive = pathname === item.href
                const Icon = item.icon
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? 'bg-teal-600 text-white'
                        : 'text-foreground hover:text-teal-500 hover:bg-secondary'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    {item.label}
                  </Link>
                )
              })}

              {/* Admin Section - Mobile */}
              {(isAdmin || isManager) && (
                <>
                  <div className="border-t border-border my-2 pt-2">
                    <p className="px-4 text-xs text-muted-foreground uppercase tracking-wide mb-2">
                      Admin
                    </p>
                    {adminMenuItems.map(item => {
                      const Icon = item.icon
                      const isActive = pathname === item.href
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setIsMenuOpen(false)}
                          className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                            isActive
                              ? 'bg-violet-600 text-white'
                              : 'text-foreground hover:text-violet-500 hover:bg-secondary'
                          }`}
                        >
                          <Icon className="w-5 h-5" />
                          {item.label}
                        </Link>
                      )
                    })}
                    {isAdmin &&
                      adminOnlyItems.map(item => {
                        const Icon = item.icon
                        const isActive = pathname === item.href
                        return (
                          <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => setIsMenuOpen(false)}
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                              isActive
                                ? 'bg-violet-600 text-white'
                                : 'text-foreground hover:text-violet-500 hover:bg-secondary'
                            }`}
                          >
                            <Icon className="w-5 h-5" />
                            {item.label}
                          </Link>
                        )
                      })}
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
