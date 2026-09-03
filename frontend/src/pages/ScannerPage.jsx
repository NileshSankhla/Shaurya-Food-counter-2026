import { useState, useEffect, useRef, useCallback } from 'react'
import { Html5Qrcode } from 'html5-qrcode'
import { verifyScan } from '../api/client'

export default function ScannerPage() {
  const [mealType, setMealType] = useState('Breakfast')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalState, setModalState] = useState('verifying') // verifying, success, failed, network_error
  const [scannedId, setScannedId] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  const html5QrCodeRef = useRef(null)
  const isProcessingRef = useRef(false)
  const mealTypeRef = useRef(mealType)

  // Keep mealTypeRef in sync so the scan callback always has fresh value
  useEffect(() => {
    mealTypeRef.current = mealType
  }, [mealType])

  const stopScanner = useCallback(async () => {
    if (html5QrCodeRef.current && html5QrCodeRef.current.isScanning) {
      try {
        await html5QrCodeRef.current.stop()
      } catch (err) {
        console.error('Failed to stop scanner:', err)
      }
    }
  }, [])

  const startScanner = useCallback(() => {
    if (!html5QrCodeRef.current) {
      html5QrCodeRef.current = new Html5Qrcode('reader')
    }

    const onScanSuccess = async (decodedText) => {
      if (isProcessingRef.current) return
      isProcessingRef.current = true

      await stopScanner()

      setScannedId(decodedText)
      setIsModalOpen(true)
      setModalState('verifying')

      try {
        const data = await verifyScan(decodedText, mealTypeRef.current)
        if (data.status === 'success') {
          setModalState('success')
        } else {
          setModalState('failed')
          setErrorMessage(data.reason || 'Verification failed')
        }
      } catch (error) {
        const isNetwork = error.message === 'Failed to fetch' || error.message === 'NetworkError'
        setModalState(isNetwork ? 'network_error' : 'failed')
        setErrorMessage(error.message || 'An error occurred')
      }
    }

    html5QrCodeRef.current
      .start(
        { facingMode: 'environment' },
        { fps: 10, qrbox: { width: 250, height: 250 } },
        onScanSuccess,
        () => {} // ignore per-frame scan failures
      )
      .catch((err) => {
        console.warn('Camera start failed:', err)
      })
  }, [stopScanner])

  useEffect(() => {
    if (!isModalOpen) {
      isProcessingRef.current = false
      startScanner()
    }
    return () => {
      stopScanner()
    }
  }, [isModalOpen, startScanner, stopScanner])

  const handleScanNext = () => {
    setIsModalOpen(false)
    setScannedId('')
    setErrorMessage('')
  }

  return (
    <div className="flex flex-col h-full bg-black relative overflow-hidden">
      {/* Meal Type Selector */}
      <div className="absolute top-0 left-0 right-0 z-20 bg-surface px-4 py-3 flex justify-center shadow-md rounded-b-3xl">
        <div className="flex bg-surface-container rounded-full p-1 w-full max-w-sm">
          {['Breakfast', 'Lunch', 'Dinner'].map(type => (
            <button
              key={type}
              className={`flex-1 py-2 text-sm font-bold rounded-full transition-all ${
                mealType === type
                  ? 'bg-primary text-on-primary shadow-md'
                  : 'text-on-surface-variant hover:bg-surface-container-high'
              }`}
              onClick={() => setMealType(type)}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Camera View */}
      <div className="flex-1 relative">
        <div id="reader" className="w-full h-full" />

        {/* Scanner Overlay UI */}
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
          <div className="relative w-[250px] h-[250px]">
            <div className="corner-marker corner-tl" />
            <div className="corner-marker corner-tr" />
            <div className="corner-marker corner-bl" />
            <div className="corner-marker corner-br" />
            {!isModalOpen && <div className="scan-line" />}
          </div>
        </div>
      </div>

      {/* Instructional text */}
      <div className="absolute bottom-6 left-0 right-0 text-center z-20 pointer-events-none">
        <p className="text-white bg-black/50 px-4 py-2 rounded-full inline-block backdrop-blur-sm text-sm">
          Align QR Code within the frame to scan
        </p>
      </div>

      {/* Result Modal */}
      {isModalOpen && (
        <div className="absolute inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-surface w-full max-w-sm rounded-[32px] p-6 shadow-2xl">

            {modalState === 'verifying' && (
              <div className="flex flex-col items-center py-8">
                <span className="material-symbols-outlined text-primary text-5xl animate-spin mb-4">refresh</span>
                <h3 className="font-display font-bold text-xl text-on-surface">Verifying...</h3>
                <p className="text-on-surface-variant mt-2 text-sm">{scannedId}</p>
              </div>
            )}

            {modalState === 'success' && (
              <div className="flex flex-col items-center py-4">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <span className="material-symbols-outlined text-green-600 text-5xl">check_circle</span>
                </div>
                <h3 className="font-display font-bold text-2xl text-green-700 mb-1">FOOD ISSUED</h3>
                <p className="text-on-surface-variant text-center text-sm mb-2">Successfully verified for {mealType}</p>
                <p className="text-xs text-outline mb-6 font-mono">{scannedId}</p>
                <button
                  onClick={handleScanNext}
                  className="w-full py-4 bg-primary text-on-primary rounded-full font-bold text-lg hover:bg-primary/90 active:scale-95 transition-all"
                >
                  SCAN NEXT
                </button>
              </div>
            )}

            {(modalState === 'failed' || modalState === 'network_error') && (
              <div className="flex flex-col items-center py-4">
                <div className="w-20 h-20 bg-error-container rounded-full flex items-center justify-center mb-4">
                  <span className="material-symbols-outlined text-error text-5xl">
                    {modalState === 'network_error' ? 'wifi_off' : 'cancel'}
                  </span>
                </div>
                <h3 className="font-display font-bold text-2xl text-error mb-1">
                  {modalState === 'network_error' ? 'NETWORK ERROR' : 'SCAN FAILED'}
                </h3>
                <p className="text-on-surface-variant text-center text-sm mb-6 font-medium">{errorMessage}</p>
                <button
                  onClick={handleScanNext}
                  className="w-full py-4 bg-surface-container-high text-on-surface rounded-full font-bold text-lg hover:bg-surface-variant active:scale-95 transition-all"
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
