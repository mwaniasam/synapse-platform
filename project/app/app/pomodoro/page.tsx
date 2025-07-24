"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import { redirect } from "next/navigation"
import { PomodoroTimer } from "@/components/pomodoro/timer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Timer, Brain, Target, TrendingUp, Settings } from "lucide-react"
import Link from "next/link"

type SessionType = 'work' | 'shortBreak' | 'longBreak'

export default function PomodoroPage() {
  const { data: session, status } = useSession()
  const [todaySessions, setTodaySessions] = useState([
    // Empty array - sessions will be added as user completes them
  ] as Array<{ type: SessionType; completed: boolean; focusScore: number | null }>)

  const [weeklyStats] = useState({
    totalSessions: 0,
    averageFocus: 0,
    longestStreak: 0,
    totalTime: 0 // minutes
  })

  if (status === "loading") {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  if (!session) {
    redirect("/auth/signin")
  }

  // Default settings - would come from user preferences in real app
  const settings = {
    workDuration: 25,
    shortBreakDuration: 5,
    longBreakDuration: 15,
    sessionsUntilLongBreak: 4
  }

  const handleSessionComplete = (sessionData: {
    type: SessionType
    duration: number
    completed: boolean
  }) => {
    // In a real app, you'd save this to the database
    console.log("Session completed:", sessionData)
    
    // Add to today's sessions
    setTodaySessions(prev => [...prev, {
      type: sessionData.type,
      completed: sessionData.completed,
      focusScore: sessionData.type === 'work' ? Math.floor(Math.random() * 20) + 80 : null
    }])
  }

  const workSessions = todaySessions.filter(s => s.type === 'work' && s.completed)
  const dailyGoal = 6
  const dailyProgress = (workSessions.length / dailyGoal) * 100

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Timer className="h-8 w-8 text-primary" />
            Pomodoro Timer
          </h1>
          <p className="text-muted-foreground mt-2">
            Optimize your focus with AI-powered productivity sessions
          </p>
        </div>
        
        <Button variant="outline" asChild>
          <Link href="/app/settings">
            <Settings className="h-4 w-4 mr-2" />
            Customize Timer
          </Link>
        </Button>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Timer Section */}
        <div className="lg:col-span-2 space-y-6">
          <PomodoroTimer 
            settings={settings}
            onSessionComplete={handleSessionComplete}
          />
          
          {/* Today's Sessions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Today's Progress
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm">Work Sessions: {workSessions.length}/{dailyGoal}</span>
                <Badge variant={workSessions.length >= dailyGoal ? "default" : "secondary"}>
                  {Math.round(dailyProgress)}%
                </Badge>
              </div>
              <Progress value={dailyProgress} className="h-2" />
              
              <div className="flex flex-wrap gap-2">
                {todaySessions.map((session, index) => (
                  <div
                    key={index}
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs ${
                      session.type === 'work' 
                        ? 'bg-blue-500 text-white' 
                        : session.type === 'shortBreak'
                        ? 'bg-green-500 text-white'
                        : 'bg-purple-500 text-white'
                    }`}
                    title={`${session.type} - ${session.completed ? 'completed' : 'in progress'}`}
                  >
                    {session.type === 'work' ? 'W' : session.type === 'shortBreak' ? 'S' : 'L'}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Stats Sidebar */}
        <div className="space-y-6">
          {/* Weekly Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Weekly Stats
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Total Sessions</span>
                  <span className="font-medium">{weeklyStats.totalSessions}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Average Focus</span>
                  <span className="font-medium">{weeklyStats.averageFocus}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Longest Streak</span>
                  <span className="font-medium">{weeklyStats.longestStreak} days</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Total Time</span>
                  <span className="font-medium">{Math.floor(weeklyStats.totalTime / 60)}h {weeklyStats.totalTime % 60}m</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Focus Insights */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5" />
                AI Insights
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                <p className="text-sm">
                  <strong>Peak Focus:</strong> Your concentration is highest between 10-11 AM. 
                  Consider scheduling challenging tasks during this time.
                </p>
              </div>
              <div className="p-3 bg-green-50 dark:bg-green-950/20 rounded-lg">
                <p className="text-sm">
                  <strong>Improvement:</strong> Your focus score increased by 12% this week. 
                  Keep up the great work!
                </p>
              </div>
              <div className="p-3 bg-orange-50 dark:bg-orange-950/20 rounded-lg">
                <p className="text-sm">
                  <strong>Recommendation:</strong> Try extending work sessions to 30 minutes 
                  based on your attention patterns.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}