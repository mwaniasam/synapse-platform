export interface User {
  id: string
  email: string
  name: string
  createdAt: Date
  preferences: UserPreferences
}

export interface UserPreferences {
  theme: "light" | "dark" | "system"
  adaptationIntensity: number
  cognitiveDetectionEnabled: boolean
  knowledgeMappingEnabled: boolean
  aiGuidanceEnabled: boolean
}

export interface CognitiveState {
  state: "focused" | "fatigued" | "distracted" | "receptive"
  confidence: number
  timestamp: Date
  duration: number
}

export interface LearningSession {
  id: string
  userId: string
  startTime: Date
  endTime?: Date
  goals: string[]
  subject: string
  cognitiveStates: CognitiveState[]
  conceptsLearned: string[]
  summary?: string
}

export interface KnowledgeNode {
  id: string
  concept: string
  domain: string
  frequency: number
  lastEncountered: Date
  connections: string[]
}
