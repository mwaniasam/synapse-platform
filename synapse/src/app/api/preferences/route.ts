import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { z } from "zod"

const preferencesSchema = z.object({
  enableCognitiveDetection: z.boolean().optional(),
  detectionSensitivity: z.number().min(0).max(1).optional(),
  enableContentAdaptation: z.boolean().optional(),
  adaptationIntensity: z.number().min(0).max(1).optional(),
  enableKnowledgeMapping: z.boolean().optional(),
  theme: z.string().optional(),
  dashboardLayout: z.string().optional(),
})

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const preferences = await prisma.userPreferences.findUnique({
      where: { userId: session.user.id },
    })

    if (!preferences) {
      // Create default preferences if none exist
      const defaultPreferences = await prisma.userPreferences.create({
        data: { userId: session.user.id },
      })
      return NextResponse.json(defaultPreferences)
    }

    return NextResponse.json(preferences)
  } catch (error) {
    console.error("Error fetching user preferences:", error)
    return NextResponse.json({ error: "Failed to fetch preferences" }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = preferencesSchema.parse(body)

    const updatedPreferences = await prisma.userPreferences.upsert({
      where: { userId: session.user.id },
      update: validatedData,
      create: {
        userId: session.user.id,
        ...validatedData,
      },
    })

    return NextResponse.json(updatedPreferences)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid input", details: error.errors }, { status: 400 })
    }
    console.error("Error updating user preferences:", error)
    return NextResponse.json({ error: "Failed to update preferences" }, { status: 500 })
  }
}
