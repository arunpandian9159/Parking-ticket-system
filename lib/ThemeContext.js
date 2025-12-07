'use client'

import { createContext, useContext, useEffect, useState } from 'react'

const ThemeContext = createContext({
    theme: 'dark',
    toggleTheme: () => { },
})

export function ThemeProvider({ children }) {
    const [theme, setTheme] = useState('dark')
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
        // Check for saved theme preference - default to dark mode
        const savedTheme = localStorage.getItem('theme')
        if (savedTheme) {
            setTheme(savedTheme)
        }
        // If no saved preference, keep the default 'dark' theme
    }, [])

    useEffect(() => {
        if (mounted) {
            // Update document class and save preference
            document.documentElement.setAttribute('data-theme', theme)
            localStorage.setItem('theme', theme)
        }
    }, [theme, mounted])

    const toggleTheme = () => {
        setTheme(prev => prev === 'dark' ? 'light' : 'dark')
    }

    // Prevent flash of wrong theme
    if (!mounted) {
        return null
    }

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    )
}

export function useTheme() {
    const context = useContext(ThemeContext)
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider')
    }
    return context
}
