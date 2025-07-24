import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

export async function POST(request: NextRequest) {
  try {
    const { topic, subject, difficulty } = await request.json()

    if (!topic || !subject || !difficulty) {
      return NextResponse.json(
        { error: 'Missing required fields: topic, subject, difficulty' },
        { status: 400 }
      )
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

    const prompt = `
      Create educational content about "${topic}" in the subject area of "${subject}" at a "${difficulty}" level.
      
      Please provide a JSON response with the following structure:
      {
        "title": "An engaging title for the content",
        "description": "A brief 2-3 sentence description",
        "content": "Detailed educational content (at least 300 words)",
        "keyPoints": ["Key point 1", "Key point 2", "Key point 3", "Key point 4", "Key point 5"],
        "exercises": ["Exercise 1", "Exercise 2", "Exercise 3"],
        "tags": ["tag1", "tag2", "tag3", "tag4", "tag5"]
      }
      
      Guidelines:
      - For "beginner" level: Use simple language, basic concepts, lots of examples
      - For "intermediate" level: Include moderate complexity, some technical terms with explanations
      - For "advanced" level: Use technical language, complex concepts, assume prior knowledge
      
      Make the content educational, accurate, and engaging. Ensure exercises are practical and relevant.
    `

    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()

    // Try to extract JSON from the response
    let content
    try {
      // Remove any markdown formatting that might wrap the JSON
      const cleanText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
      content = JSON.parse(cleanText)
    } catch (parseError) {
      // If JSON parsing fails, create a structured response from the raw text
      content = {
        title: `${subject}: ${topic}`,
        description: `Educational content about ${topic} in ${subject} at ${difficulty} level.`,
        content: text,
        keyPoints: [
          `Understanding ${topic}`,
          `Key concepts in ${subject}`,
          `${difficulty.charAt(0).toUpperCase() + difficulty.slice(1)} level insights`,
          `Practical applications`,
          `Further learning opportunities`
        ],
        exercises: [
          `Practice exercise on ${topic}`,
          `Apply concepts from ${subject}`,
          `Create your own example`
        ],
        tags: [topic, subject, difficulty, 'ai-generated', 'educational']
      }
    }

    return NextResponse.json(content)
  } catch (error) {
    console.error('AI content generation error:', error)
    
    // Return a fallback response in case of AI API failure
    const { topic, subject, difficulty } = await request.json().catch(() => ({
      topic: 'General Topic',
      subject: 'General',
      difficulty: 'intermediate'
    }))

    return NextResponse.json({
      title: `${subject}: ${topic}`,
      description: `Educational content about ${topic} in ${subject} at ${difficulty} level.`,
      content: `This is educational content about ${topic}. While our AI assistant is temporarily unavailable, here's some basic information to get you started. ${topic} is an important concept in ${subject} that students at the ${difficulty} level should understand. We recommend exploring additional resources to deepen your understanding.`,
      keyPoints: [
        `Introduction to ${topic}`,
        `Core concepts`,
        `Practical applications`,
        `Common challenges`,
        `Next steps`
      ],
      exercises: [
        `Research more about ${topic}`,
        `Find examples in real life`,
        `Discuss with peers`
      ],
      tags: [topic, subject, difficulty, 'educational']
    })
  }
}
