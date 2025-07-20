import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions) as { user?: { id?: string } } | null

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const settings = await prisma.userSettings.findUnique({
      where: {
        userId: session.user.id,
      },
    })

    if (!settings) {
      // Create default settings if they don't exist
      const defaultSettings = await prisma.userSettings.create({
        data: {
          userId: session.user.id,
        },
      })
      return NextResponse.json(defaultSettings)
    }

    return NextResponse.json(settings)
  } catch (error) {
    console.error("Get settings error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions) as { user?: { id?: string } } | null

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
      cognitiveDetectionEnabled,
      adaptiveContentEnabled,
      knowledgeMappingEnabled,
      adaptationIntensity,
      highlightKeywords,
      simplifyComplexContent,
      enhanceVisualCues,
    } = body

    // Validate numeric values
    const validatedData: any = {}

    if (pomodoroWorkDuration !== undefined) {
      validatedData.pomodoroWorkDuration = Math.max(1, Math.min(pomodoroWorkDuration, 120))
    }
    if (pomodoroBreakDuration !== undefined) {
      validatedData.pomodoroBreakDuration = Math.max(1, Math.min(pomodoroBreakDuration, 30))
    }
    if (pomodoroLongBreak !== undefined) {
      validatedData.pomodoroLongBreak = Math.max(1, Math.min(pomodoroLongBreak, 60))
    }
    if (dailyGoal !== undefined) {
      validatedData.dailyGoal = Math.max(1, Math.min(dailyGoal, 20))
    }

    // Boolean values
    if (notifications !== undefined) validatedData.notifications = Boolean(notifications)
    if (soundEnabled !== undefined) validatedData.soundEnabled = Boolean(soundEnabled)
    if (cognitiveDetectionEnabled !== undefined)
      validatedData.cognitiveDetectionEnabled = Boolean(cognitiveDetectionEnabled)
    if (adaptiveContentEnabled !== undefined) validatedData.adaptiveContentEnabled = Boolean(adaptiveContentEnabled)
    if (knowledgeMappingEnabled !== undefined) validatedData.knowledgeMappingEnabled = Boolean(knowledgeMappingEnabled)
    if (highlightKeywords !== undefined) validatedData.highlightKeywords = Boolean(highlightKeywords)
    if (simplifyComplexContent !== undefined) validatedData.simplifyComplexContent = Boolean(simplifyComplexContent)
    if (enhanceVisualCues !== undefined) validatedData.enhanceVisualCues = Boolean(enhanceVisualCues)

    // String values with validation
    if (theme !== undefined && ["light", "dark", "system"].includes(theme)) {
      validatedData.theme = theme
    }
    if (adaptationIntensity !== undefined && ["low", "medium", "high"].includes(adaptationIntensity)) {
      validatedData.adaptationIntensity = adaptationIntensity
    }

    const settings = await prisma.userSettings.upsert({
      where: {
        userId: session.user.id,
      },
      update: validatedData,
      create: {
        userId: session.user.id,
        ...validatedData,
      },
    })

    return NextResponse.json(settings)
  } catch (error) {
    console.error("Update settings error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
