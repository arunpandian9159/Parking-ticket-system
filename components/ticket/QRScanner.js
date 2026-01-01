/**
 * QRScanner Component
 * Scan QR codes using browser camera API
 */

'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Camera, X, FlipHorizontal, Flashlight, AlertCircle, CheckCircle } from 'lucide-react'
import { toast } from 'sonner'

/**
 * QRScanner - Scans QR codes using camera
 */
export function QRScanner({
  onScan,
  onError,
  onClose,
  isOpen = true,
  autoClose = true,
  scannerTitle = 'Scan QR Code',
  scannerDescription = 'Position the QR code within the frame',
}) {
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const [hasCamera, setHasCamera] = useState(true)
  const [scanning, setScanning] = useState(false)
  const [facingMode, setFacingMode] = useState('environment') // environment = back camera
  const [stream, setStream] = useState(null)
  const [scanResult, setScanResult] = useState(null)
  const scanFrameRef = useRef(null)

  // Start camera
  const startCamera = useCallback(async () => {
    try {
      const constraints = {
        video: {
          facingMode: facingMode,
          width: { ideal: 640 },
          height: { ideal: 480 },
        },
      }

      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints)
      setStream(mediaStream)

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream
        await videoRef.current.play()
        setScanning(true)
      }
    } catch (err) {
      console.error('Camera error:', err)
      setHasCamera(false)
      onError?.(err)
      toast.error('Could not access camera. Please check permissions.')
    }
  }, [facingMode, onError])

  // Stop camera
  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop())
      setStream(null)
    }
    setScanning(false)
    if (scanFrameRef.current) {
      cancelAnimationFrame(scanFrameRef.current)
    }
  }, [stream])

  // Switch camera
  const switchCamera = useCallback(() => {
    stopCamera()
    setFacingMode(prev => (prev === 'environment' ? 'user' : 'environment'))
  }, [stopCamera])

  // Scan frame for QR code
  const scanFrame = useCallback(async () => {
    if (!videoRef.current || !canvasRef.current || !scanning) return

    const video = videoRef.current
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')

    if (video.readyState !== video.HAVE_ENOUGH_DATA) {
      scanFrameRef.current = requestAnimationFrame(scanFrame)
      return
    }

    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height)

    try {
      // Use BarcodeDetector API if available (Chrome/Edge)
      if ('BarcodeDetector' in window) {
        const barcodeDetector = new window.BarcodeDetector({ formats: ['qr_code'] })
        const barcodes = await barcodeDetector.detect(canvas)

        if (barcodes.length > 0) {
          const qrValue = barcodes[0].rawValue
          handleSuccessfulScan(qrValue)
          return
        }
      }
    } catch (err) {
      // BarcodeDetector not supported or failed, continue scanning
      console.log('BarcodeDetector error:', err)
    }

    // Continue scanning
    scanFrameRef.current = requestAnimationFrame(scanFrame)
  }, [scanning])

  // Handle successful scan
  const handleSuccessfulScan = useCallback(
    value => {
      setScanResult(value)
      setScanning(false)
      toast.success('QR Code scanned successfully!')
      onScan?.(value)

      if (autoClose) {
        setTimeout(() => {
          stopCamera()
          onClose?.()
        }, 1000)
      }
    },
    [onScan, autoClose, stopCamera, onClose]
  )

  // Manual input fallback
  const [manualInput, setManualInput] = useState('')
  const handleManualSubmit = () => {
    if (manualInput.trim()) {
      handleSuccessfulScan(manualInput.trim())
    }
  }

  // Start scanning when component mounts
  useEffect(() => {
    if (isOpen) {
      startCamera()
    }

    return () => {
      stopCamera()
    }
  }, [isOpen])

  // Start frame scanning when camera is ready
  useEffect(() => {
    if (scanning) {
      scanFrameRef.current = requestAnimationFrame(scanFrame)
    }

    return () => {
      if (scanFrameRef.current) {
        cancelAnimationFrame(scanFrameRef.current)
      }
    }
  }, [scanning, scanFrame])

  // Restart camera when facingMode changes
  useEffect(() => {
    if (isOpen && !stream) {
      startCamera()
    }
  }, [facingMode, isOpen, startCamera, stream])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
      <Card className="w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div>
            <h3 className="font-semibold text-foreground">{scannerTitle}</h3>
            <p className="text-xs text-muted-foreground">{scannerDescription}</p>
          </div>
          <button
            onClick={() => {
              stopCamera()
              onClose?.()
            }}
            className="p-2 rounded-lg hover:bg-secondary transition-colors"
          >
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        {/* Scanner area */}
        <div className="relative aspect-square bg-black">
          {hasCamera ? (
            <>
              <video ref={videoRef} className="w-full h-full object-cover" playsInline muted />
              <canvas ref={canvasRef} className="hidden" />

              {/* Scan frame overlay */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-48 h-48 border-2 border-teal-500 rounded-2xl relative">
                  {/* Corner accents */}
                  <div className="absolute -top-1 -left-1 w-8 h-8 border-t-4 border-l-4 border-teal-500 rounded-tl-xl" />
                  <div className="absolute -top-1 -right-1 w-8 h-8 border-t-4 border-r-4 border-teal-500 rounded-tr-xl" />
                  <div className="absolute -bottom-1 -left-1 w-8 h-8 border-b-4 border-l-4 border-teal-500 rounded-bl-xl" />
                  <div className="absolute -bottom-1 -right-1 w-8 h-8 border-b-4 border-r-4 border-teal-500 rounded-br-xl" />

                  {/* Scanning line animation */}
                  {scanning && (
                    <div className="absolute inset-x-4 h-0.5 bg-teal-500 shadow-lg shadow-teal-500/50 animate-scan" />
                  )}
                </div>
              </div>

              {/* Camera controls */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-3">
                <button
                  onClick={switchCamera}
                  className="p-3 rounded-full bg-white/10 backdrop-blur text-white hover:bg-white/20 transition-colors"
                  title="Switch camera"
                >
                  <FlipHorizontal className="w-5 h-5" />
                </button>
              </div>
            </>
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-8">
              <AlertCircle className="w-12 h-12 mb-4 text-amber-500" />
              <p className="text-center mb-4">
                Camera not available. Please enter the code manually.
              </p>
            </div>
          )}

          {/* Scan result overlay */}
          {scanResult && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/80">
              <div className="text-center text-white">
                <CheckCircle className="w-16 h-16 mx-auto mb-4 text-teal-500" />
                <p className="font-semibold">Scan Successful!</p>
              </div>
            </div>
          )}
        </div>

        {/* Manual input fallback */}
        <div className="p-4 border-t border-border">
          <p className="text-xs text-muted-foreground mb-2">
            Or enter the ticket/pass ID manually:
          </p>
          <div className="flex gap-2">
            <input
              type="text"
              value={manualInput}
              onChange={e => setManualInput(e.target.value)}
              placeholder="Enter ID..."
              className="flex-1 px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/50"
            />
            <Button
              onClick={handleManualSubmit}
              disabled={!manualInput.trim()}
              className="bg-teal-500 text-white hover:bg-teal-600"
            >
              Check
            </Button>
          </div>
        </div>
      </Card>

      {/* Scan line animation styles */}
      <style jsx>{`
        @keyframes scan {
          0%,
          100% {
            top: 0;
          }
          50% {
            top: calc(100% - 2px);
          }
        }
        .animate-scan {
          animation: scan 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}

/**
 * ScanButton - Button to trigger QR scanner
 */
export function ScanButton({ onScan, className, children }) {
  const [showScanner, setShowScanner] = useState(false)

  return (
    <>
      <Button onClick={() => setShowScanner(true)} className={className}>
        <Camera className="w-4 h-4 mr-2" />
        {children || 'Scan QR Code'}
      </Button>

      {showScanner && (
        <QRScanner isOpen={showScanner} onScan={onScan} onClose={() => setShowScanner(false)} />
      )}
    </>
  )
}
