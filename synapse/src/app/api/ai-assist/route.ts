import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { GoogleGenerativeAI } from "@google/generative-ai"
import { env } from "@/lib/env"
import { z } from "zod"

const genAI = new GoogleGenerativeAI(env.GEMINI_API_KEY)

const aiAssistSchema = z.object({
  type: z.enum(["summary", "qa", "recommendation"]),
  query: z.string().min(1),
  context: z.string().optional(),
})

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { type, query, context } = aiAssistSchema.parse(body)

    const model = genAI.getGenerativeModel({ model: "gemini-pro" })

    let prompt = ""
    switch (type) {
      case "summary":
        prompt = `Please provide a concise summary of the following content, focusing on key concepts and main ideas:\n\n${query}`
        break
      case "qa":
        prompt = `Answer the following question in a clear and educational manner:\n\nQuestion: ${query}\n\n${context ? `Context: ${context}` : ""}`
        break
      case "recommendation":
        prompt = `Based on the user's learning context, provide personalized learning recommendations:\n\nContext: ${query}\n\nPlease suggest specific resources, topics to explore, or learning strategies.`
        break
    }

    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()

    // Save interaction to database
    await prisma.aIInteraction.create({
      data: {
        userId: session.user.id,
        type,
        query,
        response: text,
        context,
      },
    })

    return NextResponse.json({
      response: text,
      type,
    })
  } catch (error) {
    console.error("AI assistance error:", error)
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
    const type = searchParams.get("type")
    const limit = Number.parseInt(searchParams.get("limit") || "10")

    const interactions = await prisma.aIInteraction.findMany({
      where: {
        userId: session.user.id,
        ...(type && { type }),
      },
      orderBy: { createdAt: "desc" },
      take: limit,
    })

    return NextResponse.json(interactions)
  } catch (error) {
    console.error("Failed to fetch AI interactions:", error)
    return NextResponse.json({ error: "Failed to fetch interactions" }, { status: 500 })
  }
}
