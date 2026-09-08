"use client"

import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, ReferenceLine
} from 'recharts'
import { mockCumulativeData } from '@/lib/mockData'

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ value: number }>;
  label?: string;
}

const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-[var(--color-surface-container-lowest)] border border-[var(--color-surface-variant)] rounded-xl p-3 shadow-xl text-sm">
      <p className="font-bold mb-1 text-[var(--color-on-surface)]">{label}</p>
      <p className="text-[var(--color-on-surface-variant)]">
        This slot: <span className="font-bold text-[#f58529]">{payload[1]?.value ?? 0}</span>
      </p>
      <p className="text-[var(--color-on-surface-variant)]">
        Running total: <span className="font-bold text-[#8639b4]">{payload[0]?.value?.toLocaleString()}</span>
      </p>
    </div>
  )
}

export function CumulativeAreaChart() {
  return (
    <div className="bg-[var(--color-surface-container-lowest)] rounded-2xl border border-[var(--color-surface-variant)] shadow-sm p-4">
      <div className="mb-4">
        <h3 className="font-bold text-[var(--color-on-surface)]">Cumulative Meals Over Event</h3>
        <p className="text-xs text-[var(--color-on-surface-variant)] mt-0.5">Running total across all 12 slots (3 days × 4 meals)</p>
      </div>

      <ResponsiveContainer width="100%" height={240}>
        <AreaChart data={mockCumulativeData} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
          <defs>
            <linearGradient id="cumulativeGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor="#8639b4" stopOpacity={0.25} />
              <stop offset="95%" stopColor="#8639b4" stopOpacity={0.02} />
            </linearGradient>
            <linearGradient id="slotGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor="#f58529" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#f58529" stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--color-surface-variant)" vertical={false} />
          <XAxis
            dataKey="label"
            tick={{ fontSize: 9, fill: 'var(--color-on-surface-variant)' }}
            axisLine={false} tickLine={false}
            interval={0}
            angle={-30}
            textAnchor="end"
            height={40}
          />
          <YAxis tick={{ fontSize: 10, fill: 'var(--color-on-surface-variant)' }} axisLine={false} tickLine={false} width={40} />
          <Tooltip content={<CustomTooltip />} />

          {/* Day boundary reference lines */}
          <ReferenceLine x="D2 Breakfast" stroke="var(--color-outline-variant)" strokeDasharray="4 4" label={{ value: 'Day 2', position: 'top', fontSize: 9, fill: 'var(--color-on-surface-variant)' }} />
          <ReferenceLine x="D3 Breakfast" stroke="var(--color-outline-variant)" strokeDasharray="4 4" label={{ value: 'Day 3', position: 'top', fontSize: 9, fill: 'var(--color-on-surface-variant)' }} />

          <Area type="monotone" dataKey="cumulative" stroke="#8639b4" strokeWidth={2.5} fill="url(#cumulativeGrad)" dot={false} activeDot={{ r: 5, fill: '#8639b4' }} />
          <Area type="monotone" dataKey="slot"       stroke="#f58529" strokeWidth={2}   fill="url(#slotGrad)"       dot={false} activeDot={{ r: 4, fill: '#f58529' }} />
        </AreaChart>
      </ResponsiveContainer>

      <div className="flex gap-4 mt-2">
        <div className="flex items-center gap-1.5">
          <span className="w-4 h-0.5 rounded" style={{ background: '#8639b4' }} />
          <span className="text-xs text-[var(--color-on-surface-variant)]">Cumulative</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-4 h-0.5 rounded" style={{ background: '#f58529' }} />
          <span className="text-xs text-[var(--color-on-surface-variant)]">Per slot</span>
        </div>
      </div>
    </div>
  )
}
