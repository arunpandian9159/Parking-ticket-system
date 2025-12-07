'use client'

import Link from 'next/link'
import { Card } from '@/components/ui/Card'
import { UserCog, Shield, ArrowRight } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function ChoiceDashboard() {
    const router = useRouter()
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const checkUser = async () => {
            const { data: { session } } = await supabase.auth.getSession()
            if (!session) {
                router.push('/')
            }
            setLoading(false)
        }
        checkUser()
    }, [router])

    if (loading) return null

    return (
        <div className="min-h-[80vh] flex items-center justify-center p-4 bg-background">
            <div className="max-w-4xl w-full">
                <h1 className="text-3xl font-bold text-foreground text-center mb-12">Select Dashboard</h1>

                <div className="grid md:grid-cols-2 gap-8">
                    {/* Officer Card */}
                    <Link href="/officer" className="group">
                        <Card className="h-full p-8 transition-all hover:shadow-lg hover:shadow-teal-500/10 hover:border-teal-500/30 cursor-pointer flex flex-col items-center text-center">
                            <div className="w-20 h-20 bg-teal-500/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-teal-500/20 transition-colors">
                                <UserCog className="w-10 h-10 text-teal-500" />
                            </div>
                            <h2 className="text-2xl font-bold text-foreground mb-4">Officer Portal</h2>
                            <p className="text-muted-foreground mb-8 flex-1">
                                Issue tickets, manage parking slots, and handle vehicle exits. Optimal for field staff.
                            </p>
                            <div className="text-teal-500 font-semibold group-hover:translate-x-1 transition-transform flex items-center">
                                Enter Portal <ArrowRight className="w-4 h-4 ml-2" />
                            </div>
                        </Card>
                    </Link>

                    {/* Admin Card */}
                    <Link href="/admin/analytics" className="group">
                        <Card className="h-full p-8 transition-all hover:shadow-lg hover:shadow-cyan-500/10 hover:border-cyan-500/30 cursor-pointer flex flex-col items-center text-center">
                            <div className="w-20 h-20 bg-cyan-500/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-cyan-500/20 transition-colors">
                                <Shield className="w-10 h-10 text-cyan-500" />
                            </div>
                            <h2 className="text-2xl font-bold text-foreground mb-4">Admin Console</h2>
                            <p className="text-muted-foreground mb-8 flex-1">
                                Configure rates, manage monthly passes, and view revenue analytics. Optimal for managers.
                            </p>
                            <div className="text-cyan-500 font-semibold group-hover:translate-x-1 transition-transform flex items-center">
                                Enter Console <ArrowRight className="w-4 h-4 ml-2" />
                            </div>
                        </Card>
                    </Link>
                </div>
            </div>
        </div>
    )
}
