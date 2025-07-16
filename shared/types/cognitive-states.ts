// Cognitive States Type Definitions
export type CognitiveState = "focused" | "receptive" | "distracted" | "fatigued"

export interface CognitiveStateData {
  state: CognitiveState
  confidence: number
  timestamp: number
  factors: string[]
}

export type InteractionPattern = "reading" | "scrolling" | "clicking" | "typing" | "idle"

export interface InteractionData {
  pattern: InteractionPattern
  frequency: number
  duration: number
  timestamp: number
}
