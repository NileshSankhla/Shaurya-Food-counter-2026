"use client"
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Home, ScanLine, History, User } from 'lucide-react'

const NAV_ITEMS = [
  { path: '/dashboard', icon: Home, label: 'Home' },
  { path: '/scanner', icon: ScanLine, label: 'Scanner' },
  { path: '/history', icon: History, label: 'History' },
  { path: '/profile', icon: User, label: 'Profile' },
]

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isScanner = pathname === '/scanner'

  return (
    <div className="flex flex-col bg-[var(--color-surface)] h-[100dvh] overflow-hidden">
      {!isScanner && (
        <header className="flex-shrink-0 z-50 flex items-center justify-between px-4 h-14 bg-[var(--color-surface)] border-b border-[var(--color-surface-variant)] relative">
          <div className="relative w-8 h-8"><Image src="/logo.png" alt="Logo" fill className="object-contain" /></div>
          <h1 className="font-[family-name:var(--font-display)] font-bold text-base text-[var(--color-primary)] tracking-wide absolute left-1/2 -translate-x-1/2">
            CampusEats
          </h1>
          <div className="w-9 h-9" />
        </header>
      )}

      <main className={`flex-1 min-h-0 ${isScanner ? 'overflow-hidden' : 'overflow-y-auto'}`}>
        {children}
      </main>

      <nav className="flex-shrink-0 bg-[var(--color-surface-container-lowest)] border-t border-[var(--color-surface-variant)] z-50 pb-safe">
        <div className="flex justify-around items-stretch">
          {NAV_ITEMS.map(({ path, icon: Icon, label }) => {
            const isActive = pathname === path
            return (
              <Link key={path} href={path} className={`flex flex-col items-center justify-center gap-1 flex-1 py-2 min-h-[56px] transition-colors ${isActive ? 'text-[var(--color-primary)]' : 'text-[var(--color-on-surface-variant)]'}`}>
                <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
                <span className={`text-[10px] leading-none ${isActive ? 'font-bold' : 'font-medium'}`}>{label}</span>
              </Link>
            )
          })}
        </div>
      </nav>
    </div>
  )
}
