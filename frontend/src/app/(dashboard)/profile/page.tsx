"use client"
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { getDashboardStatsAction, logoutAction } from '@/app/actions'
import { Store, QrCode, Calendar, LogOut } from 'lucide-react'

function InfoRow({ icon: Icon, label, value }: { icon: any, label: string, value: string }) {
  return (
    <div className="flex items-center gap-3 p-4 border-b border-[var(--color-surface-variant)] last:border-0">
      <div className="w-10 h-10 rounded-2xl bg-[var(--color-primary)]/10 text-[var(--color-primary)] flex items-center justify-center flex-shrink-0">
        <Icon size={20} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-[var(--color-on-surface-variant)] font-semibold uppercase tracking-wide">{label}</p>
        <p className="font-bold truncate">{value}</p>
      </div>
    </div>
  )
}

export default function ProfilePage() {
  const router = useRouter()
  const [userName, setUserName] = useState('Volunteer')
  const [todayScans, setTodayScans] = useState('—')

  useEffect(() => {
    setUserName(localStorage.getItem('userName') || 'Volunteer')
    getDashboardStatsAction()
      .then(data => setTodayScans(String(data.totalMealsServed)))
      .catch(() => setTodayScans('—'))
  }, [])

  const handleLogout = () => {
    logoutAction()
    localStorage.removeItem('userName')
    router.replace('/login')
  }

  return (
    <div className="flex flex-col h-full overflow-y-auto bg-[var(--color-surface)]">
      <div className="flex flex-col items-center pt-8 pb-6 px-4"
        style={{ background: 'linear-gradient(180deg, rgba(245,133,41,0.08) 0%, transparent 100%)' }}>
        <div className="relative mb-4">
          <div className="w-24 h-24 rounded-full p-[3px]" style={{ background: 'linear-gradient(135deg, #f58529, #d081ff)' }}>
            <div className="relative w-full h-full rounded-full overflow-hidden border-2 border-[var(--color-surface)]">
              <Image src="/profile.png" alt="Profile" fill className="object-cover" />
            </div>
          </div>
          <div className="absolute bottom-0.5 right-0.5 w-5 h-5 bg-green-500 border-2 border-[var(--color-surface)] rounded-full" />
        </div>
        <h2 className="font-[family-name:var(--font-display)] text-2xl font-bold">{userName}</h2>
        <p className="text-[var(--color-on-surface-variant)] text-sm mt-1 font-medium">Food Counter Volunteer</p>
      </div>

      <div className="px-4 flex flex-col gap-4">
        <h3 className="text-xs font-bold text-[var(--color-on-surface-variant)] uppercase tracking-wider px-1">Account Details</h3>
        <div className="bg-[var(--color-surface-container-lowest)] rounded-2xl border border-[var(--color-surface-variant)] shadow-sm overflow-hidden">
          <InfoRow icon={Store} label="Assigned Counter" value="Counter 01" />
          <InfoRow icon={QrCode} label="Today's Scans" value={todayScans} />
          <InfoRow icon={Calendar} label="Event" value="Shaurya Sports Meet 2026" />
        </div>

        <button onClick={handleLogout} className="mt-4 flex items-center justify-center gap-2 w-full py-4 rounded-2xl font-bold text-[var(--color-error)] bg-[var(--color-error-container)]/50 border border-[var(--color-error-container)] transition-all active:scale-95">
          <LogOut size={20} />
          Logout securely
        </button>
      </div>
    </div>
  )
}
