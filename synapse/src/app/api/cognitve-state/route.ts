import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { z } from "zod"

const cognitiveStateSchema = z.object({
  state: z.enum(["focused", "fatigued", "distracted", "receptive"]),
  confidence: z.number().min(0).max(1),
  metrics: z.object({
    typingSpeed: z.number(),
    typingRhythm: z.number(),
    mouseVelocity: z.number(),
    scrollPattern: z.number(),
    focusStability: z.number(),
    taskSwitching: z.number(),
  }),
  sessionId: z.string().optional(),
})

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = cognitiveStateSchema.parse(body)

    const cognitiveState = await prisma.cognitiveState.create({
      data: {
        userId: session.user.id,
        sessionId: validatedData.sessionId,
        state: validatedData.state,
        confidence: validatedData.confidence,
        typingSpeed: validatedData.metrics.typingSpeed,
        mouseMovements: Math.round(validatedData.metrics.mouseVelocity * 1000),
        tabSwitches: validatedData.metrics.taskSwitching,
        scrollBehavior: validatedData.metrics.scrollPattern.toString(),
      },
    })

    return NextResponse.json(cognitiveState)
  } catch (error) {
    console.error("Error saving cognitive state:", error)
    return NextResponse.json({ error: "Failed to save cognitive state" }, { status: 500 })
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
    const limit = Number.parseInt(searchParams.get("limit") || "50")

    const whereClause: any = { userId: session.user.id }
    if (sessionId) {
      whereClause.sessionId = sessionId
    }

    const cognitiveStates = await prisma.cognitiveState.findMany({
      where: whereClause,
      orderBy: { createdAt: "desc" },
      take: limit,
    })

    return NextResponse.json(cognitiveStates)
  } catch (error) {
    console.error("Error fetching cognitive states:", error)
    return NextResponse.json({ error: "Failed to fetch cognitive states" }, { status: 500 })
  }
}
