"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Play, Pause, RotateCcw, Settings } from "lucide-react"
import { formatTime } from "@/lib/utils"

type TimerMode = "work" | "shortBreak" | "longBreak"

interface TimerSettings {
  workDuration: number
  shortBreakDuration: number
  longBreakDuration: number
  longBreakInterval: number
}

interface PomodoroTimerProps {
  onSessionComplete?: (type: "work" | "break" | "long_break", duration: number) => Promise<void>;
}

export function PomodoroTimer({ onSessionComplete }: PomodoroTimerProps) {
  const [settings] = useState<TimerSettings>({
    workDuration: 25 * 60, // 25 minutes
    shortBreakDuration: 5 * 60, // 5 minutes
    longBreakDuration: 15 * 60, // 15 minutes
    longBreakInterval: 4, // Long break after 4 work sessions
  })

  const [mode, setMode] = useState<TimerMode>("work")
  const [timeLeft, setTimeLeft] = useState(settings.workDuration)
  const [isRunning, setIsRunning] = useState(false)
  const [completedSessions, setCompletedSessions] = useState(0)

  const getCurrentDuration = useCallback(() => {
    switch (mode) {
      case "work":
        return settings.workDuration
      case "shortBreak":
        return settings.shortBreakDuration
      case "longBreak":
        return settings.longBreakDuration
      default:
        return settings.workDuration
    }
  }, [mode, settings])

  const progress = ((getCurrentDuration() - timeLeft) / getCurrentDuration()) * 100

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null

    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => time - 1)
      }, 1000)
    } else if (timeLeft === 0) {
      // Timer completed
      setIsRunning(false)

      if (mode === "work") {
        setCompletedSessions((prev) => prev + 1)
        // Determine next break type
        const nextBreakType = (completedSessions + 1) % settings.longBreakInterval === 0 ? "longBreak" : "shortBreak"
        setMode(nextBreakType)
        setTimeLeft(nextBreakType === "longBreak" ? settings.longBreakDuration : settings.shortBreakDuration)
      } else {
        // Break completed, start work session
        setMode("work")
        setTimeLeft(settings.workDuration)
      }

      // Play notification sound (if enabled)
      if (typeof window !== "undefined" && "Notification" in window) {
        new Notification(`${mode === "work" ? "Work" : "Break"} session completed!`)
      }
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isRunning, timeLeft, mode, completedSessions, settings])

  const toggleTimer = () => {
    setIsRunning(!isRunning)
  }

  const resetTimer = () => {
    setIsRunning(false)
    setTimeLeft(getCurrentDuration())
  }

  const switchMode = (newMode: TimerMode) => {
    setIsRunning(false)
    setMode(newMode)
    setTimeLeft(
      newMode === "work"
        ? settings.workDuration
        : newMode === "shortBreak"
          ? settings.shortBreakDuration
          : settings.longBreakDuration,
    )
  }

  const getModeColor = () => {
    switch (mode) {
      case "work":
        return "bg-red-500"
      case "shortBreak":
        return "bg-green-500"
      case "longBreak":
        return "bg-blue-500"
      default:
        return "bg-gray-500"
    }
  }

  const getModeLabel = () => {
    switch (mode) {
      case "work":
        return "Focus Time"
      case "shortBreak":
        return "Short Break"
      case "longBreak":
        return "Long Break"
      default:
        return "Timer"
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Badge className={getModeColor()}>{getModeLabel()}</Badge>
            </CardTitle>
            <CardDescription>
              Session {completedSessions + 1} • {completedSessions} completed today
            </CardDescription>
          </div>
          <Button variant="ghost" size="sm">
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-center">
          <div className="text-6xl font-mono font-bold mb-4">{formatTime(timeLeft)}</div>
          <Progress value={progress} className="w-full h-2" />
        </div>

        <div className="flex justify-center gap-2">
          <Button onClick={toggleTimer} size="lg" className="flex items-center gap-2">
            {isRunning ? (
              <>
                <Pause className="h-4 w-4" />
                Pause
              </>
            ) : (
              <>
                <Play className="h-4 w-4" />
                Start
              </>
            )}
          </Button>
          <Button onClick={resetTimer} variant="outline" size="lg">
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex justify-center gap-2">
          <Button variant={mode === "work" ? "default" : "outline"} size="sm" onClick={() => switchMode("work")}>
            Work
          </Button>
          <Button
            variant={mode === "shortBreak" ? "default" : "outline"}
            size="sm"
            onClick={() => switchMode("shortBreak")}
          >
            Short Break
          </Button>
          <Button
            variant={mode === "longBreak" ? "default" : "outline"}
            size="sm"
            onClick={() => switchMode("longBreak")}
          >
            Long Break
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
