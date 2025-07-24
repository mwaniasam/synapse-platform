import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userSettings = await prisma.userSettings.findUnique({
      where: { userId: session.user.id }
    })

    // Return default settings if none exist
    if (!userSettings) {
      const defaultSettings = {
        workDuration: 25,
        shortBreakDuration: 5,
        longBreakDuration: 15,
        sessionsUntilLongBreak: 4,
        dailyGoal: 4,
        difficultyLevel: "intermediate",
        adaptiveMode: true,
        theme: "system",
        notifications: true,
        soundEnabled: true
      }
      return NextResponse.json(defaultSettings)
    }

    return NextResponse.json(userSettings)
  } catch (error) {
    console.error('Error fetching user settings:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const settings = await request.json()

    const updatedSettings = await prisma.userSettings.upsert({
      where: { userId: session.user.id },
      update: {
        ...settings.preferences,
        notifications: settings.notifications?.email || false,
        updatedAt: new Date(),
      },
      create: {
        userId: session.user.id,
        ...settings.preferences,
        notifications: settings.notifications?.email || false,
      }
    })

    return NextResponse.json(updatedSettings)
  } catch (error) {
    console.error('Error updating user settings:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
