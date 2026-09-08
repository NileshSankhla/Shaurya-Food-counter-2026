"use client"
import { useState, useEffect, useRef } from 'react'
import QrScanner from 'qr-scanner'
import { verifyScanAction } from '@/app/actions'
import { Loader2, CheckCircle, XCircle, Keyboard, Camera, WifiOff } from 'lucide-react'

export default function ScannerPage() {
  const [modalState, setModalState] = useState<'verifying' | 'success' | 'failed' | 'network_error' | null>(null)
  const [scannedId, setScannedId] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [guestInfo, setGuestInfo] = useState({ name: '', college: '', slot: '' })
  const [isManualEntry, setIsManualEntry] = useState(false)
  const [manualCode, setManualCode] = useState('')

  const videoRef = useRef<HTMLVideoElement>(null)
  const scannerRef = useRef<QrScanner | null>(null)
  const isProcessing = useRef(false)

  const handleScanProcess = async (text: string) => {
    if (isProcessing.current) return
    isProcessing.current = true
    scannerRef.current?.stop()
    setScannedId(text)
    setModalState('verifying')
    try {
      const data = await verifyScanAction(text)
      if (data.status === 'success') {
        setGuestInfo({ name: data.guestName!, college: data.college!, slot: data.slotTitle! })
        setModalState('success')
      } else {
        setErrorMessage(data.reason || 'Scan not valid')
        setModalState('failed')
      }
    } catch (err: any) {
      setErrorMessage('Server error')
      setModalState('failed')
    }
  }

  useEffect(() => {
    if (isManualEntry || modalState !== null || !videoRef.current) return
    scannerRef.current = new QrScanner(videoRef.current, (result) => handleScanProcess(result.data), {
      highlightScanRegion: true, highlightCodeOutline: true, returnDetailedScanResult: true
    })
    scannerRef.current.start().catch(e => console.error(e))
    return () => { scannerRef.current?.stop(); scannerRef.current?.destroy() }
  }, [isManualEntry, modalState])

  const resetScanner = () => {
    setModalState(null); setScannedId(''); setErrorMessage('')
    if (isManualEntry) setManualCode(''); isProcessing.current = false
  }

  return (
    <div className="relative w-full h-full bg-black flex flex-col">
      <div className="absolute top-0 left-0 right-0 z-20 flex justify-center px-4 pt-3 pb-3 bg-black/60 backdrop-blur-md">
        <div className="flex bg-white/10 rounded-full p-1 w-full max-w-xs gap-1">
          <button onClick={() => setIsManualEntry(false)} className={`flex-1 py-1.5 text-xs font-bold rounded-full transition-all ${!isManualEntry ? 'bg-[var(--color-primary)] text-white shadow' : 'text-white/70'}`}><Camera size={14} className="inline mr-1" />CAMERA</button>
          <button onClick={() => setIsManualEntry(true)} className={`flex-1 py-1.5 text-xs font-bold rounded-full transition-all ${isManualEntry ? 'bg-[var(--color-primary)] text-white shadow' : 'text-white/70'}`}><Keyboard size={14} className="inline mr-1" />MANUAL</button>
        </div>
      </div>
      {isManualEntry ? (
        <div className="flex-1 flex flex-col items-center justify-center p-6">
           <div className="bg-[var(--color-surface)] rounded-3xl p-6 w-full max-w-sm flex flex-col items-center gap-4">
              <Keyboard className="text-[var(--color-primary)]" size={48} />
              <h2 className="font-[family-name:var(--font-display)] font-bold text-xl">Enter QR Code ID</h2>
              <form onSubmit={e => { e.preventDefault(); if(manualCode) handleScanProcess(manualCode) }} className="w-full flex flex-col gap-3">
                <input autoFocus type="text" placeholder="e.g. SHR-1001" value={manualCode} onChange={(e) => setManualCode(e.target.value.toUpperCase())} className="w-full px-4 py-3 rounded-xl border border-[var(--color-surface-variant)] bg-[var(--color-surface-container-lowest)] font-mono uppercase focus:border-[var(--color-primary)] outline-none" />
                <button type="submit" className="w-full py-3 bg-[var(--color-primary)] text-white rounded-full font-bold">VERIFY</button>
              </form>
           </div>
        </div>
      ) : <video ref={videoRef} className="w-full h-full object-cover" />}
      {modalState !== null && (
        <div className="absolute inset-0 z-50 flex items-end justify-center bg-black/70 backdrop-blur-sm p-4 pb-8">
          <div className="bg-[var(--color-surface)] w-full max-w-sm rounded-[32px] p-6 shadow-2xl">
            {modalState === 'verifying' && (
              <div className="flex flex-col items-center py-8 gap-3">
                <Loader2 className="text-[var(--color-primary)] animate-spin" size={48} />
                <h3 className="font-[family-name:var(--font-display)] font-bold text-xl">Verifying...</h3>
                <p className="text-[var(--color-on-surface-variant)] text-xs font-mono">{scannedId}</p>
              </div>
            )}
            {modalState === 'success' && (
              <div className="flex flex-col items-center py-4 gap-3">
                <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center">
                  <CheckCircle className="text-green-600" size={48} />
                </div>
                <h3 className="font-[family-name:var(--font-display)] font-bold text-2xl text-green-700">FOOD ISSUED</h3>
                <div className="bg-[var(--color-surface-container)] w-full rounded-2xl p-4 text-center border border-green-200">
                  <p className="font-bold text-lg leading-tight">{guestInfo.name}</p>
                  <p className="text-sm mt-1 text-[var(--color-on-surface-variant)]">{guestInfo.college}</p>
                  <p className="text-xs text-[var(--color-primary)] font-bold mt-2 uppercase">{guestInfo.slot}</p>
                </div>
                <p className="text-xs text-[var(--color-outline)] font-mono">{scannedId}</p>
                <button onClick={resetScanner} className="mt-2 w-full py-4 bg-[var(--color-primary)] text-white rounded-full font-bold">SCAN NEXT</button>
              </div>
            )}
            {(modalState === 'failed' || modalState === 'network_error') && (
              <div className="flex flex-col items-center py-4 gap-3">
                <div className="w-20 h-20 rounded-full bg-[var(--color-error-container)] flex items-center justify-center">
                  {modalState === 'network_error' ? <WifiOff className="text-[var(--color-error)]" size={48} /> : <XCircle className="text-[var(--color-error)]" size={48} />}
                </div>
                <h3 className="font-[family-name:var(--font-display)] font-bold text-2xl text-[var(--color-error)]">{modalState === 'network_error' ? 'NO CONNECTION' : 'SCAN FAILED'}</h3>
                <p className="text-sm font-medium text-center">{errorMessage}</p>
                <p className="text-xs text-[var(--color-outline)] font-mono mt-2">{scannedId}</p>
                <button onClick={resetScanner} className="mt-2 w-full py-4 bg-[var(--color-surface-container-high)] text-[var(--color-on-surface)] rounded-full font-bold">TRY AGAIN</button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
