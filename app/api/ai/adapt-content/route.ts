import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

export async function POST(req: NextRequest) {
  try {
    const { content, userProfile, cognitiveState } = await req.json()

    if (!content || !userProfile || !cognitiveState) {
      return NextResponse.json({ error: "Missing required data" }, { status: 400 })
    }

    const prompt = `Given the following content, user profile, and current cognitive state, adapt the content to be most effective for the user.
    Focus on simplifying complex concepts, adding examples, or breaking it down into smaller chunks if comprehension is low.
    If engagement is low, suggest making it more interactive or relatable.
    If energy is low, suggest shorter, more digestible formats.
    If the user's learning style is '${userProfile.learningStyle}', prioritize that style (e.g., visual, auditory, kinesthetic, reading/writing).

    Original Content: ${content}
    User Profile: ${JSON.stringify(userProfile)}
    Cognitive State: ${JSON.stringify(cognitiveState)}

    Provide the adapted content directly.
    `

    const { text: adaptedContent } = await generateText({
      model: openai("gpt-4o"), // Using gpt-4o for content adaptation
      prompt: prompt,
      temperature: 0.8, // Higher temperature for more creative adaptation
    })

    return NextResponse.json({ adaptedContent })
  } catch (error) {
    console.error("Error adapting content:", error)
    return NextResponse.json({ error: "Failed to adapt content" }, { status: 500 })
  }
}
