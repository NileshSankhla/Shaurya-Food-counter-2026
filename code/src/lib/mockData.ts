// =====================================================
// MOCK DATA — Shaurya Sports Fest 2026
// Full 3-day × 4-slot food distribution data
// Matches real Prisma schema shapes exactly
// =====================================================

import { SlotName, DayName, MealEntry, GuestDetail } from '@/types'

export const SLOT_COLORS: Record<SlotName, string> = {
  Breakfast: '#f58529',
  Lunch:     '#964900',
  Snacks:    '#8639b4',
  Dinner:    '#b5005f',
}

// KPI Summary
export const mockKpis = {
  totalGuests:      480,
  totalMealsServed: 1340,
  todayMeals:       312,
  activeSlot:       'Dinner',
  activeSlotServed: 87,
  activeSlotTotal:  480,
}

// 3-Day × 4-Slot grid — meals served per cell
export const mockHeatmapData: Record<DayName, Record<SlotName, number>> = {
  'Day 1 (Sep 12)': { Breakfast: 412, Lunch: 460, Snacks: 388, Dinner: 431 },
  'Day 2 (Sep 13)': { Breakfast: 398, Lunch: 475, Snacks: 402, Dinner: 456 },
  'Day 3 (Sep 14)': { Breakfast: 87,  Lunch: 0,   Snacks: 0,   Dinner: 0   }, // Day 3 in progress
}

// Grouped bar chart data (one entry per day)
export const mockDayOverviewData = [
  { day: 'Day 1', Breakfast: 412, Lunch: 460, Snacks: 388, Dinner: 431 },
  { day: 'Day 2', Breakfast: 398, Lunch: 475, Snacks: 402, Dinner: 456 },
  { day: 'Day 3', Breakfast: 87,  Lunch: 0,   Snacks: 0,   Dinner: 0   },
]

// Area chart — cumulative meals over all 12 slots
export const mockCumulativeData = [
  { label: 'D1 Breakfast', cumulative: 412,  slot: 412  },
  { label: 'D1 Lunch',     cumulative: 872,  slot: 460  },
  { label: 'D1 Snacks',    cumulative: 1260, slot: 388  },
  { label: 'D1 Dinner',    cumulative: 1691, slot: 431  },
  { label: 'D2 Breakfast', cumulative: 2089, slot: 398  },
  { label: 'D2 Lunch',     cumulative: 2564, slot: 475  },
  { label: 'D2 Snacks',    cumulative: 2966, slot: 402  },
  { label: 'D2 Dinner',    cumulative: 3422, slot: 456  },
  { label: 'D3 Breakfast', cumulative: 3509, slot: 87   },
  { label: 'D3 Lunch',     cumulative: 3509, slot: 0    },
  { label: 'D3 Snacks',    cumulative: 3509, slot: 0    },
  { label: 'D3 Dinner',    cumulative: 3509, slot: 0    },
]

// College distribution
export const mockCollegeData = [
  { college: 'IIT Jodhpur',      count: 120 },
  { college: 'MNIT Jaipur',      count: 85  },
  { college: 'Bits Pilani',      count: 75  },
  { college: 'NIT Hamirpur',     count: 62  },
  { college: 'IIT Bombay',       count: 54  },
  { college: 'NIT Surat',        count: 48  },
  { college: 'SVNIT',            count: 36  },
]

export const COLLEGE_COLORS = [
  '#f58529', '#964900', '#8639b4', '#b5005f',
  '#d081ff', '#d92778', '#5d2b00',
]

// Live feed
export const mockLiveFeed = [
  { id: 1,  name: 'Arjun Mehta',     college: 'IIT Jodhpur',  slot: 'Dinner',    time: '9:12 PM' },
  { id: 2,  name: 'Priya Sharma',    college: 'MNIT Jaipur',  slot: 'Dinner',    time: '9:11 PM' },
  { id: 3,  name: 'Rahul Verma',     college: 'Bits Pilani',  slot: 'Dinner',    time: '9:10 PM' },
  { id: 4,  name: 'Sneha Patel',     college: 'NIT Hamirpur', slot: 'Dinner',    time: '9:09 PM' },
  { id: 5,  name: 'Vikram Singh',    college: 'IIT Bombay',   slot: 'Dinner',    time: '9:08 PM' },
  { id: 6,  name: 'Ananya Joshi',    college: 'NIT Surat',    slot: 'Dinner',    time: '9:07 PM' },
  { id: 7,  name: 'Ravi Kumar',      college: 'SVNIT',        slot: 'Dinner',    time: '9:06 PM' },
  { id: 8,  name: 'Kavya Nair',      college: 'IIT Jodhpur',  slot: 'Dinner',    time: '9:05 PM' },
  { id: 9,  name: 'Aditya Rao',      college: 'MNIT Jaipur',  slot: 'Dinner',    time: '9:04 PM' },
  { id: 10, name: 'Meera Reddy',     college: 'Bits Pilani',  slot: 'Dinner',    time: '9:03 PM' },
]

