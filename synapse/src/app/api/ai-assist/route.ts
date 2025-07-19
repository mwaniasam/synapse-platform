import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { GrokClient } from "@/lib/grok-client"
import { z } from "zod"

const aiRequestSchema = z.object({
  type: z.enum(["question", "summary", "recommendation", "path"]),
  data: z.object({
    question: z.string().optional(),
    content: z.string().optional(),
    context: z.string().optional(),
    cognitiveState: z.string().optional(),
    userKnowledge: z.array(z.string()).optional(),
    learningGoals: z.array(z.string()).optional(),
    timeAvailable: z.number().optional(),
    isTeachingMode: z.boolean().optional(), // Added for teacher persona
    complexity: z.enum(["brief", "moderate", "detailed"]).optional(),
    learningHistory: z.array(z.string()).optional(),
    currentTopic: z.string().optional(),
    knowledgeGaps: z.array(z.string()).optional(),
    currentKnowledge: z.array(z.string()).optional(),
  }),
})

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = aiRequestSchema.parse(body)

    const grokClient = new GrokClient()
    let response: any

    switch (validatedData.type) {
      case "question":
        const context = `Context: ${validatedData.data.context || ""}\n\n` +
          `User's Knowledge: ${validatedData.data.userKnowledge?.join(", ") || ""}\n` +
          `Teaching Mode: ${validatedData.data.isTeachingMode ? 'Enabled' : 'Disabled'}`
          
        const answer = await grokClient.answerQuestion(
          validatedData.data.question || "",
          context
        )
        
        response = {
          answer: answer,
          sources: [], // Grok doesn't provide sources by default
          type: 'answer'
        }
        break

      case "summary":
        const summary = await grokClient.summarizeContent(
          validatedData.data.content || "",
          {
            maxLength: validatedData.data.complexity === "brief" ? 100 :
                      validatedData.data.complexity === "detailed" ? 400 : 200
          }
        )
        response = { summary }
        break

      case "recommendation":
        const recommendations = await grokClient.generatePersonalizedRecommendations({
          userPreferences: validatedData.data.cognitiveState || "",
          learningGoals: validatedData.data.knowledgeGaps || [],
          pastInteractions: validatedData.data.learningHistory
        })
        response = { recommendations }
        break

      case "path":
        const path = await grokClient.generateLearningPath({
          topic: validatedData.data.currentTopic || "General Learning",
          level: "intermediate", // Default level, could be made configurable
          durationWeeks: Math.ceil((validatedData.data.timeAvailable || 10) / 5) // Convert hours to weeks (rough estimate)
        })
        response = { path }
        break

      default:
        return NextResponse.json({ error: "Invalid request type" }, { status: 400 })
    }

    // Log the AI interaction
    await prisma.aIInteraction.create({
      data: {
        userId: session.user.id,
        type: validatedData.type,
        query: JSON.stringify(validatedData.data),
        response: JSON.stringify(response),
        context: validatedData.data.context,
      },
    })

    return NextResponse.json(response)
  } catch (error) {
    console.error("Error processing AI request:", error)
    return NextResponse.json({ error: "Failed to process AI request" }, { status: 500 })
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
    const type = searchParams.get("type")

    const whereClause: any = { userId: session.user.id }
    if (type) {
      whereClause.type = type
    }

    const interactions = await prisma.aIInteraction.findMany({
      where: whereClause,
      orderBy: { createdAt: "desc" },
      take: limit,
    })

    return NextResponse.json(interactions)
  } catch (error) {
    console.error("Error fetching AI interactions:", error)
    return NextResponse.json({ error: "Failed to fetch AI interactions" }, { status: 500 })
  }
}
