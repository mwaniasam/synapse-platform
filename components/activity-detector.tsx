"use client"

import { useEffect, useRef } from "react"
import { useSession } from "next-auth/react"

interface ActivityData {
  mouseMovements: number
  keystrokes: number
  scrollEvents: number
  tabSwitches: number
  url: string
  title: string
  domain: string
}

export function ActivityDetector() {
  const { data: session } = useSession()
  const activityRef = useRef<ActivityData>({
    mouseMovements: 0,
    keystrokes: 0,
    scrollEvents: 0,
    tabSwitches: 0,
    url: typeof window !== "undefined" ? window.location.href : "",
    title: typeof window !== "undefined" ? document.title : "",
    domain: typeof window !== "undefined" ? window.location.hostname : "",
  })

  const lastSentRef = useRef<number>(Date.now())

  useEffect(() => {
    if (!session?.user) return

    // Update page info
    activityRef.current.url = window.location.href
    activityRef.current.title = document.title
    activityRef.current.domain = window.location.hostname

    // Mouse movement tracking
    const handleMouseMove = () => {
      activityRef.current.mouseMovements++
    }

    // Keystroke tracking
    const handleKeyDown = () => {
      activityRef.current.keystrokes++
    }

    // Scroll tracking
    const handleScroll = () => {
      activityRef.current.scrollEvents++
    }

    // Tab visibility tracking
    const handleVisibilityChange = () => {
      if (document.hidden) {
        activityRef.current.tabSwitches++
      }
    }

    // Add event listeners
    document.addEventListener("mousemove", handleMouseMove, { passive: true })
    document.addEventListener("keydown", handleKeyDown, { passive: true })
    document.addEventListener("scroll", handleScroll, { passive: true })
    document.addEventListener("visibilitychange", handleVisibilityChange)

    // Send activity data every 30 seconds
    const interval = setInterval(async () => {
      const now = Date.now()
      const timeSpent = now - lastSentRef.current

      if (timeSpent > 5000) {
        // Only send if more than 5 seconds have passed
        try {
          await fetch("/api/activities", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              ...activityRef.current,
              timeSpent: Math.floor(timeSpent / 1000), // Convert to seconds
              activityLevel: calculateActivityLevel(activityRef.current),
              focusScore: calculateFocusScore(activityRef.current, timeSpent),
            }),
          })

          // Reset counters
          activityRef.current.mouseMovements = 0
          activityRef.current.keystrokes = 0
          activityRef.current.scrollEvents = 0
          activityRef.current.tabSwitches = 0
          lastSentRef.current = now
        } catch (error) {
          console.error("Failed to send activity data:", error)
        }
      }
    }, 30000) // 30 seconds

    return () => {
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("keydown", handleKeyDown)
      document.removeEventListener("scroll", handleScroll)
      document.removeEventListener("visibilitychange", handleVisibilityChange)
      clearInterval(interval)
    }
  }, [session])

  return null // This component doesn't render anything
}

function calculateActivityLevel(activity: ActivityData): string {
  const totalActivity = activity.mouseMovements + activity.keystrokes + activity.scrollEvents

  if (totalActivity > 100) return "high"
  if (totalActivity > 30) return "medium"
  return "low"
}

function calculateFocusScore(activity: ActivityData, timeSpent: number): number {
  const baseScore = 50
  const activityScore = Math.min((activity.mouseMovements + activity.keystrokes) / 10, 30)
  const tabSwitchPenalty = activity.tabSwitches * 5
  const timeBonus = Math.min(timeSpent / 60000, 20) // Bonus for longer focus periods

  return Math.max(0, Math.min(100, baseScore + activityScore - tabSwitchPenalty + timeBonus))
}
