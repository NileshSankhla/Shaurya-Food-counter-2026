"use client"

import { mockKpis } from '@/lib/mockData'
import { KpiRow } from '@/components/dashboard/KpiCard'
import { SlotProgressBar } from '@/components/dashboard/SlotProgressBar'
import { LiveFeed } from '@/components/dashboard/LiveFeed'
import { DayOverviewChart } from '@/components/charts/DayOverviewChart'
import { SlotHeatmap } from '@/components/charts/SlotHeatmap'
import { CollegeDonut } from '@/components/charts/CollegeDonut'
import { CumulativeAreaChart } from '@/components/charts/CumulativeAreaChart'
import { RefreshCw } from 'lucide-react'

export default function DashboardPage() {
  const firstName = 'Volunteer' // will come from localStorage after wiring

  return (
    <div className="overflow-y-auto h-full no-scrollbar bg-[var(--color-surface)]">
      <div className="max-w-2xl mx-auto px-4 pt-5 pb-24 flex flex-col gap-5">

        {/* ── Header ── */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold text-[var(--color-on-surface)]">
              Hello, {firstName} 👋
            </h1>
            <p className="text-sm text-[var(--color-on-surface-variant)] flex items-center gap-1.5 mt-1">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse inline-block" />
              Counter 01 &bull; Active · Shaurya 2026
            </p>
          </div>
          <button
            aria-label="Refresh"
            className="w-10 h-10 rounded-full bg-[var(--color-surface-container)] flex items-center justify-center text-[var(--color-on-surface-variant)] hover:text-[var(--color-primary)] transition-colors"
          >
            <RefreshCw size={20} />
          </button>
        </div>

        {/* ── Active Slot Hero ── */}
        <SlotProgressBar
          slotName={mockKpis.activeSlot}
          served={mockKpis.activeSlotServed}
          total={mockKpis.activeSlotTotal}
          isActive={true}
        />

        {/* ── KPI Cards ── */}
        <KpiRow
          totalGuests={mockKpis.totalGuests}
          totalMealsServed={mockKpis.totalMealsServed}
          todayMeals={mockKpis.todayMeals}
          activeSlot={mockKpis.activeSlot}
        />

        {/* ── Section Label ── */}
        <div className="flex items-center gap-2">
          <div className="flex-1 h-px bg-[var(--color-surface-variant)]" />
          <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--color-on-surface-variant)]">
            Analytics
          </span>
          <div className="flex-1 h-px bg-[var(--color-surface-variant)]" />
        </div>

        {/* ── Chart 1: Grouped Bar ── */}
        <DayOverviewChart />

        {/* ── Chart 2: Heatmap ── */}
        <SlotHeatmap />

        {/* ── Chart 3 + 4 stacked ── */}
        <CumulativeAreaChart />
        <CollegeDonut />

        {/* ── Section Label ── */}
        <div className="flex items-center gap-2">
          <div className="flex-1 h-px bg-[var(--color-surface-variant)]" />
          <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--color-on-surface-variant)]">
            Live Activity
          </span>
          <div className="flex-1 h-px bg-[var(--color-surface-variant)]" />
        </div>

        {/* ── Live Feed ── */}
        <LiveFeed />

      </div>
    </div>
  )
}
