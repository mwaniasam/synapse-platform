"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Play, Pause, Square, RotateCcw, Timer } from "lucide-react"
import { formatTime } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"
import toast from "react-hot-toast"

interface PomodoroTimerProps {
  workDuration?: number // in seconds
  breakDuration?: number // in seconds
  longBreakDuration?: number // in seconds
  onSessionComplete?: (type: "work" | "break" | "long_break", duration: number) => void
}

export function PomodoroTimer({
  workDuration = 1500, // 25 minutes
  breakDuration = 300, // 5 minutes
  longBreakDuration = 900, // 15 minutes
  onSessionComplete,
}: PomodoroTimerProps) {
  const [timeLeft, setTimeLeft] = useState(workDuration)
  const [isActive, setIsActive] = useState(false)
  const [sessionType, setSessionType] = useState<"work" | "break" | "long_break">("work")
  const [sessionCount, setSessionCount] = useState(0)
  const [totalSessions, setTotalSessions] = useState(0)

  const getCurrentDuration = useCallback(() => {
    switch (sessionType) {
      case "work":
        return workDuration
      case "break":
        return breakDuration
      case "long_break":
        return longBreakDuration
      default:
        return workDuration
    }
  }, [sessionType, workDuration, breakDuration, longBreakDuration])

  const progress = ((getCurrentDuration() - timeLeft) / getCurrentDuration()) * 100

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((timeLeft) => timeLeft - 1)
      }, 1000)
    } else if (timeLeft === 0) {
      // Session completed
      const completedDuration = getCurrentDuration()
      onSessionComplete?.(sessionType, completedDuration)

      if (sessionType === "work") {
        setSessionCount((prev) => prev + 1)
        setTotalSessions((prev) => prev + 1)

        // Every 4 work sessions, take a long break
        const nextSessionType = (sessionCount + 1) % 4 === 0 ? "long_break" : "break"
        setSessionType(nextSessionType)

        toast.success(`Work session complete! Time for a ${nextSessionType === "long_break" ? "long " : ""}break.`)
      } else {
        setSessionType("work")
        toast.success("Break time over! Ready for another work session?")
      }

      setTimeLeft(getCurrentDuration())
      setIsActive(false)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isActive, timeLeft, sessionType, sessionCount, getCurrentDuration, onSessionComplete])

  const toggleTimer = () => {
    setIsActive(!isActive)
    if (!isActive) {
      toast.success(`${sessionType === "work" ? "Work" : "Break"} session started!`)
    }
  }

  const resetTimer = () => {
    setIsActive(false)
    setTimeLeft(getCurrentDuration())
    toast.success("Timer reset")
  }

  const skipSession = () => {
    setTimeLeft(0)
    toast.success("Session skipped")
  }

  const getSessionColor = () => {
    switch (sessionType) {
      case "work":
        return "text-blue-500"
      case "break":
        return "text-green-500"
      case "long_break":
        return "text-purple-500"
      default:
        return "text-blue-500"
    }
  }

  const getSessionBadgeVariant = () => {
    switch (sessionType) {
      case "work":
        return "default"
      case "break":
        return "secondary"
      case "long_break":
        return "outline"
      default:
        return "default"
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center space-x-2">
          <Timer className="h-5 w-5" />
          <span>Pomodoro Timer</span>
        </CardTitle>
        <div className="flex items-center justify-center space-x-2">
          <Badge variant={getSessionBadgeVariant()}>
            {sessionType === "work" ? "Work Session" : sessionType === "break" ? "Short Break" : "Long Break"}
          </Badge>
          <Badge variant="outline">Session {sessionCount + 1}</Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Circular Progress */}
        <div className="relative flex items-center justify-center">
          <div className="relative w-48 h-48">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              {/* Background circle */}
              <circle
                cx="50"
                cy="50"
                r="45"
                stroke="currentColor"
                strokeWidth="2"
                fill="none"
                className="text-muted-foreground/20"
              />
              {/* Progress circle */}
              <motion.circle
                cx="50"
                cy="50"
                r="45"
                stroke="currentColor"
                strokeWidth="3"
                fill="none"
                strokeLinecap="round"
                className={getSessionColor()}
                strokeDasharray={`${2 * Math.PI * 45}`}
                strokeDashoffset={`${2 * Math.PI * 45 * (1 - progress / 100)}`}
                initial={{ strokeDashoffset: 2 * Math.PI * 45 }}
                animate={{ strokeDashoffset: 2 * Math.PI * 45 * (1 - progress / 100) }}
                transition={{ duration: 0.5 }}
              />
            </svg>

            {/* Timer display */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <AnimatePresence mode="wait">
                <motion.div
                  key={timeLeft}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 1.2, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className={`text-3xl font-bold ${getSessionColor()}`}
                >
                  {formatTime(timeLeft)}
                </motion.div>
              </AnimatePresence>
              <div className="text-sm text-muted-foreground mt-1">{Math.round(progress)}% complete</div>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <Progress value={progress} className="h-2" />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>0:00</span>
            <span>{formatTime(getCurrentDuration())}</span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center space-x-2">
          <Button onClick={toggleTimer} size="lg" className="flex items-center space-x-2">
            {isActive ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            <span>{isActive ? "Pause" : "Start"}</span>
          </Button>

          <Button onClick={resetTimer} variant="outline" size="lg">
            <RotateCcw className="h-4 w-4" />
          </Button>

          <Button onClick={skipSession} variant="ghost" size="lg">
            <Square className="h-4 w-4" />
          </Button>
        </div>

        {/* Session Stats */}
        <div className="grid grid-cols-2 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-primary">{sessionCount}</div>
            <div className="text-xs text-muted-foreground">Work Sessions</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-primary">{totalSessions}</div>
            <div className="text-xs text-muted-foreground">Total Sessions</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
