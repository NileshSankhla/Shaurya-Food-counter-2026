import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getStats } from '../api/client'

function InfoRow({ icon, label, value }) {
  return (
    <div className="flex items-center gap-3 p-4 border-b border-surface-variant last:border-0">
      <div className="w-10 h-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
        <span className="material-symbols-outlined text-xl">{icon}</span>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-on-surface-variant font-semibold uppercase tracking-wide">{label}</p>
        <p className="font-bold text-on-surface truncate">{value}</p>
      </div>
    </div>
  )
}

export default function ProfilePage() {
  const navigate = useNavigate()
  const userName = localStorage.getItem('userName') || 'Volunteer'
  const [todayScans, setTodayScans] = useState('—')

  useEffect(() => {
    getStats()
      .then(data => setTodayScans(String(data.total)))
      .catch(() => setTodayScans('—'))
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('userName')
    navigate('/login', { replace: true })
  }

  return (
    <div className="flex flex-col h-full overflow-y-auto bg-surface">

      {/* ── Profile header ── */}
      <div className="flex flex-col items-center pt-8 pb-6 px-4"
        style={{ background: 'linear-gradient(180deg, rgba(245,133,41,0.08) 0%, transparent 100%)' }}>
        {/* Avatar with gradient ring */}
        <div className="relative mb-4">
          <div className="w-24 h-24 rounded-full p-[3px]"
            style={{ background: 'linear-gradient(135deg, #f58529, #d081ff)' }}>
            <img
              src="/profile.png"
              alt="Profile"
              className="w-full h-full rounded-full object-cover border-2 border-surface"
            />
          </div>
          {/* Online indicator */}
          <div className="absolute bottom-0.5 right-0.5 w-5 h-5 bg-green-500 border-2 border-surface rounded-full" />
        </div>

        <h2 className="font-display text-2xl font-bold text-on-surface text-center">{userName}</h2>
        <p className="text-on-surface-variant text-sm mt-1 font-medium">Food Counter Volunteer</p>
      </div>

      {/* ── Info card ── */}
      <div className="px-4 flex flex-col gap-4">
        <h3 className="text-xs font-bold text-on-surface-variant uppercase tracking-wider px-1">Account Details</h3>
        <div className="bg-surface-container-lowest rounded-2xl border border-surface-variant shadow-sm overflow-hidden">
          <InfoRow icon="storefront"      label="Assigned Counter"  value="Counter 01" />
          <InfoRow icon="qr_code_scanner" label="Today's Scans"     value={todayScans} />
          <InfoRow icon="event"           label="Event"             value="Shaurya Sports Meet 2026" />
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="w-full h-14 mt-2 rounded-2xl font-bold text-base flex items-center justify-center gap-2 bg-error-container text-on-error-container hover:bg-error/15 active:scale-95 transition-all"
        >
          <span className="material-symbols-outlined">logout</span>
          Logout
        </button>

        <p className="text-center text-xs text-on-surface-variant/40 pb-4">
          Shaurya Food Counter v2.0.0
        </p>
      </div>

    </div>
  )
}
