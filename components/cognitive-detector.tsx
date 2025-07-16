"use client"

import { useEffect, useState, useCallback } from "react"
import { Brain, Activity, Eye, Zap } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

interface CognitiveState {
  state: "focused" | "receptive" | "distracted" | "fatigued"
  confidence: number
  factors: string[]
  timestamp: number
}

interface InteractionData {
  type: string
  timestamp: number
  duration?: number
  element?: string
  coordinates?: { x: number; y: number }
}

export default function CognitiveDetector() {
  const [cognitiveState, setCognitiveState] = useState<CognitiveState>({
    state: "focused",
    confidence: 0.5,
    factors: [],
    timestamp: Date.now(),
  })
  const [interactions, setInteractions] = useState<InteractionData[]>([])
  const [isActive, setIsActive] = useState(true)

  const addInteraction = useCallback((interaction: InteractionData) => {
    setInteractions((prev) => [...prev.slice(-19), interaction])
  }, [])

  const detectCognitiveState = useCallback(async () => {
    if (interactions.length === 0) return

    try {
      const response = await fetch("/api/cognitive-state", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ interactions }),
      })

      if (response.ok) {
        const state = await response.json()
        setCognitiveState(state)
      }
    } catch (error) {
      console.error("Cognitive state detection error:", error)
    }
  }, [interactions])

  useEffect(() => {
    if (!isActive) return

    const handleMouseMove = (e: MouseEvent) => {
      addInteraction({
        type: "mousemove",
        timestamp: Date.now(),
        coordinates: { x: e.clientX, y: e.clientY },
      })
    }

    const handleClick = (e: MouseEvent) => {
      addInteraction({
        type: "click",
        timestamp: Date.now(),
        element: (e.target as Element)?.tagName,
        coordinates: { x: e.clientX, y: e.clientY },
      })
    }

    const handleScroll = () => {
      addInteraction({
        type: "scroll",
        timestamp: Date.now(),
      })
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      addInteraction({
        type: "keydown",
        timestamp: Date.now(),
        element: (e.target as Element)?.tagName,
      })
    }

    // Throttled event listeners
    let mouseMoveTimeout: NodeJS.Timeout
    const throttledMouseMove = (e: MouseEvent) => {
      clearTimeout(mouseMoveTimeout)
      mouseMoveTimeout = setTimeout(() => handleMouseMove(e), 100)
    }

    let scrollTimeout: NodeJS.Timeout
    const throttledScroll = () => {
      clearTimeout(scrollTimeout)
      scrollTimeout = setTimeout(handleScroll, 200)
    }

    document.addEventListener("mousemove", throttledMouseMove)
    document.addEventListener("click", handleClick)
    document.addEventListener("scroll", throttledScroll)
    document.addEventListener("keydown", handleKeyDown)

    return () => {
      document.removeEventListener("mousemove", throttledMouseMove)
      document.removeEventListener("click", handleClick)
      document.removeEventListener("scroll", throttledScroll)
      document.removeEventListener("keydown", handleKeyDown)
      clearTimeout(mouseMoveTimeout)
      clearTimeout(scrollTimeout)
    }
  }, [isActive, addInteraction])

  useEffect(() => {
    const interval = setInterval(detectCognitiveState, 5000)
    return () => clearInterval(interval)
  }, [detectCognitiveState])

  const getStateIcon = (state: string) => {
    switch (state) {
      case "focused":
        return <Brain className="w-5 h-5 text-green-500" />
      case "receptive":
        return <Eye className="w-5 h-5 text-blue-500" />
      case "distracted":
        return <Activity className="w-5 h-5 text-yellow-500" />
      case "fatigued":
        return <Zap className="w-5 h-5 text-red-500" />
      default:
        return <Brain className="w-5 h-5 text-gray-500" />
    }
  }

  const getStateColor = (state: string) => {
    switch (state) {
      case "focused":
        return "bg-green-100 text-green-800 border-green-200"
      case "receptive":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "distracted":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "fatigued":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            {getStateIcon(cognitiveState.state)}
            Cognitive State
          </span>
          <button
            onClick={() => setIsActive(!isActive)}
            className={`text-xs px-2 py-1 rounded ${
              isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"
            }`}
          >
            {isActive ? "Active" : "Paused"}
          </button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <Badge className={getStateColor(cognitiveState.state)}>
            {cognitiveState.state.charAt(0).toUpperCase() + cognitiveState.state.slice(1)}
          </Badge>
          <span className="text-sm text-muted-foreground">
            {Math.round(cognitiveState.confidence * 100)}% confidence
          </span>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Attention Level</span>
            <span>{Math.round(cognitiveState.confidence * 100)}%</span>
          </div>
          <Progress value={cognitiveState.confidence * 100} className="h-2" />
        </div>

        {cognitiveState.factors.length > 0 && (
          <div className="space-y-2">
            <span className="text-sm font-medium">Factors:</span>
            <div className="flex flex-wrap gap-1">
              {cognitiveState.factors.map((factor, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {factor.replace(/_/g, " ")}
                </Badge>
              ))}
            </div>
          </div>
        )}

        <div className="text-xs text-muted-foreground">
          Last updated: {new Date(cognitiveState.timestamp).toLocaleTimeString()}
        </div>
      </CardContent>
    </Card>
  )
}
