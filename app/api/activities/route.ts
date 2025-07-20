import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"


export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions) as { user?: { id?: string } } | null

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
      activityLevel = "medium",
      focusScore = 50,
      sessionId,
    } = body

    // Validate required fields
    if (!url || !title || !domain || !timeSpent) {
      return NextResponse.json({ error: "Missing required fields: url, title, domain, timeSpent" }, { status: 400 })
    }

    // Create activity record
    const activity = await prisma.activity.create({
      data: {
        userId: session.user.id,
        url: url.substring(0, 500), // Limit URL length
        title: title.substring(0, 200), // Limit title length
        domain: domain.substring(0, 100), // Limit domain length
        timeSpent: Math.max(0, Math.min(timeSpent, 86400)), // Max 24 hours
        mouseMovements: Math.max(0, mouseMovements),
        keystrokes: Math.max(0, keystrokes),
        scrollEvents: Math.max(0, scrollEvents),
        tabSwitches: Math.max(0, tabSwitches),
        activityLevel,
        focusScore: Math.max(0, Math.min(focusScore, 100)),
        sessionId,
      },
    })

    return NextResponse.json({ success: true, activityId: activity.id })
  } catch (error) {
    console.error("Activity tracking error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions) as { user?: { id?: string } } | null

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const limit = Math.min(Number.parseInt(searchParams.get("limit") || "50"), 100)
    const offset = Math.max(Number.parseInt(searchParams.get("offset") || "0"), 0)
    const domain = searchParams.get("domain")
    const startDate = searchParams.get("startDate")
    const endDate = searchParams.get("endDate")

    const where: any = {
      userId: session.user.id,
    }

    if (domain) {
      where.domain = domain
    }

    if (startDate && endDate) {
      where.createdAt = {
        gte: new Date(startDate),
        lte: new Date(endDate),
      }
    }

    const activities = await prisma.activity.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: limit,
      skip: offset,
      select: {
        id: true,
        url: true,
        title: true,
        domain: true,
        timeSpent: true,
        mouseMovements: true,
        keystrokes: true,
        scrollEvents: true,
        tabSwitches: true,
        activityLevel: true,
        focusScore: true,
        createdAt: true,
      },
    })

    const total = await prisma.activity.count({ where })

    return NextResponse.json({
      activities,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total,
      },
    })
  } catch (error) {
    console.error("Get activities error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
