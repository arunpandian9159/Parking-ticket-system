'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/Button'
import {
  Car,
  ShieldCheck,
  BarChart3,
  MapPin,
  Clock,
  CreditCard,
  Users,
  Zap,
  CheckCircle2,
  ArrowRight,
  Quote,
  Smartphone,
  BadgeCheck,
  Timer,
  TrendingUp,
  Mail,
  Phone,
  Globe,
  ChevronRight,
  Sparkles,
  Shield,
} from 'lucide-react'
import { FadeIn, GradientText, SpotlightCard } from '@/components/ui/ReactBits'
import LoginModal from '@/components/auth/LoginModal'
import Navbar from '@/components/layout/Navbar'

// Animated Counter Component
function AnimatedCounter({ end, duration = 2000, suffix = '', prefix = '' }) {
  const [count, setCount] = useState(0)
  const countRef = useRef(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 }
    )

    if (countRef.current) {
      observer.observe(countRef.current)
    }

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!isVisible) return

    let startTime
    const animate = currentTime => {
      if (!startTime) startTime = currentTime
      const progress = Math.min((currentTime - startTime) / duration, 1)
      setCount(Math.floor(progress * end))
      if (progress < 1) {
        requestAnimationFrame(animate)
      }
    }
    requestAnimationFrame(animate)
  }, [isVisible, end, duration])

  return (
    <span ref={countRef} className="tabular-nums">
      {prefix}
      {count.toLocaleString()}
      {suffix}
    </span>
  )
}

