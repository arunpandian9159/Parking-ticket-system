&apos;use client&apos;

import { useState, useEffect, useRef } from &apos;react&apos;
import Link from &apos;next/link&apos;
import { Button } from &apos;@/components/ui/Button&apos;
import {
    Car, ShieldCheck, BarChart3, MapPin, Clock, CreditCard,
    Users, Zap, CheckCircle2, ArrowRight, Star, Quote,
    Smartphone, Building2, BadgeCheck, Timer, TrendingUp,
    Mail, Phone, Globe, ChevronRight, Sparkles, Shield
} from &apos;lucide-react&apos;
import { AnimatedBackground, FadeIn, GradientText, SpotlightCard } from &apos;@/components/ui/ReactBits&apos;
import LoginModal from &apos;@/components/auth/LoginModal&apos;

// Animated Counter Component
function AnimatedCounter({ end, duration = 2000, suffix = &apos;&apos;, prefix = &apos;&apos; }) {
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
        const animate = (currentTime) => {
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
            {prefix}{count.toLocaleString()}{suffix}
        </span>
    )
}

// Floating Badge Component
function FloatingBadge({ children, className = "" }) {
    return (
        <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 backdrop-blur-sm ${className}`}>
            <Sparkles className="w-4 h-4 text-blue-400" />
            <span className="text-sm font-medium text-blue-300">{children}</span>
        </div>
    )
}

// Testimonial Card Component
function TestimonialCard({ quote, author, role, company, avatar }) {
    return (
        <SpotlightCard className="p-8" spotlightColor="rgba(59, 130, 246, 0.15)">
            <div className="relative z-10">
                <Quote className="w-10 h-10 text-blue-500/30 mb-4" />
                <p className="text-gray-300 text-lg leading-relaxed mb-6">&ldquo;{quote}&rdquo;</p>
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg">
                        {avatar}
                    </div>
                    <div>
                        <p className="font-semibold text-white">{author}</p>
                        <p className="text-sm text-gray-400">{role} · {company}</p>
                    </div>
                </div>
            </div>
        </SpotlightCard>
    )
}

// Pricing Card Component
function PricingCard({ title, price, description, features, popular = false, ctaText = "Get Started" }) {
    return (
        <SpotlightCard
            className={`p-8 relative ${popular ? &apos;border-blue-500/50 ring-1 ring-blue-500/20&apos; : &apos;&apos;}`}
            spotlightColor={popular ? "rgba(59, 130, 246, 0.2)" : "rgba(255, 255, 255, 0.1)"}
        >
            {popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="px-4 py-1.5 text-xs font-semibold uppercase tracking-wider bg-gradient-to-r from-blue-500 to-purple-600 rounded-full text-white">
                        Most Popular
                    </span>
                </div>
            )}
            <div className="relative z-10">
                <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
                <p className="text-gray-400 text-sm mb-6">{description}</p>
                <div className="mb-6">
                    <span className="text-4xl font-bold text-white">{price}</span>
                    {price !== "Custom" && <span className="text-gray-400 ml-2">/month</span>}
                </div>
                <ul className="space-y-4 mb-8">
                    {features.map((feature, index) => (
                        <li key={index} className="flex items-start gap-3">
                            <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                            <span className="text-gray-300 text-sm">{feature}</span>
                        </li>
                    ))}
                </ul>
                <Button
                    className={`w-full py-3 transition-all duration-300 hover:scale-[1.02] ${popular
                        ? &apos;bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-400 hover:to-purple-500&apos;
                        : &apos;bg-white/10 hover:bg-white/20 border border-white/10&apos;
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
            <div className="absolute -inset-px bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative bg-neutral-900/80 border border-neutral-800 rounded-2xl p-8 h-full">
                <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-xl">
                        {number}
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-neutral-800 flex items-center justify-center">
                        <Icon className="w-6 h-6 text-blue-400" />
                    </div>
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">{title}</h3>
                <p className="text-gray-400 leading-relaxed">{description}</p>
            </div>
        </div>
    )
}

export default function LandingPage() {
    const [isLoginOpen, setIsLoginOpen] = useState(false)

    const stats = [
        { value: 50000, suffix: &apos;+&apos;, label: &apos;Tickets Issued&apos;, icon: CreditCard },
        { value: 99.9, suffix: &apos;%&apos;, label: &apos;Uptime&apos;, icon: Zap },
        { value: 500, suffix: &apos;+&apos;, label: &apos;Parking Zones&apos;, icon: MapPin },
        { value: 24, suffix: &apos;/7&apos;, label: &apos;Support&apos;, icon: Users },
    ]

    const features = [
        {
            icon: Car,
            title: &apos;Vehicle Tracking&apos;,
            description: &apos;Track license plates, vehicle types, and parking duration automatically with our intelligent OCR-powered system.&apos;,
            color: &apos;blue&apos;,
            gradient: &apos;from-blue-500 to-cyan-400&apos;
        },
        {
            icon: MapPin,
            title: &apos;Smart Mapping&apos;,
            description: &apos;Visual parking map to see occupied slots and manage capacity efficiently with real-time updates.&apos;,
            color: &apos;green&apos;,
            gradient: &apos;from-green-500 to-emerald-400&apos;
        },
        {
            icon: BarChart3,
            title: &apos;Revenue Analytics&apos;,
            description: &apos;Comprehensive dashboards to monitor daily earnings and operational trends to maximize profit.&apos;,
            color: &apos;purple&apos;,
            gradient: &apos;from-purple-500 to-pink-400&apos;
        },
        {
            icon: Clock,
            title: &apos;Time-Based Billing&apos;,
            description: &apos;Automatic calculation of parking fees based on duration with customizable hourly rates.&apos;,
            color: &apos;orange&apos;,
            gradient: &apos;from-orange-500 to-amber-400&apos;
        },
        {
            icon: Shield,
            title: &apos;Secure & Reliable&apos;,
            description: &apos;Enterprise-grade security with encrypted data storage and role-based access control.&apos;,
            color: &apos;red&apos;,
            gradient: &apos;from-red-500 to-rose-400&apos;
        },
        {
            icon: Smartphone,
            title: &apos;Mobile Ready&apos;,
            description: &apos;Fully responsive design works perfectly on any device - desktop, tablet, or smartphone.&apos;,
            color: &apos;indigo&apos;,
            gradient: &apos;from-indigo-500 to-violet-400&apos;
        },
    ]

    const steps = [
        {
            icon: Car,
            title: &apos;Vehicle Entry&apos;,
            description: &apos;Officer scans or enters the vehicle license plate and selects the parking zone.&apos;
        },
        {
            icon: CreditCard,
            title: &apos;Ticket Generation&apos;,
            description: &apos;System automatically generates a digital ticket with entry time and estimated cost.&apos;
        },
        {
            icon: Timer,
            title: &apos;Duration Tracking&apos;,
            description: &apos;Real-time tracking of parking duration with automatic billing calculation.&apos;
        },
        {
            icon: CheckCircle2,
            title: &apos;Easy Checkout&apos;,
            description: &apos;Quick checkout process with multiple payment options and instant receipt generation.&apos;
        },
    ]

    const testimonials = [
        {
            quote: "This system has revolutionized how we manage our parking facility. Revenue is up 40% and complaints are down significantly.",
            author: "Rajesh Kumar",
            role: "Operations Manager",
            company: "City Mall Chennai",
            avatar: "RK"
        },
        {
            quote: "The real-time analytics help us make data-driven decisions. We can now optimize our pricing based on demand patterns.",
            author: "Priya Sharma",
            role: "Finance Director",
            company: "Metro Parking Solutions",
            avatar: "PS"
        },
        {
            quote: "Our officers love how intuitive the interface is. Training time has been reduced from days to just a few hours.",
            author: "Amit Patel",
            role: "HR Manager",
            company: "Horizon Parking",
            avatar: "AP"
        },
    ]

    const pricingPlans = [
        {
            title: "Starter",
            price: "₹2,999",
            description: "Perfect for small parking lots",
            features: [
                "Up to 50 parking slots",
                "2 officer accounts",
                "Basic analytics dashboard",
                "Email support",
                "Mobile responsive interface"
            ]
        },
        {
            title: "Professional",
            price: "₹7,999",
            description: "Ideal for growing businesses",
            features: [
                "Up to 200 parking slots",
                "10 officer accounts",
                "Advanced analytics & reports",
                "Priority email & phone support",
                "Custom branding",
                "API access"
            ],
            popular: true
        },
        {
            title: "Enterprise",
            price: "Custom",
            description: "For large-scale operations",
            features: [
                "Unlimited parking slots",
                "Unlimited officer accounts",
                "White-label solution",
                "24/7 dedicated support",
                "Custom integrations",
                "On-premise deployment option"
            ],
            ctaText: "Contact Sales"
        },
    ]

    return (
        <div className="min-h-screen bg-neutral-950 text-white overflow-x-hidden">
            <AnimatedBackground />
            <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />

            {/* Navigation */}
            <nav className="fixed top-0 left-0 right-0 z-50 bg-neutral-950/80 backdrop-blur-xl border-b border-white/5">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                                <Car className="w-6 h-6 text-white" />
                            </div>
                            <span className="text-xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                                ParkSmart
                            </span>
                        </div>
                        <div className="hidden md:flex items-center gap-8">
                            <a href="#features" className="text-gray-400 hover:text-white transition-colors text-sm font-medium">Features</a>
                            <a href="#how-it-works" className="text-gray-400 hover:text-white transition-colors text-sm font-medium">How It Works</a>
                            <a href="#testimonials" className="text-gray-400 hover:text-white transition-colors text-sm font-medium">Testimonials</a>
                            <a href="#pricing" className="text-gray-400 hover:text-white transition-colors text-sm font-medium">Pricing</a>
                        </div>
                        <div className="flex items-center gap-4">
                            <Link href="/status">
                                <Button variant="ghost" className="text-gray-400 hover:text-white hover:bg-white/10 text-sm">
                                    Check Status
                                </Button>
                            </Link>
                            <Button
                                onClick={() => setIsLoginOpen(true)}
                                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-400 hover:to-purple-500 text-sm px-5"
                            >
                                Login
                            </Button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative isolate pt-32 sm:pt-40 lg:pt-48 pb-16 bg-neutral-950">
                <FadeIn className="mx-auto max-w-7xl px-6 lg:px-8 text-center">
                    <div className="mx-auto max-w-3xl">
                        <FloatingBadge className="mb-8">Trusted by 500+ Parking Facilities</FloatingBadge>
                        <GradientText
                            className="text-5xl font-bold tracking-tight sm:text-7xl lg:text-8xl mb-8 py-2 px-4"
                            colors={["#60A5FA", "#A78BFA", "#34D399", "#60A5FA"]}
                            animationSpeed={4}
                        >
                            Smart Parking Management
                        </GradientText>
                        <p className="mt-6 text-xl leading-8 text-gray-300 max-w-2xl mx-auto">
                            Transform your parking operations with AI-powered ticketing, real-time analytics,
                            and seamless vehicle tracking. Increase revenue by up to <span className="text-green-400 font-semibold">40%</span>.
                        </p>
                        <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Button
                                onClick={() => setIsLoginOpen(true)}
                                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-400 hover:to-purple-500 px-8 py-6 text-lg transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-blue-500/25 cursor-pointer group"
                            >
                                Get Started Free
                                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </Button>
                            <Link href="/status">
                                <Button
                                    variant="outline"
                                    className="text-white border-white/20 hover:bg-white/10 px-8 py-6 text-lg transition-all duration-300 hover:scale-105 hover:border-white/40"
                                >
                                    Check Vehicle Status
                                </Button>
                            </Link>
                        </div>
                        <p className="mt-4 text-sm text-gray-500">
                            No credit card required · 14-day free trial · Cancel anytime
                        </p>
                    </div>
                </FadeIn>

                {/* Dashboard Preview */}
                <FadeIn delay={0.3} className="mx-auto max-w-6xl px-6 lg:px-8 mt-20">
                    <div className="relative">
                        <div className="absolute -inset-4 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 rounded-3xl blur-3xl" />
                        <div className="relative rounded-2xl border border-white/10 bg-neutral-900/80 backdrop-blur-xl overflow-hidden shadow-2xl">
                            <div className="flex items-center gap-2 px-4 py-3 border-b border-white/10 bg-neutral-900/50">
                                <div className="w-3 h-3 rounded-full bg-red-500" />
                                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                                <div className="w-3 h-3 rounded-full bg-green-500" />
                                <span className="ml-4 text-xs text-gray-500">dashboard.parksmart.io</span>
                            </div>
                            <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="bg-gradient-to-br from-blue-500/10 to-blue-500/5 border border-blue-500/20 rounded-xl p-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <span className="text-gray-400 text-sm">Today&apos;s Revenue</span>
                                        <TrendingUp className="w-5 h-5 text-green-400" />
                                    </div>
                                    <p className="text-3xl font-bold text-white">₹24,500</p>
                                    <p className="text-green-400 text-sm mt-2">+12% from yesterday</p>
                                </div>
                                <div className="bg-gradient-to-br from-purple-500/10 to-purple-500/5 border border-purple-500/20 rounded-xl p-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <span className="text-gray-400 text-sm">Active Vehicles</span>
                                        <Car className="w-5 h-5 text-purple-400" />
                                    </div>
                                    <p className="text-3xl font-bold text-white">42</p>
                                    <p className="text-gray-400 text-sm mt-2">8 slots available</p>
                                </div>
                                <div className="bg-gradient-to-br from-green-500/10 to-green-500/5 border border-green-500/20 rounded-xl p-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <span className="text-gray-400 text-sm">Tickets Issued</span>
                                        <CreditCard className="w-5 h-5 text-green-400" />
                                    </div>
                                    <p className="text-3xl font-bold text-white">156</p>
                                    <p className="text-gray-400 text-sm mt-2">Today&apos;s count</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </FadeIn>
            </section>

            {/* Stats Section */}
            <section className="py-16 border-y border-white/5 bg-gradient-to-b from-neutral-950 to-neutral-900/50">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                        {stats.map((stat, index) => (
                            <FadeIn key={index} delay={index * 0.1}>
                                <div className="text-center group">
                                    <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-white/10 mb-4 group-hover:scale-110 transition-transform duration-300">
                                        <stat.icon className="w-7 h-7 text-blue-400" />
                                    </div>
                                    <p className="text-4xl sm:text-5xl font-bold text-white mb-2">
                                        <AnimatedCounter end={stat.value} suffix={stat.suffix} />
                                    </p>
                                    <p className="text-gray-400 text-sm">{stat.label}</p>
                                </div>
                            </FadeIn>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features Grid */}
            <section id="features" className="mx-auto max-w-7xl px-6 lg:px-8 py-24 sm:py-32">
                <FadeIn className="mx-auto max-w-2xl lg:text-center mb-16">
                    <span className="inline-block px-4 py-1.5 text-xs font-semibold uppercase tracking-wider bg-blue-500/10 text-blue-400 rounded-full mb-4">
                        Features
                    </span>
                    <h2 className="text-3xl font-bold tracking-tight text-white sm:text-5xl mb-6">
                        Everything you need to manage parking
                    </h2>
                    <p className="text-lg text-gray-400">
                        Powerful tools designed to streamline operations, increase revenue, and delight your customers.
                    </p>
                </FadeIn>
                <div className="mx-auto max-w-2xl lg:max-w-none">
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {features.map((feature, index) => (
                            <FadeIn key={index} delay={index * 0.1}>
                                <SpotlightCard className="p-8 h-full group" spotlightColor={`rgba(59, 130, 246, 0.15)`}>
                                    <div className="flex flex-col items-start h-full relative z-10">
                                        <div className={`rounded-xl bg-gradient-to-br ${feature.gradient} p-3 mb-6 group-hover:scale-110 transition-transform duration-300`}>
                                            <feature.icon className="h-6 w-6 text-white" aria-hidden="true" />
                                        </div>
                                        <h3 className="text-xl font-semibold leading-7 text-white mb-3">{feature.title}</h3>
                                        <p className="flex-auto text-base leading-7 text-gray-400">
                                            {feature.description}
                                        </p>
                                        <div className="mt-6 flex items-center text-blue-400 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                            Learn more <ChevronRight className="w-4 h-4 ml-1" />
                                        </div>
                                    </div>
                                </SpotlightCard>
                            </FadeIn>
                        ))}
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section id="how-it-works" className="py-24 sm:py-32 bg-gradient-to-b from-neutral-950 to-neutral-900/30">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <FadeIn className="mx-auto max-w-2xl lg:text-center mb-16">
                        <span className="inline-block px-4 py-1.5 text-xs font-semibold uppercase tracking-wider bg-purple-500/10 text-purple-400 rounded-full mb-4">
                            How It Works
                        </span>
                        <h2 className="text-3xl font-bold tracking-tight text-white sm:text-5xl mb-6">
                            Simple, efficient, and powerful
                        </h2>
                        <p className="text-lg text-gray-400">
                            Get your parking operations running smoothly in four simple steps.
                        </p>
                    </FadeIn>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
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
            <section id="testimonials" className="mx-auto max-w-7xl px-6 lg:px-8 py-24 sm:py-32">
                <FadeIn className="mx-auto max-w-2xl lg:text-center mb-16">
                    <span className="inline-block px-4 py-1.5 text-xs font-semibold uppercase tracking-wider bg-green-500/10 text-green-400 rounded-full mb-4">
                        Testimonials
                    </span>
                    <h2 className="text-3xl font-bold tracking-tight text-white sm:text-5xl mb-6">
                        Loved by parking operators everywhere
                    </h2>
                    <p className="text-lg text-gray-400">
                        See what our customers have to say about their experience with ParkSmart.
                    </p>
                </FadeIn>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {testimonials.map((testimonial, index) => (
                        <FadeIn key={index} delay={index * 0.1}>
                            <TestimonialCard {...testimonial} />
                        </FadeIn>
                    ))}
                </div>
                <FadeIn delay={0.4} className="mt-12 text-center">
                    <div className="inline-flex items-center gap-2 text-gray-400">
                        <div className="flex -space-x-2">
                            {[...Array(5)].map((_, i) => (
                                <div key={i} className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 border-2 border-neutral-950 flex items-center justify-center text-xs text-white font-medium">
                                    {String.fromCharCode(65 + i)}
                                </div>
                            ))}
                        </div>
                        <span className="ml-3">Join 500+ parking facilities already using ParkSmart</span>
                    </div>
                </FadeIn>
            </section>

            {/* Pricing */}
            <section id="pricing" className="py-24 sm:py-32 bg-gradient-to-b from-neutral-950 to-neutral-900/30">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <FadeIn className="mx-auto max-w-2xl lg:text-center mb-16">
                        <span className="inline-block px-4 py-1.5 text-xs font-semibold uppercase tracking-wider bg-orange-500/10 text-orange-400 rounded-full mb-4">
                            Pricing
                        </span>
                        <h2 className="text-3xl font-bold tracking-tight text-white sm:text-5xl mb-6">
                            Plans that scale with your business
                        </h2>
                        <p className="text-lg text-gray-400">
                            Choose the perfect plan for your parking facility. All plans include a 14-day free trial.
                        </p>
                    </FadeIn>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                        {pricingPlans.map((plan, index) => (
                            <FadeIn key={index} delay={index * 0.1}>
                                <PricingCard {...plan} />
                            </FadeIn>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="mx-auto max-w-7xl px-6 lg:px-8 py-24">
                <FadeIn>
                    <div className="relative overflow-hidden rounded-3xl">
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600" />
                        <div className="absolute inset-0 bg-[url(&apos;data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRjMC0yLTItNC00LTRzLTQgMi00IDQgMiA0IDQgNCA0LTIgNC00eiIvPjwvZz48L2c+PC9zdmc+&apos;)] opacity-30" />
                        <div className="relative px-8 py-16 sm:px-16 sm:py-24 text-center">
                            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
                                Ready to transform your parking operations?
                            </h2>
                            <p className="text-lg text-white/80 mb-8 max-w-2xl mx-auto">
                                Join hundreds of parking facilities that have already modernized their operations with ParkSmart.
                            </p>
                            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                                <Button
                                    onClick={() => setIsLoginOpen(true)}
                                    className="bg-white text-gray-900 hover:bg-gray-100 px-8 py-6 text-lg font-semibold transition-all duration-300 hover:scale-105"
                                >
                                    Start Free Trial
                                    <ArrowRight className="ml-2 w-5 h-5" />
                                </Button>
                                <Button
                                    variant="outline"
                                    className="border-white/30 text-white hover:bg-white/10 px-8 py-6 text-lg"
                                >
                                    Schedule Demo
                                </Button>
                            </div>
                        </div>
                    </div>
                </FadeIn>
            </section>

            {/* Footer */}
            <footer className="border-t border-white/5 bg-neutral-950">
                <div className="mx-auto max-w-7xl px-6 lg:px-8 py-16">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
                        <div className="col-span-2 md:col-span-1">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                                    <Car className="w-6 h-6 text-white" />
                                </div>
                                <span className="text-xl font-bold text-white">ParkSmart</span>
                            </div>
                            <p className="text-gray-400 text-sm leading-relaxed mb-6">
                                Modern parking management solution for the digital age. Streamline operations and maximize revenue.
                            </p>
                            <div className="flex items-center gap-4">
                                <a href="#" className="w-10 h-10 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors">
                                    <Globe className="w-5 h-5 text-gray-400" />
                                </a>
                                <a href="#" className="w-10 h-10 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors">
                                    <Mail className="w-5 h-5 text-gray-400" />
                                </a>
                                <a href="#" className="w-10 h-10 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors">
                                    <Phone className="w-5 h-5 text-gray-400" />
                                </a>
                            </div>
                        </div>
                        <div>
                            <h4 className="text-white font-semibold mb-4">Product</h4>
                            <ul className="space-y-3">
                                <li><a href="#features" className="text-gray-400 hover:text-white text-sm transition-colors">Features</a></li>
                                <li><a href="#pricing" className="text-gray-400 hover:text-white text-sm transition-colors">Pricing</a></li>
                                <li><a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">API Docs</a></li>
                                <li><a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Changelog</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-white font-semibold mb-4">Company</h4>
                            <ul className="space-y-3">
                                <li><a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">About Us</a></li>
                                <li><a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Careers</a></li>
                                <li><a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Blog</a></li>
                                <li><a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Contact</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-white font-semibold mb-4">Legal</h4>
                            <ul className="space-y-3">
                                <li><a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Privacy Policy</a></li>
                                <li><a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Terms of Service</a></li>
                                <li><a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Cookie Policy</a></li>
                                <li><a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Security</a></li>
                            </ul>
                        </div>
                    </div>
                    <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
                        <p className="text-gray-500 text-sm">
                            © {new Date().getFullYear()} ParkSmart. All rights reserved.
                        </p>
                        <div className="flex items-center gap-6">
                            <span className="flex items-center gap-2 text-sm text-gray-500">
                                <BadgeCheck className="w-4 h-4 text-green-500" />
                                SSL Secured
                            </span>
                            <span className="flex items-center gap-2 text-sm text-gray-500">
                                <ShieldCheck className="w-4 h-4 text-blue-500" />
                                GDPR Compliant
                            </span>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    )
}
