"use client"
import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { loginAction } from '@/app/actions'
import { User, Lock, Eye, EyeOff, AlertCircle, Loader2 } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim() || !password.trim()) return
    setError('')
    
    startTransition(async () => {
      try {
        const res = await loginAction(email.trim(), password)
        if (res.success) {
          localStorage.setItem('userName', res.name!)
          router.replace('/dashboard')
        } else {
          setError(res.error || 'Login failed')
        }
      } catch {
        setError('Server unreachable')
      }
    })
  }

  return (
    <div className="min-h-screen bg-[var(--color-surface)] flex flex-col items-center justify-center px-6 py-12 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-80 h-80 rounded-full opacity-10 blur-3xl"
          style={{ background: 'radial-gradient(circle, #f58529 0%, #d081ff 100%)' }} />
      </div>

      <div className="w-full max-w-sm relative z-10">
        <div className="flex flex-col items-center mb-8">
          <div className="w-20 h-20 rounded-full bg-white shadow-lg flex items-center justify-center mb-4"
            style={{ boxShadow: '0 0 24px rgba(245,133,41,0.2)' }}>
            <div className="relative w-14 h-14"><Image src="/logo.png" alt="Logo" fill className="object-contain" /></div>
          </div>
          <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold text-[var(--color-on-surface)] text-center tracking-tight">SHAURYA FOOD COUNTER</h1>
          <p className="text-[var(--color-on-surface-variant)] text-sm mt-1">Volunteer Login</p>
        </div>

        {error && (
          <div className="flex items-start gap-2 p-3 mb-4 bg-[var(--color-error-container)] text-[var(--color-on-error-container)] rounded-2xl text-sm">
            <AlertCircle size={18} className="flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="flex flex-col gap-4" noValidate>
          <div className="relative">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-on-surface-variant)]" size={20} />
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="Email address"
              className="w-full h-14 pl-12 pr-4 bg-[var(--color-surface-container-low)] border border-[var(--color-outline-variant)] rounded-2xl text-[var(--color-on-surface)] placeholder:text-[var(--color-outline-variant)] focus:outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20 transition-all" />
          </div>

          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-on-surface-variant)]" size={20} />
            <input type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} required placeholder="Password"
              className="w-full h-14 pl-12 pr-12 bg-[var(--color-surface-container-low)] border border-[var(--color-outline-variant)] rounded-2xl text-[var(--color-on-surface)] focus:outline-none focus:border-[var(--color-primary)] transition-all" />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--color-on-surface-variant)]">
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <button type="submit" disabled={isPending}
            className="w-full h-14 mt-4 rounded-full font-bold text-white text-base flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-60"
            style={{ background: 'linear-gradient(135deg, #f58529 0%, #8639b4 100%)', boxShadow: '0 8px 24px rgba(245,133,41,0.3)' }}>
            {isPending ? <Loader2 className="animate-spin" /> : 'Login'}
          </button>
        </form>
      </div>
    </div>
  )
}
