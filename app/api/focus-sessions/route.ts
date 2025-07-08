import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const limit = Number.parseInt(searchParams.get("limit") || "20")
    const offset = Number.parseInt(searchParams.get("offset") || "0")

    const focusSessions = await prisma.focusSession.findMany({
      where: {
        userId: session.user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: limit,
      skip: offset,
    })

    return NextResponse.json({ focusSessions })
  } catch (error) {
    console.error("Error fetching focus sessions:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const {
      sessionId,
      type = "pomodoro",
      duration,
      actualTime,
      completed = false,
      interrupted = false,
      notes,
      productivity,
    } = body

    // Validate required fields
    if (!sessionId || !duration) {
      return NextResponse.json({ error: "Missing required fields: sessionId and duration" }, { status: 400 })
    }

    const focusSession = await prisma.focusSession.create({
      data: {
        userId: session.user.id,
        sessionId,
        type,
        duration,
        actualTime,
        completed,
        interrupted,
        notes,
        productivity,
      },
    })

    return NextResponse.json({ focusSession }, { status: 201 })
  } catch (error) {
    console.error("Error creating focus session:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { sessionId, actualTime, completed, interrupted, notes, productivity } = body

    if (!sessionId) {
      return NextResponse.json({ error: "Missing sessionId" }, { status: 400 })
    }

    const focusSession = await prisma.focusSession.update({
      where: {
        sessionId,
        userId: session.user.id,
      },
      data: {
        actualTime,
        completed,
        interrupted,
        notes,
        productivity,
        updatedAt: new Date(),
      },
    })

    return NextResponse.json({ focusSession })
  } catch (error) {
    console.error("Error updating focus session:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
