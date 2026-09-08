"use client"

import { useEffect, useRef } from 'react'
import { X, Phone, Mail, QrCode, UtensilsCrossed, CheckCircle, Calendar } from 'lucide-react'
import type { GuestDetail } from '@/types'
import { SLOT_BADGE_COLORS } from '@/lib/mockData'

interface GuestDetailModalProps {
  guest: GuestDetail | null
  onClose: () => void
}

const DAY_COLORS = ['border-orange-300', 'border-purple-300', 'border-pink-300']
const DAY_BG    = ['bg-orange-50',      'bg-purple-50',      'bg-pink-50'      ]

function getInitials(name: string) {
  return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
}

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true })
}

const POSSIBLE_SLOTS = ['Breakfast', 'Lunch', 'Snacks', 'Dinner'] as const

export function GuestDetailModal({ guest, onClose }: GuestDetailModalProps) {
  const panelRef = useRef<HTMLDivElement>(null)

  // Close on backdrop click
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose()
  }

  // Close on Escape key
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  // Lock body scroll while modal is open
  useEffect(() => {
    if (guest) document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [guest])

  if (!guest) return null

  // Group meals by day number
  const mealsByDay: Record<number, typeof guest.meals> = {}
  for (const meal of guest.meals) {
    if (!mealsByDay[meal.dayNumber]) mealsByDay[meal.dayNumber] = []
    mealsByDay[meal.dayNumber].push(meal)
  }

  const totalMeals = guest.meals.length
  const allPossible = 3 * 4  // 3 days × 4 slots
  const attendancePct = Math.round((totalMeals / allPossible) * 100)

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 backdrop-blur-sm"
      onClick={handleBackdropClick}
    >
      {/* Bottom sheet panel */}
      <div
        ref={panelRef}
        className="w-full max-w-lg bg-[var(--color-surface)] rounded-t-[32px] shadow-2xl flex flex-col"
        style={{ maxHeight: '92dvh' }}
      >
        {/* Drag handle */}
        <div className="flex justify-center pt-3 pb-1 flex-shrink-0">
          <div className="w-10 h-1 rounded-full bg-[var(--color-outline-variant)]" />
        </div>

        {/* Scrollable content */}
        <div className="overflow-y-auto flex-1 no-scrollbar">

          {/* ── Profile Header ── */}
          <div className="px-6 pt-3 pb-5 relative">
            <button
              onClick={onClose}
              className="absolute top-0 right-6 w-9 h-9 rounded-full bg-[var(--color-surface-container)] flex items-center justify-center text-[var(--color-on-surface-variant)] hover:text-[var(--color-on-surface)] transition-colors"
            >
              <X size={18} />
            </button>

            <div className="flex items-center gap-4 mt-2">
              {/* Avatar */}
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center text-white text-xl font-bold font-[family-name:var(--font-display)] flex-shrink-0"
                style={{ background: 'linear-gradient(135deg, #f58529, #8639b4)' }}
              >
                {getInitials(guest.name)}
              </div>

              <div className="flex-1 min-w-0">
                <h2 className="font-[family-name:var(--font-display)] text-xl font-bold text-[var(--color-on-surface)] truncate">
                  {guest.name}
                </h2>
                <p className="text-sm text-[var(--color-on-surface-variant)] truncate">{guest.college}</p>
                <span className="inline-flex items-center gap-1 mt-1 text-[10px] font-bold bg-[var(--color-surface-container)] text-[var(--color-on-surface-variant)] px-2 py-0.5 rounded-full">
                  <QrCode size={10} />
                  {guest.uid}
                </span>
              </div>
            </div>

            {/* Contact info pills */}
            <div className="flex flex-col gap-2 mt-4">
              <a href={`tel:${guest.mobile}`} className="flex items-center gap-3 p-3 bg-[var(--color-surface-container-low)] rounded-2xl hover:bg-[var(--color-surface-container)] transition-colors">
                <div className="w-8 h-8 rounded-xl bg-[var(--color-primary)]/10 text-[var(--color-primary)] flex items-center justify-center flex-shrink-0">
                  <Phone size={16} />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-[var(--color-on-surface-variant)] uppercase tracking-wide">Mobile</p>
                  <p className="text-sm font-bold text-[var(--color-on-surface)]">{guest.mobile}</p>
                </div>
              </a>

              <a href={`mailto:${guest.email}`} className="flex items-center gap-3 p-3 bg-[var(--color-surface-container-low)] rounded-2xl hover:bg-[var(--color-surface-container)] transition-colors">
                <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center flex-shrink-0">
                  <Mail size={16} />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] font-bold text-[var(--color-on-surface-variant)] uppercase tracking-wide">Email</p>
                  <p className="text-sm font-bold text-[var(--color-on-surface)] truncate">{guest.email}</p>
                </div>
              </a>
            </div>

            {/* Attendance Summary Bar */}
            <div className="mt-4 p-4 rounded-2xl border border-[var(--color-surface-variant)] bg-[var(--color-surface-container-lowest)]">
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-1.5">
                  <UtensilsCrossed size={14} className="text-[var(--color-primary)]" />
                  <span className="text-xs font-bold text-[var(--color-on-surface)]">Meal Attendance</span>
                </div>
                <span className="text-xs font-bold text-[var(--color-primary)]">{totalMeals} / {allPossible} slots</span>
              </div>
              <div className="w-full h-2 rounded-full bg-[var(--color-surface-container-high)] overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{ width: `${attendancePct}%`, background: 'linear-gradient(90deg, #f58529, #8639b4)' }}
                />
              </div>
              <p className="text-[10px] text-[var(--color-on-surface-variant)] mt-1 text-right">{attendancePct}% attended</p>
            </div>
          </div>

          {/* ── Meal Timeline by Day ── */}
          <div className="px-6 pb-8">
            <h3 className="text-xs font-bold uppercase tracking-widest text-[var(--color-on-surface-variant)] mb-3">
              Meal Timeline
            </h3>

            {[1, 2, 3].map(dayNum => {
              const dayMeals = mealsByDay[dayNum] || []
              const dayLabel = ['Day 1 (Sep 12)', 'Day 2 (Sep 13)', 'Day 3 (Sep 14)'][dayNum - 1]

              return (
                <div key={dayNum} className={`mb-4 rounded-2xl border-l-4 overflow-hidden ${DAY_COLORS[dayNum - 1]}`}>
                  {/* Day Header */}
                  <div className={`flex items-center justify-between px-4 py-2.5 ${DAY_BG[dayNum - 1]}`}>
                    <div className="flex items-center gap-2">
                      <Calendar size={14} className="text-[var(--color-on-surface-variant)]" />
                      <span className="text-sm font-bold text-[var(--color-on-surface)]">{dayLabel}</span>
                    </div>
                    <span className="text-xs font-bold text-[var(--color-on-surface-variant)]">
                      {dayMeals.length} / 4 meals
                    </span>
                  </div>

                  {/* Slot Grid */}
                  <div className="bg-[var(--color-surface-container-lowest)] grid grid-cols-2 gap-2 p-3">
                    {POSSIBLE_SLOTS.map(slot => {
                      const meal = dayMeals.find(m => m.slotTitle === slot)
                      const received = !!meal
                      const colors = SLOT_BADGE_COLORS[slot]

                      return (
                        <div
                          key={slot}
                          className={`flex items-center gap-2.5 p-2.5 rounded-xl border transition-all ${
                            received
                              ? `${colors.bg} border-transparent`
                              : 'bg-[var(--color-surface-container)] border-[var(--color-surface-variant)]'
                          }`}
                        >
                          <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${
                            received ? `${colors.bg} ${colors.text}` : 'bg-[var(--color-surface-variant)] text-[var(--color-outline)]'
                          }`}>
                            {received
                              ? <CheckCircle size={14} />
                              : <X size={14} />
                            }
                          </div>
                          <div className="min-w-0">
                            <p className={`text-xs font-bold truncate ${received ? colors.text : 'text-[var(--color-on-surface-variant)]'}`}>
                              {slot}
                            </p>
                            {received && (
                              <p className="text-[9px] text-[var(--color-on-surface-variant)]">
                                {formatTime(meal.scannedAt)}
                              </p>
                            )}
                            {!received && (
                              <p className="text-[9px] text-[var(--color-on-surface-variant)]">Not taken</p>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
