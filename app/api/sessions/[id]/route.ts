import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { endTime, duration, focusScore, comprehensionRate, retentionScore } = body

    const updatedSession = await prisma.learningSession.update({
      where: {
        id: params.id,
        userId: session.user.id,
      },
      data: {
        endTime: endTime ? new Date(endTime) : undefined,
        duration,
        focusScore,
        comprehensionRate,
        retentionScore,
      },
    })

    return NextResponse.json(updatedSession)
  } catch (error) {
    console.error("Session update error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
