import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

export async function POST(req: NextRequest) {
  try {
    const { userProfile, learningHistory } = await req.json()

    if (!userProfile || !learningHistory) {
      return NextResponse.json({ error: "Missing user profile or learning history" }, { status: 400 })
    }

    const prompt = `Based on the following user profile and learning history, provide 3 personalized learning recommendations. Each recommendation should include a title, type (course, topic, or resource), and a brief description.
    Prioritize recommendations that address identified weaknesses or build upon strengths.

    User Profile: ${JSON.stringify(userProfile)}
    Learning History: ${JSON.stringify(learningHistory)}

    Format your response as a JSON array of objects, like this:
    [
      { "id": "rec1", "title": "Recommendation Title 1", "type": "course", "description": "Description of recommendation 1." },
      { "id": "rec2", "title": "Recommendation Title 2", "type": "topic", "description": "Description of recommendation 2." },
      { "id": "rec3", "title": "Recommendation Title 3", "type": "resource", "description": "Description of recommendation 3." }
    ]
    `

    const { text } = await generateText({
      model: openai("gpt-4o"), // Using gpt-4o for generating recommendations
      prompt: prompt,
      temperature: 0.7,
      // response_format: { type: "json_object" }, // Removed unsupported property
    })

    // The AI SDK's generateText with response_format: 'json_object' should return valid JSON.
    // However, adding a fallback parse for robustness.
    let recommendations
    try {
      recommendations = JSON.parse(text)
    } catch (e) {
      console.error("Failed to parse AI response as JSON:", text, e)
      return NextResponse.json({ error: "AI response was not valid JSON." }, { status: 500 })
    }

    if (!Array.isArray(recommendations)) {
      return NextResponse.json({ error: "AI did not return an array of recommendations." }, { status: 500 })
    }

    return NextResponse.json({ recommendations })
  } catch (error) {
    console.error("Error generating AI recommendations:", error)
    return NextResponse.json({ error: "Failed to generate AI recommendations" }, { status: 500 })
  }
}
