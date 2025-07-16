import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { interactions } = await request.json()

    // Simple cognitive state detection based on interaction patterns
    const recentInteractions = interactions.slice(-10) // Last 10 interactions

    let cognitiveState = "neutral"
    let confidence = 0.5

    if (recentInteractions.length === 0) {
      cognitiveState = "idle"
      confidence = 0.8
    } else {
      const avgTimeBetween = calculateAverageTimeBetween(recentInteractions)
      const scrollCount = recentInteractions.filter((i: any) => i.type === "scroll").length
      const clickCount = recentInteractions.filter((i: any) => i.type === "click").length

      if (avgTimeBetween > 5000 && scrollCount < 2) {
        cognitiveState = "focused"
        confidence = 0.9
      } else if (scrollCount > 5 && avgTimeBetween < 1000) {
        cognitiveState = "distracted"
        confidence = 0.8
      } else if (clickCount > 8 && avgTimeBetween < 2000) {
        cognitiveState = "stressed"
        confidence = 0.7
      }
    }

    return NextResponse.json({
      cognitiveState,
      confidence,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Cognitive detection error:", error)
    return NextResponse.json({ error: "Failed to detect cognitive state" }, { status: 500 })
  }
}

function calculateAverageTimeBetween(interactions: Array<{ timestamp: string }>): number {
  if (interactions.length < 2) return 0

  const times = interactions.map((i) => new Date(i.timestamp).getTime()).sort()
  const differences = []

  for (let i = 1; i < times.length; i++) {
    differences.push(times[i] - times[i - 1])
  }

  return differences.reduce((sum, diff) => sum + diff, 0) / differences.length
}
