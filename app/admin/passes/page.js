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

    if (loading) return <div className="p-8">Loading passes...</div>

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Monthly Passes</h1>
                <p className="text-gray-500">Manage subscriptions for regular customers.</p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
                    <UserPlus className="w-5 h-5 text-blue-600" />
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

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50 border-b border-gray-100">
                        <tr>
                            <th className="px-6 py-3 font-semibold text-gray-500">Customer</th>
                            <th className="px-6 py-3 font-semibold text-gray-500">Vehicle</th>
                            <th className="px-6 py-3 font-semibold text-gray-500">Valid Until</th>
                            <th className="px-6 py-3 font-semibold text-gray-500">Status</th>
                            <th className="px-6 py-3 font-semibold text-gray-500">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {passes.map(pass => (
                            <tr key={pass.id}>
                                <td className="px-6 py-4">{pass.customer_name}</td>
                                <td className="px-6 py-4 font-mono font-bold">{pass.vehicle_number}</td>
                                <td className="px-6 py-4">{new Date(pass.end_date).toLocaleDateString()}</td>
                                <td className="px-6 py-4">
                                    <span className="px-2 py-1 rounded-full bg-green-100 text-green-700 text-xs font-bold">
                                        {pass.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <button onClick={() => handleDelete(pass.id)} className="text-red-500 hover:text-red-700">
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {passes.length === 0 && (
                            <tr>
                                <td colSpan="5" className="px-6 py-8 text-center text-gray-500">No active passes.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
