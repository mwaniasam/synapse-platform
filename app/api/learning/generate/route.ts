import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { generateLearningContent } from "@/lib/ai-engine"
import { prisma } from "@/lib/prisma"

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { topic, difficulty, cognitiveState } = await request.json()

    if (!topic) {
      return NextResponse.json({ error: "Topic is required" }, { status: 400 })
    }

    // Generate AI content
    const content = await generateLearningContent(topic, difficulty || "beginner", cognitiveState)

    // Save learning session
    const session_record = await prisma.focusSession.create({
      data: {
        userId: parseInt(session.user.id),
        topic,
        content: content as any,
        sessionData: {},
        duration: 0, 
        performance: "not_assessed",
      },
    })

    return NextResponse.json({
      sessionId: session_record.id,
      content,
    })
  } catch (error) {
    console.error("Content generation error:", error)
    return NextResponse.json({ error: "Failed to generate content" }, { status: 500 })
  }
}
