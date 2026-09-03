import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export default function SplashPage() {
  const navigate = useNavigate()

  useEffect(() => {
    const timer = setTimeout(() => {
      const token = localStorage.getItem('token')
      navigate(token ? '/dashboard' : '/login', { replace: true })
    }, 2500)
    return () => clearTimeout(timer)
  }, [navigate])

  return (
    <div className="min-h-screen flex flex-col items-center justify-between py-12 bg-surface relative overflow-hidden">
      {/* Glow aura */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div
          className="w-72 h-72 rounded-full animate-pulse"
          style={{ background: 'radial-gradient(circle, rgba(245,133,41,0.2) 0%, transparent 70%)', filter: 'blur(40px)' }}
        />
      </div>

      <div className="flex-1" />

      {/* Center content */}
      <div className="z-10 flex flex-col items-center gap-4">
        <div className="relative">
          <div className="absolute inset-0 rounded-3xl rotate-12 opacity-20 blur-xl"
            style={{ background: 'linear-gradient(135deg, #964900, #f58529)' }} />
          <img src="/logo.png" alt="Shaurya Logo" className="w-28 h-28 object-contain relative z-10 drop-shadow-xl" />
        </div>
        <div className="text-center">
          <h1 className="font-display text-5xl font-bold text-primary tracking-wider">SHAURYA</h1>
          <p className="font-display text-lg text-on-surface-variant font-medium tracking-wide mt-1">Food Counter</p>
        </div>
      </div>

      <div className="flex-1" />

      {/* Footer */}
      <p className="z-10 text-xs text-on-surface-variant/60 tracking-[0.15em] uppercase">
        Smart QR Food Distribution System
      </p>
    </div>
  )
}
