import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

interface UserProfile {
  learningStyle: "visual" | "auditory" | "kinesthetic" | "reading-writing" | string
  // Add other relevant user profile details
}

interface CognitiveState {
  focusLevel: number
  energyLevel: number
  comprehension: number
  engagement: number
}

interface UserPreferences {
  learningPace: string // e.g., "slow", "moderate", "fast"
  preferredLanguage: string // e.g., "en", "es"
}

/**
 * Adapts learning content based on user profile and cognitive state using AI.
 * @param content The original learning content (e.g., text, summary of a video).
 * @param userProfile The user's learning preferences and profile.
 * @param cognitiveState The user's current cognitive state (e.g., focus, energy).
 * @returns A promise that resolves to the adapted content string.
 */
export async function adaptContent(
  content: string,
  userProfile: UserProfile,
  cognitiveState: CognitiveState,
): Promise<string> {
  try {
    const prompt = `Given the following learning content, user profile, and current cognitive state, adapt the content to be most effective for the user.
    
    Consider these factors:
    - If comprehension is low (${cognitiveState.comprehension}%), simplify complex concepts, add more examples, or break down information into smaller, digestible chunks.
    - If engagement is low (${cognitiveState.engagement}%), suggest making the content more interactive, relatable, or add real-world applications.
    - If energy is low (${cognitiveState.energyLevel}%), suggest shorter, more concise formats or highlight key takeaways.
    - If the user's learning style is '${userProfile.learningStyle}', prioritize adapting the content to that style (e.g., for 'visual', suggest adding diagrams; for 'auditory', suggest listening exercises; for 'kinesthetic', suggest hands-on activities; for 'reading-writing', suggest summaries or note-taking prompts).

    Original Content:
    "${content}"

    User Profile:
    ${JSON.stringify(userProfile, null, 2)}

    Cognitive State:
    ${JSON.stringify(cognitiveState, null, 2)}

    Provide the adapted content directly, focusing on clarity and effectiveness based on the above.
    `

    const { text: adaptedContent } = await generateText({
      model: openai("gpt-4o"), // Use a powerful model for nuanced content adaptation
      prompt: prompt,
      temperature: 0.8, // Allow for more creative and varied adaptations
    })

    return adaptedContent
  } catch (error) {
    console.error("Error adapting content with AI:", error)
    // Fallback to original content or a generic message in case of AI error
    return `Failed to adapt content. Original content: "${content}"`
  }
}

/**
 * Generates AI insights based on learning data.
 * @param learningData Comprehensive data about the user's learning sessions, quizzes, etc.
 * @returns A promise that resolves to an array of string insights.
 */
export async function generateInsights(learningData: any): Promise<string[]> {
  try {
    const prompt = `Analyze the following learning data and provide 3-5 concise, actionable insights for the user to improve their learning.
    Focus on patterns, strengths, weaknesses, and suggestions for optimization.

    Learning Data:
    ${JSON.stringify(learningData, null, 2)}

    Format your response as a JSON array of strings.
    `

    const { text } = await generateText({
      model: openai("gpt-4o"),
      prompt: prompt,
      temperature: 0.6,
      response_format: { type: "json_object" },
    })

    const insights = JSON.parse(text)
    if (!Array.isArray(insights)) {
      throw new Error("AI did not return an array for insights.")
    }
    return insights
  } catch (error) {
    console.error("Error generating AI insights:", error)
    return ["Failed to generate insights. Please try again later."]
  }
}

/**
 * Generates AI recommendations based on user profile and learning history.
 * @param userProfile The user's profile.
 * @param learningHistory Detailed history of user's learning activities.
 * @returns A promise that resolves to an array of recommendation objects.
 */
export async function generateRecommendations(
  userProfile: UserProfile,
  learningHistory: any,
): Promise<Array<{ id: string; title: string; type: string; description: string }>> {
  try {
    const prompt = `Based on the following user profile and learning history, provide 3 personalized learning recommendations. Each recommendation should include a title, type (course, topic, or resource), and a brief description.
    Prioritize recommendations that address identified weaknesses or build upon strengths.

    User Profile:
    ${JSON.stringify(userProfile, null, 2)}
    Learning History:
    ${JSON.stringify(learningHistory, null, 2)}

    Format your response as a JSON array of objects, with each object having 'id', 'title', 'type', and 'description' fields.
    `

    const { text } = await generateText({
      model: openai("gpt-4o"),
      prompt: prompt,
      temperature: 0.7,
      response_format: { type: "json_object" },
    })

    const recommendations = JSON.parse(text)
    if (!Array.isArray(recommendations)) {
      throw new Error("AI did not return an array for recommendations.")
    }
    return recommendations
  } catch (error) {
    console.error("Error generating AI recommendations:", error)
    return [
      {
        id: "fallback",
        title: "Explore New Topics",
        type: "topic",
        description: "Discover a wide range of subjects to expand your knowledge.",
      },
    ]
  }
}

/**
 * Generates a comprehensive analysis of the user's learning performance.
 * @param learningData Comprehensive data about the user's learning sessions, quizzes, etc.
 * @returns A promise that resolves to a string containing the comprehensive analysis.
 */
export async function generateComprehensiveAnalysis(learningData: any): Promise<string> {
  try {
    const prompt = `Provide a comprehensive analysis of the user's learning performance based on the following data.
    Include observations on strengths, areas for improvement, and overall learning patterns.
    
    Learning Data:
    ${JSON.stringify(learningData, null, 2)}

    Provide the analysis as a detailed text response.
    `

    const { text: analysis } = await generateText({
      model: openai("gpt-4o"),
      prompt: prompt,
      temperature: 0.7,
    })

    return analysis
  } catch (error) {
    console.error("Error generating comprehensive analysis:", error)
    return "Failed to generate comprehensive analysis. Please try again later."
  }
}
