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

    const { searchParams } = new URL(request.url)
    const period = searchParams.get("period") || "week" // day, week, month, year
    const startDate = searchParams.get("startDate")
    const endDate = searchParams.get("endDate")

    // Calculate date range
    let dateRange: { gte: Date; lte: Date }
    const now = new Date()

    if (startDate && endDate) {
      dateRange = {
        gte: new Date(startDate),
        lte: new Date(endDate),
      }
    } else {
      switch (period) {
        case "day":
          dateRange = {
            gte: new Date(now.getFullYear(), now.getMonth(), now.getDate()),
            lte: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1),
          }
          break
        case "week":
          const weekStart = new Date(now)
          weekStart.setDate(now.getDate() - now.getDay())
          weekStart.setHours(0, 0, 0, 0)
          dateRange = {
            gte: weekStart,
            lte: new Date(weekStart.getTime() + 7 * 24 * 60 * 60 * 1000),
          }
          break
        case "month":
          dateRange = {
            gte: new Date(now.getFullYear(), now.getMonth(), 1),
            lte: new Date(now.getFullYear(), now.getMonth() + 1, 1),
          }
          break
        case "year":
          dateRange = {
            gte: new Date(now.getFullYear(), 0, 1),
            lte: new Date(now.getFullYear() + 1, 0, 1),
          }
          break
        default:
          dateRange = {
            gte: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
            lte: now,
          }
      }
    }

    const where = {
      userId: session.user.id,
      createdAt: dateRange,
    }

    // Activity analytics
    const activityStats = await prisma.activity.aggregate({
      where,
      _sum: {
        timeSpent: true,
        mouseMovements: true,
        keystrokes: true,
        scrollEvents: true,
        tabSwitches: true,
      },
      _avg: {
        focusScore: true,
      },
      _count: true,
    })

    // Top domains
    const topDomains = await prisma.activity.groupBy({
      by: ["domain"],
      where,
      _sum: {
        timeSpent: true,
      },
      _count: true,
      orderBy: {
        _sum: {
          timeSpent: "desc",
        },
      },
      take: 10,
    })

    // Focus sessions analytics
    const focusStats = await prisma.focusSession.aggregate({
      where: {
        userId: session.user.id,
        createdAt: dateRange,
      },
      _sum: {
        duration: true,
        actualTime: true,
      },
      _avg: {
        productivity: true,
      },
      _count: true,
    })

    const completedFocusSessions = await prisma.focusSession.count({
      where: {
        userId: session.user.id,
        createdAt: dateRange,
        completed: true,
      },
    })

    // Daily activity breakdown
    const dailyActivity = await prisma.$queryRaw`
      SELECT 
        DATE(created_at) as date,
        SUM(time_spent) as total_time,
        AVG(focus_score) as avg_focus_score,
        COUNT(*) as activity_count
      FROM "Activity"
      WHERE user_id = ${session.user.id}
        AND created_at >= ${dateRange.gte}
        AND created_at <= ${dateRange.lte}
      GROUP BY DATE(created_at)
      ORDER BY date DESC
      LIMIT 30
    `

    // Knowledge nodes (concepts learned)
    const knowledgeStats = await prisma.knowledgeNode.aggregate({
      where: {
        userId: session.user.id,
        lastSeen: dateRange,
      },
      _sum: {
        frequency: true,
      },
      _avg: {
        confidence: true,
      },
      _count: true,
    })

    const topConcepts = await prisma.knowledgeNode.findMany({
      where: {
        userId: session.user.id,
        lastSeen: dateRange,
      },
      orderBy: {
        frequency: "desc",
      },
      take: 20,
      select: {
        concept: true,
        frequency: true,
        confidence: true,
        domain: true,
      },
    })

    return NextResponse.json({
      period,
      dateRange,
      activity: {
        totalTime: activityStats._sum.timeSpent || 0,
        totalSessions: activityStats._count || 0,
        averageFocusScore: activityStats._avg.focusScore || 0,
        totalMouseMovements: activityStats._sum.mouseMovements || 0,
        totalKeystrokes: activityStats._sum.keystrokes || 0,
        totalScrollEvents: activityStats._sum.scrollEvents || 0,
        totalTabSwitches: activityStats._sum.tabSwitches || 0,
        topDomains: topDomains.map((domain) => ({
          domain: domain.domain,
          timeSpent: domain._sum.timeSpent || 0,
          sessionCount: domain._count,
        })),
        dailyBreakdown: dailyActivity,
      },
      focus: {
        totalSessions: focusStats._count || 0,
        completedSessions: completedFocusSessions,
        completionRate: focusStats._count ? (completedFocusSessions / focusStats._count) * 100 : 0,
        totalDuration: focusStats._sum.duration || 0,
        totalActualTime: focusStats._sum.actualTime || 0,
        averageProductivity: focusStats._avg.productivity || 0,
      },
      knowledge: {
        totalConcepts: knowledgeStats._count || 0,
        totalFrequency: knowledgeStats._sum.frequency || 0,
        averageConfidence: knowledgeStats._avg.confidence || 0,
        topConcepts,
      },
    })
  } catch (error) {
    console.error("Analytics error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
