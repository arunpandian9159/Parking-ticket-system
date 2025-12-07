'use client'

import { ThemeProvider } from '@/lib/ThemeContext'
import Navbar from '@/components/Navbar'

export default function ClientLayout({ children }) {
    return (
        <ThemeProvider>
            <Navbar />
            <main className="pt-16 sm:pt-20 pb-8 sm:pb-10 px-3 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                {children}
            </main>
        </ThemeProvider>
    )
}