// Floating Badge Component
function FloatingBadge({ children, className = '' }) {
  return (
    <div
      className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-linear-to-r from-teal-500/10 to-cyan-500/10 border border-teal-500/20 backdrop-blur-sm ${className}`}
    >
      <Sparkles className="w-4 h-4 text-teal-500" />
      <span className="text-sm font-medium text-teal-600 dark:text-teal-300">{children}</span>
    </div>
  )
}

// Testimonial Card Component
function TestimonialCard({ quote, author, role, company, avatar }) {
  return (
    <SpotlightCard className="p-4 sm:p-8" spotlightColor="rgba(6, 182, 212, 0.15)">
      <div className="relative z-10">
        <Quote className="w-6 h-6 sm:w-10 sm:h-10 text-teal-500/30 mb-2 sm:mb-4" />
        <p className="text-muted-foreground text-sm sm:text-lg leading-relaxed mb-3 sm:mb-6">
          "{quote}"
        </p>
        <div className="flex items-center gap-2 sm:gap-4">
          <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-full bg-linear-to-br from-teal-500 to-cyan-600 flex items-center justify-center text-white font-bold text-sm sm:text-lg">
            {avatar}
          </div>
          <div>
            <p className="font-semibold text-foreground text-sm sm:text-base">{author}</p>
            <p className="text-xs sm:text-sm text-muted-foreground">
              {role} · {company}
            </p>
          </div>
        </div>
      </div>
    </SpotlightCard>
  )
}

// Pricing Card Component
function PricingCard({
  title,
  price,
  description,
  features,
  popular = false,
  ctaText = 'Get Started',
  onGetStarted,
}) {
  return (
    <SpotlightCard
      className={`p-4 sm:p-8 relative ${
        popular ? 'border-teal-500/50 ring-1 ring-teal-500/20' : ''
      }`}
      spotlightColor={popular ? 'rgba(6, 182, 212, 0.2)' : 'rgba(255, 255, 255, 0.1)'}
    >
      {popular && (
        <div className="absolute -top-3 sm:-top-4 right-1/9 translate-x-1/2 z-20">
          <span className="px-2 sm:px-4 py-1 sm:py-1.5 text-[10px] sm:text-xs font-semibold uppercase tracking-wider bg-linear-to-r from-teal-500 to-cyan-600 rounded-full text-white">
            Popular
          </span>
        </div>
      )}
      <div className="relative z-10">
        <h3 className="text-lg sm:text-xl font-semibold text-foreground mb-1 sm:mb-2">{title}</h3>
        <p className="text-muted-foreground text-xs sm:text-sm mb-3 sm:mb-6">{description}</p>
        <div className="mb-3 sm:mb-6">
          <span className="text-2xl sm:text-4xl font-bold text-foreground">{price}</span>
          {price !== 'Custom' && (
            <span className="text-muted-foreground text-sm ml-1 sm:ml-2">/mo</span>
          )}
        </div>
        <ul className="space-y-2 sm:space-y-4 mb-4 sm:mb-8">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start gap-2 sm:gap-3">
              <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-teal-500 shrink-0 mt-0.5" />
              <span className="text-muted-foreground text-xs sm:text-sm">{feature}</span>
            </li>
          ))}
        </ul>
        <Button
          onClick={onGetStarted}
          className={`w-full py-2 sm:py-3 text-sm sm:text-base transition-all duration-300 hover:scale-[1.02] cursor-pointer ${
            popular
              ? 'bg-linear-to-r from-teal-500 to-cyan-600 hover:from-teal-400 hover:to-cyan-500'
              : 'bg-secondary hover:bg-secondary/80 border border-border'
          }`}
        >
          {ctaText}
        </Button>
      </div>
    </SpotlightCard>
  )
}

// Step Card Component
function StepCard({ number, icon: Icon, title, description }) {
  return (
    <div className="relative group">
      <div className="absolute -inset-px bg-linear-to-r from-teal-500/20 to-cyan-500/20 rounded-xl sm:rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="relative bg-card border border-border rounded-xl sm:rounded-2xl p-4 sm:p-8 h-full">
        {/* Mobile: inline layout */}
        <div className="flex items-center gap-2 mb-2 sm:hidden">
          <div className="w-8 h-8 rounded-lg bg-linear-to-br from-teal-500 to-cyan-600 flex items-center justify-center text-white font-bold text-sm shrink-0">
            {number}
          </div>
          <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center shrink-0">
            <Icon className="w-4 h-4 text-teal-500" />
          </div>
          <h3 className="text-base font-semibold text-foreground">{title}</h3>
        </div>
        {/* Desktop: stacked layout */}
        <div className="hidden sm:flex items-center gap-4 mb-6">
          <div className="w-12 h-12 rounded-xl bg-linear-to-br from-teal-500 to-cyan-600 flex items-center justify-center text-white font-bold text-xl">
            {number}
          </div>
          <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center">
            <Icon className="w-6 h-6 text-teal-500" />
          </div>
        </div>
        <h3 className="hidden sm:block text-xl font-semibold text-foreground mb-3">{title}</h3>
        <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">{description}</p>
      </div>
    </div>
  )
}

export default function LandingPage() {
  const [isLoginOpen, setIsLoginOpen] = useState(false)

  const stats = [
    { value: 50000, suffix: '+', label: 'Tickets Issued', icon: CreditCard },
    { value: 99.9, suffix: '%', label: 'Uptime', icon: Zap },
    { value: 500, suffix: '+', label: 'Parking Zones', icon: MapPin },
    { value: 24, suffix: '/7', label: 'Support', icon: Users },
  ]

  const features = [
    {
      icon: Car,
      title: 'Vehicle Tracking',
      description:
        'Track license plates, vehicle types, and parking duration automatically with our intelligent OCR-powered system.',
      color: 'teal',
      gradient: 'from-teal-500 to-cyan-400',
    },
    {
      icon: MapPin,
      title: 'Smart Mapping',
      description:
        'Visual parking map to see occupied slots and manage capacity efficiently with real-time updates.',
      color: 'emerald',
      gradient: 'from-emerald-500 to-teal-400',
    },
    {
      icon: BarChart3,
      title: 'Revenue Analytics',
      description:
        'Comprehensive dashboards to monitor daily earnings and operational trends to maximize profit.',
      color: 'cyan',
      gradient: 'from-cyan-500 to-teal-400',
    },
    {
      icon: Clock,
      title: 'Time-Based Billing',
      description:
        'Automatic calculation of parking fees based on duration with customizable hourly rates.',
      color: 'teal',
      gradient: 'from-teal-600 to-emerald-400',
    },
    {
      icon: Shield,
      title: 'Secure & Reliable',
      description:
        'Enterprise-grade security with encrypted data storage and role-based access control.',
      color: 'slate',
      gradient: 'from-slate-500 to-teal-400',
    },
    {
      icon: Smartphone,
      title: 'Mobile Ready',
      description:
        'Fully responsive design works perfectly on any device - desktop, tablet, or smartphone.',
      color: 'sky',
      gradient: 'from-sky-500 to-cyan-400',
    },
  ]

  const steps = [
    {
      icon: Car,
      title: 'Vehicle Entry',
      description:
        'Officer scans or enters the vehicle license plate and selects the parking zone.',
    },
    {
      icon: CreditCard,
      title: 'Ticket Generation',
      description:
        'System automatically generates a digital ticket with entry time and estimated cost.',
    },
    {
      icon: Timer,
      title: 'Duration Tracking',
      description: 'Real-time tracking of parking duration with automatic billing calculation.',
    },
    {
      icon: CheckCircle2,
      title: 'Easy Checkout',
      description:
        'Quick checkout process with multiple payment options and instant receipt generation.',
    },
  ]

  const testimonials = [
    {
      quote:
        'This system has revolutionized how we manage our parking facility. Revenue is up 40% and complaints are down significantly.',
      author: 'Rajesh Kumar',
      role: 'Operations Manager',
      company: 'City Mall Chennai',
      avatar: 'RK',
    },
    {
      quote:
        'The real-time analytics help us make data-driven decisions. We can now optimize our pricing based on demand patterns.',
      author: 'Priya Sharma',
      role: 'Finance Director',
      company: 'Metro Parking Solutions',
      avatar: 'PS',
    },
    {
      quote:
        'Our officers love how intuitive the interface is. Training time has been reduced from days to just a few hours.',
      author: 'Amit Patel',
      role: 'HR Manager',
      company: 'Horizon Parking',
      avatar: 'AP',
    },
  ]

  const pricingPlans = [
    {
      title: 'Starter',
      price: '₹999',
      description: 'Perfect for small parking lots',
      features: [
        'Up to 50 parking slots',
        '2 officer accounts',
        'Basic analytics dashboard',
        'Email support',
        'Mobile responsive interface',
      ],
    },
    {
      title: 'Professional',
      price: '₹2,999',
      description: 'Ideal for growing businesses',
      features: [
        'Up to 300 parking slots',
        '10 officer accounts',
        'Advanced analytics & reports',
        'Priority email & phone support',
        'Custom branding',
      ],
      popular: true,
    },
    {
      title: 'Enterprise',
      price: 'Custom',
      description: 'For large-scale operations',
      features: [
        'Unlimited parking slots',
        'Unlimited officer accounts',
        '24/7 dedicated support',
        'Custom integrations',
        'On-premise deployment option',
      ],
      ctaText: 'Contact Sales',
    },
  ]

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
      {/* Navigation */}
      <Navbar onLoginClick={() => setIsLoginOpen(true)} />

      {/* Hero Section */}
      <section className="relative isolate pt-8 pb-16 bg-background">
        <FadeIn className="mx-auto max-w-7xl px-6 lg:px-8 text-center">
          <div className="mx-auto max-w-3xl">
            <FloatingBadge className="mb-6 sm:mb-8">
              Trusted by 500+ Parking Facilities
            </FloatingBadge>
            <GradientText
              className="text-3xl sm:text-5xl lg:text-7xl xl:text-8xl font-extrabold tracking-tight mb-6 sm:mb-8 py-2 px-4"
              colors={['#06b6d4', '#14b8a6', '#0f766e', '#06b6d4']}
              animationSpeed={4}
            >
              Parking Ticket Management
            </GradientText>
            <p className="mt-4 sm:mt-6 text-base sm:text-xl leading-7 sm:leading-8 text-muted-foreground max-w-2xl mx-auto px-2">
              Transform your parking operations with real-time analytics, and seamless vehicle
              tracking. Increase revenue by up to{' '}
              <span className="text-teal-500 font-semibold">40%</span>.
            </p>
            <div className="mt-6 sm:mt-12 flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 px-4 sm:px-0">
              <Button
                onClick={() => setIsLoginOpen(true)}
                className="w-full sm:w-auto bg-linear-to-r from-teal-500 to-cyan-600 hover:from-teal-400 hover:to-cyan-500 px-4 sm:px-8 py-3 sm:py-6 text-sm sm:text-lg transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-teal-500/25 cursor-pointer group"
              >
                Get Started Free
                <ArrowRight className="ml-1.5 sm:ml-2 w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Link href="/status" className="w-full sm:w-auto">
                <Button
                  variant="outline"
                  className="w-full sm:w-auto text-foreground border-teal-500/30 hover:bg-teal-500/10 hover:border-teal-400/50 px-4 sm:px-8 py-3 sm:py-6 text-sm sm:text-lg transition-all duration-300 hover:scale-105"
                >
                  Check Status
                </Button>
              </Link>
            </div>
            <p className="mt-3 sm:mt-4 text-[10px] sm:text-sm text-muted-foreground">
              No credit card required · 14-day free trial · Cancel anytime
            </p>
          </div>
        </FadeIn>

        {/* Dashboard Preview */}
        <FadeIn delay={0.3} className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 mt-8 sm:mt-20">
          <div className="relative">
            <div className="absolute -inset-2 sm:-inset-4 bg-linear-to-r from-teal-500/20 via-cyan-500/20 to-teal-500/20 rounded-2xl sm:rounded-3xl blur-2xl sm:blur-3xl" />
            <div className="relative rounded-lg sm:rounded-2xl border border-border bg-card backdrop-blur-xl overflow-hidden shadow-xl sm:shadow-2xl">
              <div className="flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-1.5 sm:py-3 border-b border-border bg-secondary/50">
                <div className="w-1.5 h-1.5 sm:w-3 sm:h-3 rounded-full bg-red-500" />
                <div className="w-1.5 h-1.5 sm:w-3 sm:h-3 rounded-full bg-yellow-500" />
                <div className="w-1.5 h-1.5 sm:w-3 sm:h-3 rounded-full bg-green-500" />
                <span className="ml-2 sm:ml-4 text-[10px] sm:text-xs text-muted-foreground hidden sm:inline">
                  dashboard.parksmart.io
                </span>
              </div>
              <div className="p-2 sm:p-8 grid grid-cols-3 gap-1.5 sm:gap-6">
                <div className="bg-linear-to-br from-teal-500/10 to-teal-500/5 border border-teal-500/20 rounded-lg sm:rounded-xl p-2 sm:p-6">
                  <div className="flex items-center justify-between mb-1 sm:mb-4">
                    <span className="text-muted-foreground text-[8px] sm:text-sm">Revenue</span>
                    <TrendingUp className="w-3 h-3 sm:w-5 sm:h-5 text-teal-500" />
                  </div>
                  <p className="text-sm sm:text-3xl font-bold text-foreground">₹24.5K</p>
                  <p className="text-teal-500 text-[8px] sm:text-sm mt-0.5 sm:mt-2">+12%</p>
                </div>
                <div className="bg-linear-to-br from-cyan-500/10 to-cyan-500/5 border border-cyan-500/20 rounded-lg sm:rounded-xl p-2 sm:p-6">
                  <div className="flex items-center justify-between mb-1 sm:mb-4">
                    <span className="text-muted-foreground text-[8px] sm:text-sm">Vehicles</span>
                    <Car className="w-3 h-3 sm:w-5 sm:h-5 text-cyan-500" />
                  </div>
                  <p className="text-sm sm:text-3xl font-bold text-foreground">42</p>
                  <p className="text-muted-foreground text-[8px] sm:text-sm mt-0.5 sm:mt-2">
                    8 free
                  </p>
                </div>
                <div className="bg-linear-to-br from-emerald-500/10 to-emerald-500/5 border border-emerald-500/20 rounded-lg sm:rounded-xl p-2 sm:p-6">
                  <div className="flex items-center justify-between mb-1 sm:mb-4">
                    <span className="text-muted-foreground text-[8px] sm:text-sm">Tickets</span>
                    <CreditCard className="w-3 h-3 sm:w-5 sm:h-5 text-emerald-500" />
                  </div>
                  <p className="text-sm sm:text-3xl font-bold text-foreground">156</p>
                  <p className="text-muted-foreground text-[8px] sm:text-sm mt-0.5 sm:mt-2">
                    Today
                  </p>
                </div>
              </div>
            </div>
          </div>
        </FadeIn>
      </section>

      {/* Stats Section */}
      <section className="py-6 sm:py-16 border-y border-border bg-linear-to-b from-background to-secondary/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-8">
            {stats.map((stat, index) => (
              <FadeIn key={index} delay={index * 0.1}>
                <div className="text-center group">
                  <div className="inline-flex items-center justify-center w-8 h-8 sm:w-14 sm:h-14 rounded-lg sm:rounded-2xl bg-linear-to-br from-teal-500/20 to-cyan-500/20 border border-border mb-2 sm:mb-4 group-hover:scale-110 transition-transform duration-300">
                    <stat.icon className="w-4 h-4 sm:w-7 sm:h-7 text-teal-500" />
                  </div>
                  <p className="text-xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-0.5 sm:mb-2">
                    <AnimatedCounter end={stat.value} suffix={stat.suffix} />
                  </p>
                  <p className="text-muted-foreground text-[10px] sm:text-sm">{stat.label}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        <FadeIn className="mx-auto max-w-2xl lg:text-center mb-6 sm:mb-16">
          <span className="inline-block px-2 sm:px-4 py-1 sm:py-1.5 text-[10px] sm:text-xs font-semibold uppercase tracking-wider bg-teal-500/10 text-teal-500 rounded-full mb-2 sm:mb-4">
            Features
          </span>
          <h2 className="text-xl sm:text-3xl lg:text-5xl font-bold tracking-tight text-foreground mb-2 sm:mb-6">
            Everything you need to manage parking
          </h2>
          <p className="text-sm sm:text-lg text-muted-foreground">
            Powerful tools designed to streamline operations, increase revenue, and delight your
            customers.
          </p>
        </FadeIn>
        <div className="mx-auto max-w-2xl lg:max-w-none">
          <div className="grid grid-cols-1 gap-3 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <FadeIn key={index} delay={index * 0.1}>
                <SpotlightCard
                  className="p-4 sm:p-8 h-full group"
                  spotlightColor="rgba(6, 182, 212, 0.15)"
                >
                  <div className="flex flex-col h-full relative z-10">
                    <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-4">
                      <div
                        className={`rounded-lg sm:rounded-xl bg-linear-to-br ${feature.gradient} p-2 sm:p-3 group-hover:scale-110 transition-transform duration-300 shrink-0`}
                      >
                        <feature.icon
                          className="h-4 w-4 sm:h-5 sm:w-5 text-white"
                          aria-hidden="true"
                        />
                      </div>
                      <h3 className="text-base sm:text-lg font-semibold text-foreground">
                        {feature.title}
                      </h3>
                    </div>
                    <p className="flex-auto text-sm sm:text-base leading-6 sm:leading-7 text-muted-foreground">
                      {feature.description}
                    </p>
                    <div className="mt-3 sm:mt-6 flex items-center text-teal-500 text-xs sm:text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      Learn more <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 ml-1" />
                    </div>
                  </div>
                </SpotlightCard>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section
        id="how-it-works"
        className="py-6 sm:py-8 bg-linear-to-b from-background to-secondary/30"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <FadeIn className="mx-auto max-w-2xl lg:text-center mb-6 sm:mb-16">
            <span className="inline-block px-2 sm:px-4 py-1 sm:py-1.5 text-[10px] sm:text-xs font-semibold uppercase tracking-wider bg-cyan-500/10 text-cyan-500 rounded-full mb-2 sm:mb-4">
              How It Works
            </span>
            <h2 className="text-xl sm:text-3xl lg:text-5xl font-bold tracking-tight text-foreground mb-2 sm:mb-6">
              Simple, efficient, and powerful
            </h2>
            <p className="text-sm sm:text-lg text-muted-foreground">
              Get your parking operations running smoothly in four simple steps.
            </p>
          </FadeIn>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-8">
            {steps.map((step, index) => (
              <FadeIn key={index} delay={index * 0.15}>
                <StepCard
                  number={index + 1}
                  icon={step.icon}
                  title={step.title}
                  description={step.description}
                />
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-32">
        <FadeIn className="mx-auto max-w-2xl lg:text-center mb-6 sm:mb-16">
          <span className="inline-block px-2 sm:px-4 py-1 sm:py-1.5 text-[10px] sm:text-xs font-semibold uppercase tracking-wider bg-emerald-500/10 text-emerald-500 rounded-full mb-2 sm:mb-4">
            Testimonials
          </span>
          <h2 className="text-xl sm:text-3xl lg:text-5xl font-bold tracking-tight text-foreground mb-2 sm:mb-6">
            Loved by parking operators
          </h2>
          <p className="text-sm sm:text-lg text-muted-foreground">
            See what our customers have to say about their experience with PARKINGTICKET.
          </p>
        </FadeIn>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-8">
          {testimonials.map((testimonial, index) => (
            <FadeIn key={index} delay={index * 0.1}>
              <TestimonialCard {...testimonial} />
            </FadeIn>
          ))}
        </div>
        <FadeIn delay={0.4} className="mt-6 sm:mt-12 text-center">
          <div className="inline-flex items-center gap-1 sm:gap-2 text-muted-foreground">
            <div className="flex -space-x-1 sm:-space-x-2">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="w-5 h-5 sm:w-8 sm:h-8 rounded-full bg-linear-to-br from-teal-500 to-cyan-600 border-2 border-background flex items-center justify-center text-[8px] sm:text-xs text-white font-medium"
                >
                  {String.fromCharCode(65 + i)}
                </div>
              ))}
            </div>
            <span className="ml-2 sm:ml-3 text-xs sm:text-base">Join 500+ parking facilities</span>
          </div>
        </FadeIn>
      </section>

      {/* Pricing */}
      <section
        id="pricing"
        className="py-8 sm:py-32 bg-linear-to-b from-background to-secondary/30"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <FadeIn className="mx-auto max-w-2xl lg:text-center mb-6 sm:mb-16">
            <span className="inline-block px-2 sm:px-4 py-1 sm:py-1.5 text-[10px] sm:text-xs font-semibold uppercase tracking-wider bg-amber-500/10 text-amber-500 rounded-full mb-2 sm:mb-4">
              Pricing
            </span>
            <h2 className="text-xl sm:text-3xl lg:text-5xl font-bold tracking-tight text-foreground mb-2 sm:mb-6">
              Plans that scale with your business
            </h2>
            <p className="text-sm sm:text-lg text-muted-foreground">
              Choose the perfect plan for your parking facility. All plans include a 14-day free
              trial.
            </p>
          </FadeIn>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-8 max-w-5xl mx-auto">
            {pricingPlans.map((plan, index) => (
              <FadeIn key={index} delay={index * 0.1}>
                <PricingCard {...plan} onGetStarted={() => setIsLoginOpen(true)} />
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-24">
        <FadeIn>
          <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl">
            <div className="absolute inset-0 bg-linear-to-r from-teal-600 to-cyan-600" />
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRjMC0yLTItNC00LTRzLTQgMi00IDQgMiA0IDQgNCA0LTIgNC00eiIvPjwvZz48L2c+PC9zdmc+')] opacity-30" />
            <div className="relative px-4 py-8 sm:px-16 sm:py-24 text-center">
              <h2 className="text-xl sm:text-4xl font-bold text-white mb-3 sm:mb-6">
                Ready to transform your parking?
              </h2>
              <p className="text-sm sm:text-lg text-white/80 mb-4 sm:mb-8 max-w-2xl mx-auto">
                Join hundreds of parking facilities that have already modernized their operations.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4">
                <Button
                  onClick={() => setIsLoginOpen(true)}
                  className="w-full sm:w-auto bg-white text-teal-700 hover:bg-gray-100 px-4 sm:px-8 py-3 sm:py-6 text-sm sm:text-lg font-semibold transition-all duration-300 hover:scale-105"
                >
                  Start Free Trial
                  <ArrowRight className="ml-1.5 sm:ml-2 w-4 h-4 sm:w-5 sm:h-5" />
                </Button>
                <Button
                  variant="outline"
                  className="w-full sm:w-auto border-white/30 text-white hover:bg-white/10 px-4 sm:px-8 py-3 sm:py-6 text-sm sm:text-lg"
                >
                  Schedule Demo
                </Button>
              </div>
            </div>
          </div>
        </FadeIn>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 sm:gap-8 mb-6 sm:mb-12">
            <div className="md:col-span-1">
              <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-6">
                <Image
                  src="/logo2.png"
                  alt="PARKINGTICKET Logo"
                  width={32}
                  height={32}
                  className="rounded-lg sm:w-10 sm:h-10"
                />
                <span className="text-base sm:text-xl font-bold bg-linear-to-r from-teal-400 to-cyan-300 bg-clip-text text-transparent">
                  PARKINGTICKET
                </span>
              </div>
              <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed mb-3 sm:mb-6">
                Modern parking management solution for the digital age.
              </p>
              <div className="flex items-center gap-2 sm:gap-4">
                <a
                  href="#"
                  className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-secondary hover:bg-secondary/80 flex items-center justify-center transition-colors"
                >
                  <Globe className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground" />
                </a>
                <a
                  href="#"
                  className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-secondary hover:bg-secondary/80 flex items-center justify-center transition-colors"
                >
                  <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground" />
                </a>
                <a
                  href="#"
                  className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-secondary hover:bg-secondary/80 flex items-center justify-center transition-colors"
                >
                  <Phone className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground" />
                </a>
              </div>
            </div>
            {/* Links Grid - 3 columns on mobile */}
            <div className="col-span-1 md:col-span-3 grid grid-cols-3 gap-4 sm:gap-8">
              <div>
                <h4 className="text-foreground font-semibold text-xs sm:text-base mb-2 sm:mb-4">
                  Product
                </h4>
                <ul className="space-y-1 sm:space-y-3">
                  <li>
                    <a
                      href="#features"
                      className="text-muted-foreground hover:text-teal-500 text-[10px] sm:text-sm transition-colors"
                    >
                      Features
                    </a>
                  </li>
                  <li>
                    <a
                      href="#pricing"
                      className="text-muted-foreground hover:text-teal-500 text-[10px] sm:text-sm transition-colors"
                    >
                      Pricing
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-muted-foreground hover:text-teal-500 text-[10px] sm:text-sm transition-colors"
                    >
                      API Docs
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-muted-foreground hover:text-teal-500 text-[10px] sm:text-sm transition-colors"
                    >
                      Changelog
                    </a>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="text-foreground font-semibold text-xs sm:text-base mb-2 sm:mb-4">
                  Company
                </h4>
                <ul className="space-y-1 sm:space-y-3">
                  <li>
                    <a
                      href="#"
                      className="text-muted-foreground hover:text-teal-500 text-[10px] sm:text-sm transition-colors"
                    >
                      About Us
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-muted-foreground hover:text-teal-500 text-[10px] sm:text-sm transition-colors"
                    >
                      Careers
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-muted-foreground hover:text-teal-500 text-[10px] sm:text-sm transition-colors"
                    >
                      Blog
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-muted-foreground hover:text-teal-500 text-[10px] sm:text-sm transition-colors"
                    >
                      Contact
                    </a>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="text-foreground font-semibold text-xs sm:text-base mb-2 sm:mb-4">
                  Legal
                </h4>
                <ul className="space-y-1 sm:space-y-3">
                  <li>
                    <a
                      href="#"
                      className="text-muted-foreground hover:text-teal-500 text-[10px] sm:text-sm transition-colors"
                    >
                      Privacy
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-muted-foreground hover:text-teal-500 text-[10px] sm:text-sm transition-colors"
                    >
                      Terms
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-muted-foreground hover:text-teal-500 text-[10px] sm:text-sm transition-colors"
                    >
                      Cookies
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-muted-foreground hover:text-teal-500 text-[10px] sm:text-sm transition-colors"
                    >
                      Security
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="pt-4 sm:pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-4">
            <p className="text-muted-foreground text-xs sm:text-sm">
              © {new Date().getFullYear()} PARKINGTICKET. All rights reserved.
            </p>
            <div className="flex items-center gap-3 sm:gap-6">
              <span className="flex items-center gap-1 sm:gap-2 text-[10px] sm:text-sm text-muted-foreground">
                <BadgeCheck className="w-3 h-3 sm:w-4 sm:h-4 text-teal-500" />
                SSL Secured
              </span>
              <span className="flex items-center gap-1 sm:gap-2 text-[10px] sm:text-sm text-muted-foreground">
                <ShieldCheck className="w-3 h-3 sm:w-4 sm:h-4 text-teal-500" />
                GDPR Compliant
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
