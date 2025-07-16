// User Preferences Types
import type { InteractionPattern } from "./cognitive-states"

export interface UserPreferences {
  id: string
  userId: string
  cognitiveDetectionEnabled: boolean
  contentAdaptationEnabled: boolean
  knowledgeMappingEnabled: boolean
  adaptationIntensity: number
  preferredFontSize: number
  preferredLineHeight: number
  highlightKeyTerms: boolean
  simplifyComplexSentences: boolean
  showVisualCues: boolean
  breakReminders: boolean
  notificationsEnabled: boolean
  dataRetentionPeriod: string
  excludedDomains: string[]
  learningGoals: string[]
  timezone: string
  preferredInteractionPattern: InteractionPattern
  createdAt: number
  updatedAt: number
}
