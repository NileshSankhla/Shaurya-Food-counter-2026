export const SLOTS = ['Breakfast', 'Lunch', 'Snacks', 'Dinner'] as const
export type SlotName = typeof SLOTS[number]

export const DAYS = ['Day 1 (Sep 12)', 'Day 2 (Sep 13)', 'Day 3 (Sep 14)'] as const
export type DayName = typeof DAYS[number]

export interface MealEntry {
  slotId: string
  slotTitle: SlotName
  day: string
  dayNumber: 1 | 2 | 3
  scannedAt: string
}

export interface GuestDetail {
  id: string
  uid: string
  name: string
  college: string
  mobile: string
  email: string
  meals: MealEntry[]
}
