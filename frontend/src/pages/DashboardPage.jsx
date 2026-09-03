import { useState, useEffect } from 'react'
import { getStats } from '../api/client'

export default function DashboardPage() {
  const [stats, setStats] = useState({ total: 0, successful: 0, failed: 0 })
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const userName = localStorage.getItem('userName') || 'Volunteer'
  const firstName = userName.split(' ')[0]
  
  const fetchStats = async () => {
    try {
      setIsLoading(true)
      const data = await getStats()
      setStats(data)
      setError(null)
    } catch (err) {
      setError('Failed to load stats')
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchStats()
  }, [])

  const targetGoal = 9999
  const progressPercent = Math.min(100, (stats.successful / targetGoal) * 100)

  return (
    <div className="p-4 flex flex-col gap-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="font-display text-2xl font-bold text-on-surface">Hello, {firstName} 👋</h1>
          <p className="text-sm text-on-surface-variant flex items-center gap-1 mt-1">
            <span className="w-2 h-2 rounded-full bg-green-500"></span>
            Counter 01 • Active Session
          </p>
        </div>
        <button 
          onClick={fetchStats}
          className="p-2 rounded-full bg-surface-container-low text-on-surface-variant hover:text-primary transition-colors"
        >
          <span className={`material-symbols-outlined ${isLoading ? 'animate-spin' : ''}`}>refresh</span>
        </button>
      </div>

      {error && (
        <div className="p-3 bg-error-container text-on-error-container rounded-xl text-sm font-medium">
          {error}
        </div>
      )}

      {/* Main Stats Card */}
      <div className="bg-gradient-to-br from-primary to-primary-container rounded-3xl p-6 text-on-primary shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-20">
          <span className="material-symbols-outlined text-7xl">restaurant</span>
        </div>
        
        <h2 className="text-sm font-bold tracking-wider opacity-90 mb-2">TODAY'S FOOD DISTRIBUTION</h2>
        <div className="flex items-baseline gap-2 mb-6">
          <span className="text-5xl font-display font-bold">{stats.successful}</span>
          <span className="text-sm opacity-80">meals served</span>
        </div>
        
        <div>
          <div className="flex justify-between text-xs mb-1 opacity-90 font-medium">
            <span>Progress</span>
            <span>{stats.successful} / {targetGoal}</span>
          </div>
          <div className="w-full bg-on-primary/20 rounded-full h-2.5 overflow-hidden">
            <div 
              className="bg-on-primary h-2.5 rounded-full transition-all duration-1000 ease-out"
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Sub Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2 bg-surface-container-lowest rounded-2xl p-4 border border-surface-variant shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant">
              <span className="material-symbols-outlined">qr_code_scanner</span>
            </div>
            <div>
              <p className="text-xs text-on-surface-variant font-medium uppercase tracking-wide">Total Scanned</p>
              <p className="text-xl font-bold text-on-surface">{stats.total}</p>
            </div>
          </div>
          <span className="material-symbols-outlined text-outline-variant">chevron_right</span>
        </div>
        
        <div className="bg-surface-container-lowest rounded-2xl p-4 border border-surface-variant shadow-sm flex flex-col gap-2">
          <div className="w-8 h-8 rounded-full bg-green-100 text-green-700 flex items-center justify-center">
            <span className="material-symbols-outlined text-sm">check_circle</span>
          </div>
          <p className="text-xs text-on-surface-variant font-medium uppercase tracking-wide mt-1">Successful</p>
          <p className="text-2xl font-bold text-on-surface">{stats.successful}</p>
        </div>
        
        <div className="bg-surface-container-lowest rounded-2xl p-4 border border-error-container shadow-sm flex flex-col gap-2">
          <div className="w-8 h-8 rounded-full bg-error-container text-on-error-container flex items-center justify-center">
            <span className="material-symbols-outlined text-sm">error</span>
          </div>
          <p className="text-xs text-on-surface-variant font-medium uppercase tracking-wide mt-1">Failed</p>
          <p className="text-2xl font-bold text-error">{stats.failed}</p>
        </div>
      </div>
    </div>
  )
}
