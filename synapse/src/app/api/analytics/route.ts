import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userId = session.user.id

    // Fetch total learning sessions
    const totalSessions = await prisma.learningSession.count({
      where: { userId },
    })

    // Fetch total learning duration
    const totalDurationResult = await prisma.learningSession.aggregate({
      where: { userId, duration: { not: null } },
      _sum: { duration: true },
    })
    const totalDuration = totalDurationResult._sum.duration || 0

    // Fetch average focus score
    const avgFocusScoreResult = await prisma.learningSession.aggregate({
      where: { userId, focusScore: { not: null } },
      _avg: { focusScore: true },
    })
    const averageFocusScore = avgFocusScoreResult._avg.focusScore || 0

    // Fetch cognitive state distribution
    const cognitiveStateDistribution = await prisma.cognitiveState.groupBy({
      by: ["state"],
      where: { userId },
      _count: { state: true },
    })

    // Fetch AI interaction types distribution
    const aiInteractionDistribution = await prisma.aIInteraction.groupBy({
      by: ["type"],
      where: { userId },
      _count: { type: true },
    })

    // Fetch recent focus scores for charting (e.g., last 30 sessions)
    const recentSessions = await prisma.learningSession.findMany({
      where: { userId, focusScore: { not: null } },
      orderBy: { startTime: "asc" },
      take: 30,
      select: {
        id: true,
        title: true,
        startTime: true,
        focusScore: true,
      },
    })

    // Fetch recent cognitive states for charting (e.g., last 50 states)
    const recentCognitiveStates = await prisma.cognitiveState.findMany({
      where: { userId },
      orderBy: { createdAt: "asc" },
      take: 50,
      select: {
        state: true,
        confidence: true,
        createdAt: true,
      },
    })

    return NextResponse.json({
      totalSessions,
      totalDuration,
      averageFocusScore,
      cognitiveStateDistribution,
      aiInteractionDistribution,
      recentSessions,
      recentCognitiveStates,
    })
  } catch (error) {
    console.error("Error fetching analytics data:", error)
    return NextResponse.json({ error: "Failed to fetch analytics data" }, { status: 500 })
  }
}
