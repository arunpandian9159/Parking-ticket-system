/**
 * QR Scan Page
 * Scan QR codes for quick ticket/pass checkout
 */

'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { QRScanner } from '@/components/ticket/QRScanner'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { toast } from 'sonner'
import {
  QrCode, 
  Camera,
  Ticket,
  CreditCard,
  ArrowLeft,
  CheckCircle,
  Clock,
  Car,
  MapPin,
  AlertCircle,
} from 'lucide-react'
import Link from 'next/link'

export default function ScanPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [showScanner, setShowScanner] = useState(false)
  const [scanResult, setScanResult] = useState(null)
  const [ticketData, setTicketData] = useState(null)
  const [passData, setPassData] = useState(null)
  const [loading, setLoading] = useState(false)

  // Check for pre-filled data from URL
  useEffect(() => {
    const ticketId = searchParams.get('ticket')
    const passId = searchParams.get('pass')

    if (ticketId) {
      fetchTicket(ticketId)
    } else if (passId) {
      fetchPass(passId)
    }
  }, [searchParams])

  const fetchTicket = async id => {
    setLoading(true)
    try {
      const { data, error } = await supabase.from('tickets').select('*').eq('id', id).single()

      if (error) throw error
      setTicketData(data)
    } catch (error) {
      console.error('Error fetching ticket:', error)
      toast.error('Ticket not found')
    } finally {
      setLoading(false)
    }
  }

  const fetchPass = async id => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('monthly_passes')
        .select('*')
        .eq('id', id)
        .single()

      if (error) throw error
      setPassData(data)
    } catch (error) {
      console.error('Error fetching pass:', error)
      toast.error('Pass not found')
    } finally {
      setLoading(false)
    }
  }

  const handleScan = value => {
    setScanResult(value)
    setShowScanner(false)

    // Parse the scanned URL
    try {
      const url = new URL(value)
      const ticketId = url.searchParams.get('ticket')
      const passId = url.searchParams.get('pass')

      if (ticketId) {
        fetchTicket(ticketId)
      } else if (passId) {
        fetchPass(passId)
      } else {
        // Try to use the value as a direct ID
        fetchTicket(value)
      }
    } catch {
      // Not a URL, try as direct ID
      fetchTicket(value)
    }
  }

  const getStatusBadge = status => {
    const styles = {
      Active: 'bg-teal-500/10 text-teal-500 border-teal-500/30',
      Paid: 'bg-green-500/10 text-green-500 border-green-500/30',
      Expired: 'bg-red-500/10 text-red-500 border-red-500/30',
      Cancelled: 'bg-gray-500/10 text-gray-500 border-gray-500/30',
    }
    return styles[status] || styles.Active
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground flex items-center gap-3">
            <div className="p-2 bg-teal-500/10 rounded-xl">
              <QrCode className="w-6 h-6 text-teal-500" />
            </div>
            QR Scanner
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Scan tickets or passes for quick checkout
          </p>
        </div>
        <Link href="/dashboard">
          <Button className="bg-secondary text-foreground hover:bg-secondary/80">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        </Link>
      </div>

      {/* Scan Button */}
      {!ticketData && !passData && (
        <Card className="p-8 text-center">
          <div className="w-20 h-20 mx-auto rounded-full bg-teal-500/10 flex items-center justify-center mb-6">
            <Camera className="w-10 h-10 text-teal-500" />
          </div>
          <h2 className="text-xl font-semibold text-foreground mb-2">Scan QR Code</h2>
          <p className="text-muted-foreground text-sm mb-6">
            Scan a ticket or pass QR code to view details and process checkout
          </p>
          <Button
            onClick={() => setShowScanner(true)}
            className="bg-teal-500 text-white hover:bg-teal-600 px-8"
          >
            <Camera className="w-4 h-4 mr-2" />
            Open Scanner
          </Button>
        </Card>
      )}

      {/* Ticket Result */}
      {ticketData && (
        <Card className="overflow-hidden">
          <div className="p-4 border-b border-border flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Ticket className="w-5 h-5 text-teal-500" />
              <span className="font-semibold text-foreground">Ticket Details</span>
            </div>
            <span
              className={`px-3 py-1 text-sm font-medium rounded-full border ${getStatusBadge(
                ticketData.status
              )}`}
            >
              {ticketData.status}
            </span>
          </div>
          <div className="p-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-secondary rounded-lg">
                  <Car className="w-4 h-4 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Vehicle</p>
                  <p className="font-semibold text-foreground">{ticketData.license_plate}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-secondary rounded-lg">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Spot</p>
                  <p className="font-semibold text-foreground">{ticketData.parking_spot}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-secondary rounded-lg">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Entry Time</p>
                  <p className="font-semibold text-foreground">
                    {new Date(ticketData.created_at).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-secondary rounded-lg">
                  <CreditCard className="w-4 h-4 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Amount</p>
                  <p className="font-semibold text-teal-500">₹{ticketData.price}</p>
                </div>
              </div>
            </div>

            {/* Status indicator */}
            {ticketData.status === 'Active' && (
              <div className="mt-4 p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl">
                <div className="flex items-center gap-2 text-amber-500">
                  <AlertCircle className="w-4 h-4" />
                  <span className="text-sm font-medium">Payment Pending</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  This ticket needs to be paid before exit
                </p>
              </div>
            )}

            {ticketData.status === 'Paid' && (
              <div className="mt-4 p-4 bg-green-500/10 border border-green-500/30 rounded-xl">
                <div className="flex items-center gap-2 text-green-500">
                  <CheckCircle className="w-4 h-4" />
                  <span className="text-sm font-medium">Payment Complete</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">Vehicle is cleared for exit</p>
              </div>
            )}
          </div>
          <div className="p-4 border-t border-border flex gap-3">
            <Button
              onClick={() => {
                setTicketData(null)
                setScanResult(null)
              }}
              className="flex-1 bg-secondary text-foreground hover:bg-secondary/80"
            >
              Scan Another
            </Button>
            <Link href={`/tickets/${ticketData.id}`} className="flex-1">
              <Button className="w-full bg-teal-500 text-white hover:bg-teal-600">
                View Full Details
              </Button>
            </Link>
          </div>
        </Card>
      )}

      {/* Pass Result */}
      {passData && (
        <Card className="overflow-hidden">
          <div className="p-4 border-b border-border flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-violet-500" />
              <span className="font-semibold text-foreground">Monthly Pass</span>
            </div>
            <span
              className={`px-3 py-1 text-sm font-medium rounded-full border ${getStatusBadge(
                passData.status
              )}`}
            >
              {passData.status}
            </span>
          </div>
          <div className="p-6 space-y-4">
            <div className="text-center mb-4">
              <p className="text-sm text-muted-foreground">Pass Holder</p>
              <p className="text-xl font-bold text-foreground">{passData.customer_name}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-secondary rounded-xl">
                <p className="text-xs text-muted-foreground">Vehicle</p>
                <p className="font-semibold text-foreground">{passData.vehicle_number}</p>
              </div>
              <div className="text-center p-3 bg-secondary rounded-xl">
                <p className="text-xs text-muted-foreground">Valid Until</p>
                <p className="font-semibold text-foreground">
                  {new Date(passData.end_date).toLocaleDateString()}
                </p>
              </div>
            </div>

            {passData.status === 'Active' && (
              <div className="mt-4 p-4 bg-green-500/10 border border-green-500/30 rounded-xl text-center">
                <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
                <p className="font-semibold text-green-500">Pass Valid</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Vehicle can enter and exit freely
                </p>
              </div>
            )}
          </div>
          <div className="p-4 border-t border-border">
            <Button
              onClick={() => {
                setPassData(null)
                setScanResult(null)
              }}
              className="w-full bg-secondary text-foreground hover:bg-secondary/80"
            >
              Scan Another
            </Button>
          </div>
        </Card>
      )}

      {/* QR Scanner Modal */}
      {showScanner && (
        <QRScanner
          isOpen={showScanner}
          onScan={handleScan}
          onClose={() => setShowScanner(false)}
          scannerTitle="Scan Ticket/Pass"
          scannerDescription="Point camera at QR code on receipt"
        />
      )}
    </div>
  )
}
