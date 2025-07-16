"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Play, Pause, Square, Clock, Brain } from "lucide-react"
import { toast } from "react-hot-toast"

interface LearningSession {
  id?: string
  title: string
  startTime: Date
  endTime?: Date
  duration?: number
  cognitiveState: string
  focusScore: number
  interactions: any[]
}

export default function LearningSessionTracker() {
  const [isActive, setIsActive] = useState(false)
  const [currentSession, setCurrentSession] = useState<LearningSession | null>(null)
  const [elapsedTime, setElapsedTime] = useState(0)
  const [sessionTitle, setSessionTitle] = useState("")
  const [interactions, setInteractions] = useState<any[]>([])

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isActive && currentSession) {
      interval = setInterval(() => {
        setElapsedTime(Date.now() - currentSession.startTime.getTime())
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isActive, currentSession])

  const startSession = async () => {
    if (!sessionTitle.trim()) {
      toast.error("Please enter a session title")
      return
    }

    const session: LearningSession = {
      title: sessionTitle,
      startTime: new Date(),
      cognitiveState: "focused",
      focusScore: 0,
      interactions: [],
    }

    try {
      const response = await fetch("/api/sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: sessionTitle,
          url: window.location.href,
          interactions: [],
        }),
      })

      if (response.ok) {
        const data = await response.json()
        session.id = data.sessionId
        setCurrentSession(session)
        setIsActive(true)
        setElapsedTime(0)
        toast.success("Learning session started!")
      }
    } catch (error) {
      toast.error("Failed to start session")
    }
  }

  const pauseSession = () => {
    setIsActive(false)
    toast.success("Session paused")
  }

  const resumeSession = () => {
    setIsActive(true)
    toast.success("Session resumed")
  }

  const endSession = async () => {
    if (!currentSession?.id) return

    try {
      const response = await fetch(`/api/sessions/${currentSession.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          endTime: new Date(),
          duration: Math.floor(elapsedTime / 1000),
          focusScore: Math.random() * 40 + 60, // Mock focus score
          comprehensionRate: Math.random() * 30 + 70,
          retentionScore: Math.random() * 25 + 75,
        }),
      })

      if (response.ok) {
        setCurrentSession(null)
        setIsActive(false)
        setElapsedTime(0)
        setSessionTitle("")
        setInteractions([])
        toast.success("Session completed!")
      }
    } catch (error) {
      toast.error("Failed to end session")
    }
  }

  const formatTime = (ms: number) => {
    const seconds = Math.floor(ms / 1000)
    const minutes = Math.floor(seconds / 60)
    const hours = Math.floor(minutes / 60)

    if (hours > 0) {
      return `${hours}:${(minutes % 60).toString().padStart(2, "0")}:${(seconds % 60).toString().padStart(2, "0")}`
    }
    return `${minutes}:${(seconds % 60).toString().padStart(2, "0")}`
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="w-5 h-5" />
          Learning Session
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {!currentSession ? (
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Session Title</label>
              <input
                type="text"
                value={sessionTitle}
                onChange={(e) => setSessionTitle(e.target.value)}
                placeholder="What are you learning today?"
                className="w-full px-3 py-2 border rounded-md text-sm"
              />
            </div>
            <Button onClick={startSession} className="w-full">
              <Play className="w-4 h-4 mr-2" />
              Start Learning Session
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="text-center">
              <h3 className="font-semibold">{currentSession.title}</h3>
              <div className="text-2xl font-mono font-bold text-primary">{formatTime(elapsedTime)}</div>
            </div>

            <div className="flex items-center justify-center gap-2">
              {isActive ? (
                <Button onClick={pauseSession} variant="outline">
                  <Pause className="w-4 h-4 mr-2" />
                  Pause
                </Button>
              ) : (
                <Button onClick={resumeSession}>
                  <Play className="w-4 h-4 mr-2" />
                  Resume
                </Button>
              )}
              <Button onClick={endSession} variant="destructive">
                <Square className="w-4 h-4 mr-2" />
                End Session
              </Button>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Focus Level</span>
                <Badge variant="outline">
                  <Brain className="w-3 h-3 mr-1" />
                  {currentSession.cognitiveState}
                </Badge>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span>Session Progress</span>
                  <span>{Math.floor(elapsedTime / 60000)}min</span>
                </div>
                <Progress value={Math.min(100, (elapsedTime / (25 * 60 * 1000)) * 100)} className="h-2" />
              </div>

              <div className="text-xs text-muted-foreground text-center">
                Target: 25 minutes • Interactions: {interactions.length}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
