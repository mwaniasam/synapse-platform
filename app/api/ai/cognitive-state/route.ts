import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

export async function POST(req: NextRequest) {
  try {
    const { learningData } = await req.json()

    if (!learningData) {
      return NextResponse.json({ error: "Missing learning data" }, { status: 400 })
    }

    // Simulate AI processing based on learningData
    // In a real application, this would involve more complex logic
    // and potentially a more sophisticated prompt or model.

    const prompt = `Analyze the following learning session data and provide a concise summary of the user's cognitive state, including estimated focus level, energy level, comprehension, and engagement. Provide a percentage for each.
    Learning Data: ${JSON.stringify(learningData)}

    Example Output Format:
    Focus: 85%
    Energy: 70%
    Comprehension: 90%
    Engagement: 75%
    Summary: The user demonstrated high focus and comprehension, with moderate energy and engagement.
    `

    const { text } = await generateText({
      model: openai("gpt-4o"), // Using gpt-4o for more nuanced analysis
      prompt: prompt,
      temperature: 0.7,
    })

    // Parse the AI's response to extract structured data
    const lines = text.split("\n").filter((line) => line.trim() !== "")
    const cognitiveState: { [key: string]: number | string } = {}
    let summary = ""

    lines.forEach((line) => {
      if (line.startsWith("Focus:"))
        cognitiveState.focusLevel = Number.parseInt(line.split(":")[1].trim().replace("%", ""))
      else if (line.startsWith("Energy:"))
        cognitiveState.energyLevel = Number.parseInt(line.split(":")[1].trim().replace("%", ""))
      else if (line.startsWith("Comprehension:"))
        cognitiveState.comprehension = Number.parseInt(line.split(":")[1].trim().replace("%", ""))
      else if (line.startsWith("Engagement:"))
        cognitiveState.engagement = Number.parseInt(line.split(":")[1].trim().replace("%", ""))
      else if (line.startsWith("Summary:")) summary = line.split("Summary:")[1].trim()
    })

    return NextResponse.json({
      focusLevel: cognitiveState.focusLevel || 0,
      energyLevel: cognitiveState.energyLevel || 0,
      comprehension: cognitiveState.comprehension || 0,
      engagement: cognitiveState.engagement || 0,
      summary: summary || "No specific summary provided.",
    })
  } catch (error) {
    console.error("Error generating cognitive state:", error)
    return NextResponse.json({ error: "Failed to generate cognitive state" }, { status: 500 })
  }
}
