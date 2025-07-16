import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

export async function POST(req: NextRequest) {
  try {
    const { learningData } = await req.json()

    if (!learningData) {
      return NextResponse.json({ error: "Missing learning data" }, { status: 400 })
    }

    const prompt = `Analyze the following learning data and provide 3-5 concise, actionable insights for the user to improve their learning.
    Focus on patterns, strengths, weaknesses, and suggestions for optimization.

    Learning Data: ${JSON.stringify(learningData)}

    Format your response as a JSON array of strings, like this:
    [
      "Insight 1: You tend to perform better on quizzes after reviewing interactive content.",
      "Insight 2: Your comprehension scores are lower in topics related to advanced algorithms; consider dedicating more time there."
    ]
    `

    const { text } = await generateText({
      model: openai("gpt-4o"), // Using gpt-4o for generating insights
      prompt: prompt,
      temperature: 0.6,
      // response_format: { type: "json_object" }, // Removed unsupported property
    })

    // The AI SDK's generateText with response_format: 'json_object' should return valid JSON.
    // However, adding a fallback parse for robustness.
    let insights
    try {
      insights = JSON.parse(text)
    } catch (e) {
      console.error("Failed to parse AI response as JSON:", text, e)
      return NextResponse.json({ error: "AI response was not valid JSON." }, { status: 500 })
    }

    if (!Array.isArray(insights)) {
      return NextResponse.json({ error: "AI did not return an array of insights." }, { status: 500 })
    }

    return NextResponse.json({ insights })
  } catch (error) {
    console.error("Error generating AI insights:", error)
    return NextResponse.json({ error: "Failed to generate AI insights" }, { status: 500 })
  }
}
