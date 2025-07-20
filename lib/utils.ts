import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Cognitive State Detection
export function detectCognitiveState(data: {
  mouseMovements: number[];
  keystrokes: number[];
  scrollEvents: number[];
  tabSwitches: number;
  timeSpent: number;
}): { state: string; confidence: number } {
  const { mouseMovements, keystrokes, scrollEvents, tabSwitches, timeSpent } = data;
  
  // Calculate average values
  const avgMouseMovement = mouseMovements.reduce((a, b) => a + b, 0) / (mouseMovements.length || 1);
  const avgKeystrokes = keystrokes.reduce((a, b) => a + b, 0) / (keystrokes.length || 1);
  const avgScrollEvents = scrollEvents.reduce((a, b) => a + b, 0) / (scrollEvents.length || 1);
  
  // Calculate activity metrics
  const activityLevel = calculateActivityLevel(
    avgMouseMovement,
    avgKeystrokes,
    avgScrollEvents,
    timeSpent
  );
  
  // Calculate focus score (0-100)
  const focusScore = calculateFocusScore(activityLevel, timeSpent, tabSwitches);
  
  // Determine cognitive state based on metrics
  if (focusScore > 75) {
    return { state: 'focused', confidence: focusScore / 100 };
  } else if (focusScore > 50) {
    return { state: 'neutral', confidence: (focusScore - 50) / 25 };
  } else if (focusScore > 25) {
    return { state: 'distracted', confidence: (50 - focusScore) / 25 };
  } else {
    return { state: 'unfocused', confidence: (25 - focusScore) / 25 };
  }
}

// Text Analysis
export function calculateConceptRelatedness(concept1: string, concept2: string, text: string): number {
  if (!concept1 || !concept2 || !text) return 0;
  
  // Convert to lowercase for case-insensitive comparison
  const lowerText = text.toLowerCase();
  const lowerConcept1 = concept1.toLowerCase();
  const lowerConcept2 = concept2.toLowerCase();
  
  // Simple co-occurrence based relatedness
  // 1. Check if both concepts exist in the text
  const hasConcept1 = lowerText.includes(lowerConcept1);
  const hasConcept2 = lowerText.includes(lowerConcept2);
  
  if (!hasConcept1 || !hasConcept2) return 0;
  
  // 2. Calculate distance between concepts
  const words = lowerText.split(/\s+/);
  let minDistance = Infinity;
  let concept1Positions: number[] = [];
  
  // Find all positions of concept1
  words.forEach((word, index) => {
    if (word.includes(lowerConcept1)) {
      concept1Positions.push(index);
    }
  });
  
  // Find minimum distance to any occurrence of concept2
  words.forEach((word, index) => {
    if (word.includes(lowerConcept2)) {
      concept1Positions.forEach(pos => {
        const distance = Math.abs(pos - index);
        if (distance < minDistance) {
          minDistance = distance;
        }
      });
    }
  });
  
  // Normalize distance to a 0-1 score (closer = higher score)
  // Using an exponential decay function to give higher scores to closer concepts
  const maxDistance = 20; // Words
  const decayFactor = 0.2; // Controls how quickly the score decays with distance
  
  if (minDistance === 0) return 1.0; // Same word or adjacent words
  if (minDistance >= maxDistance) return 0.1; // Minimum score for very distant concepts
  
  // Exponential decay based on distance
  return Math.max(0.1, Math.exp(-decayFactor * minDistance));
}

// Text Analysis
export function extractConcepts(text: string, minWordLength = 3, topN = 10): string[] {
  if (!text || typeof text !== 'string') return [];
  
  // Clean and tokenize text
  const words = text
    .toLowerCase()
    .replace(/[^\w\s]|_/g, '') // Remove punctuation
    .replace(/\s+/g, ' ') // Normalize whitespace
    .split(' ')
    .filter(word => word.length >= minWordLength);

  // Count word frequencies
  const wordFrequencies: Record<string, number> = {};
  words.forEach(word => {
    wordFrequencies[word] = (wordFrequencies[word] || 0) + 1;
  });

  // Convert to array and sort by frequency
  const sortedWords = Object.entries(wordFrequencies)
    .sort((a, b) => b[1] - a[1])
    .map(([word]) => word);

  // Return top N words as concepts
  return sortedWords.slice(0, topN);
}

// Activity Level Detection
export function calculateActivityLevel(
  mouseMovements: number,
  keystrokes: number,
  scrollEvents: number,
  timeSpent: number,
): string {
  if (timeSpent === 0) return "idle"

  const timeInSeconds = timeSpent / 1000
  const movementRate = mouseMovements / timeInSeconds
  const keystrokeRate = keystrokes / timeInSeconds
  const scrollRate = scrollEvents / timeInSeconds

  const totalActivity = movementRate + keystrokeRate * 2 + scrollRate

  if (totalActivity < 0.5) return "idle"
  if (totalActivity < 2) return "low"
  if (totalActivity < 5) return "medium"
  return "high"
}

// Focus Score Calculation
export function calculateFocusScore(activityLevel: string, timeOnPage: number, tabSwitches = 0): number {
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
  const seconds = Math.floor(milliseconds / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)

  if (hours > 0) {
    return `${hours}h ${minutes % 60}m`
  } else if (minutes > 0) {
    return `${minutes}m ${seconds % 60}s`
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
export function calculateStreakDays(sessions: Array<{ createdAt: Date; completed: boolean }>): number {
  if (sessions.length === 0) return 0

  const completedSessions = sessions.filter((s) => s.completed)
  if (completedSessions.length === 0) return 0

  const sortedSessions = completedSessions.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  let streak = 0
  const currentDate = new Date(today)

  for (const session of sortedSessions) {
    const sessionDate = new Date(session.createdAt)
    sessionDate.setHours(0, 0, 0, 0)

    const daysDiff = Math.floor((currentDate.getTime() - sessionDate.getTime()) / (1000 * 60 * 60 * 24))

    if (daysDiff === streak) {
      streak++
    } else if (daysDiff > streak) {
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

// Input validation
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export function validatePassword(password: string): { isValid: boolean; errors: string[] } {
  const errors: string[] = []

  if (password.length < 8) {
    errors.push("Password must be at least 8 characters long")
  }

  if (!/[A-Z]/.test(password)) {
    errors.push("Password must contain at least one uppercase letter")
  }

  if (!/[a-z]/.test(password)) {
    errors.push("Password must contain at least one lowercase letter")
  }

  if (!/\d/.test(password)) {
    errors.push("Password must contain at least one number")
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}

// Sanitization
export function sanitizeInput(input: string): string {
  return input.trim().replace(/[<>]/g, "")
}
