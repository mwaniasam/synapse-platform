import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { z } from "zod"

const updateSessionSchema = z.object({
  endTime: z.string().datetime().optional(),
  duration: z.number().optional(),
  focusScore: z.number().min(0).max(1).optional(),
  conceptsLearned: z.number().optional(),
  adaptationsUsed: z.number().optional(),
})

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const learningSession = await prisma.learningSession.findFirst({
      where: {
        id: params.id,
        userId: session.user.id,
      },
      include: {
        cognitiveStates: {
          orderBy: { createdAt: "asc" },
        },
        knowledgeNodes: {
          orderBy: { lastEncounter: "desc" },
        },
      },
    })

    if (!learningSession) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 })
    }

    return NextResponse.json(learningSession)
  } catch (error) {
    console.error("Error fetching session:", error)
    return NextResponse.json({ error: "Failed to fetch session" }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = updateSessionSchema.parse(body)

    const updatedSession = await prisma.learningSession.updateMany({
      where: {
        id: params.id,
        userId: session.user.id,
      },
      data: {
        ...validatedData,
        endTime: validatedData.endTime ? new Date(validatedData.endTime) : undefined,
      },
    })

    if (updatedSession.count === 0) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 })
    }

    const learningSession = await prisma.learningSession.findFirst({
      where: {
        id: params.id,
        userId: session.user.id,
      },
    })

    return NextResponse.json(learningSession)
  } catch (error) {
    console.error("Error updating session:", error)
    return NextResponse.json({ error: "Failed to update session" }, { status: 500 })
  }
}
