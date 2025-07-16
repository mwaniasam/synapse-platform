import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { CognitiveEngine } from "@/lib/cognitive-engine"

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { interactions } = body

    const cognitiveEngine = new CognitiveEngine()

    // Add interactions to engine
    interactions?.forEach((interaction: any) => {
      cognitiveEngine.addInteraction(interaction)
    })

    // Detect cognitive state
    const cognitiveState = cognitiveEngine.detectCognitiveState()

    return NextResponse.json(cognitiveState)
  } catch (error) {
    console.error("Cognitive state detection error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
