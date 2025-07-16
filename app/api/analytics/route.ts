import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { AnalyticsEngine } from "@/lib/analytics"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const period = searchParams.get("period") || "daily"

    const analyticsEngine = new AnalyticsEngine()

    let data
    switch (period) {
      case "weekly":
        data = await analyticsEngine.getWeeklyTrends(session.user.id)
        break
      case "monthly":
        data = await analyticsEngine.getMonthlyInsights(session.user.id)
        break
      default:
        data = await analyticsEngine.generateDailyAnalytics(session.user.id)
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("Analytics fetch error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
