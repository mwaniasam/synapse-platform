import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { generateSessionId } from "@/lib/utils"

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const data = await request.json()
    const { subject, goals, duration } = data

    const learningSession = await prisma.learningSession.create({
      data: {
        userId: session.user.id,
        sessionId: generateSessionId(),
        subject,
        goals: JSON.stringify(goals || []),
        startTime: new Date(),
      },
    })

    return NextResponse.json({
      id: learningSession.id,
      sessionId: learningSession.sessionId,
      subject: learningSession.subject,
      startTime: learningSession.startTime,
    })
  } catch (error) {
    console.error("Error creating learning session:", error)
    return NextResponse.json({ error: "Failed to create learning session" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const data = await request.json()
    const { sessionId, conceptsLearned, avgFocusScore, insights, completed } = data

    const learningSession = await prisma.learningSession.findFirst({
      where: {
        userId: session.user.id,
        sessionId,
      },
    })

    if (!learningSession) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 })
    }

    const endTime = new Date()
    const totalDuration = Math.floor((endTime.getTime() - learningSession.startTime.getTime()) / 60000) // minutes

    const updatedSession = await prisma.learningSession.update({
      where: { id: learningSession.id },
      data: {
        endTime,
        totalDuration,
        conceptsLearned,
        avgFocusScore,
        insights: JSON.stringify(insights || {}),
        completed: completed || false,
      },
    })

    return NextResponse.json({
      id: updatedSession.id,
      sessionId: updatedSession.sessionId,
      totalDuration: updatedSession.totalDuration,
      conceptsLearned: updatedSession.conceptsLearned,
      avgFocusScore: updatedSession.avgFocusScore,
      completed: updatedSession.completed,
    })
  } catch (error) {
    console.error("Error updating learning session:", error)
    return NextResponse.json({ error: "Failed to update learning session" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const limit = Number.parseInt(searchParams.get("limit") || "20")
    const completed = searchParams.get("completed")

    const whereClause: any = {
      userId: session.user.id,
    }

    if (completed !== null) {
      whereClause.completed = completed === "true"
    }

    const learningSessions = await prisma.learningSession.findMany({
      where: whereClause,
      orderBy: { startTime: "desc" },
      take: limit,
    })

    return NextResponse.json(
      learningSessions.map((session) => ({
        ...session,
        goals: session.goals ? JSON.parse(session.goals) : [],
        insights: session.insights ? JSON.parse(session.insights) : {},
      })),
    )
  } catch (error) {
    console.error("Error fetching learning sessions:", error)
    return NextResponse.json({ error: "Failed to fetch learning sessions" }, { status: 500 })
  }
}
