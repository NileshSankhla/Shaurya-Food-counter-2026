"use client"

import { useState, useMemo } from 'react'
import { Search, Users, SlidersHorizontal, X } from 'lucide-react'
import { MOCK_GUESTS } from '@/lib/mockData'
import type { GuestDetail } from '@/types'
import { GuestListRow } from '@/components/history/GuestListRow'
import { GuestDetailModal } from '@/components/history/GuestDetailModal'

type FilterType = 'all' | 'full' | 'partial' | 'none'

const FILTER_LABELS: Record<FilterType, string> = {
  all:     'All',
  full:    'Full Attendance',
  partial: 'Partial',
  none:    'Not Attended',
}

export default function HistoryPage() {
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<FilterType>('all')
  const [selectedGuest, setSelectedGuest] = useState<GuestDetail | null>(null)
  const [showFilters, setShowFilters] = useState(false)

  const maxMeals = 9 // Day 1 (4) + Day 2 (4) + Day 3 (1 so far)

  const filteredGuests = useMemo(() => {
    const q = search.toLowerCase().trim()

    return MOCK_GUESTS.filter(guest => {
      // Search across name, college, mobile, uid
      const matchesSearch = !q ||
        guest.name.toLowerCase().includes(q) ||
        guest.college.toLowerCase().includes(q) ||
        guest.mobile.includes(q) ||
        guest.uid.toLowerCase().includes(q)

      if (!matchesSearch) return false

      // Attendance filter
      const meals = guest.meals.length
      if (filter === 'full')    return meals === maxMeals
      if (filter === 'partial') return meals > 0 && meals < maxMeals
      if (filter === 'none')    return meals === 0

      return true
    })
  }, [search, filter])

  const stats = useMemo(() => ({
    total:   MOCK_GUESTS.length,
    matched: filteredGuests.length,
    avgMeals: (MOCK_GUESTS.reduce((s, g) => s + g.meals.length, 0) / MOCK_GUESTS.length).toFixed(1),
  }), [filteredGuests.length])

  return (
    <div className="flex flex-col h-full bg-[var(--color-surface)]">

      {/* ── Sticky Header ── */}
      <div className="flex-shrink-0 px-4 pt-5 pb-3 bg-[var(--color-surface)] z-10 sticky top-0 border-b border-[var(--color-surface-variant)]">

        {/* Title row */}
        <div className="flex items-center justify-between mb-3">
          <div>
            <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold text-[var(--color-on-surface)]">
              Guest History
            </h1>
            <p className="text-xs text-[var(--color-on-surface-variant)] mt-0.5">
              {stats.total} registered · avg {stats.avgMeals} meals/person
            </p>
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors ${
              filter !== 'all'
                ? 'bg-[var(--color-primary)] text-white'
                : 'bg-[var(--color-surface-container)] text-[var(--color-on-surface-variant)]'
            }`}
          >
            <SlidersHorizontal size={18} />
          </button>
        </div>

        {/* Search bar */}
        <div className="relative">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-on-surface-variant)]"
          />
          <input
            type="text"
            placeholder="Search name, college, mobile, UID..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-10 py-2.5 bg-[var(--color-surface-container-lowest)] border border-[var(--color-surface-variant)] rounded-2xl text-sm focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/15 outline-none transition-all text-[var(--color-on-surface)] placeholder:text-[var(--color-on-surface-variant)]/60"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-on-surface-variant)] hover:text-[var(--color-on-surface)]"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* Filter chips */}
        {showFilters && (
          <div className="flex gap-2 mt-2 overflow-x-auto no-scrollbar pb-0.5">
            {(Object.keys(FILTER_LABELS) as FilterType[]).map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap transition-all flex-shrink-0 ${
                  filter === f
                    ? 'bg-[var(--color-primary)] text-white shadow-sm'
                    : 'bg-[var(--color-surface-container)] text-[var(--color-on-surface-variant)]'
                }`}
              >
                {FILTER_LABELS[f]}
              </button>
            ))}
          </div>
        )}

        {/* Result count */}
        {(search || filter !== 'all') && (
          <p className="text-xs text-[var(--color-on-surface-variant)] mt-2">
            Showing <span className="font-bold text-[var(--color-primary)]">{stats.matched}</span> of {stats.total} guests
          </p>
        )}
      </div>

      {/* ── Guest List ── */}
      <div className="flex-1 overflow-y-auto no-scrollbar">
        {filteredGuests.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <Users size={40} className="text-[var(--color-outline-variant)]" />
            <p className="text-[var(--color-on-surface-variant)] font-medium">No guests match your search</p>
            <button
              onClick={() => { setSearch(''); setFilter('all') }}
              className="text-xs text-[var(--color-primary)] font-bold"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div className="rounded-none">
            {filteredGuests.map(guest => (
              <GuestListRow
                key={guest.id}
                guest={guest}
                onClick={() => setSelectedGuest(guest)}
              />
            ))}
            {/* Bottom padding for nav bar */}
            <div className="h-20" />
          </div>
        )}
      </div>

      {/* ── Guest Detail Modal ── */}
      <GuestDetailModal
        guest={selectedGuest}
        onClose={() => setSelectedGuest(null)}
      />
    </div>
  )
}
