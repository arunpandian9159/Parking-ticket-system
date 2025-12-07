'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Car, ShieldCheck, BarChart3, MapPin } from 'lucide-react'
import { AnimatedBackground, FadeIn, GradientText, SpotlightCard } from '@/components/ui/ReactBits'

export default function LandingPage() {
    return (
        <div className="min-h-screen bg-neutral-950 text-white overflow-x-hidden">
            <AnimatedBackground />

            {/* Hero Section */}
            <div className="relative isolate pt-24 sm:pt-32 lg:pt-40">
                <FadeIn className="mx-auto max-w-7xl px-6 lg:px-8 text-center">
                    <div className="mx-auto max-w-2xl">
                        <GradientText className="text-4xl font-bold tracking-tight sm:text-7xl mb-6 py-2 px-4">
                            Smart Parking Management
                        </GradientText>
                        <p className="mt-6 text-lg leading-8 text-gray-300">
                            Streamline your parking operations with our advanced digital ticketing system.
                            Manage rates, track vehicles, and analyze revenue in real-time.
                        </p>
                        <div className="mt-10 flex items-center justify-center gap-x-6">
                            <Link href="/login">
                                <Button className="bg-blue-600 hover:bg-blue-500 px-8 py-6 text-lg transition-transform hover:scale-105">
                                    Admin / Officer Login
                                </Button>
                            </Link>
                            <Link href="/status">
                                <Button variant="outline" className="text-white border-white/20 hover:bg-white/10 px-8 py-6 text-lg transition-transform hover:scale-105">
                                    Check Vehicle Status
                                </Button>
                            </Link>
                        </div>
                    </div>
                </FadeIn>
            </div>

            {/* Features Grid */}
            <div className="mx-auto max-w-7xl px-6 lg:px-8 py-24 sm:py-32">
                <FadeIn delay={0.2} className="mx-auto max-w-2xl lg:text-center mb-16">
                    <h2 className="text-base font-semibold leading-7 text-blue-400 uppercase tracking-wide">Faster Operations</h2>
                    <p className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
                        Everything you need to manage parking
                    </p>
                </FadeIn>
                <div className="mx-auto max-w-2xl lg:max-w-none">
                    <div className="grid max-w-xl grid-cols-1 gap-8 lg:max-w-none lg:grid-cols-3">
                        <SpotlightCard className="p-8">
                            <div className="flex flex-col items-start h-full relative z-10">
                                <div className="rounded-lg bg-blue-900/20 p-3 ring-1 ring-blue-500/20 mb-6">
                                    <Car className="h-6 w-6 text-blue-400" aria-hidden="true" />
                                </div>
                                <h3 className="text-xl font-semibold leading-7 text-white">Vehicle Tracking</h3>
                                <p className="mt-4 flex-auto text-base leading-7 text-gray-400">
                                    Track license plates, vehicle types, and parking duration automatically with our intelligent system.
                                </p>
                            </div>
                        </SpotlightCard>

                        <SpotlightCard className="p-8">
                            <div className="flex flex-col items-start h-full relative z-10">
                                <div className="rounded-lg bg-green-900/20 p-3 ring-1 ring-green-500/20 mb-6">
                                    <MapPin className="h-6 w-6 text-green-400" aria-hidden="true" />
                                </div>
                                <h3 className="text-xl font-semibold leading-7 text-white">Smart Mapping</h3>
                                <p className="mt-4 flex-auto text-base leading-7 text-gray-400">
                                    Visual parking map to see occupied slots and manage capacity efficiently in real-time.
                                </p>
                            </div>
                        </SpotlightCard>

                        <SpotlightCard className="p-8">
                            <div className="flex flex-col items-start h-full relative z-10">
                                <div className="rounded-lg bg-purple-900/20 p-3 ring-1 ring-purple-500/20 mb-6">
                                    <BarChart3 className="h-6 w-6 text-purple-400" aria-hidden="true" />
                                </div>
                                <h3 className="text-xl font-semibold leading-7 text-white">Revenue Analytics</h3>
                                <p className="mt-4 flex-auto text-base leading-7 text-gray-400">
                                    Comprehensive dashboards to monitor daily earnings and operational trends to maximize profit.
                                </p>
                            </div>
                        </SpotlightCard>
                    </div>
                </div>
            </div>
        </div>
    )
}
