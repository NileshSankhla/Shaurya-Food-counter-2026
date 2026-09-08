"use client"

import { CheckCircle } from 'lucide-react'
import { mockLiveFeed } from '@/lib/mockData'

const SLOT_COLORS: Record<string, string> = {
  Breakfast: 'text-orange-600 bg-orange-100',
  Lunch:     'text-amber-700 bg-amber-100',
  Snacks:    'text-purple-700 bg-purple-100',
  Dinner:    'text-pink-700 bg-pink-100',
}

export function LiveFeed() {
  return (
    <div className="bg-[var(--color-surface-container-lowest)] rounded-2xl border border-[var(--color-surface-variant)] shadow-sm overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--color-surface-variant)]">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <h3 className="font-bold text-sm text-[var(--color-on-surface)]">Live Activity Feed</h3>
        </div>
        <span className="text-xs text-[var(--color-on-surface-variant)]">Last 10 scans</span>
      </div>

      <div className="divide-y divide-[var(--color-surface-variant)]">
        {mockLiveFeed.map((entry) => (
          <div key={entry.id} className="flex items-center gap-3 px-4 py-3">
            <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
              <CheckCircle size={16} className="text-green-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-[var(--color-on-surface)] truncate">{entry.name}</p>
              <p className="text-xs text-[var(--color-on-surface-variant)] truncate">{entry.college}</p>
            </div>
            <div className="flex flex-col items-end gap-1 flex-shrink-0">
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${SLOT_COLORS[entry.slot] || 'text-gray-600 bg-gray-100'}`}>
                {entry.slot}
              </span>
              <span className="text-[10px] font-mono text-[var(--color-on-surface-variant)]">{entry.time}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
