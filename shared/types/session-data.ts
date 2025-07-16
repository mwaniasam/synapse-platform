// Session Data Types
import type { CognitiveState } from "./cognitive-states"

export interface SessionData {
  id: string
  userId: string
  startTime: number
  endTime?: number
  cognitiveState: CognitiveState
  url: string
  domain: string
  interactions: number
  focusTime: number
  adaptationsApplied: string[]
  performanceMetrics: {
    readingSpeed: number
    comprehensionScore: number
    retentionRate: number
  }
}
