"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Brain, Activity, Eye, Zap } from "lucide-react"
import { cognitiveDetector } from "@/lib/cognitive-detector"

interface CognitiveState {
  state: "focused" | "distracted" | "tired" | "stressed" | "curious" | "neutral"
  confidence: number
  indicators: string[]
  timestamp: Date
}

export function CognitiveMonitor() {
  const [cognitiveState, setCognitiveState] = useState<CognitiveState>({
    state: "neutral",
    confidence: 0.5,
    indicators: [],
    timestamp: new Date(),
  })
  const [focusScore, setFocusScore] = useState(0)

  useEffect(() => {
    // Track user interactions
    const trackInteraction = (type: string, element?: string) => {
      cognitiveDetector.trackInteraction(type, element)
    }

    // Add event listeners
    const handleClick = (e: MouseEvent) => {
      trackInteraction("click", (e.target as HTMLElement)?.tagName)
    }

    const handleScroll = () => {
      trackInteraction("scroll")
    }

    const handleKeyPress = () => {
      trackInteraction("keypress")
    }

    const handleMouseMove = () => {
      trackInteraction("mousemove")
    }

    document.addEventListener("click", handleClick)
    document.addEventListener("scroll", handleScroll)
    document.addEventListener("keypress", handleKeyPress)
    document.addEventListener("mousemove", handleMouseMove)

    // Update cognitive state every 5 seconds
    const interval = setInterval(() => {
      const newState = cognitiveDetector.detectCognitiveState()
      const newFocusScore = cognitiveDetector.getFocusScore()

      setCognitiveState(newState)
      setFocusScore(newFocusScore)
    }, 5000)

    return () => {
      document.removeEventListener("click", handleClick)
      document.removeEventListener("scroll", handleScroll)
      document.removeEventListener("keypress", handleKeyPress)
      document.removeEventListener("mousemove", handleMouseMove)
      clearInterval(interval)
    }
  }, [])

  const getStateColor = (state: string) => {
    switch (state) {
      case "focused":
        return "bg-green-500"
      case "curious":
        return "bg-blue-500"
      case "distracted":
        return "bg-yellow-500"
      case "stressed":
        return "bg-red-500"
      case "tired":
        return "bg-orange-500"
      default:
        return "bg-gray-500"
    }
  }

  const getStateIcon = (state: string) => {
    switch (state) {
      case "focused":
        return <Eye className="h-4 w-4" />
      case "curious":
        return <Brain className="h-4 w-4" />
      case "distracted":
        return <Activity className="h-4 w-4" />
      case "stressed":
        return <Zap className="h-4 w-4" />
      default:
        return <Brain className="h-4 w-4" />
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Brain className="h-5 w-5 text-blue-600" />
          Cognitive Monitor
        </CardTitle>
        <CardDescription>Real-time analysis of your learning state</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Current State */}
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Current State:</span>
          <Badge variant="secondary" className="flex items-center gap-1">
            {getStateIcon(cognitiveState.state)}
            {cognitiveState.state.charAt(0).toUpperCase() + cognitiveState.state.slice(1)}
          </Badge>
        </div>

        {/* Confidence */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span>Confidence</span>
            <span>{Math.round(cognitiveState.confidence * 100)}%</span>
          </div>
          <Progress value={cognitiveState.confidence * 100} className="h-2" />
        </div>

        {/* Focus Score */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span>Focus Score</span>
            <span>{Math.round(focusScore)}/100</span>
          </div>
          <Progress value={focusScore} className="h-2" />
          <div className={`h-2 rounded-full ${getStateColor(cognitiveState.state)} opacity-20`} />
        </div>

        {/* Indicators */}
        {cognitiveState.indicators.length > 0 && (
          <div className="space-y-2">
            <span className="text-sm font-medium">Indicators:</span>
            <div className="space-y-1">
              {cognitiveState.indicators.map((indicator, index) => (
                <div key={index} className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
                  {indicator}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Last Updated */}
        <div className="text-xs text-muted-foreground text-center pt-2 border-t">
          Updated {cognitiveState.timestamp.toLocaleTimeString()}
        </div>
      </CardContent>
    </Card>
  )
}
