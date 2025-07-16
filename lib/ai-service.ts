import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

interface CognitiveState {
  focusLevel: string
  engagementLevel: string
  stressLevel: string
  mood: string
}

interface Recommendation {
  id: string
  title: string
  type: "article" | "video" | "quiz" | "exercise"
  description: string
  link: string
}

interface Insight {
  overallInsight: string
  keyTakeaways: string[]
  actionableSteps: string[]
}

interface ComprehensiveAnalysis {
  summary: string
  strengths: string[]
  weaknesses: string[]
  patterns: string[]
  recommendations: string[]
}

interface CognitiveStateInput {
  learningData: any // Data from user's learning sessions
}

interface ContentAdaptationInput {
  content: string
  userProfile: {
    learningStyle: string
    // Add other relevant profile data
  }
  cognitiveState: {
    focusLevel: number
    energyLevel: number
    comprehension: number
    engagement: number
  }
}

interface InsightsInput {
  learningData: any // Comprehensive learning data
}

interface RecommendationsInput {
  userProfile: {
    // User profile details
    [key: string]: any
  }
  learningHistory: any // Detailed learning history
}

interface ComprehensiveAnalysisInput {
  learningData: any // Comprehensive learning data
}

/**
 * Analyzes user activity data to infer cognitive state.
 * @param text User activity data (e.g., session logs, input patterns).
 * @returns Inferred cognitive state.
 */
export async function getCognitiveState(text: string): Promise<CognitiveState> {
  const prompt = `Analyze the following user input/activity data and provide a concise cognitive state assessment.
  Focus on inferring:
  1. Focus Level (e.g., "High", "Moderate", "Low")
  2. Engagement Level (e.g., "High", "Moderate", "Low")
  3. Stress Level (e.g., "Low", "Moderate", "High")
  4. Overall Mood (e.g., "Positive", "Neutral", "Negative")

  Provide the output as a JSON object with these keys: focusLevel, engagementLevel, stressLevel, mood.
  Example: {"focusLevel": "High", "engagementLevel": "Moderate", "stressLevel": "Low", "mood": "Positive"}

  User input/activity: "${text}"`

  const { text: aiResponse } = await generateText({
    model: openai("gpt-4o"),
    prompt: prompt,
  })

  try {
    return JSON.parse(aiResponse) as CognitiveState
  } catch (error) {
    console.error("Failed to parse cognitive state AI response:", error)
    return { focusLevel: "Unknown", engagementLevel: "Unknown", stressLevel: "Unknown", mood: "Unknown" }
  }
}

/**
 * Generates personalized learning recommendations.
 * @param userProfile User's basic profile information.
 * @param learningHistory User's past learning activities and performance.
 * @param cognitiveState User's current cognitive state.
 * @returns An array of personalized recommendations.
 */
export async function getRecommendations(
  userProfile: any,
  learningHistory: any,
  cognitiveState: CognitiveState,
): Promise<Recommendation[]> {
  const prompt = `Based on the following user profile, learning history, and current cognitive state, generate 3 personalized learning recommendations.
  Each recommendation should include a title, type (article, video, quiz, exercise), a brief description, and a placeholder link.
  Prioritize recommendations that address areas of weakness or build upon strengths, considering the user's current focus, engagement, and stress levels.

  User Profile: ${JSON.stringify(userProfile)}
  Learning History: ${JSON.stringify(learningHistory)}
  Cognitive State: ${JSON.stringify(cognitiveState)}

  Provide the output as a JSON array of objects.
  Example:
  [
    {
      "id": "rec1",
      "title": "Deep Dive into Quantum Physics",
      "type": "article",
      "description": "An advanced article for high focus users.",
      "link": "/learn/quantum-physics"
    }
  ]`

  const { text: aiResponse } = await generateText({
    model: openai("gpt-4o"),
    prompt: prompt,
  })

  try {
    return JSON.parse(aiResponse) as Recommendation[]
  } catch (error) {
    console.error("Failed to parse recommendations AI response:", error)
    return []
  }
}

/**
 * Generates comprehensive insights from learning data and cognitive logs.
 * @param learningData User's learning performance data.
 * @param cognitiveLogs User's historical cognitive state logs.
 * @returns Comprehensive insights including summary, strengths, weaknesses, patterns, and actionable steps.
 */
export async function getInsights(learningData: any, cognitiveLogs: any): Promise<Insight> {
  const prompt = `Analyze the following learning data and cognitive state logs to provide comprehensive insights.
  Identify patterns, strengths, weaknesses, and suggest actionable steps for improvement.

  Learning Data (e.g., recent scores, topics, durations):
  ${JSON.stringify(learningData)}

  Cognitive State Logs (e.g., focus, engagement, stress over time):
  ${JSON.stringify(cognitiveLogs)}

  Provide the output as a JSON object with the following structure:
  {
    "overallInsight": "A summary of the user's learning and cognitive patterns.",
    "keyTakeaways": ["Point 1", "Point 2", "Point 3"],
    "actionableSteps": ["Step 1", "Step 2", "Step 3"]
  }`

  const { text: aiResponse } = await generateText({
    model: openai("gpt-4o"),
    prompt: prompt,
  })

  try {
    return JSON.parse(aiResponse) as Insight
  } catch (error) {
    console.error("Failed to parse insights AI response:", error)
    return { overallInsight: "No insights available.", keyTakeaways: [], actionableSteps: [] }
  }
}

/**
 * Performs a comprehensive analysis of user's learning and cognitive data.
 * @param learningData User's learning performance data.
 * @param cognitiveLogs User's historical cognitive state logs.
 * @param userPreferences User's learning preferences.
 * @returns A detailed comprehensive analysis.
 */
