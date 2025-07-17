import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { GeminiClient } from "@/lib/gemini-client"
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

    const geminiClient = new GeminiClient()
    let response: any

    switch (validatedData.type) {
      case "question":
        response = await geminiClient.answerQuestion(
          validatedData.data.question || "",
          validatedData.data.context || "",
          validatedData.data.userKnowledge || [],
        )
        break

      case "summary":
        response = await geminiClient.summarizeContent(
          validatedData.data.content || "",
          validatedData.data.cognitiveState || "focused",
          "moderate",
        )
        break

      case "recommendation":
        // Get user's recent cognitive states and knowledge
        const recentStates = await prisma.cognitiveState.findMany({
          where: { userId: session.user.id },
          orderBy: { createdAt: "desc" },
          take: 10,
        })

        const knowledgeNodes = await prisma.knowledgeNode.findMany({
          where: { userId: session.user.id },
          orderBy: { lastEncounter: "desc" },
          take: 20,
        })

        response = await geminiClient.generatePersonalizedRecommendations({
          cognitiveState: recentStates[0]?.state || "focused",
          learningHistory: knowledgeNodes.map((n: { concept: string }) => n.concept),
          currentTopic: validatedData.data.context || "General Learning",
          knowledgeGaps: validatedData.data.learningGoals || [],
        })
        break

      case "path":
        response = await geminiClient.generateLearningPath(
          validatedData.data.userKnowledge || [],
          validatedData.data.learningGoals || [],
          validatedData.data.timeAvailable || 10,
          validatedData.data.cognitiveState || "focused",
        )
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
