'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/Button'
import {
  Lock,
  Mail,
  User,
  X,
  Eye,
  EyeOff,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

// Password strength checker
function getPasswordStrength(password) {
  let strength = 0
  if (password.length >= 8) strength++
  if (/[A-Z]/.test(password)) strength++
  if (/[a-z]/.test(password)) strength++
  if (/[0-9]/.test(password)) strength++
  if (/[^A-Za-z0-9]/.test(password)) strength++
  return strength
}

function PasswordStrengthBar({ password }) {
  const strength = getPasswordStrength(password)
  const levels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong']
  const colors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-teal-500', 'bg-green-500']

  if (!password) return null

  return (
    <div className="mt-2">
      <div className="flex gap-1 h-1.5">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: i < strength ? 1 : 0.3 }}
            className={`h-full flex-1 rounded-full origin-left transition-all duration-300 ${
              i < strength ? colors[strength - 1] : 'bg-secondary'
            }`}
          />
        ))}
      </div>
      <motion.p
        initial={{ opacity: 0, y: -5 }}
        animate={{ opacity: 1, y: 0 }}
        className={`text-xs mt-1.5 ${
          strength <= 1
            ? 'text-red-500'
            : strength <= 2
            ? 'text-orange-500'
            : strength <= 3
            ? 'text-yellow-500'
            : strength === 4
            ? 'text-teal-500'
            : 'text-green-500'
        }`}
      >
        Password strength: {levels[strength - 1] || 'Too Short'}
      </motion.p>
    </div>
  )
}

// Floating Input Component
function FloatingInput({
  label,
  type = 'text',
  value,
  onChange,
  icon: Icon,
  error,
  showPasswordToggle,
  ...props
}) {
  const [isFocused, setIsFocused] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const isActive = isFocused || value

  return (
    <div className="relative">
      <div className={`relative group transition-all duration-300 ${error ? 'animate-shake' : ''}`}>
        {/* Glow effect on focus */}
        <div
          className={`absolute -inset-0.5 rounded-lg sm:rounded-xl transition-all duration-300 ${
            isFocused ? 'bg-linear-to-r from-teal-500/30 to-cyan-500/30 blur' : 'bg-transparent'
          }`}
        />

        <div
          className={`relative flex items-center border rounded-lg sm:rounded-xl transition-all duration-300 ${
            error
              ? 'border-red-500/50 bg-red-500/5'
              : isFocused
              ? 'border-teal-500/50 bg-secondary/50'
              : 'border-border bg-secondary/30 hover:border-muted-foreground'
          }`}
        >
          {/* Icon */}
          <div
            className={`pl-3 sm:pl-4 transition-colors duration-300 ${
              isFocused ? 'text-teal-500' : 'text-muted-foreground'
            }`}
          >
            <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>

          {/* Input */}
          <input
            type={showPasswordToggle && showPassword ? 'text' : type}
            value={value}
            onChange={onChange}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className="w-full px-3 sm:px-4 py-3 sm:py-4 pt-5 sm:pt-6 bg-transparent text-foreground focus:outline-none text-xs sm:text-sm"
            {...props}
          />

          {/* Floating Label */}
          <label
            className={`absolute left-10 sm:left-12 transition-all duration-300 pointer-events-none ${
              isActive
                ? 'top-1.5 sm:top-2 text-[10px] sm:text-xs text-teal-500'
                : 'top-1/2 -translate-y-1/2 text-xs sm:text-sm text-muted-foreground'
            }`}
          >
            {label}
          </label>

          {/* Password Toggle */}
          {showPasswordToggle && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="pr-3 sm:pr-4 text-muted-foreground hover:text-foreground transition-colors"
            >
              {showPassword ? (
                <EyeOff className="w-4 h-4 sm:w-5 sm:h-5" />
              ) : (
                <Eye className="w-4 h-4 sm:w-5 sm:h-5" />
              )}
            </button>
          )}
        </div>
      </div>

      {/* Error message */}
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -5, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -5, height: 0 }}
            className="text-red-500 text-[10px] sm:text-xs mt-1 sm:mt-1.5 flex items-center gap-1"
          >
            <AlertCircle className="w-3 h-3" />
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  )
}

