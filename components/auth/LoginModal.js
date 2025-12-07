'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card } from '@/components/ui/Card'
import { Lock, User, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export default function LoginModal({ isOpen, onClose }) {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [isSignUp, setIsSignUp] = useState(false)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState(null)

    // Reset state when modal opens/closes
    useEffect(() => {
        if (!isOpen) {
            setError(null)
            setEmail('')
            setPassword('')
        }
    }, [isOpen])

    const handleAuth = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        try {
            if (isSignUp) {
                const { error } = await supabase.auth.signUp({
                    email,
                    password,
                })
                if (error) throw error
                alert('Check your email for the confirmation link!')
            } else {
                const { error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                })
                if (error) throw error
                router.push('/dashboard')
                onClose()
            }
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop - allows clicking through to nav if we really want, but usually blocks. 
                        User said "access nav bar". I'll make the backdrop lighter and maybe check if we want it blocking.
                        To explicitly allow navbar access, we shouldn't cover the navbar (z-index). 
                        Navbar is z-50. We'll make this z-40.
                     */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
                    />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md p-4"
                    >
                        <Card className="w-full relative bg-white/95 backdrop-blur shadow-2xl border-white/20">
                            <button
                                onClick={onClose}
                                className="absolute right-4 top-4 text-gray-500 hover:text-gray-700 transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>

                            <div className="p-6">
                                <div className="text-center mb-8">
                                    <div className="mx-auto w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                                        <Lock className="w-6 h-6 text-blue-600" />
                                    </div>
                                    <h2 className="text-2xl font-bold text-gray-900">Staff Login</h2>
                                    <p className="text-gray-500 mt-2">
                                        {isSignUp ? 'Create a new account' : 'Sign in to access dashboards'}
                                    </p>
                                </div>

                                <form onSubmit={handleAuth} className="space-y-6">
                                    <Input
                                        label="Email Address"
                                        type="email"
                                        placeholder="admin@parking.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        icon={<User className="w-4 h-4" />}
                                        className="bg-white/50"
                                    />

                                    <Input
                                        label="Password"
                                        type="password"
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        className="bg-white/50"
                                    />

                                    {error && (
                                        <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">
                                            {error}
                                        </div>
                                    )}

                                    <Button
                                        type="submit"
                                        className="w-full bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/30"
                                        disabled={loading}
                                    >
                                        {loading ? (isSignUp ? 'Creating Account...' : 'Signing In...') : (isSignUp ? 'Create Account' : 'Sign In')}
                                    </Button>

                                    <div className="text-center mt-4">
                                        <button
                                            type="button"
                                            onClick={() => setIsSignUp(!isSignUp)}
                                            className="text-sm text-blue-600 hover:text-blue-700 font-medium hover:underline"
                                        >
                                            {isSignUp ? 'Already have an account? Sign In' : 'Need an account? Sign Up'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </Card>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    )
}
