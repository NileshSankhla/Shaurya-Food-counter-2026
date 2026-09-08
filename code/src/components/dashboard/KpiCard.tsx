"use client"

import { Users, UtensilsCrossed, CalendarCheck, Zap } from 'lucide-react'

interface KpiCardProps {
  title: string
  value: string | number
  subtitle?: string
  icon: React.ReactNode
  accent: 'primary' | 'green' | 'purple' | 'pink'
}

const ACCENT_STYLES = {
  primary: {
    icon: 'bg-[#f58529]/15 text-[#f58529]',
    value: 'text-[var(--color-primary)]',
  },
  green: {
    icon: 'bg-green-100 text-green-700',
    value: 'text-green-700',
  },
  purple: {
    icon: 'bg-purple-100 text-purple-700',
    value: 'text-purple-700',
  },
  pink: {
    icon: 'bg-pink-100 text-pink-700',
    value: 'text-pink-700',
  },
}

export function KpiCard({ title, value, subtitle, icon, accent }: KpiCardProps) {
  const styles = ACCENT_STYLES[accent]
  return (
    <div className="bg-[var(--color-surface-container-lowest)] rounded-2xl p-4 border border-[var(--color-surface-variant)] shadow-sm flex items-start gap-3">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${styles.icon}`}>
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-on-surface-variant)]">{title}</p>
        <p className={`text-2xl font-bold font-[family-name:var(--font-display)] leading-tight ${styles.value}`}>{value}</p>
        {subtitle && <p className="text-xs text-[var(--color-on-surface-variant)] mt-0.5">{subtitle}</p>}
      </div>
    </div>
  )
}

interface KpiRowProps {
  totalGuests: number
  totalMealsServed: number
  todayMeals: number
  activeSlot: string
}

export function KpiRow({ totalGuests, totalMealsServed, todayMeals, activeSlot }: KpiRowProps) {
  return (
    <div className="grid grid-cols-2 gap-3">
      <KpiCard title="Total Guests" value={totalGuests} subtitle="Registered" icon={<Users size={20} />} accent="primary" />
      <KpiCard title="All-Time Meals" value={totalMealsServed.toLocaleString()} subtitle="Across 3 days" icon={<UtensilsCrossed size={20} />} accent="green" />
      <KpiCard title="Today's Meals" value={todayMeals} subtitle="Day 3 progress" icon={<CalendarCheck size={20} />} accent="purple" />
      <KpiCard title="Active Slot" value={activeSlot} subtitle="Counter is open" icon={<Zap size={20} />} accent="pink" />
    </div>
  )
}
