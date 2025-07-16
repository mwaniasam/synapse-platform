export interface CognitiveState {
  state: "focused" | "distracted" | "tired" | "stressed" | "curious" | "neutral"
  confidence: number
  indicators: string[]
  timestamp: Date
}

export class CognitiveDetector {
  private interactions: Array<{
    type: string
    timestamp: Date
    duration?: number
    element?: string
  }> = []

  private focusStartTime: Date | null = null
  private lastInteraction: Date = new Date()

  trackInteraction(type: string, element?: string, duration?: number) {
    const now = new Date()
    this.interactions.push({
      type,
      timestamp: now,
      duration,
      element,
    })

    this.lastInteraction = now

    // Keep only last 50 interactions for performance
    if (this.interactions.length > 50) {
      this.interactions = this.interactions.slice(-50)
    }
  }

  startFocusSession() {
    this.focusStartTime = new Date()
  }

  endFocusSession() {
    this.focusStartTime = null
  }

  detectCognitiveState(): CognitiveState {
    const now = new Date()
    const recentInteractions = this.interactions.filter(
      (i) => now.getTime() - i.timestamp.getTime() < 60000, // Last minute
    )

    if (recentInteractions.length === 0) {
      return {
        state: "neutral",
        confidence: 0.5,
        indicators: ["No recent activity"],
        timestamp: now,
      }
    }

    // Analyze interaction patterns
    const clickCount = recentInteractions.filter((i) => i.type === "click").length
    const scrollCount = recentInteractions.filter((i) => i.type === "scroll").length
    const readTime = recentInteractions
      .filter((i) => i.type === "read" && i.duration)
      .reduce((sum, i) => sum + (i.duration || 0), 0)

    const avgTimeBetweenInteractions = this.calculateAverageTimeBetween(recentInteractions)
    const timeSinceLastInteraction = now.getTime() - this.lastInteraction.getTime()

    // Determine cognitive state based on patterns
    if (timeSinceLastInteraction > 30000) {
      return {
        state: "distracted",
        confidence: 0.8,
        indicators: ["Long period without interaction"],
        timestamp: now,
      }
    }

    if (clickCount > 10 && avgTimeBetweenInteractions < 2000) {
      return {
        state: "stressed",
        confidence: 0.7,
        indicators: ["Rapid clicking pattern", "High interaction frequency"],
        timestamp: now,
      }
    }

    if (readTime > 30000 && scrollCount < 3) {
      return {
        state: "focused",
        confidence: 0.9,
        indicators: ["Extended reading time", "Minimal scrolling"],
        timestamp: now,
      }
    }

    if (scrollCount > 15 && readTime < 5000) {
      return {
        state: "distracted",
        confidence: 0.8,
        indicators: ["Excessive scrolling", "Short reading time"],
        timestamp: now,
      }
    }

    if (avgTimeBetweenInteractions > 5000 && readTime > 10000) {
      return {
        state: "curious",
        confidence: 0.7,
        indicators: ["Thoughtful interaction pace", "Good reading engagement"],
        timestamp: now,
      }
    }

    return {
      state: "neutral",
      confidence: 0.6,
      indicators: ["Normal interaction patterns"],
      timestamp: now,
    }
  }

  private calculateAverageTimeBetween(interactions: Array<{ timestamp: Date }>): number {
    if (interactions.length < 2) return 0

    const times = interactions.map((i) => i.timestamp.getTime()).sort()
    const differences = []

    for (let i = 1; i < times.length; i++) {
      differences.push(times[i] - times[i - 1])
    }

    return differences.reduce((sum, diff) => sum + diff, 0) / differences.length
  }

  getFocusScore(): number {
    if (!this.focusStartTime) return 0

    const sessionDuration = new Date().getTime() - this.focusStartTime.getTime()
    const recentState = this.detectCognitiveState()

    // Base score on session duration and cognitive state
    let score = Math.min(sessionDuration / 60000, 10) * 10 // Max 100 for 10 minutes

    // Adjust based on cognitive state
    switch (recentState.state) {
      case "focused":
        score *= 1.2
        break
      case "curious":
        score *= 1.1
        break
      case "distracted":
        score *= 0.7
        break
      case "stressed":
        score *= 0.6
        break
      case "tired":
        score *= 0.8
        break
    }

    return Math.min(Math.max(score, 0), 100)
  }
}

export const cognitiveDetector = new CognitiveDetector()