// =====================================================
// GUEST DIRECTORY — 500 Students with meal history
// =====================================================

const COLLEGES = [
  'IIT Jodhpur', 'MNIT Jaipur', 'Bits Pilani', 'NIT Hamirpur',
  'IIT Bombay', 'NIT Surat', 'SVNIT', 'IIT Delhi', 'NIT Warangal',
  'VIT Vellore', 'DTU Delhi', 'NSUT Delhi',
]

const FIRST_NAMES = [
  'Arjun','Priya','Rahul','Sneha','Vikram','Ananya','Ravi','Kavya','Aditya','Meera',
  'Rohan','Ishaan','Pooja','Kunal','Divya','Siddharth','Nisha','Amit','Shreya','Karan',
  'Tanvi','Varun','Swati','Harsh','Riya','Mohit','Anjali','Deepak','Kritika','Saurabh',
  'Nidhi','Abhinav','Simran','Gaurav','Pallavi','Nikhil','Tanya','Rajesh','Sunita','Piyush',
]

const LAST_NAMES = [
  'Mehta','Sharma','Verma','Patel','Singh','Joshi','Kumar','Nair','Rao','Reddy',
  'Gupta','Mishra','Chauhan','Aggarwal','Kapoor','Shah','Trivedi','Iyer','Menon','Pillai',
]

const SLOT_TITLES: SlotName[] = ['Breakfast', 'Lunch', 'Snacks', 'Dinner']
const DAY_LABELS = ['Day 1 (Sep 12)', 'Day 2 (Sep 13)', 'Day 3 (Sep 14)'] as const

function seededRandom(seed: number) {
  const x = Math.sin(seed) * 10000
  return x - Math.floor(x)
}

function generateGuestMeals(id: number): MealEntry[] {
  const meals: MealEntry[] = []
  // Day 1 and 2 complete for most, Day 3 partial
  for (let dayNum = 1; dayNum <= 3; dayNum++) {
    const dayLabel = DAY_LABELS[dayNum - 1]
    const slotsForDay = dayNum === 3 ? 1 : 4  // Day 3 only breakfast so far
    for (let si = 0; si < slotsForDay; si++) {
      // ~85% attendance per slot
      if (seededRandom(id * 100 + dayNum * 10 + si) > 0.15) {
        const baseHour = [7, 12, 16, 19][si]
        const mins = Math.floor(seededRandom(id * 37 + si * 13 + dayNum) * 59)
        const date = new Date(`2026-09-${11 + dayNum}T${String(baseHour).padStart(2,'0')}:${String(mins).padStart(2,'0')}:00`)
        meals.push({
          slotId: `slot-d${dayNum}-${si}`,
          slotTitle: SLOT_TITLES[si],
          day: dayLabel,
          dayNumber: dayNum as 1 | 2 | 3,
          scannedAt: date.toISOString(),
        })
      }
    }
  }
  return meals
}

export function generateGuestList(count = 120): GuestDetail[] {
  return Array.from({ length: count }, (_, i) => {
    const id = i + 1
    const fnIdx = Math.floor(seededRandom(id * 7) * FIRST_NAMES.length)
    const lnIdx = Math.floor(seededRandom(id * 13) * LAST_NAMES.length)
    const colIdx = Math.floor(seededRandom(id * 3) * COLLEGES.length)
    const name = `${FIRST_NAMES[fnIdx]} ${LAST_NAMES[lnIdx]}`
    const college = COLLEGES[colIdx]
    const mobile = `${['98','97','96','95','94','93'][Math.floor(seededRandom(id*5)*6)]}${String(Math.floor(seededRandom(id*17)*100000000)).padStart(8,'0')}`
    return {
      id: String(id),
      uid: `SHR-${String(id).padStart(3,'0')}`,
      name,
      college,
      mobile,
      email: `${name.toLowerCase().replace(' ','.')}${id}@${college.toLowerCase().replace(/\s+/g,'')}.ac.in`,
      meals: generateGuestMeals(id),
    }
  })
}

export const MOCK_GUESTS = generateGuestList(120)

export const SLOT_BADGE_COLORS: Record<SlotName, { bg: string; text: string }> = {
  Breakfast: { bg: 'bg-orange-100', text: 'text-orange-700' },
  Lunch:     { bg: 'bg-amber-100',  text: 'text-amber-700'  },
  Snacks:    { bg: 'bg-purple-100', text: 'text-purple-700' },
  Dinner:    { bg: 'bg-pink-100',   text: 'text-pink-700'   },
}
