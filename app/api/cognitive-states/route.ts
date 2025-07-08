import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { detectCognitiveState } from "@/lib/utils"

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const data = await request.json()
    const { mouseMovements, keystrokes, scrollEvents, tabSwitches, timeSpent, sessionId, activityId } = data

    // Detect cognitive state
    const { state, confidence } = detectCognitiveState({
      mouseMovements,
      keystrokes,
      scrollEvents,
      tabSwitches,
      timeSpent,
    })

    // Save cognitive state to database
    const cognitiveState = await prisma.cognitiveState.create({
      data: {
        userId: session.user.id,
        state,
        confidence,
        duration: timeSpent,
        sessionId,
        activityId,
        triggers: JSON.stringify({
          mouseMovements,
          keystrokes,
          scrollEvents,
          tabSwitches,
        }),
      },
    })

    return NextResponse.json({
      id: cognitiveState.id,
      state,
      confidence,
      timestamp: cognitiveState.timestamp,
    })
  } catch (error) {
    console.error("Error saving cognitive state:", error)
    return NextResponse.json({ error: "Failed to save cognitive state" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const sessionId = searchParams.get("sessionId")
    const limit = Number.parseInt(searchParams.get("limit") || "50")

    const whereClause: any = {
      userId: session.user.id,
    }

    if (sessionId) {
      whereClause.sessionId = sessionId
    }

    const cognitiveStates = await prisma.cognitiveState.findMany({
      where: whereClause,
      orderBy: { timestamp: "desc" },
      take: limit,
    })

    return NextResponse.json(cognitiveStates)
  } catch (error) {
    console.error("Error fetching cognitive states:", error)
    return NextResponse.json({ error: "Failed to fetch cognitive states" }, { status: 500 })
  }
}
