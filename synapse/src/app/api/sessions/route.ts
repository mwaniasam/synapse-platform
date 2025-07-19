import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { z } from "zod"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { withRateLimit } from "@/lib/rate-limit"
import { withValidation } from "@/lib/validation-middleware"
import type { ValidatedRequest } from "@/types/next-request"
import { createSessionSchema } from "@/lib/schemas/session"

type CreateSessionRequest = ValidatedRequest<z.infer<typeof createSessionSchema>>;

async function handlePOST(request: CreateSessionRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const learningSession = await prisma.learningSession.create({
      data: {
        userId: session.user.id,
        title: request.data.title,
        description: request.data.description,
        subject: request.data.subject,
        goals: request.data.goals,
        startTime: new Date(),
      },
    })

    return NextResponse.json(learningSession)
  } catch (error) {
    console.error("Error creating session:", error);
    return NextResponse.json(
      { error: "Failed to create session" }, 
      { status: 500 }
    );
  }
}

// Create a type-safe handler with validation
const validatedHandler = withValidation(createSessionSchema, handlePOST);

export async function POST(request: NextRequest) {
  return withRateLimit(request, validatedHandler);
}

async function handleGET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const limit = Number.parseInt(searchParams.get("limit") || "20")
    const offset = Number.parseInt(searchParams.get("offset") || "0")

    const sessions = await prisma.learningSession.findMany({
      where: { userId: session.user.id },
      orderBy: { startTime: "desc" },
      take: limit,
      skip: offset,
      include: {
        cognitiveStates: {
          orderBy: { createdAt: "desc" },
          take: 5,
        },
        knowledgeNodes: {
          orderBy: { lastEncounter: "desc" },
          take: 10,
        },
      },
    })

    return NextResponse.json(sessions)
  } catch (error) {
    console.error("Error fetching sessions:", error);
    return NextResponse.json(
      { error: "Failed to fetch sessions" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  return withRateLimit(request, handleGET);
}
