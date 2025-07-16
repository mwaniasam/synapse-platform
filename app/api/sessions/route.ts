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

    const sessions = await prisma.focusSession.findMany({
      where: { userId: session.user.id },
      orderBy: { startTime: "desc" },
      take: 10,
    })

    return NextResponse.json({ sessions })
  } catch (error) {
    console.error("Sessions fetch error:", error)
    return NextResponse.json({ error: "Failed to fetch sessions" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { sessionId, duration, focusScore, completed } = await request.json()

    const updatedSession = await prisma.focusSession.update({
      where: { id: sessionId },
      data: {
        endTime: new Date(),
        duration,
        focusScore,
        completed,
      },
    })

    return NextResponse.json({ session: updatedSession })
  } catch (error) {
    console.error("Session update error:", error)
    return NextResponse.json({ error: "Failed to update session" }, { status: 500 })
  }
}