// Tab Button Component
function TabButton({ active, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative flex-1 py-2.5 sm:py-3 text-xs sm:text-sm font-medium transition-colors duration-300 ${
        active ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
      }`}
    >
      {children}
      {active && (
        <motion.div
          layoutId="activeTab"
          className="absolute bottom-0 left-0 right-0 h-0.5 bg-linear-to-r from-teal-500 to-cyan-500"
          initial={false}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        />
      )}
    </button>
  )
}

// Social Button Component
function SocialButton({ icon: Icon, label, onClick, disabled }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="flex-1 flex items-center justify-center gap-1.5 sm:gap-2 py-2.5 sm:py-3 px-3 sm:px-4 rounded-lg sm:rounded-xl border border-border bg-secondary/30 hover:bg-secondary hover:border-muted-foreground transition-all duration-300 text-muted-foreground hover:text-foreground group disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <Icon className="w-4 h-4 sm:w-5 sm:h-5 group-hover:scale-110 transition-transform" />
      <span className="text-xs sm:text-sm font-medium">{label}</span>
    </button>
  )
}

export default function LoginModal({ isOpen, onClose }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [isSignUp, setIsSignUp] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [name, setName] = useState('')
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)
  const [fieldErrors, setFieldErrors] = useState({})

  // Reset state when modal opens/closes
  useEffect(() => {
    if (!isOpen) {
      setError(null)
      setSuccess(null)
      setEmail('')
      setPassword('')
      setConfirmPassword('')
      setName('')
      setFieldErrors({})
    }
  }, [isOpen])

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  const validateForm = () => {
    const errors = {}

    if (!email) {
      errors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = 'Please enter a valid email'
    }

    if (!password) {
      errors.password = 'Password is required'
    } else if (isSignUp && password.length < 8) {
      errors.password = 'Password must be at least 8 characters'
    }

    if (isSignUp) {
      if (!name.trim()) {
        errors.name = 'Name is required'
      }
      if (password !== confirmPassword) {
        errors.confirmPassword = 'Passwords do not match'
      }
    }

    setFieldErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleAuth = async e => {
    e.preventDefault()

    if (!validateForm()) return

    setLoading(true)
    setError(null)
    setSuccess(null)

    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: name,
            },
          },
        })
        if (error) throw error
        setSuccess('Account created! Check your email for the confirmation link.')
        // Switch to login after successful signup
        setTimeout(() => {
          setIsSignUp(false)
          setSuccess(null)
        }, 3000)
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

  const handleGoogleLogin = async () => {
    setLoading(true)
    setError(null)
    try {
      const redirectUrl = `${window.location.origin}/auth/callback?next=/dashboard`
      console.log('Google OAuth redirect URL:', redirectUrl)

      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectUrl,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      })
      if (error) throw error
    } catch (err) {
      setError(err.message)
      setLoading(false)
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop with animated blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/70 backdrop-blur-md z-40"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 30 }}
            transition={{
              type: 'spring',
              stiffness: 400,
              damping: 30,
            }}
            className="fixed inset-0 sm:inset-auto sm:left-1/2 sm:top-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 z-60 w-full sm:max-w-md sm:p-4 overflow-y-auto"
          >
            <div className="relative min-h-full sm:min-h-0">
              {/* Animated gradient background glow - hidden on mobile for performance */}
              <div className="hidden sm:block absolute -inset-1 bg-linear-to-r from-teal-600 via-cyan-600 to-teal-600 rounded-3xl blur-xl opacity-50 animate-pulse" />

              {/* Main Card */}
              <div className="relative bg-card backdrop-blur-xl sm:rounded-2xl border-0 sm:border border-border shadow-2xl overflow-hidden min-h-screen sm:min-h-0">
                {/* Decorative gradient orbs - smaller on mobile */}
                <div className="absolute -top-16 -right-16 sm:-top-24 sm:-right-24 w-32 h-32 sm:w-48 sm:h-48 bg-teal-500/20 rounded-full blur-3xl" />
                <div className="absolute -bottom-16 -left-16 sm:-bottom-24 sm:-left-24 w-32 h-32 sm:w-48 sm:h-48 bg-cyan-500/20 rounded-full blur-3xl" />

                {/* Mobile Header with Back Button */}
                <div className="sm:hidden sticky top-0 z-20 flex items-center gap-3 px-4 py-3 bg-card/95 backdrop-blur-sm border-b border-border">
                  <button
                    onClick={onClose}
                    className="p-2 -ml-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-all duration-300"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                  <span className="text-sm font-medium text-foreground">
                    {isSignUp ? 'Create Account' : 'Sign In'}
                  </span>
                </div>

                {/* Close button - hidden on mobile, shown on desktop */}
                <button
                  onClick={onClose}
                  className="hidden sm:block absolute right-4 top-4 z-10 p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-secondary transition-all duration-300 group"
                >
                  <X className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
                </button>

                <div className="relative p-5 sm:p-8">
                  {/* Header */}
                  <div className="text-center mb-5 sm:mb-8">
                    <motion.div
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{
                        type: 'spring',
                        stiffness: 500,
                        damping: 25,
                        delay: 0.1,
                      }}
                      className="mx-auto w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl overflow-hidden mb-3 sm:mb-5 shadow-lg shadow-teal-500/25"
                    >
                      <Image
                        src="/logo2.png"
                        alt="PARKINGTICKET Logo"
                        width={70}
                        height={70}
                        className="rounded-xl sm:rounded-4xl w-full h-full object-cover"
                      />
                    </motion.div>
                    <motion.h2
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="text-lg sm:text-2xl font-bold text-foreground mb-1 sm:mb-2"
                    >
                      Welcome to PARKINGTICKET
                    </motion.h2>
                    <motion.p
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="text-muted-foreground text-xs sm:text-sm"
                    >
                      {isSignUp
                        ? 'Create your account to get started'
                        : 'Sign in to access your dashboard'}
                    </motion.p>
                  </div>

                  {/* Tab Switcher */}
                  <div className="flex border-b border-border mb-4 sm:mb-6">
                    <TabButton
                      active={!isSignUp}
                      onClick={() => {
                        setIsSignUp(false)
                        setFieldErrors({})
                        setError(null)
                      }}
                    >
                      Sign In
                    </TabButton>
                    <TabButton
                      active={isSignUp}
                      onClick={() => {
                        setIsSignUp(true)
                        setFieldErrors({})
                        setError(null)
                      }}
                    >
                      Sign Up
                    </TabButton>
                  </div>

                  {/* Form */}
                  <form onSubmit={handleAuth} className="space-y-3 sm:space-y-5">
                    <AnimatePresence mode="wait">
                      {isSignUp && (
                        <motion.div
                          key="name"
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <FloatingInput
                            label="Full Name"
                            type="text"
                            value={name}
                            onChange={e => {
                              setName(e.target.value)
                              setFieldErrors(prev => ({ ...prev, name: null }))
                            }}
                            icon={User}
                            error={fieldErrors.name}
                            required={isSignUp}
                          />
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <FloatingInput
                      label="Email Address"
                      type="email"
                      value={email}
                      onChange={e => {
                        setEmail(e.target.value)
                        setFieldErrors(prev => ({ ...prev, email: null }))
                      }}
                      icon={Mail}
                      error={fieldErrors.email}
                      required
                    />

                    <div>
                      <FloatingInput
                        label="Password"
                        type="password"
                        value={password}
                        onChange={e => {
                          setPassword(e.target.value)
                          setFieldErrors(prev => ({ ...prev, password: null }))
                        }}
                        icon={Lock}
                        error={fieldErrors.password}
                        showPasswordToggle
                        required
                      />
                      {isSignUp && <PasswordStrengthBar password={password} />}
                    </div>

                    <AnimatePresence mode="wait">
                      {isSignUp && (
                        <motion.div
                          key="confirm"
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <FloatingInput
                            label="Confirm Password"
                            type="password"
                            value={confirmPassword}
                            onChange={e => {
                              setConfirmPassword(e.target.value)
                              setFieldErrors(prev => ({ ...prev, confirmPassword: null }))
                            }}
                            icon={Lock}
                            error={fieldErrors.confirmPassword}
                            showPasswordToggle
                            required={isSignUp}
                          />
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Error/Success Messages */}
                    <AnimatePresence>
                      {error && (
                        <motion.div
                          initial={{ opacity: 0, y: -10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: -10, scale: 0.95 }}
                          className="p-3 sm:p-4 bg-red-500/10 border border-red-500/20 rounded-lg sm:rounded-xl flex items-start gap-2 sm:gap-3"
                        >
                          <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-red-500 shrink-0 mt-0.5" />
                          <p className="text-red-500 text-xs sm:text-sm">{error}</p>
                        </motion.div>
                      )}
                      {success && (
                        <motion.div
                          initial={{ opacity: 0, y: -10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: -10, scale: 0.95 }}
                          className="p-3 sm:p-4 bg-teal-500/10 border border-teal-500/20 rounded-lg sm:rounded-xl flex items-start gap-2 sm:gap-3"
                        >
                          <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-teal-500 shrink-0 mt-0.5" />
                          <p className="text-teal-500 text-xs sm:text-sm">{success}</p>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Forgot Password */}
                    {!isSignUp && (
                      <div className="text-right">
                        <button
                          type="button"
                          className="text-xs sm:text-sm text-teal-500 hover:text-teal-400 transition-colors"
                        >
                          Forgot password?
                        </button>
                      </div>
                    )}

                    {/* Submit Button */}
                    <Button
                      type="submit"
                      disabled={loading}
                      className="w-full py-3 sm:py-4 bg-linear-to-r from-teal-500 to-cyan-600 hover:from-teal-400 hover:to-cyan-500 text-white font-medium rounded-lg sm:rounded-xl shadow-lg shadow-teal-500/25 hover:shadow-teal-500/40 transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 group text-sm sm:text-base"
                    >
                      {loading ? (
                        <span className="flex items-center justify-center gap-2">
                          <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                          {isSignUp ? 'Creating Account...' : 'Signing In...'}
                        </span>
                      ) : (
                        <span className="flex items-center justify-center gap-2">
                          {isSignUp ? 'Create Account' : 'Sign In'}
                          <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
                        </span>
                      )}
                    </Button>
                  </form>

                  {/* Divider */}
                  <div className="relative my-4 sm:my-6">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-border" />
                    </div>
                    <div className="relative flex justify-center text-xs sm:text-sm">
                      <span className="bg-card px-3 sm:px-4 text-muted-foreground">
                        or continue with
                      </span>
                    </div>
                  </div>

                  {/* Social Login */}
                  <div className="flex gap-2 sm:gap-3">
                    <SocialButton
                      icon={({ className }) => (
                        <svg className={className} viewBox="0 0 24 24" fill="currentColor">
                          <path
                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                            fill="#4285F4"
                          />
                          <path
                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                            fill="#34A853"
                          />
                          <path
                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                            fill="#FBBC05"
                          />
                          <path
                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                            fill="#EA4335"
                          />
                        </svg>
                      )}
                      label="Google"
                      onClick={handleGoogleLogin}
                      disabled={loading}
                    />
                    <SocialButton
                      icon={({ className }) => (
                        <svg className={className} viewBox="0 0 24 24" fill="currentColor">
                          <path
                            d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
                            fill="#1877F2"
                          />
                        </svg>
                      )}
                      label="Facebook"
                      onClick={() => {}}
                      disabled={loading}
                    />
                  </div>

                  {/* Footer Info */}
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="text-center text-[10px] sm:text-xs text-muted-foreground mt-4 sm:mt-6 flex items-center justify-center gap-1"
                  >
                    <Sparkles className="w-3 h-3" />
                    Secure login powered by Supabase
                  </motion.p>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
