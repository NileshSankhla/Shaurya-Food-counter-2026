import { useState, useEffect, useRef, useCallback } from 'react'
import { Html5Qrcode } from 'html5-qrcode'
import { verifyScan } from '../api/client'

const MEALS = ['Breakfast', 'Lunch', 'Dinner']

export default function ScannerPage() {
  const [mealType, setMealType] = useState('Breakfast')
  const [modalState, setModalState] = useState(null) // null | 'verifying' | 'success' | 'failed' | 'network_error'
  const [scannedId, setScannedId] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  const qrRef = useRef(null)         // Html5Qrcode instance
  const isProcessing = useRef(false) // prevents double-scan
  const mealRef = useRef(mealType)   // always-fresh meal for callback closure

  // Keep mealRef synced when meal changes
  useEffect(() => { mealRef.current = mealType }, [mealType])

  const stopScanner = useCallback(async () => {
    if (qrRef.current?.isScanning) {
      try { await qrRef.current.stop() } catch (_) { /* ignore */ }
    }
  }, [])

  const startScanner = useCallback(async () => {
    // Create instance once
    if (!qrRef.current) {
      qrRef.current = new Html5Qrcode('qr-reader', { verbose: false })
    }
    // Don't start if already scanning
    if (qrRef.current.isScanning) return

    const config = { fps: 10, qrbox: { width: 220, height: 220 }, aspectRatio: 1.0 }

    const onSuccess = async (decodedText) => {
      if (isProcessing.current) return
      isProcessing.current = true

      await stopScanner()
      setScannedId(decodedText)
      setModalState('verifying')

      try {
        const data = await verifyScan(decodedText, mealRef.current)
        // Backend returns scan doc: { status: 'success'|'failed', reason: '...' }
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

    try {
      await qrRef.current.start({ facingMode: 'environment' }, config, onSuccess, () => {})
    } catch {
      // Fallback: try default camera if rear not available
      try {
        await qrRef.current.start({ facingMode: 'user' }, config, onSuccess, () => {})
      } catch (err) {
        setErrorMessage('Camera access denied. Please allow camera permission and reload.')
        setModalState('failed')
      }
    }
  }, [stopScanner])

  // Start scanner on mount / when modal closes
  useEffect(() => {
    if (modalState === null) {
      isProcessing.current = false
      startScanner()
    }
    // Cleanup on unmount or when modal opens
    return () => {
      stopScanner()
    }
  }, [modalState, startScanner, stopScanner])

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

      {/* ── Camera feed – html5-qrcode renders <video> inside this div ── */}
      {/* It MUST have an explicit pixel height, not just flex-1 / h-full */}
      <div
        id="qr-reader"
        className="w-full"
        style={{ height: '100%', overflow: 'hidden' }}
      />

      {/* ── Scan-frame overlay (pointer-events-none so it doesn't block camera) ── */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
        {/* darken everything outside the frame */}
        <div className="absolute inset-0 bg-black/50" style={{
          WebkitMaskImage: 'radial-gradient(ellipse 230px 230px at center, transparent 100%, black 100%)',
          maskImage: 'radial-gradient(ellipse 230px 230px at center, transparent 100%, black 100%)',
        }} />
        {/* frame box */}
        <div className="relative w-[220px] h-[220px]">
          <div className="corner-marker corner-tl" />
          <div className="corner-marker corner-tr" />
          <div className="corner-marker corner-bl" />
          <div className="corner-marker corner-br" />
          {modalState === null && <div className="scan-line" />}
        </div>
      </div>

      {/* ── Hint text ── */}
      <div className="absolute bottom-8 left-0 right-0 text-center pointer-events-none z-10">
        <p className="inline-block text-white text-sm bg-black/50 px-4 py-1.5 rounded-full backdrop-blur-sm">
          Align student QR code in the frame
        </p>
      </div>

      {/* ── Modal ── */}
      {modalState !== null && (
        <div className="absolute inset-0 z-50 flex items-end justify-center bg-black/70 backdrop-blur-sm p-4 pb-8">
          <div className="bg-surface w-full max-w-sm rounded-[32px] p-6 shadow-2xl">

            {/* Verifying */}
            {modalState === 'verifying' && (
              <div className="flex flex-col items-center py-8 gap-3">
                <span className="material-symbols-outlined text-primary animate-spin" style={{ fontSize: 48 }}>refresh</span>
                <h3 className="font-display font-bold text-xl text-on-surface">Verifying...</h3>
                <p className="text-on-surface-variant text-xs font-mono text-center break-all px-2">{scannedId}</p>
              </div>
            )}

            {/* Success */}
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

            {/* Failed / Network Error */}
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
