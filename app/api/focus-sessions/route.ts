import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { prisma } from "@/lib/db"
import { authOptions } from "@/lib/auth" // Assuming authOptions are exported from lib/auth

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)

  if (!session || !session.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }

  try {
    const { duration, topic, performance } = await req.json()

    if (!duration || !topic || !performance) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 })
    }

    const newSession = await prisma.focusSession.create({
      data: {
        userId: session.user.id,
        duration,
        topic,
        performance,
      },
    })

    return NextResponse.json(newSession, { status: 201 })
  } catch (error) {
    console.error("Error creating focus session:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)

  if (!session || !session.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }

  try {
    const sessions = await prisma.focusSession.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
      take: 10, // Limit to recent sessions
    })

    return NextResponse.json(sessions)
  } catch (error) {
    console.error("Error fetching focus sessions:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
