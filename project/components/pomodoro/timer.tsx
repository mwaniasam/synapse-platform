"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Play, Pause, RotateCcw, Timer, Coffee, Clock } from "lucide-react"
import { cn } from "@/lib/utils"

type SessionType = 'work' | 'shortBreak' | 'longBreak'

interface PomodoroTimerProps {
  settings: {
    workDuration: number
    shortBreakDuration: number
    longBreakDuration: number
    sessionsUntilLongBreak: number
  }
  onSessionComplete: (sessionData: {
    type: SessionType
    duration: number
    completed: boolean
  }) => void
}

export function PomodoroTimer({ settings, onSessionComplete }: PomodoroTimerProps) {
  const [timeLeft, setTimeLeft] = useState(settings.workDuration * 60)
  const [isActive, setIsActive] = useState(false)
  const [sessionType, setSessionType] = useState<SessionType>('work')
  const [sessionsCompleted, setSessionsCompleted] = useState(0)
  const [totalTime, setTotalTime] = useState(settings.workDuration * 60)

  const getCurrentDuration = useCallback((type: SessionType) => {
    switch (type) {
      case 'work': return settings.workDuration * 60
      case 'shortBreak': return settings.shortBreakDuration * 60
      case 'longBreak': return settings.longBreakDuration * 60
    }
  }, [settings])

  const getSessionIcon = (type: SessionType) => {
    switch (type) {
      case 'work': return <Timer className="h-4 w-4" />
      case 'shortBreak': return <Coffee className="h-4 w-4" />
      case 'longBreak': return <Clock className="h-4 w-4" />
    }
  }

  const getSessionColor = (type: SessionType) => {
    switch (type) {
      case 'work': return 'bg-blue-500'
      case 'shortBreak': return 'bg-green-500'
      case 'longBreak': return 'bg-purple-500'
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const startNextSession = useCallback(() => {
    let nextType: SessionType
    let newSessionsCompleted = sessionsCompleted

    if (sessionType === 'work') {
      newSessionsCompleted += 1
      nextType = newSessionsCompleted % settings.sessionsUntilLongBreak === 0 
        ? 'longBreak' 
        : 'shortBreak'
    } else {
      nextType = 'work'
    }

    const duration = getCurrentDuration(nextType)
    setSessionType(nextType)
    setTimeLeft(duration)
    setTotalTime(duration)
    setSessionsCompleted(newSessionsCompleted)
    setIsActive(false)
  }, [sessionType, sessionsCompleted, settings.sessionsUntilLongBreak, getCurrentDuration])

  const resetTimer = () => {
    const duration = getCurrentDuration(sessionType)
    setTimeLeft(duration)
    setTotalTime(duration)
    setIsActive(false)
  }

  const toggleTimer = () => {
    setIsActive(!isActive)
  }

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(timeLeft => timeLeft - 1)
      }, 1000)
    } else if (timeLeft === 0) {
      onSessionComplete({
        type: sessionType,
        duration: totalTime,
        completed: true
      })
      startNextSession()
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isActive, timeLeft, onSessionComplete, sessionType, totalTime, startNextSession])

  const progress = ((totalTime - timeLeft) / totalTime) * 100

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center gap-2">
          {getSessionIcon(sessionType)}
          <span className="capitalize">{sessionType === 'shortBreak' ? 'Short Break' : sessionType === 'longBreak' ? 'Long Break' : 'Work Session'}</span>
        </CardTitle>
        <div className="flex justify-center gap-2 mt-2">
          <Badge variant="outline">
            Session {sessionsCompleted + 1}
          </Badge>
          <Badge 
            className={cn(
              "text-white",
              getSessionColor(sessionType)
            )}
          >
            {sessionType === 'work' ? 'Focus' : 'Break'}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="text-center">
          <div className="text-6xl font-mono font-bold mb-4">
            {formatTime(timeLeft)}
          </div>
          <Progress 
            value={progress} 
            className="h-2"
          />
        </div>

        <div className="flex justify-center gap-4">
          <Button
            onClick={toggleTimer}
            size="lg"
            className={cn(
              "px-8",
              isActive ? "bg-red-500 hover:bg-red-600" : getSessionColor(sessionType)
            )}
          >
            {isActive ? (
              <>
                <Pause className="h-4 w-4 mr-2" />
                Pause
              </>
            ) : (
              <>
                <Play className="h-4 w-4 mr-2" />
                Start
              </>
            )}
          </Button>

          <Button
            onClick={resetTimer}
            variant="outline"
            size="lg"
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset
          </Button>
        </div>

        <div className="text-center text-sm text-muted-foreground">
          <p>Sessions completed today: {sessionsCompleted}</p>
          {sessionType === 'work' && (
            <p>
              {settings.sessionsUntilLongBreak - (sessionsCompleted % settings.sessionsUntilLongBreak)} more until long break
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}