import { GoogleGenerativeAI } from "@google/generative-ai"
import { env } from "@/lib/env"

export class GeminiClient {
  private genAI: GoogleGenerativeAI
  private model: any

  constructor() {
    this.genAI = new GoogleGenerativeAI(env.GEMINI_API_KEY)
    this.model = this.genAI.getGenerativeModel({ model: "gemini-pro" })
  }

  async generatePersonalizedRecommendations(userProfile: {
    cognitiveState: string
    learningHistory: string[]
    currentTopic: string
    knowledgeGaps: string[]
  }): Promise<{
    recommendations: string[]
    reasoning: string
    adaptedContent?: string
  }> {
    const prompt = `
    As an AI learning assistant, provide personalized learning recommendations for a user with the following profile:

    Current Cognitive State: ${userProfile.cognitiveState}
    Learning History: ${userProfile.learningHistory.join(", ")}
    Current Topic: ${userProfile.currentTopic}
    Knowledge Gaps: ${userProfile.knowledgeGaps.join(", ")}

    Please provide:
    1. 3-5 specific learning recommendations tailored to their cognitive state
    2. Reasoning for each recommendation
    3. Suggested learning resources or activities
    4. How to adapt the current content for their cognitive state

    Format your response as JSON with the following structure:
    {
      "recommendations": ["recommendation1", "recommendation2", ...],
      "reasoning": "explanation of the recommendations",
      "adaptedContent": "suggestions for content adaptation"
    }
    `

    try {
      const result = await this.model.generateContent(prompt)
      const response = await result.response
      const text = response.text()

      // Try to parse as JSON, fallback to structured text
      try {
        return JSON.parse(text)
      } catch {
        return {
          recommendations: [text],
          reasoning: "AI-generated recommendations based on your current learning state",
          adaptedContent: "Content adapted for your cognitive state",
        }
      }
    } catch (error) {
      console.error("Error generating recommendations:", error)
      return {
        recommendations: [
          "Take a short break to refresh your mind",
          "Review previous concepts before learning new ones",
        ],
        reasoning: "Default recommendations due to AI service unavailability",
        adaptedContent: "Standard content presentation",
      }
    }
  }

  async summarizeContent(
    content: string,
    cognitiveState: string,
    complexity: "simple" | "moderate" | "detailed" = "moderate",
  ): Promise<{
    summary: string
    keyPoints: string[]
    questions: string[]
  }> {
    const complexityInstructions = {
      simple: "Use simple language, short sentences, and basic concepts",
      moderate: "Use clear explanations with moderate technical detail",
      detailed: "Provide comprehensive explanations with technical depth",
    }

    const prompt = `
    Summarize the following content for a user in a ${cognitiveState} cognitive state.
    Use ${complexity} complexity: ${complexityInstructions[complexity]}

    Content: ${content}

    Provide:
    1. A concise summary adapted for their cognitive state
    2. 3-5 key points they should remember
    3. 2-3 questions to test understanding

    Format as JSON:
    {
      "summary": "summary text",
      "keyPoints": ["point1", "point2", ...],
      "questions": ["question1", "question2", ...]
    }
    `

    try {
      const result = await this.model.generateContent(prompt)
      const response = await result.response
      const text = response.text()

      try {
        return JSON.parse(text)
      } catch {
        return {
          summary: text,
          keyPoints: ["Key concepts from the content"],
          questions: ["What are the main ideas?", "How does this relate to previous learning?"],
        }
      }
    } catch (error) {
      console.error("Error summarizing content:", error)
      return {
        summary: "Content summary unavailable",
        keyPoints: ["Review the original content"],
        questions: ["What are the main concepts?"],
      }
    }
  }

  async answerQuestion(
    question: string,
    context: string,
    userKnowledge: string[],
  ): Promise<{
    answer: string
    confidence: number
    relatedConcepts: string[]
    followUpQuestions: string[]
  }> {
    const prompt = `
    Answer the following question based on the provided context and user's knowledge level:

    Question: ${question}
    Context: ${context}
    User's Knowledge: ${userKnowledge.join(", ")}

    Provide:
    1. A clear, accurate answer
    2. Confidence level (0-1)
    3. Related concepts they should explore
    4. Follow-up questions to deepen understanding

    Format as JSON:
    {
      "answer": "detailed answer",
      "confidence": 0.95,
      "relatedConcepts": ["concept1", "concept2", ...],
      "followUpQuestions": ["question1", "question2", ...]
    }
    `

    try {
      const result = await this.model.generateContent(prompt)
      const response = await result.response
      const text = response.text()

      try {
        return JSON.parse(text)
      } catch {
        return {
          answer: text,
          confidence: 0.8,
          relatedConcepts: ["Related topics"],
          followUpQuestions: ["What would you like to know more about?"],
        }
      }
    } catch (error) {
      console.error("Error answering question:", error)
      return {
        answer: "I'm unable to answer that question right now. Please try again later.",
        confidence: 0.1,
        relatedConcepts: [],
        followUpQuestions: [],
      }
    }
  }

  async generateLearningPath(
    currentKnowledge: string[],
    learningGoals: string[],
    timeAvailable: number, // in hours
    cognitiveState: string,
  ): Promise<{
    path: Array<{
      topic: string
      duration: number
      difficulty: string
      prerequisites: string[]
      resources: string[]
    }>
    totalDuration: number
    reasoning: string
  }> {
    const prompt = `
    Create a personalized learning path for a user with:

    Current Knowledge: ${currentKnowledge.join(", ")}
    Learning Goals: ${learningGoals.join(", ")}
    Available Time: ${timeAvailable} hours
    Current Cognitive State: ${cognitiveState}

    Create a structured learning path with topics ordered by difficulty and prerequisites.
    Consider their cognitive state for pacing and complexity.

    Format as JSON:
    {
      "path": [
        {
          "topic": "topic name",
          "duration": 2,
          "difficulty": "beginner|intermediate|advanced",
          "prerequisites": ["prereq1", "prereq2"],
          "resources": ["resource1", "resource2"]
        }
      ],
      "totalDuration": 10,
      "reasoning": "explanation of the learning path design"
    }
    `

    try {
      const result = await this.model.generateContent(prompt)
      const response = await result.response
      const text = response.text()

      try {
        return JSON.parse(text)
      } catch {
        return {
          path: [
            {
              topic: "Foundation Concepts",
              duration: Math.min(timeAvailable / 2, 4),
              difficulty: "beginner",
              prerequisites: [],
              resources: ["Online tutorials", "Documentation"],
            },
          ],
          totalDuration: timeAvailable,
          reasoning: "Basic learning path due to AI service limitations",
        }
      }
    } catch (error) {
      console.error("Error generating learning path:", error)
      return {
        path: [],
        totalDuration: 0,
        reasoning: "Unable to generate learning path at this time",
      }
    }
  }
}
