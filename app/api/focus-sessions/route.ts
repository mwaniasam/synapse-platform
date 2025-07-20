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
      sessionId,
      type = "pomodoro",
      duration,
      actualTime,
      completed = false,
      interrupted = false,
      notes,
      productivity,
    } = body

    // Validate required fields
    if (!sessionId || !duration) {
      return NextResponse.json({ error: "Missing required fields: sessionId, duration" }, { status: 400 })
    }

    // Create focus session record
    const focusSession = await prisma.focusSession.create({
      data: {
        userId: session.user.id,
        sessionId,
        type,
        duration: Math.max(0, duration),
        actualTime: actualTime ? Math.max(0, actualTime) : null,
        completed,
        interrupted,
        notes: notes?.substring(0, 500), // Limit notes length
        productivity: productivity ? Math.max(0, Math.min(productivity, 100)) : null,
      },
    })

    return NextResponse.json({ success: true, sessionId: focusSession.id })
  } catch (error) {
    console.error("Focus session error:", error)
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
    const type = searchParams.get("type")
    const startDate = searchParams.get("startDate")
    const endDate = searchParams.get("endDate")

    const where: any = {
      userId: session.user.id,
    }

    if (type) {
      where.type = type
    }

    if (startDate && endDate) {
      where.createdAt = {
        gte: new Date(startDate),
        lte: new Date(endDate),
      }
    }

    const focusSessions = await prisma.focusSession.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: limit,
      skip: offset,
    })

    const total = await prisma.focusSession.count({ where })

    // Calculate statistics
    const stats = await prisma.focusSession.aggregate({
      where,
      _avg: {
        duration: true,
        actualTime: true,
        productivity: true,
      },
      _sum: {
        duration: true,
        actualTime: true,
      },
      _count: {
        completed: true,
      },
    })

    const completedCount = await prisma.focusSession.count({
      where: { ...where, completed: true },
    })

    return NextResponse.json({
      focusSessions,
      stats: {
        averageDuration: stats._avg.duration || 0,
        averageActualTime: stats._avg.actualTime || 0,
        averageProductivity: stats._avg.productivity || 0,
        totalDuration: stats._sum.duration || 0,
        totalActualTime: stats._sum.actualTime || 0,
        completedSessions: completedCount,
        totalSessions: total,
        completionRate: total > 0 ? (completedCount / total) * 100 : 0,
      },
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total,
      },
    })
  } catch (error) {
    console.error("Get focus sessions error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
