import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { calculateActivityLevel, calculateFocusScore } from "@/lib/utils"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const limit = Number.parseInt(searchParams.get("limit") || "50")
    const offset = Number.parseInt(searchParams.get("offset") || "0")

    const activities = await prisma.activity.findMany({
      where: {
        userId: session.user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: limit,
      skip: offset,
    })

    return NextResponse.json({ activities })
  } catch (error) {
    console.error("Error fetching activities:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const {
      url,
      title,
      domain,
      timeSpent,
      mouseMovements = 0,
      keystrokes = 0,
      scrollEvents = 0,
      tabSwitches = 0,
      sessionId,
    } = body

    // Validate required fields
    if (!url || !title || !domain || timeSpent === undefined) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Calculate activity level and focus score
    const activityLevel = calculateActivityLevel(mouseMovements, keystrokes, scrollEvents, timeSpent)

    const focusScore = calculateFocusScore(activityLevel, timeSpent, tabSwitches)

    const activity = await prisma.activity.create({
      data: {
        userId: session.user.id,
        url,
        title,
        domain,
        timeSpent,
        mouseMovements,
        keystrokes,
        scrollEvents,
        tabSwitches,
        activityLevel,
        focusScore,
        sessionId,
      },
    })

    return NextResponse.json({ activity }, { status: 201 })
  } catch (error) {
    console.error("Error creating activity:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
