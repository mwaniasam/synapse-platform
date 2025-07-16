import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

export interface LearningContent {
  topic: string
  difficulty: "beginner" | "intermediate" | "advanced"
  content: string
  keyPoints: string[]
  exercises: Array<{
    question: string
    type: "multiple-choice" | "short-answer" | "essay"
    options?: string[]
    answer?: string
  }>
}

export async function generateLearningContent(
  topic: string,
  difficulty: "beginner" | "intermediate" | "advanced" = "beginner",
  cognitiveState?: string,
): Promise<LearningContent> {
  const adaptationPrompt = cognitiveState
    ? `The user is currently in a ${cognitiveState} cognitive state. Adapt the content accordingly.`
    : ""

  const { text } = await generateText({
    model: openai("gpt-4o"),
    prompt: `Create comprehensive learning content about "${topic}" for ${difficulty} level.
    
    ${adaptationPrompt}
    
    Structure the response as JSON with:
    - topic: string
    - difficulty: string
    - content: detailed explanation (500-800 words)
    - keyPoints: array of 5-7 key takeaways
    - exercises: array of 3-5 practice questions with different types
    
    Make the content engaging, clear, and educational. Use examples and analogies where helpful.`,
  })

  try {
    return JSON.parse(text)
  } catch (error) {
    // Fallback if JSON parsing fails
    return {
      topic,
      difficulty,
      content: text,
      keyPoints: [],
      exercises: [],
    }
  }
}

export async function adaptContentToCognitiveState(content: string, cognitiveState: string): Promise<string> {
  const { text } = await generateText({
    model: openai("gpt-4o"),
    prompt: `Adapt this learning content based on the user's cognitive state: ${cognitiveState}

    Original content: ${content}

    Adaptation guidelines:
    - If "focused": Keep content detailed and comprehensive
    - If "distracted": Break into smaller chunks with clear headings
    - If "tired": Simplify language and add more examples
    - If "stressed": Use calming tone and reduce cognitive load
    - If "curious": Add deeper insights and related topics

    Return the adapted content maintaining educational value.`,
  })

  return text
}
