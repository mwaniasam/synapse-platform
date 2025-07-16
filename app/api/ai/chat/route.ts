import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

export async function POST(request: NextRequest) {
  try {
    const { message, context } = await request.json()

    const systemPrompt = `You are an AI learning assistant for Synapse, a cognitive learning acceleration platform. 
    Your role is to help users optimize their learning experience by:
    
    1. Providing personalized learning guidance based on cognitive patterns
    2. Suggesting effective learning techniques and strategies
    3. Recommending resources and study materials
    4. Helping users understand complex concepts
    5. Encouraging healthy learning habits and breaks
    
    Keep responses concise, helpful, and encouraging. Focus on practical advice that can improve learning outcomes.
    Context: ${context || "general_learning"}`

    const { text } = await generateText({
      model: openai("gpt-4o-mini"),
      system: systemPrompt,
      prompt: message,
      maxTokens: 500,
    })

    return NextResponse.json({ response: text })
  } catch (error) {
    console.error("AI chat error:", error)
    return NextResponse.json({ error: "Failed to generate AI response" }, { status: 500 })
  }
}
