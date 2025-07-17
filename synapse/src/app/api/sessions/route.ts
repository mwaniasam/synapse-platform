import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { z } from "zod"

const createSessionSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  subject: z.string().optional(),
  goals: z.array(z.string()).default([]),
})

const updateSessionSchema = z.object({
  endTime: z.string().datetime().optional(),
  duration: z.number().optional(),
  focusScore: z.number().optional(),
  conceptsLearned: z.number().optional(),
  adaptationsUsed: z.number().optional(),
})

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = createSessionSchema.parse(body)

    const learningSession = await prisma.learningSession.create({
      data: {
        userId: session.user.id,
        title: validatedData.title,
        description: validatedData.description,
        subject: validatedData.subject,
        goals: validatedData.goals,
        startTime: new Date(),
      },
    })

    return NextResponse.json(learningSession)
  } catch (error) {
    console.error("Failed to create session:", error)
    return NextResponse.json({ error: "Failed to create session" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const limit = Number.parseInt(searchParams.get("limit") || "10")

    const sessions = await prisma.learningSession.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
      take: limit,
      include: {
        cognitiveStates: {
          take: 1,
          orderBy: { createdAt: "desc" },
        },
        knowledgeNodes: {
          take: 5,
        },
      },
    })

    return NextResponse.json(sessions)
  } catch (error) {
    console.error("Failed to fetch sessions:", error)
    return NextResponse.json({ error: "Failed to fetch sessions" }, { status: 500 })
  }
}
