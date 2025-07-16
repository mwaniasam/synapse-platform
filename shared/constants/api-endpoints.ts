// API Endpoints Configuration
export const API_ENDPOINTS = {
  BASE_URL: "http://localhost:3000/api",
  COGNITIVE_STATE: "/cognitive-state",
  SESSION_DATA: "/session-data",
  USER_PREFERENCES: "/user-preferences",
  KNOWLEDGE_GRAPH: "/knowledge-graph",
  ANALYTICS: "/analytics",
  HEALTH_CHECK: "/health",
} as const

export type ApiEndpoint = keyof typeof API_ENDPOINTS
