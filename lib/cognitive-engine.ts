import { Matrix } from "ml-matrix"
import nlp from "compromise"

export interface CognitiveState {
  state: "focused" | "receptive" | "distracted" | "fatigued"
  confidence: number
  factors: string[]
  timestamp: number
}

export interface InteractionData {
  type: string
  timestamp: number
  duration?: number
  element?: string
  coordinates?: { x: number; y: number }
  metadata?: any
}

export class CognitiveEngine {
  private interactionHistory: InteractionData[] = []
  private cognitiveModel: Matrix | null = null

  constructor() {
    this.initializeModel()
  }

  private initializeModel() {
    // Initialize a simple cognitive state prediction model
    // In production, this would be a trained ML model
    this.cognitiveModel = new Matrix([
      [0.8, 0.1, 0.05, 0.05], // focused
      [0.2, 0.6, 0.15, 0.05], // receptive
      [0.1, 0.2, 0.6, 0.1], // distracted
      [0.05, 0.1, 0.25, 0.6], // fatigued
    ])
  }

  addInteraction(interaction: InteractionData) {
    this.interactionHistory.push(interaction)

    // Keep only last 100 interactions for performance
    if (this.interactionHistory.length > 100) {
      this.interactionHistory = this.interactionHistory.slice(-100)
    }
  }

  detectCognitiveState(): CognitiveState {
    if (this.interactionHistory.length === 0) {
      return {
        state: "focused",
        confidence: 0.5,
        factors: ["no_data"],
        timestamp: Date.now(),
      }
    }

    const recentInteractions = this.interactionHistory.slice(-20)
    const features = this.extractFeatures(recentInteractions)

    return this.classifyState(features)
  }

  private extractFeatures(interactions: InteractionData[]) {
    const now = Date.now()
    const timeWindow = 60000 // 1 minute

    const recentInteractions = interactions.filter((i) => now - i.timestamp < timeWindow)

    // Feature extraction
    const interactionRate = recentInteractions.length / (timeWindow / 1000)
    const avgDuration =
      recentInteractions.reduce((sum, i) => sum + (i.duration || 0), 0) / recentInteractions.length || 0
    const scrollRate = recentInteractions.filter((i) => i.type === "scroll").length
    const clickRate = recentInteractions.filter((i) => i.type === "click").length
    const readingTime = recentInteractions
      .filter((i) => i.type === "read")
      .reduce((sum, i) => sum + (i.duration || 0), 0)

    return {
      interactionRate,
      avgDuration,
      scrollRate,
      clickRate,
      readingTime,
      pauseCount: recentInteractions.filter((i) => i.type === "pause").length,
    }
  }

  private classifyState(features: any): CognitiveState {
    const { interactionRate, avgDuration, scrollRate, clickRate, readingTime, pauseCount } = features

    let state: CognitiveState["state"] = "focused"
    let confidence = 0.5
    const factors: string[] = []

    // Simple rule-based classification
    // In production, this would use the trained ML model

    if (readingTime > 30000 && scrollRate < 5 && pauseCount < 2) {
      state = "focused"
      confidence = 0.85
      factors.push("sustained_reading", "minimal_scrolling", "few_pauses")
    } else if (interactionRate > 0.5 && avgDuration > 1000) {
      state = "receptive"
      confidence = 0.75
      factors.push("moderate_interaction", "good_engagement")
    } else if (scrollRate > 10 || clickRate > 8) {
      state = "distracted"
      confidence = 0.8
      factors.push("excessive_scrolling", "rapid_clicking")
    } else if (interactionRate < 0.1 || pauseCount > 5) {
      state = "fatigued"
      confidence = 0.7
      factors.push("low_interaction", "frequent_pauses")
    }

    return {
      state,
      confidence,
      factors,
      timestamp: Date.now(),
    }
  }

  analyzeContent(content: string) {
    const doc = nlp(content)

    return {
      wordCount: doc.wordCount(),
      sentences: doc.sentences().length,
      complexity: this.calculateComplexity(doc),
      keyTerms: this.extractKeyTerms(doc),
      readingTime: this.estimateReadingTime(doc.wordCount()),
      topics: this.extractTopics(doc),
    }
  }

  private calculateComplexity(doc: any): number {
    const avgWordsPerSentence = doc.wordCount() / doc.sentences().length
    const complexWords = doc.match("#Adjective").length + doc.match("#Adverb").length

    // Simple complexity score (0-1)
    return Math.min(1, (avgWordsPerSentence / 20 + complexWords / doc.wordCount()) / 2)
  }

  private extractKeyTerms(doc: any): string[] {
    return doc.match("#Noun").unique().out("array").slice(0, 10)
  }

  private estimateReadingTime(wordCount: number): number {
    // Average reading speed: 200-250 words per minute
    return Math.ceil(wordCount / 225) * 60 * 1000 // milliseconds
  }

  private extractTopics(doc: any): string[] {
    const topics = []

    // Extract potential topics from nouns and noun phrases
    const nouns = doc.match("#Noun").out("array")
    const phrases = doc.match("#Noun #Noun").out("array")

    return [...new Set([...nouns, ...phrases])].slice(0, 5)
  }

  generateAdaptations(cognitiveState: CognitiveState, content: any) {
    const adaptations = []

    switch (cognitiveState.state) {
      case "focused":
        adaptations.push({
          type: "highlight",
          target: "key_terms",
          intensity: 0.3,
        })
        break

      case "receptive":
        adaptations.push({
          type: "font_size",
          value: "+2px",
        })
        break

      case "distracted":
        adaptations.push(
          {
            type: "simplify",
            target: "complex_sentences",
          },
          {
            type: "visual_cues",
            target: "important_sections",
          },
        )
        break

      case "fatigued":
        adaptations.push(
          {
            type: "break_reminder",
            message: "Consider taking a short break",
          },
          {
            type: "font_size",
            value: "+4px",
          },
          {
            type: "line_height",
            value: "1.8",
          },
        )
        break
    }

    return adaptations
  }
}
