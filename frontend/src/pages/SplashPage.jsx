import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export default function SplashPage() {
  const navigate = useNavigate()

  useEffect(() => {
    const timer = setTimeout(() => {
      const token = localStorage.getItem('token')
      if (token) {
        navigate('/dashboard', { replace: true })
      } else {
        navigate('/login', { replace: true })
      }
    }, 3000)
    
    return () => clearTimeout(timer)
  }, [navigate])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background relative overflow-hidden">
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-64 h-64 bg-primary-container rounded-full opacity-20 blur-3xl animate-pulse"></div>
      </div>
      
      <div className="z-10 flex flex-col items-center">
        <img 
          src="/logo.png" 
          alt="Shaurya Logo" 
          className="w-32 h-32 mb-6 drop-shadow-lg"
        />
        <h1 className="font-display text-4xl font-bold text-primary mb-2 tracking-wider">
          SHAURYA
        </h1>
        <h2 className="font-body text-xl text-on-surface-variant font-medium tracking-wide">
          Food Counter
        </h2>
      </div>
      
      <div className="absolute bottom-10 z-10">
        <p className="font-body text-sm text-on-surface-variant/70 tracking-widest uppercase">
          Smart QR Food Distribution System
        </p>
      </div>
    </div>
  )
}
