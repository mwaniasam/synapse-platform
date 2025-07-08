import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { calculateStreakDays } from "@/lib/utils"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const days = Number.parseInt(searchParams.get("days") || "7")

    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)
    startDate.setHours(0, 0, 0, 0)

    // Get activities for the specified period
    const activities = await prisma.activity.findMany({
      where: {
        userId: session.user.id,
        createdAt: {
          gte: startDate,
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    // Get focus sessions for the specified period
    const focusSessions = await prisma.focusSession.findMany({
      where: {
        userId: session.user.id,
        createdAt: {
          gte: startDate,
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    // Calculate analytics
    const totalTimeSpent = activities.reduce((sum, activity) => sum + activity.timeSpent, 0)
    const averageFocusScore =
      activities.length > 0 ? activities.reduce((sum, activity) => sum + activity.focusScore, 0) / activities.length : 0

    const completedSessions = focusSessions.filter((session) => session.completed).length
    const totalSessions = focusSessions.length
    const completionRate = totalSessions > 0 ? (completedSessions / totalSessions) * 100 : 0

    // Calculate daily data for charts
    const dailyData = []
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      date.setHours(0, 0, 0, 0)

      const nextDate = new Date(date)
      nextDate.setDate(nextDate.getDate() + 1)

      const dayActivities = activities.filter((activity) => activity.createdAt >= date && activity.createdAt < nextDate)

      const daySessions = focusSessions.filter((session) => session.createdAt >= date && session.createdAt < nextDate)

      const dayTimeSpent = dayActivities.reduce((sum, activity) => sum + activity.timeSpent, 0)
      const dayFocusScore =
        dayActivities.length > 0
          ? dayActivities.reduce((sum, activity) => sum + activity.focusScore, 0) / dayActivities.length
          : 0

      dailyData.push({
        date: date.toISOString().split("T")[0],
        timeSpent: Math.round(dayTimeSpent / (1000 * 60)), // Convert to minutes
        focusScore: Math.round(dayFocusScore),
        sessions: daySessions.length,
        completedSessions: daySessions.filter((s) => s.completed).length,
      })
    }

    // Top domains
    const domainStats = activities.reduce(
      (acc, activity) => {
        if (!acc[activity.domain]) {
          acc[activity.domain] = {
            domain: activity.domain,
            timeSpent: 0,
            visits: 0,
            avgFocusScore: 0,
          }
        }
        acc[activity.domain].timeSpent += activity.timeSpent
        acc[activity.domain].visits += 1
        acc[activity.domain].avgFocusScore += activity.focusScore
        return acc
      },
      {} as Record<string, any>,
    )

    const topDomains = Object.values(domainStats)
      .map((domain: any) => ({
        ...domain,
        avgFocusScore: Math.round(domain.avgFocusScore / domain.visits),
        timeSpent: Math.round(domain.timeSpent / (1000 * 60)), // Convert to minutes
      }))
      .sort((a: any, b: any) => b.timeSpent - a.timeSpent)
      .slice(0, 10)

    // Calculate streak
    const streakDays = calculateStreakDays(focusSessions)

    const analytics = {
      summary: {
        totalTimeSpent: Math.round(totalTimeSpent / (1000 * 60)), // Convert to minutes
        averageFocusScore: Math.round(averageFocusScore),
        totalSessions,
        completedSessions,
        completionRate: Math.round(completionRate),
        streakDays,
      },
      dailyData,
      topDomains,
      activityLevels: {
        high: activities.filter((a) => a.activityLevel === "high").length,
        medium: activities.filter((a) => a.activityLevel === "medium").length,
        low: activities.filter((a) => a.activityLevel === "low").length,
        idle: activities.filter((a) => a.activityLevel === "idle").length,
      },
    }

    return NextResponse.json({ analytics })
  } catch (error) {
    console.error("Error fetching analytics:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
