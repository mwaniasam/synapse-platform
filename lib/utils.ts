import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Activity Level Detection
export function calculateActivityLevel(
  mouseMovements: number,
  keystrokes: number,
  scrollEvents: number,
  timeSpent: number,
): string {
  const movementRate = mouseMovements / (timeSpent / 1000)
  const keystrokeRate = keystrokes / (timeSpent / 1000)
  const scrollRate = scrollEvents / (timeSpent / 1000)

  const totalActivity = movementRate + keystrokeRate * 2 + scrollRate

  if (totalActivity < 0.5) return "idle"
  if (totalActivity < 2) return "low"
  if (totalActivity < 5) return "medium"
  return "high"
}

export function detectActivityLevel(interactions: {
  mouseMovements: number
  keystrokes: number
  scrollEvents: number
  timeSpent: number
}): string {
  return calculateActivityLevel(
    interactions.mouseMovements,
    interactions.keystrokes,
    interactions.scrollEvents,
    interactions.timeSpent,
  )
}

// Focus Score Calculation
export function calculateFocusScore(activityLevel: string, timeOnPage: number, tabSwitches: number): number {
  let baseScore = 50

  // Activity level impact
  switch (activityLevel) {
    case "high":
      baseScore += 30
      break
    case "medium":
      baseScore += 15
      break
    case "low":
      baseScore -= 10
      break
    case "idle":
      baseScore -= 30
      break
  }

  // Time on page impact (longer = better focus)
  const timeMinutes = timeOnPage / (1000 * 60)
  if (timeMinutes > 10) baseScore += 20
  else if (timeMinutes > 5) baseScore += 10
  else if (timeMinutes < 1) baseScore -= 20

  // Tab switches impact (more switches = less focus)
  if (tabSwitches > 10) baseScore -= 25
  else if (tabSwitches > 5) baseScore -= 15
  else if (tabSwitches <= 2) baseScore += 10

  return Math.max(0, Math.min(100, baseScore))
}

// Time Formatting
export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
}

export function formatDuration(milliseconds: number): string {
  const totalSeconds = Math.floor(milliseconds / 1000)
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60

  if (hours > 0) {
    return `${hours}h ${minutes}m ${seconds}s`
  } else if (minutes > 0) {
    return `${minutes}m ${seconds}s`
  } else {
    return `${seconds}s`
  }
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date)
}

export function formatTimeAgo(date: Date): string {
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

  if (diffInSeconds < 60) return "just now"
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`
  return `${Math.floor(diffInSeconds / 86400)}d ago`
}

// Session Management
export function generateSessionId(): string {
  return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

// UI Helpers
export function getProductivityColor(score: number): string {
  if (score >= 80) return "text-green-600"
  if (score >= 60) return "text-blue-600"
  if (score >= 40) return "text-yellow-600"
  return "text-red-600"
}

export function getActivityColor(level: string): string {
  switch (level) {
    case "high":
      return "text-green-600"
    case "medium":
      return "text-blue-600"
    case "low":
      return "text-yellow-600"
    case "idle":
      return "text-gray-600"
    default:
      return "text-gray-600"
  }
}

// Analytics Helpers
export function calculateStreakDays(sessions: Array<{ createdAt: Date }>): number {
  if (sessions.length === 0) return 0

  const sortedSessions = sessions.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  let streak = 0
  const currentDate = new Date(today)

  for (const session of sortedSessions) {
    const sessionDate = new Date(session.createdAt)
    sessionDate.setHours(0, 0, 0, 0)

    if (sessionDate.getTime() === currentDate.getTime()) {
      streak++
      currentDate.setDate(currentDate.getDate() - 1)
    } else if (sessionDate.getTime() < currentDate.getTime()) {
      break
    }
  }

  return streak
}

// Performance Utilities
export function debounce<T extends (...args: any[]) => any>(func: T, wait: number): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null

  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

export function throttle<T extends (...args: any[]) => any>(func: T, limit: number): (...args: Parameters<T>) => void {
  let inThrottle = false

  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => (inThrottle = false), limit)
    }
  }
}
