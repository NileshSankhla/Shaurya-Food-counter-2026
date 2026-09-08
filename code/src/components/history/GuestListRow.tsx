"use client"

import { ChevronRight } from 'lucide-react'
import type { GuestDetail } from '@/types'

interface GuestListRowProps {
  guest: GuestDetail
  onClick: () => void
}

function getInitials(name: string) {
  return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
}

// Deterministic gradient from guest id
const GRADIENTS = [
  'from-orange-400 to-pink-500',
  'from-purple-500 to-indigo-500',
  'from-amber-400 to-orange-500',
  'from-pink-500 to-rose-500',
  'from-teal-400 to-cyan-500',
  'from-green-400 to-emerald-500',
]

export function GuestListRow({ guest, onClick }: GuestListRowProps) {
  const gradient = GRADIENTS[Number(guest.id) % GRADIENTS.length]
  const totalMeals = guest.meals.length
  const allPossible = 9 // Day 1 (4) + Day 2 (4) + Day 3 (1 so far)
  const pct = Math.round((totalMeals / allPossible) * 100)

  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-3 px-4 py-3.5 bg-[var(--color-surface-container-lowest)] hover:bg-[var(--color-surface-container-low)] active:bg-[var(--color-surface-container)] transition-colors border-b border-[var(--color-surface-variant)] last:border-0 text-left"
    >
      {/* Initials Avatar */}
      <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center text-white text-sm font-bold flex-shrink-0`}>
        {getInitials(guest.name)}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <p className="font-bold text-sm text-[var(--color-on-surface)] truncate">{guest.name}</p>
          <span className="text-[10px] font-mono text-[var(--color-on-surface-variant)] flex-shrink-0">{guest.uid}</span>
        </div>
        <div className="flex items-center gap-2 mt-0.5">
          <p className="text-xs text-[var(--color-on-surface-variant)] truncate flex-1">{guest.college}</p>
          {/* Mini meal progress */}
          <div className="flex items-center gap-1 flex-shrink-0">
            <div className="w-14 h-1.5 rounded-full bg-[var(--color-surface-container-high)] overflow-hidden">
              <div
                className="h-full rounded-full"
                style={{ width: `${pct}%`, background: 'linear-gradient(90deg, #f58529, #8639b4)' }}
              />
            </div>
            <span className="text-[9px] font-bold text-[var(--color-on-surface-variant)]">{totalMeals}m</span>
          </div>
        </div>
      </div>

      <ChevronRight size={16} className="text-[var(--color-outline-variant)] flex-shrink-0" />
    </button>
  )
}
