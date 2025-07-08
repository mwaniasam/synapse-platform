import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    let settings = await prisma.userSettings.findUnique({
      where: {
        userId: session.user.id,
      },
    })

    // Create default settings if they don't exist
    if (!settings) {
      settings = await prisma.userSettings.create({
        data: {
          userId: session.user.id,
        },
      })
    }

    return NextResponse.json({ settings })
  } catch (error) {
    console.error("Error fetching settings:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const {
      pomodoroWorkDuration,
      pomodoroBreakDuration,
      pomodoroLongBreak,
      dailyGoal,
      notifications,
      soundEnabled,
      theme,
    } = body

    const settings = await prisma.userSettings.upsert({
      where: {
        userId: session.user.id,
      },
      update: {
        pomodoroWorkDuration,
        pomodoroBreakDuration,
        pomodoroLongBreak,
        dailyGoal,
        notifications,
        soundEnabled,
        theme,
      },
      create: {
        userId: session.user.id,
        pomodoroWorkDuration,
        pomodoroBreakDuration,
        pomodoroLongBreak,
        dailyGoal,
        notifications,
        soundEnabled,
        theme,
      },
    })

    return NextResponse.json({ settings })
  } catch (error) {
    console.error("Error updating settings:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
