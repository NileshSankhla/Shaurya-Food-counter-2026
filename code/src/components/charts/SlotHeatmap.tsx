"use client"

import { useState } from 'react'
import { mockHeatmapData, SLOT_COLORS } from '@/lib/mockData'
import { SLOTS, DAYS } from '@/types'

const MAX_MEALS = 480 // Total guests = max possible

function getIntensity(value: number): string {
  if (value === 0) return 'bg-[var(--color-surface-variant)] text-[var(--color-on-surface-variant)]'
  const pct = value / MAX_MEALS
  if (pct > 0.9)  return 'text-white opacity-100'
  if (pct > 0.7)  return 'text-white opacity-90'
  if (pct > 0.5)  return 'text-white opacity-80'
  if (pct > 0.3)  return 'text-white opacity-70'
  return 'text-white opacity-60'
}

function getCellStyle(slot: string, value: number): React.CSSProperties {
  if (value === 0) return {}
  const pct = value / MAX_MEALS
  const color = SLOT_COLORS[slot as keyof typeof SLOT_COLORS] || '#964900'
  return {
    background: color,
    opacity: 0.3 + pct * 0.7,
  }
}

export function SlotHeatmap() {
  const [tooltip, setTooltip] = useState<{ day: string; slot: string; value: number } | null>(null)

  return (
    <div className="bg-[var(--color-surface-container-lowest)] rounded-2xl border border-[var(--color-surface-variant)] shadow-sm p-4">
      <div className="mb-4">
        <h3 className="font-bold text-[var(--color-on-surface)]">Distribution Heatmap</h3>
        <p className="text-xs text-[var(--color-on-surface-variant)] mt-0.5">Intensity = meals served (darker = more)</p>
      </div>

      {/* Header row */}
      <div className="grid grid-cols-5 gap-2 mb-2">
        <div /> {/* Empty corner */}
        {SLOTS.map(slot => (
          <div key={slot} className="text-center">
            <span
              className="text-[10px] font-bold px-1.5 py-0.5 rounded-full text-white"
              style={{ background: SLOT_COLORS[slot] }}
            >
              {slot.slice(0, 4)}
            </span>
          </div>
        ))}
      </div>

      {/* Data rows */}
      {DAYS.map((day, di) => (
        <div key={day} className="grid grid-cols-5 gap-2 mb-2">
          <div className="flex items-center">
            <span className="text-[10px] font-bold text-[var(--color-on-surface-variant)] leading-tight">
              Day {di + 1}
            </span>
          </div>
          {SLOTS.map(slot => {
            const val = mockHeatmapData[day][slot]
            const pct = val > 0 ? Math.round((val / MAX_MEALS) * 100) : 0
            return (
              <div
                key={slot}
                className="relative rounded-xl h-14 flex flex-col items-center justify-center cursor-pointer transition-transform hover:scale-105"
                style={val > 0 ? getCellStyle(slot, val) : { background: '#eeeeee' }}
                onMouseEnter={() => setTooltip({ day, slot, value: val })}
                onMouseLeave={() => setTooltip(null)}
              >
                <span className={`text-sm font-bold ${val > 0 ? getIntensity(val) : 'text-[var(--color-on-surface-variant)]'}`}>
                  {val > 0 ? val : '—'}
                </span>
                {val > 0 && (
                  <span className="text-[9px] opacity-80 text-white">{pct}%</span>
                )}
              </div>
            )
          })}
        </div>
      ))}

      {/* Tooltip */}
      {tooltip && tooltip.value > 0 && (
        <div className="mt-3 p-3 rounded-xl bg-[var(--color-surface-container)] border border-[var(--color-surface-variant)] text-sm flex items-center gap-2">
          <span className="w-3 h-3 rounded-full" style={{ background: SLOT_COLORS[tooltip.slot as keyof typeof SLOT_COLORS] }} />
          <span className="font-bold">{tooltip.slot}</span>
          <span className="text-[var(--color-on-surface-variant)]">·</span>
          <span className="text-[var(--color-on-surface-variant)]">{tooltip.day}</span>
          <span className="ml-auto font-bold text-[var(--color-primary)]">{tooltip.value} meals</span>
        </div>
      )}

      {/* Legend */}
      <div className="flex items-center gap-2 mt-3">
        <span className="text-[10px] text-[var(--color-on-surface-variant)]">Less</span>
        {[0.2, 0.4, 0.6, 0.8, 1.0].map(op => (
          <div key={op} className="w-5 h-3 rounded" style={{ background: SLOT_COLORS.Breakfast, opacity: op }} />
        ))}
        <span className="text-[10px] text-[var(--color-on-surface-variant)]">More</span>
      </div>
    </div>
  )
}
