"use client"

import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  Legend, ResponsiveContainer
} from 'recharts'
import { mockDayOverviewData, SLOT_COLORS } from '@/lib/mockData'

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-[var(--color-surface-container-lowest)] border border-[var(--color-surface-variant)] rounded-2xl p-3 shadow-xl text-sm">
      <p className="font-bold text-[var(--color-on-surface)] mb-2">{label}</p>
      {payload.map((p: any) => (
        <div key={p.name} className="flex items-center gap-2 mb-1">
          <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: p.fill }} />
          <span className="text-[var(--color-on-surface-variant)]">{p.name}:</span>
          <span className="font-bold text-[var(--color-on-surface)]">{p.value}</span>
        </div>
      ))}
    </div>
  )
}

export function DayOverviewChart() {
  return (
    <div className="bg-[var(--color-surface-container-lowest)] rounded-2xl border border-[var(--color-surface-variant)] shadow-sm p-4">
      <div className="mb-4">
        <h3 className="font-bold text-[var(--color-on-surface)]">3-Day Slot Breakdown</h3>
        <p className="text-xs text-[var(--color-on-surface-variant)] mt-0.5">Meals served per slot across all days</p>
      </div>
      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={mockDayOverviewData} barCategoryGap="25%" barGap={3}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--color-surface-variant)" vertical={false} />
          <XAxis dataKey="day" tick={{ fontSize: 12, fill: 'var(--color-on-surface-variant)' }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 11, fill: 'var(--color-on-surface-variant)' }} axisLine={false} tickLine={false} width={36} />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(0,0,0,0.04)' }} />
          <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '12px' }} iconType="circle" iconSize={8} />
          <Bar dataKey="Breakfast" fill={SLOT_COLORS.Breakfast} radius={[4, 4, 0, 0]} />
          <Bar dataKey="Lunch"     fill={SLOT_COLORS.Lunch}     radius={[4, 4, 0, 0]} />
          <Bar dataKey="Snacks"    fill={SLOT_COLORS.Snacks}    radius={[4, 4, 0, 0]} />
          <Bar dataKey="Dinner"    fill={SLOT_COLORS.Dinner}    radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
