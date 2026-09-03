import { useState, useEffect, useCallback } from 'react'
import { getStats } from '../api/client'

export default function DashboardPage() {
  const [stats, setStats] = useState({ total: 0, successful: 0, failed: 0 })
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  const userName = localStorage.getItem('userName') || 'Volunteer'
  const firstName = userName.split(' ')[0]

  const fetchStats = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await getStats()
      setStats(data)
    } catch (err) {
      setError('Could not load stats. Check your connection.')
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => { fetchStats() }, [fetchStats])

  const GOAL = 9999
  const progressPct = stats.successful > 0 ? Math.min(100, (stats.successful / GOAL) * 100) : 0

  return (
    <div className="px-4 pt-5 pb-6 flex flex-col gap-5 max-w-lg mx-auto">

      {/* ── Welcome row ── */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="font-display text-2xl font-bold text-on-surface">Hello, {firstName} 👋</h1>
          <p className="text-sm text-on-surface-variant flex items-center gap-1.5 mt-1">
            <span className="w-2 h-2 rounded-full bg-green-500 inline-block" />
            Counter 01 &bull; Active Session
          </p>
        </div>
        <button
          onClick={fetchStats}
          disabled={isLoading}
          aria-label="Refresh stats"
          className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant hover:text-primary hover:bg-surface-container-high transition-colors disabled:opacity-50"
        >
          <span className={`material-symbols-outlined text-xl ${isLoading ? 'animate-spin' : ''}`}>refresh</span>
        </button>
      </div>

      {/* ── Error banner ── */}
      {error && (
        <div className="flex items-center gap-2 p-3 bg-error-container text-on-error-container rounded-2xl text-sm">
          <span className="material-symbols-outlined text-base">error</span>
          {error}
        </div>
      )}

      {/* ── Hero stats card ── */}
      <div className="rounded-3xl p-6 text-on-primary shadow-lg relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #964900 0%, #f58529 100%)' }}>
        {/* Decorative icon */}
        <span className="material-symbols-outlined absolute -right-3 -top-3 opacity-10 select-none"
          style={{ fontSize: 120 }}>restaurant</span>

        <p className="text-xs font-bold tracking-widest uppercase opacity-80 mb-1">Today&rsquo;s Food Distribution</p>

        <div className="flex items-baseline gap-2 mb-5">
          <span className="font-display font-bold leading-none" style={{ fontSize: 56 }}>{stats.successful}</span>
          <span className="text-sm opacity-80 mb-1">meals served</span>
        </div>

        {/* Progress bar */}
        <div className="flex justify-between text-xs opacity-80 mb-1.5">
          <span>Daily Goal Progress</span>
          <span>{stats.successful} / {GOAL}</span>
        </div>
        <div className="w-full h-2 rounded-full overflow-hidden bg-white/20">
          <div
            className="h-full rounded-full bg-white transition-all duration-1000 ease-out"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>

      {/* ── Sub-stats grid ── */}
      <div className="grid grid-cols-2 gap-3">

        {/* Total Scanned — spans full width */}
        <div className="col-span-2 bg-surface-container-lowest rounded-2xl p-4 border border-surface-variant shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
              <span className="material-symbols-outlined">qr_code_scanner</span>
            </div>
            <div>
              <p className="text-xs text-on-surface-variant font-semibold uppercase tracking-wide">Total Scanned</p>
              <p className="text-2xl font-bold text-on-surface font-display">{stats.total}</p>
            </div>
          </div>
          <span className="material-symbols-outlined text-outline-variant">chevron_right</span>
        </div>

        {/* Successful */}
        <div className="bg-surface-container-lowest rounded-2xl p-4 border border-surface-variant shadow-sm">
          <div className="w-9 h-9 rounded-xl bg-green-100 text-green-700 flex items-center justify-center mb-2">
            <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
          </div>
          <p className="text-xs text-on-surface-variant font-semibold uppercase tracking-wide">Successful</p>
          <p className="text-2xl font-bold text-green-700 font-display mt-0.5">{stats.successful}</p>
        </div>

        {/* Failed */}
        <div className="bg-surface-container-lowest rounded-2xl p-4 border border-surface-variant shadow-sm">
          <div className="w-9 h-9 rounded-xl bg-error-container text-on-error-container flex items-center justify-center mb-2">
            <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 1" }}>cancel</span>
          </div>
          <p className="text-xs text-on-surface-variant font-semibold uppercase tracking-wide">Failed</p>
          <p className="text-2xl font-bold text-error font-display mt-0.5">{stats.failed}</p>
        </div>

      </div>
    </div>
  )
}
