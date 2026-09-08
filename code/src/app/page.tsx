"use client"
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { checkAuthAction } from '@/app/actions'

export default function SplashPage() {
  const router = useRouter()

  useEffect(() => {
    const timer = setTimeout(async () => {
      const isAuthenticated = await checkAuthAction()
      if (isAuthenticated) router.replace('/dashboard')
      else router.replace('/login')
    }, 2500)
    return () => clearTimeout(timer)
  }, [router])

  return (
    <div className="min-h-screen flex flex-col items-center justify-between py-12 bg-[var(--color-surface)] relative overflow-hidden">
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-72 h-72 rounded-full animate-pulse"
          style={{ background: 'radial-gradient(circle, rgba(245,133,41,0.2) 0%, transparent 70%)', filter: 'blur(40px)' }} />
      </div>
      <div className="flex-1" />
      <div className="z-10 flex flex-col items-center gap-4">
        <div className="relative w-28 h-28">
          <div className="absolute inset-0 rounded-3xl rotate-12 opacity-20 blur-xl"
            style={{ background: 'linear-gradient(135deg, #964900, #f58529)' }} />
          <Image src="/logo.png" alt="Shaurya Logo" fill className="object-contain relative z-10 drop-shadow-xl" priority />
        </div>
        <div className="text-center">
          <h1 className="font-[family-name:var(--font-display)] text-5xl font-bold text-[var(--color-primary)] tracking-wider">SHAURYA</h1>
          <p className="font-[family-name:var(--font-display)] text-lg text-[var(--color-on-surface-variant)] font-medium tracking-wide mt-1">Food Counter</p>
        </div>
      </div>
      <div className="flex-1" />
      <p className="z-10 text-xs text-[var(--color-on-surface-variant)] opacity-60 tracking-[0.15em] uppercase">Smart QR Food Distribution System</p>
    </div>
  )
}
