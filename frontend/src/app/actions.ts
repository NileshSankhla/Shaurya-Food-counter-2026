"use server"

import { cookies } from 'next/headers'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'

export async function loginAction(email: string, password: string) {
  if (email === 'volunteer@campuseats.com' && password === 'password123') {
    const cookieStore = await cookies()
    cookieStore.set('auth_token', 'volunteer-session', { httpOnly: true, secure: process.env.NODE_ENV === 'production' })
    return { success: true, name: 'Food Counter Volunteer' }
  }
  return { success: false, error: 'Invalid credentials' }
}

export async function logoutAction() {
  const cookieStore = await cookies()
  cookieStore.delete('auth_token')
  redirect('/login')
}

export async function checkAuthAction() {
  const cookieStore = await cookies()
  return cookieStore.has('auth_token')
}

// Internal helper for server actions
async function requireAuth() {
  const cookieStore = await cookies()
  if (!cookieStore.has('auth_token')) {
    return false
  }
  return true
}

export async function getDashboardStatsAction() {
  const isAuth = await requireAuth()
  if (!isAuth) return { error: 'Unauthorized' }

  const totalGuests = await prisma.guest.count()
  const totalMealsServed = await prisma.foodEntry.count()

  const collegeBreakdownRaw = await prisma.guest.groupBy({
    by: ['college'],
    _count: { id: true },
    orderBy: { _count: { id: 'desc' } }
  })

  const now = new Date()
  const activeSlot = await prisma.foodSlot.findFirst({
    where: { startTime: { lte: now }, endTime: { gte: now } }
  })
  
  let activeSlotStats = null
  if (activeSlot) {
    const servedInActiveSlot = await prisma.foodEntry.count({
      where: { slotId: activeSlot.id }
    })
    activeSlotStats = {
      title: activeSlot.title,
      served: servedInActiveSlot,
      remaining: totalGuests - servedInActiveSlot
    }
  }

  const recentScans = await prisma.foodEntry.findMany({
    take: 10,
    orderBy: { scannedAt: 'desc' },
    include: { guest: { select: { name: true, college: true } }, slot: { select: { title: true } } }
  })

  return {
    totalGuests,
    totalMealsServed,
    collegeBreakdown: collegeBreakdownRaw.map(c => ({
      college: c.college || 'Unknown',
      count: c._count.id
    })),
    activeSlotStats,
    recentScans
  }
}

export async function verifyScanAction(studentId: string) {
  const isAuth = await requireAuth()
  if (!isAuth) return { status: 'failed', reason: 'Unauthorized. Please login again.' }

  const card = await prisma.qrCard.findUnique({
    where: { uid: studentId },
    include: { guest: true }
  })

  if (!card) return { status: 'failed', reason: 'Invalid QR Pass (Not Found)' }
  if (!card.isAssigned || !card.guest) return { status: 'failed', reason: 'QR Pass not assigned' }

  const now = new Date()
  const activeSlot = await prisma.foodSlot.findFirst({
    where: { startTime: { lte: now }, endTime: { gte: now } }
  })

  if (!activeSlot) return { status: 'failed', reason: 'No food counter is open right now' }

  try {
    await prisma.foodEntry.create({
      data: { guestId: card.guest.id, slotId: activeSlot.id }
    })
    return { 
      status: 'success', 
      message: 'FOOD ISSUED',
      guestName: card.guest.name,
      college: card.guest.college,
      slotTitle: activeSlot.title
    }
  } catch (dbError: any) {
    if (dbError.code === 'P2002') return { status: 'failed', reason: `Already scanned for ${activeSlot.title}!` }
    return { status: 'failed', reason: 'Database Error' }
  }
}

export async function getHistoryAction() {
  const isAuth = await requireAuth()
  if (!isAuth) return { error: 'Unauthorized' }

  const history = await prisma.foodEntry.findMany({
    orderBy: { scannedAt: 'desc' },
    take: 100,
    include: { guest: { select: { name: true, college: true } }, slot: { select: { title: true } } }
  })
  
  return history.map(entry => ({
    id: entry.id,
    status: 'success',
    mealType: entry.slot.title,
    createdAt: entry.scannedAt,
    studentId: entry.guest.name,
    reason: entry.guest.college
  }))
}
