import { Inter } from 'next/font/google'
import './globals.css'
import Navbar from '../components/Navbar'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Parking Ticket System',
  description: 'A comprehensive parking ticket management system',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen flex flex-col bg-gradient-gray relative">
          <Navbar />
          <main className="flex-1 py-8 animate-fade-in">
            <div className="max-w-[1200px] mx-auto px-4">
              {children}
            </div>
          </main>
        </div>
      </body>
    </html>
  )
}
