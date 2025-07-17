import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { z } from "zod"

const cognitiveStateSchema = z.object({
  typingSpeed: z.number().optional(),
  mouseMovements: z.number().optional(),
  tabSwitches: z.number().optional(),
  scrollBehavior: z.string().optional(),
  sessionId: z.string().optional(),
})

// Simple cognitive state classification algorithm
function classifyCognitiveState(data: {
  typingSpeed?: number
  mouseMovements?: number
  tabSwitches?: number
  scrollBehavior?: string
}) {
  let state: "focused" | "fatigued" | "distracted" | "receptive" = "focused"
  let confidence = 0.5

  // Simple heuristics (in a real implementation, this would be ML-based)
  if (data.tabSwitches && data.tabSwitches > 5) {
    state = "distracted"
    confidence = 0.8
  } else if (data.typingSpeed && data.typingSpeed < 20) {
    state = "fatigued"
    confidence = 0.7
  } else if (data.typingSpeed && data.typingSpeed > 60) {
    state = "focused"
    confidence = 0.9
  } else {
    state = "receptive"
    confidence = 0.6
  }

  return { state, confidence }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = cognitiveStateSchema.parse(body)

    const { state, confidence } = classifyCognitiveState(validatedData)

    // Save to database
    const cognitiveState = await prisma.cognitiveState.create({
      data: {
        userId: session.user.id,
        sessionId: validatedData.sessionId,
        state,
        confidence,
        typingSpeed: validatedData.typingSpeed,
        mouseMovements: validatedData.mouseMovements,
        tabSwitches: validatedData.tabSwitches,
        scrollBehavior: validatedData.scrollBehavior,
      },
    })

    return NextResponse.json({
      state,
      confidence,
      timestamp: cognitiveState.createdAt,
    })
  } catch (error) {
    console.error("Cognitive state detection error:", error)
    return NextResponse.json({ error: "Failed to process cognitive state" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const sessionId = searchParams.get("sessionId")
    const limit = Number.parseInt(searchParams.get("limit") || "10")

    const cognitiveStates = await prisma.cognitiveState.findMany({
      where: {
        userId: session.user.id,
        ...(sessionId && { sessionId }),
      },
      orderBy: { createdAt: "desc" },
      take: limit,
    })

    return NextResponse.json(cognitiveStates)
  } catch (error) {
    console.error("Failed to fetch cognitive states:", error)
    return NextResponse.json({ error: "Failed to fetch cognitive states" }, { status: 500 })
  }
}
