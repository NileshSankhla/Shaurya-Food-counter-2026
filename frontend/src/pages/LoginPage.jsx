import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { login } from '../api/client'

export default function LoginPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = async (e) => {
    e.preventDefault()
    if (!email.trim() || !password.trim()) return
    setError('')
    setIsLoading(true)
    try {
      const data = await login(email.trim(), password)
      localStorage.setItem('token', data.token)
      localStorage.setItem('userName', data.name)
      navigate('/dashboard', { replace: true })
    } catch (err) {
      setError(err.message === 'Failed to fetch' ? 'Server unreachable. Check your connection.' : (err.message || 'Login failed'))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-surface flex flex-col items-center justify-center px-6 py-12 relative overflow-hidden">
      {/* Background aura */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-80 h-80 rounded-full opacity-10 blur-3xl"
          style={{ background: 'radial-gradient(circle, #f58529 0%, #d081ff 100%)' }} />
      </div>

      <div className="w-full max-w-sm relative z-10">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-20 h-20 rounded-full bg-white shadow-lg flex items-center justify-center mb-4"
            style={{ boxShadow: '0 0 24px rgba(245,133,41,0.2)' }}>
            <img src="/logo.png" alt="Shaurya Logo" className="w-14 h-14 object-contain" />
          </div>
          <h1 className="font-display text-2xl font-bold text-on-surface text-center tracking-tight">SHAURYA FOOD COUNTER</h1>
          <p className="text-on-surface-variant text-sm mt-1">Volunteer Login</p>
        </div>

        {/* Error */}
        {error && (
          <div className="flex items-start gap-2 p-3 mb-4 bg-error-container text-on-error-container rounded-2xl text-sm">
            <span className="material-symbols-outlined text-base flex-shrink-0 mt-0.5">error</span>
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleLogin} className="flex flex-col gap-4" noValidate>
          {/* Email */}
          <div className="relative">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none">person</span>
            <input
              type="email"
              autoComplete="email"
              placeholder="Email address"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              className="w-full h-14 pl-12 pr-4 bg-surface-container-low border border-outline-variant rounded-2xl text-on-surface placeholder:text-outline-variant focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
            />
          </div>

          {/* Password */}
          <div className="relative">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none">lock</span>
            <input
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              className="w-full h-14 pl-12 pr-12 bg-surface-container-low border border-outline-variant rounded-2xl text-on-surface placeholder:text-outline-variant focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
            />
            <button
              type="button"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              onClick={() => setShowPassword(v => !v)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface transition-colors"
            >
              <span className="material-symbols-outlined">{showPassword ? 'visibility_off' : 'visibility'}</span>
            </button>
          </div>

          {/* Forgot */}
          <div className="flex justify-end -mt-1">
            <button type="button" className="text-sm text-primary hover:underline">Forgot password?</button>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full h-14 rounded-full font-bold text-on-primary text-base flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
            style={{ background: isLoading ? '#ccc' : 'linear-gradient(135deg, #f58529 0%, #8639b4 100%)', boxShadow: '0 8px 24px rgba(245,133,41,0.3)' }}
          >
            {isLoading
              ? <><span className="material-symbols-outlined animate-spin">refresh</span> Logging in...</>
              : 'Login'
            }
          </button>
        </form>

        {/* Help */}
        <p className="text-center text-xs text-on-surface-variant/60 mt-8">
          Need help? Contact the event admin.
        </p>
      </div>
    </div>
  )
}
