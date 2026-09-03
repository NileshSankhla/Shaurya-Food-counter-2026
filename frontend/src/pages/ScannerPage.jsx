import { useState, useEffect, useRef } from 'react'
import { Html5Qrcode } from 'html5-qrcode'
import { verifyScan } from '../api/client'

const MEALS = ['Breakfast', 'Lunch', 'Dinner']

export default function ScannerPage() {
  const [mealType, setMealType] = useState('Breakfast')
  const [modalState, setModalState] = useState(null)
  const [scannedId, setScannedId] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [cameraError, setCameraError] = useState('')

  const qrRef = useRef(null)
  const isProcessing = useRef(false)
  const isStarting = useRef(false)   // guard against double-start
  const mealRef = useRef(mealType)
  const mountedRef = useRef(false)   // skip StrictMode extra cycle

  useEffect(() => { mealRef.current = mealType }, [mealType])

  // ── Stop the scanner safely ──
  const stopScanner = async () => {
    try {
      if (qrRef.current) {
        const state = qrRef.current.getState?.()
        // State 2 = SCANNING, State 3 = PAUSED
        if (state === 2 || state === 3 || qrRef.current.isScanning) {
          await qrRef.current.stop()
        }
      }
    } catch {
      // Ignore — scanner may already be stopped
    }
  }

  // ── Start the scanner ──
  const startScanner = async () => {
    // Guards
    if (isStarting.current) return
    if (qrRef.current?.isScanning) return

    const el = document.getElementById('qr-reader')
    if (!el || el.offsetHeight < 10) return  // element not laid out yet

    isStarting.current = true
    setCameraError('')

    try {
      // Create fresh instance each time (avoids stale DOM references)
      if (qrRef.current) {
        await stopScanner()
        try { qrRef.current.clear() } catch { /* ok */ }
      }
      qrRef.current = new Html5Qrcode('qr-reader', { verbose: false })

      const config = {
        fps: 10,
        qrbox: { width: 220, height: 220 },
        aspectRatio: 1.0,
        disableFlip: false,
      }

      const onSuccess = async (decodedText) => {
        if (isProcessing.current) return
        isProcessing.current = true

        await stopScanner()
        setScannedId(decodedText)
        setModalState('verifying')

        try {
          const data = await verifyScan(decodedText, mealRef.current)
          if (data.status === 'success') {
            setModalState('success')
          } else {
            setErrorMessage(data.reason || 'Scan not valid')
            setModalState('failed')
          }
        } catch (err) {
          const isNet = !navigator.onLine || err.message === 'Failed to fetch'
          setErrorMessage(isNet ? 'No internet connection' : (err.message || 'Server error'))
          setModalState(isNet ? 'network_error' : 'failed')
        }
      }

      // Try rear camera first
      try {
        await qrRef.current.start(
          { facingMode: 'environment' }, config, onSuccess, () => {}
        )
      } catch {
        // Fallback — try any available camera by ID
        try {
          const devices = await Html5Qrcode.getCameras()
          if (devices && devices.length > 0) {
            await qrRef.current.start(
              devices[0].id, config, onSuccess, () => {}
            )
          } else {
            setCameraError('No camera found on this device.')
          }
        } catch {
          setCameraError('Camera permission denied. Please allow camera access in your browser settings and reload the page.')
        }
      }
    } catch (err) {
      setCameraError('Could not start camera: ' + (err.message || 'Unknown error'))
    } finally {
      isStarting.current = false
    }
  }

  // ── Main effect: start on mount, restart when modal closes ──
  useEffect(() => {
    // React StrictMode in dev runs effects twice.
    // Skip the first mount+unmount cycle.
    if (!mountedRef.current) {
      mountedRef.current = true
      // Small delay to let the DOM element get its layout dimensions
      const t = setTimeout(() => {
        if (modalState === null) {
          isProcessing.current = false
          startScanner()
        }
      }, 300)
      return () => {
        clearTimeout(t)
        stopScanner()
      }
    }

    // Normal re-runs (modal closed)
    if (modalState === null) {
      isProcessing.current = false
      const t = setTimeout(startScanner, 200)
      return () => {
        clearTimeout(t)
        stopScanner()
      }
    }

    return () => { stopScanner() }
  }, [modalState])

  // ── Cleanup on unmount ──
  useEffect(() => {
    return () => {
      stopScanner().then(() => {
        try { qrRef.current?.clear() } catch { /* ok */ }
        qrRef.current = null
      })
    }
  }, [])

  const handleTryAgain = () => {
    setScannedId('')
    setErrorMessage('')
    setModalState(null)
  }

  return (
    <div className="relative w-full bg-black" style={{ height: '100%' }}>

      {/* ── Meal selector ── */}
      <div className="absolute top-0 left-0 right-0 z-20 flex justify-center px-4 pt-3 pb-3 bg-black/60 backdrop-blur-md">
        <div className="flex bg-white/10 rounded-full p-1 w-full max-w-xs gap-1">
          {MEALS.map(m => (
            <button
              key={m}
              onClick={() => setMealType(m)}
              className={`flex-1 py-1.5 text-xs font-bold rounded-full transition-all ${
                mealType === m
                  ? 'bg-primary text-on-primary shadow'
                  : 'text-white/70 hover:text-white'
              }`}
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      {/* ── Camera container ── */}
      <div
        id="qr-reader"
        className="w-full"
        style={{ height: '100%', overflow: 'hidden', position: 'relative' }}
      />

      {/* ── Camera error message ── */}
      {cameraError && modalState === null && (
        <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/80 p-6">
          <div className="bg-surface rounded-3xl p-6 max-w-xs text-center shadow-xl flex flex-col items-center gap-4">
            <span className="material-symbols-outlined text-error" style={{ fontSize: 48, fontVariationSettings: "'FILL' 1" }}>videocam_off</span>
            <p className="text-on-surface text-sm font-medium leading-relaxed">{cameraError}</p>
            <button
              onClick={() => { setCameraError(''); startScanner() }}
              className="w-full py-3 bg-primary text-on-primary rounded-full font-bold text-sm active:scale-95 transition-all"
            >
              Retry Camera
            </button>
          </div>
        </div>
      )}

      {/* ── Scan frame overlay ── */}
      {!cameraError && (
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center z-10">
          <div className="absolute inset-0 bg-black/40" style={{
            WebkitMaskImage: 'radial-gradient(ellipse 130px 130px at center, transparent 100%, black 100%)',
            maskImage: 'radial-gradient(ellipse 130px 130px at center, transparent 100%, black 100%)',
          }} />
          <div className="relative w-[220px] h-[220px]">
            <div className="corner-marker corner-tl" />
            <div className="corner-marker corner-tr" />
            <div className="corner-marker corner-bl" />
            <div className="corner-marker corner-br" />
            {modalState === null && <div className="scan-line" />}
          </div>
        </div>
      )}

      {/* ── Hint text ── */}
      {!cameraError && modalState === null && (
        <div className="absolute bottom-8 left-0 right-0 text-center pointer-events-none z-10">
          <p className="inline-block text-white text-sm bg-black/50 px-4 py-1.5 rounded-full backdrop-blur-sm">
            Align student QR code in the frame
          </p>
        </div>
      )}

      {/* ── Result Modal ── */}
      {modalState !== null && (
        <div className="absolute inset-0 z-50 flex items-end justify-center bg-black/70 backdrop-blur-sm p-4 pb-8">
          <div className="bg-surface w-full max-w-sm rounded-[32px] p-6 shadow-2xl">

            {modalState === 'verifying' && (
              <div className="flex flex-col items-center py-8 gap-3">
                <span className="material-symbols-outlined text-primary animate-spin" style={{ fontSize: 48 }}>refresh</span>
                <h3 className="font-display font-bold text-xl text-on-surface">Verifying...</h3>
                <p className="text-on-surface-variant text-xs font-mono text-center break-all px-2">{scannedId}</p>
              </div>
            )}

            {modalState === 'success' && (
              <div className="flex flex-col items-center py-4 gap-3">
                <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center">
                  <span className="material-symbols-outlined text-green-600" style={{ fontSize: 44, fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                </div>
                <h3 className="font-display font-bold text-2xl text-green-700">FOOD ISSUED</h3>
                <p className="text-on-surface-variant text-sm text-center">Verified for <strong>{mealType}</strong></p>
                <p className="text-xs text-outline font-mono text-center break-all px-2">{scannedId}</p>
                <button
                  onClick={handleTryAgain}
                  className="mt-2 w-full py-4 bg-primary text-on-primary rounded-full font-bold text-base hover:opacity-90 active:scale-95 transition-all"
                >
                  SCAN NEXT
                </button>
              </div>
            )}

            {(modalState === 'failed' || modalState === 'network_error') && (
              <div className="flex flex-col items-center py-4 gap-3">
                <div className="w-20 h-20 rounded-full bg-error-container flex items-center justify-center">
                  <span className="material-symbols-outlined text-error" style={{ fontSize: 44, fontVariationSettings: "'FILL' 1" }}>
                    {modalState === 'network_error' ? 'wifi_off' : 'cancel'}
                  </span>
                </div>
                <h3 className="font-display font-bold text-2xl text-error">
                  {modalState === 'network_error' ? 'NO CONNECTION' : 'SCAN FAILED'}
                </h3>
                <p className="text-on-surface-variant text-sm text-center font-medium px-2">{errorMessage}</p>
                <button
                  onClick={handleTryAgain}
                  className="mt-2 w-full py-4 bg-surface-container-high text-on-surface rounded-full font-bold text-base hover:bg-surface-variant active:scale-95 transition-all"
                >
                  TRY AGAIN
                </button>
              </div>
            )}

          </div>
        </div>
      )}
    </div>
  )
}
