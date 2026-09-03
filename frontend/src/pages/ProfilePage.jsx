import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { getStats } from '../api/client'

export default function ProfilePage() {
  const navigate = useNavigate()
  const userName = localStorage.getItem('userName') || 'Volunteer User'
  const [todayScans, setTodayScans] = useState('-')

  useEffect(() => {
    getStats().then(data => setTodayScans(data.total)).catch(() => {})
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('userName')
    navigate('/login')
  }

  return (
    <div className="flex flex-col h-full bg-surface">
      <div className="bg-gradient-to-b from-primary-container/20 to-surface pt-12 pb-6 px-4 flex flex-col items-center">
        <div className="relative mb-4">
          <div className="w-24 h-24 rounded-full p-1 bg-gradient-to-tr from-primary to-tertiary">
            <img src="/profile.png" alt="Profile" className="w-full h-full rounded-full object-cover border-4 border-surface" />
          </div>
          <div className="absolute bottom-0 right-0 w-6 h-6 bg-green-500 border-2 border-surface rounded-full flex items-center justify-center">
            <span className="material-symbols-outlined text-[14px] text-white">check</span>
          </div>
        </div>
        
        <h2 className="font-display text-2xl font-bold text-on-surface">{userName}</h2>
        <p className="text-on-surface-variant font-medium">Food Counter Volunteer</p>
      </div>

      <div className="p-4 flex-1 flex flex-col gap-4">
        <h3 className="text-sm font-bold text-on-surface-variant uppercase tracking-wider mb-1 px-2">Account Info</h3>
        
        <div className="bg-surface-container-lowest rounded-2xl border border-surface-variant shadow-sm overflow-hidden">
          <div className="p-4 flex items-center gap-4 border-b border-surface-variant">
            <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center">
              <span className="material-symbols-outlined">storefront</span>
            </div>
            <div>
              <p className="text-xs text-on-surface-variant font-medium uppercase">Assigned Counter</p>
              <p className="font-bold text-on-surface">Counter 01</p>
            </div>
          </div>
          
          <div className="p-4 flex items-center gap-4 border-b border-surface-variant">
            <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center">
              <span className="material-symbols-outlined">qr_code_scanner</span>
            </div>
            <div>
              <p className="text-xs text-on-surface-variant font-medium uppercase">Today's Scans</p>
              <p className="font-bold text-on-surface">{todayScans}</p>
            </div>
          </div>

          <div className="p-4 flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center">
              <span className="material-symbols-outlined">event</span>
            </div>
            <div>
              <p className="text-xs text-on-surface-variant font-medium uppercase">Event</p>
              <p className="font-bold text-on-surface">Shaurya Sports Meet 2026</p>
            </div>
          </div>
        </div>

        <button 
          onClick={handleLogout}
          className="mt-6 w-full py-4 bg-error-container text-on-error-container rounded-2xl font-bold text-lg hover:bg-error/20 transition-colors flex justify-center items-center gap-2"
        >
          <span className="material-symbols-outlined">logout</span>
          Logout
        </button>
        
        <p className="text-center text-xs text-on-surface-variant/60 mt-auto pt-8 pb-4">
          App Version 2.0.0 (React)
        </p>
      </div>
    </div>
  )
}
