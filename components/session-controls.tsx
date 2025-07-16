"use client"

import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { motion } from "framer-motion"
import { Play, Pause, RotateCcw, Timer } from "lucide-react"
import { useState, useEffect, useRef } from "react"

interface SessionControlsProps {
  onStart: () => void
  onPause: () => void
  onReset: () => void
  onEndSession: () => void
}

export function SessionControls({ onStart, onPause, onReset, onEndSession }: SessionControlsProps) {
  const [isRunning, setIsRunning] = useState(false)
  const [timeElapsed, setTimeElapsed] = useState(0)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [])

  const startTimer = () => {
    setIsRunning(true)
    onStart()
    const startTime = Date.now() - timeElapsed
    intervalRef.current = setInterval(() => {
      setTimeElapsed(Date.now() - startTime)
    }, 1000) // Update every second
  }

  const pauseTimer = () => {
    setIsRunning(false)
    onPause()
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }
  }

  const resetTimer = () => {
    pauseTimer()
    setTimeElapsed(0)
    onReset()
  }

  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000)
    const minutes = Math.floor(totalSeconds / 60)
    const seconds = totalSeconds % 60
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
  }

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  }

  return (
    <motion.div variants={cardVariants} initial="hidden" animate="visible">
      <Card className="w-full bg-gradient-to-br from-yellow-50 to-orange-50 shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-lg font-semibold text-gray-800">Focus Session</CardTitle>
          <Timer className="h-6 w-6 text-orange-600" />
        </CardHeader>
        <CardContent className="space-y-4 text-center">
          <div className="text-5xl font-bold text-gray-900 tabular-nums">{formatTime(timeElapsed)}</div>
          <div className="flex justify-center gap-4">
            <Button onClick={isRunning ? pauseTimer : startTimer} className="bg-orange-500 hover:bg-orange-600">
              {isRunning ? <Pause className="h-5 w-5 mr-2" /> : <Play className="h-5 w-5 mr-2" />}
              {isRunning ? "Pause" : "Start"}
            </Button>
            <Button
              onClick={resetTimer}
              variant="outline"
              className="border-orange-500 text-orange-500 hover:bg-orange-50 hover:text-orange-600 bg-transparent"
            >
              <RotateCcw className="h-5 w-5 mr-2" /> Reset
            </Button>
          </div>
          <Button onClick={onEndSession} className="w-full bg-purple-600 hover:bg-purple-700 mt-4">
            End Session
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  )
}