export async function getComprehensiveAnalysis(
  learningData: any,
  cognitiveLogs: any,
  userPreferences: any,
): Promise<ComprehensiveAnalysis> {
  const prompt = `Perform a comprehensive analysis of the user's learning performance and cognitive state.
  Identify strengths, weaknesses, patterns, and provide actionable recommendations.

  Learning Data: ${JSON.stringify(learningData)}
  Cognitive Logs: ${JSON.stringify(cognitiveLogs)}
  User Preferences: ${JSON.stringify(userPreferences)}

  Structure your response as a JSON object with the following keys:
  - "summary": "A concise overall summary of the analysis."
  - "strengths": ["Identified strength 1", "Identified strength 2"]
  - "weaknesses": ["Identified weakness 1", "Identified weakness 2"]
  - "patterns": ["Observed pattern 1", "Observed pattern 2"]
  - "recommendations": ["Actionable recommendation 1", "Actionable recommendation 2"]
  `

  const { text: aiResponse } = await generateText({
    model: openai("gpt-4o"),
    prompt: prompt,
  })

  try {
    return JSON.parse(aiResponse) as ComprehensiveAnalysis
  } catch (error) {
    console.error("Failed to parse comprehensive analysis AI response:", error)
    return {
      summary: "No comprehensive analysis available.",
      strengths: [],
      weaknesses: [],
      patterns: [],
      recommendations: [],
    }
  }
}

/**
 * Generates a summary of the user's cognitive state based on learning data.
 * @param input - The learning data to analyze.
 * @returns An object containing cognitive levels and a summary.
 */
export async function getCognitiveStateSummary(input: CognitiveStateInput) {
  const prompt = `Analyze the following learning session data and provide a concise summary of the user's cognitive state, including estimated focus level, energy level, comprehension, and engagement. Provide a percentage for each.
    Learning Data: ${JSON.stringify(input.learningData)}

    Example Output Format:
    Focus: 85%
    Energy: 70%
    Comprehension: 90%
    Engagement: 75%
    Summary: The user demonstrated high focus and comprehension, with moderate energy and engagement.
    `

  const { text } = await generateText({
    model: openai("gpt-4o"),
    prompt: prompt,
    temperature: 0.7,
  })

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

  return {
    focusLevel: cognitiveState.focusLevel || 0,
    energyLevel: cognitiveState.energyLevel || 0,
    comprehension: cognitiveState.comprehension || 0,
    engagement: cognitiveState.engagement || 0,
    summary: summary || "No specific summary provided.",
  }
}

/**
 * Adapts learning content based on user profile and cognitive state.
 * @param input - The content, user profile, and cognitive state for adaptation.
 * @returns The adapted content string.
 */
export async function adaptLearningContent(input: ContentAdaptationInput) {
  const prompt = `Given the following content, user profile, and current cognitive state, adapt the content to be most effective for the user.
    Focus on simplifying complex concepts, adding examples, or breaking it down into smaller chunks if comprehension is low.
    If engagement is low, suggest making it more interactive or relatable.
    If energy is low, suggest shorter, more digestible formats.
    If the user's learning style is '${input.userProfile.learningStyle}', prioritize that style (e.g., visual, auditory, kinesthetic, reading/writing).

    Original Content: ${input.content}
    User Profile: ${JSON.stringify(input.userProfile)}
    Cognitive State: ${JSON.stringify(input.cognitiveState)}

    Provide the adapted content directly.
    `

  const { text: adaptedContent } = await generateText({
    model: openai("gpt-4o"),
    prompt: prompt,
    temperature: 0.8,
  })

  return adaptedContent
}

/**
 * Generates actionable insights for the user.
 * @param input - Comprehensive learning data.
 * @returns An array of string insights.
 */
export async function generateLearningInsights(input: InsightsInput): Promise<string[]> {
  const prompt = `Analyze the following learning data and provide 3-5 concise, actionable insights for the user to improve their learning.
    Focus on patterns, strengths, weaknesses, and suggestions for optimization.

    Learning Data: ${JSON.stringify(input.learningData)}

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
}

/**
 * Generates personalized learning recommendations.
 * @param input - User profile and learning history.
 * @returns An array of recommendation objects.
 */
export async function generateLearningRecommendations(
  input: RecommendationsInput,
): Promise<Array<{ id: string; title: string; type: string; description: string }>> {
  const prompt = `Based on the following user profile and learning history, provide 3 personalized learning recommendations. Each recommendation should include a title, type (course, topic, or resource), and a brief description.
    Prioritize recommendations that address identified weaknesses or build upon strengths.

    User Profile: ${JSON.stringify(input.userProfile)}
    Learning History: ${JSON.stringify(input.learningHistory)}

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
    throw new Error("AI did not return an array of recommendations.")
  }
  return recommendations
}

/**
 * Generates a comprehensive analysis of the user's learning performance.
 * @param input - Comprehensive learning data.
 * @returns A string containing the comprehensive analysis.
 */
export async function generateComprehensiveLearningAnalysis(input: ComprehensiveAnalysisInput): Promise<string> {
  const prompt = `Provide a comprehensive analysis of the user's learning performance based on the following data.
    Include observations on strengths, areas for improvement, and overall learning patterns.
    
    Learning Data: ${JSON.stringify(input.learningData)}

    Provide the analysis as a detailed text response.
    `

  const { text: analysis } = await generateText({
    model: openai("gpt-4o"),
    prompt: prompt,
    temperature: 0.7,
  })

  return analysis
}
