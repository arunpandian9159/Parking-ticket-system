'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Trash2, UserPlus } from 'lucide-react'

export default function MonthlyPassesPage() {
    const [passes, setPasses] = useState([])
    const [loading, setLoading] = useState(true)
    const [newPass, setNewPass] = useState({
        customer_name: '',
        vehicle_number: '',
        phone_number: '',
        months: 1
    })

    useEffect(() => {
        fetchPasses()

    }, [])

    const fetchPasses = async () => {
        try {
            const { data, error } = await supabase
                .from('monthly_passes')
                .select('*')
                .order('created_at', { ascending: false })

            if (error) throw error
            setPasses(data || [])
        } catch (error) {
            console.error('Error fetching passes:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleCreatePass = async (e) => {
        e.preventDefault()
        try {
            const startDate = new Date()
            const endDate = new Date()
            endDate.setMonth(endDate.getMonth() + Number(newPass.months))

            const { error } = await supabase.from('monthly_passes').insert([{
                customer_name: newPass.customer_name,
                vehicle_number: newPass.vehicle_number.toUpperCase(),
                phone_number: newPass.phone_number,
                start_date: startDate.toISOString(),
                end_date: endDate.toISOString(),
                status: 'Active'
            }])

            if (error) throw error

            setNewPass({ customer_name: '', vehicle_number: '', phone_number: '', months: 1 })
            fetchPasses()
            alert('Monthly pass created successfully!')
        } catch (error) {
            alert('Error creating pass: ' + error.message)
        }
    }

    const handleDelete = async (id) => {
        if (!confirm('Revoke this pass?')) return
        const { error } = await supabase.from('monthly_passes').delete().eq('id', id)
        if (!error) fetchPasses()
    }

    if (loading) return <div className="p-8 text-muted-foreground">Loading passes...</div>

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-foreground">Monthly Passes</h1>
                <p className="text-muted-foreground">Manage subscriptions for regular customers.</p>
            </div>

            <div className="bg-card p-6 rounded-xl border border-border shadow-sm">
                <h2 className="text-lg font-semibold mb-6 flex items-center gap-2 text-foreground">
                    <UserPlus className="w-5 h-5 text-teal-500" />
                    Issue New Pass
                </h2>
                <form onSubmit={handleCreatePass} className="grid md:grid-cols-4 gap-4 items-end">
                    <Input
                        placeholder="Customer Name"
                        value={newPass.customer_name}
                        onChange={e => setNewPass({ ...newPass, customer_name: e.target.value })}
                        required
                    />
                    <Input
                        placeholder="Vehicle Number"
                        value={newPass.vehicle_number}
                        onChange={e => setNewPass({ ...newPass, vehicle_number: e.target.value })}
                        required
                        className="uppercase"
                    />
                    <Input
                        placeholder="Phone"
                        value={newPass.phone_number}
                        onChange={e => setNewPass({ ...newPass, phone_number: e.target.value })}
                        required
                    />
                    <Button type="submit">Create Pass</Button>
                </form>
            </div>

            <div className="bg-card rounded-xl shadow-sm border border-border overflow-hidden">
                <table className="w-full text-left text-sm">
                    <thead className="bg-secondary/50 border-b border-border">
                        <tr>
                            <th className="px-6 py-3 font-semibold text-muted-foreground">Customer</th>
                            <th className="px-6 py-3 font-semibold text-muted-foreground">Vehicle</th>
                            <th className="px-6 py-3 font-semibold text-muted-foreground">Valid Until</th>
                            <th className="px-6 py-3 font-semibold text-muted-foreground">Status</th>
                            <th className="px-6 py-3 font-semibold text-muted-foreground">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                        {passes.map(pass => (
                            <tr key={pass.id} className="hover:bg-secondary/50 transition-colors">
                                <td className="px-6 py-4 text-foreground">{pass.customer_name}</td>
                                <td className="px-6 py-4 font-mono font-bold text-foreground">{pass.vehicle_number}</td>
                                <td className="px-6 py-4 text-muted-foreground">{new Date(pass.end_date).toLocaleDateString()}</td>
                                <td className="px-6 py-4">
                                    <span className="px-2 py-1 rounded-full bg-teal-500/10 text-teal-500 text-xs font-bold border border-teal-500/20">
                                        {pass.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <button onClick={() => handleDelete(pass.id)} className="text-red-500 hover:text-red-400 transition-colors">
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {passes.length === 0 && (
                            <tr>
                                <td colSpan="5" className="px-6 py-8 text-center text-muted-foreground">No active passes.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
