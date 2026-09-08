"use client"

import { useState } from 'react'
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Sector
} from 'recharts'
import { mockCollegeData, COLLEGE_COLORS } from '@/lib/mockData'

const renderActiveShape = (props: any) => {
  const {
    cx, cy, innerRadius, outerRadius, startAngle, endAngle,
    fill, payload, value
  } = props
  return (
    <g>
      <text x={cx} y={cy - 8} textAnchor="middle" fill="var(--color-on-surface)" className="text-sm font-bold" style={{ fontSize: 13, fontWeight: 700 }}>
        {payload.college}
      </text>
      <text x={cx} y={cy + 12} textAnchor="middle" fill="var(--color-on-surface-variant)" style={{ fontSize: 20, fontWeight: 800, fill: fill }}>
        {value}
      </text>
      <text x={cx} y={cy + 30} textAnchor="middle" fill="var(--color-on-surface-variant)" style={{ fontSize: 11 }}>
        guests
      </text>
      <Sector cx={cx} cy={cy} innerRadius={innerRadius} outerRadius={outerRadius + 8} startAngle={startAngle} endAngle={endAngle} fill={fill} />
      <Sector cx={cx} cy={cy} innerRadius={innerRadius - 4} outerRadius={innerRadius - 2} startAngle={startAngle} endAngle={endAngle} fill={fill} />
    </g>
  )
}

export function CollegeDonut() {
  const [activeIndex, setActiveIndex] = useState(0)
  const total = mockCollegeData.reduce((s, c) => s + c.count, 0)

  return (
    <div className="bg-[var(--color-surface-container-lowest)] rounded-2xl border border-[var(--color-surface-variant)] shadow-sm p-4">
      <div className="mb-2">
        <h3 className="font-bold text-[var(--color-on-surface)]">College Distribution</h3>
        <p className="text-xs text-[var(--color-on-surface-variant)] mt-0.5">{mockCollegeData.length} colleges · {total} total guests</p>
      </div>

      <ResponsiveContainer width="100%" height={220}>
        <PieChart>
          <Pie
            data={mockCollegeData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={90}
            dataKey="count"
            nameKey="college"
            activeIndex={activeIndex}
            activeShape={renderActiveShape}
            onMouseEnter={(_, index) => setActiveIndex(index)}
          >
            {mockCollegeData.map((_, index) => (
              <Cell key={index} fill={COLLEGE_COLORS[index % COLLEGE_COLORS.length]} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>

      {/* Legend */}
      <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 mt-2">
        {mockCollegeData.map((item, i) => (
          <div
            key={item.college}
            className="flex items-center gap-1.5 cursor-pointer"
            onMouseEnter={() => setActiveIndex(i)}
          >
            <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: COLLEGE_COLORS[i % COLLEGE_COLORS.length] }} />
            <span className="text-xs text-[var(--color-on-surface-variant)] truncate">{item.college}</span>
            <span className="text-xs font-bold text-[var(--color-on-surface)] ml-auto">{item.count}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
