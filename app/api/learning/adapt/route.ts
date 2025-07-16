import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { adaptContentToCognitiveState } from "@/lib/ai-engine"

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { content, cognitiveState } = await request.json()

    if (!content || !cognitiveState) {
      return NextResponse.json({ error: "Content and cognitive state are required" }, { status: 400 })
    }

    const adaptedContent = await adaptContentToCognitiveState(content, cognitiveState)

    return NextResponse.json({ adaptedContent })
  } catch (error) {
    console.error("Content adaptation error:", error)
    return NextResponse.json({ error: "Failed to adapt content" }, { status: 500 })
  }
}
