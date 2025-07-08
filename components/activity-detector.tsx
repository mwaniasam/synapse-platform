"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Activity, Mouse, Keyboard, ScrollText, Eye } from "lucide-react"
import { calculateActivityLevel, calculateFocusScore } from "@/lib/utils"
import { motion } from "framer-motion"

interface ActivityMetrics {
  mouseMovements: number
  keystrokes: number
  scrolls: number
  tabSwitches: number
  timeOnPage: number
  activityLevel: "idle" | "low" | "medium" | "high"
  focusScore: number
}

interface ActivityDetectorProps {
  onActivityUpdate?: (metrics: ActivityMetrics) => void
  trackingEnabled?: boolean
}

export function ActivityDetector({ onActivityUpdate, trackingEnabled = true }: ActivityDetectorProps) {
  const [metrics, setMetrics] = useState<ActivityMetrics>({
    mouseMovements: 0,
    keystrokes: 0,
    scrolls: 0,
    tabSwitches: 0,
    timeOnPage: 0,
    activityLevel: "idle",
    focusScore: 50,
  })

  const [isVisible, setIsVisible] = useState(true)
  const [startTime] = useState(Date.now())

  const updateMetrics = useCallback(() => {
    const timeOnPage = Date.now() - startTime
    const activityLevel = calculateActivityLevel(metrics.mouseMovements, metrics.keystrokes, metrics.scrolls)
    const focusScore = calculateFocusScore(activityLevel, metrics.tabSwitches, timeOnPage)

    const updatedMetrics = {
      ...metrics,
      timeOnPage,
      activityLevel,
      focusScore,
    }

    setMetrics(updatedMetrics)
    onActivityUpdate?.(updatedMetrics)
  }, [metrics, startTime, onActivityUpdate])

  useEffect(() => {
    if (!trackingEnabled) return

    const handleMouseMove = () => {
      setMetrics((prev) => ({ ...prev, mouseMovements: prev.mouseMovements + 1 }))
    }

    const handleKeyPress = () => {
      setMetrics((prev) => ({ ...prev, keystrokes: prev.keystrokes + 1 }))
    }

    const handleScroll = () => {
      setMetrics((prev) => ({ ...prev, scrolls: prev.scrolls + 1 }))
    }

    const handleVisibilityChange = () => {
      if (document.hidden) {
        setIsVisible(false)
        setMetrics((prev) => ({ ...prev, tabSwitches: prev.tabSwitches + 1 }))
      } else {
        setIsVisible(true)
      }
    }

    // Add event listeners
    document.addEventListener("mousemove", handleMouseMove)
    document.addEventListener("keypress", handleKeyPress)
    document.addEventListener("scroll", handleScroll)
    document.addEventListener("visibilitychange", handleVisibilityChange)

    // Update metrics every 5 seconds
    const interval = setInterval(updateMetrics, 5000)

    return () => {
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("keypress", handleKeyPress)
      document.removeEventListener("scroll", handleScroll)
      document.removeEventListener("visibilitychange", handleVisibilityChange)
      clearInterval(interval)
    }
  }, [trackingEnabled, updateMetrics])

  const getActivityColor = (level: string) => {
    switch (level) {
      case "high":
        return "text-green-500"
      case "medium":
        return "text-yellow-500"
      case "low":
        return "text-orange-500"
      case "idle":
        return "text-red-500"
      default:
        return "text-gray-500"
    }
  }

  const getActivityBadgeVariant = (level: string) => {
    switch (level) {
      case "high":
        return "default"
      case "medium":
        return "secondary"
      case "low":
        return "outline"
      case "idle":
        return "destructive"
      default:
        return "outline"
    }
  }

  const getFocusColor = (score: number) => {
    if (score >= 80) return "text-green-500"
    if (score >= 60) return "text-blue-500"
    if (score >= 40) return "text-yellow-500"
    return "text-red-500"
  }

  if (!trackingEnabled) {
    return (
      <Card className="w-full max-w-md">
        <CardContent className="flex items-center justify-center py-8">
          <div className="text-center text-muted-foreground">
            <Activity className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>Activity tracking disabled</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Activity className="h-5 w-5" />
            <span>Activity Monitor</span>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant={getActivityBadgeVariant(metrics.activityLevel)}>
              {metrics.activityLevel.toUpperCase()}
            </Badge>
            {!isVisible && (
              <Badge variant="outline" className="text-xs">
                <Eye className="h-3 w-3 mr-1" />
                Away
              </Badge>
            )}
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Focus Score */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Focus Score</span>
            <span className={`text-sm font-bold ${getFocusColor(metrics.focusScore)}`}>{metrics.focusScore}%</span>
          </div>
          <Progress value={metrics.focusScore} className="h-2" />
        </div>

        {/* Activity Metrics */}
        <div className="grid grid-cols-2 gap-4">
          <motion.div
            className="flex items-center space-x-2"
            animate={{ scale: metrics.mouseMovements > 0 ? [1, 1.05, 1] : 1 }}
            transition={{ duration: 0.2 }}
          >
            <Mouse className="h-4 w-4 text-blue-500" />
            <div>
              <div className="text-sm font-medium">{metrics.mouseMovements}</div>
              <div className="text-xs text-muted-foreground">Mouse</div>
            </div>
          </motion.div>

          <motion.div
            className="flex items-center space-x-2"
            animate={{ scale: metrics.keystrokes > 0 ? [1, 1.05, 1] : 1 }}
            transition={{ duration: 0.2 }}
          >
            <Keyboard className="h-4 w-4 text-green-500" />
            <div>
              <div className="text-sm font-medium">{metrics.keystrokes}</div>
              <div className="text-xs text-muted-foreground">Keys</div>
            </div>
          </motion.div>

          <motion.div
            className="flex items-center space-x-2"
            animate={{ scale: metrics.scrolls > 0 ? [1, 1.05, 1] : 1 }}
            transition={{ duration: 0.2 }}
          >
            <ScrollText className="h-4 w-4 text-purple-500" />
            <div>
              <div className="text-sm font-medium">{metrics.scrolls}</div>
              <div className="text-xs text-muted-foreground">Scrolls</div>
            </div>
          </motion.div>

          <div className="flex items-center space-x-2">
            <Activity className="h-4 w-4 text-orange-500" />
            <div>
              <div className="text-sm font-medium">{metrics.tabSwitches}</div>
              <div className="text-xs text-muted-foreground">Switches</div>
            </div>
          </div>
        </div>

        {/* Activity Level Indicator */}
        <div className="flex items-center justify-center">
          <motion.div
            className={`flex items-center space-x-2 px-3 py-2 rounded-full border ${getActivityColor(metrics.activityLevel)}`}
            animate={{
              scale: metrics.activityLevel === "high" ? [1, 1.1, 1] : 1,
              opacity: isVisible ? 1 : 0.5,
            }}
            transition={{ duration: 0.5, repeat: metrics.activityLevel === "high" ? Number.POSITIVE_INFINITY : 0 }}
          >
            <div className={`w-2 h-2 rounded-full ${getActivityColor(metrics.activityLevel)} bg-current`} />
            <span className="text-sm font-medium capitalize">{metrics.activityLevel} Activity</span>
          </motion.div>
        </div>

        {/* Time on Page */}
        <div className="text-center">
          <div className="text-lg font-bold text-primary">
            {Math.floor(metrics.timeOnPage / 60000)}:
            {String(Math.floor((metrics.timeOnPage % 60000) / 1000)).padStart(2, "0")}
          </div>
          <div className="text-xs text-muted-foreground">Time on Page</div>
        </div>
      </CardContent>
    </Card>
  )
}
