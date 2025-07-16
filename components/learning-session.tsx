"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Calendar, Clock, Target, TrendingUp, Play, Pause, Square } from "lucide-react"

interface SessionData {
  id: string
  date: string
  duration: number
  subject: string
  goals: string[]
  focusScore: number
  conceptsLearned: number
  status: "completed" | "in-progress" | "planned"
}

export function LearningSession() {
  const [sessions] = useState<SessionData[]>([
    {
      id: "1",
      date: "2024-01-15",
      duration: 120,
      subject: "Machine Learning",
      goals: ["Understand neural networks", "Practice coding"],
      focusScore: 85,
      conceptsLearned: 12,
      status: "completed",
    },
    {
      id: "2",
      date: "2024-01-14",
      duration: 90,
      subject: "Data Science",
      goals: ["Learn pandas", "Data visualization"],
      focusScore: 78,
      conceptsLearned: 8,
      status: "completed",
    },
    {
      id: "3",
      date: "2024-01-13",
      duration: 60,
      subject: "Python Programming",
      goals: ["Object-oriented programming"],
      focusScore: 92,
      conceptsLearned: 6,
      status: "completed",
    },
  ])

  const [newSession, setNewSession] = useState({
    subject: "",
    goals: "",
    duration: 60,
  })

  const [currentSession, setCurrentSession] = useState<any>(null)

  const startSession = () => {
    if (newSession.subject) {
      const session = {
        id: Date.now().toString(),
        startTime: new Date(),
        subject: newSession.subject,
        goals: newSession.goals.split(",").map((g) => g.trim()),
        duration: newSession.duration,
      }
      setCurrentSession(session)
    }
  }

  const endSession = () => {
    setCurrentSession(null)
    setNewSession({ subject: "", goals: "", duration: 60 })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "in-progress":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
      case "planned":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    }
  }

  return (
    <div className="space-y-6">
      {/* Session Control */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Play className="h-5 w-5" />
            <span>Start New Session</span>
          </CardTitle>
          <CardDescription>Configure and start a focused learning session</CardDescription>
        </CardHeader>
        <CardContent>
          {currentSession ? (
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-blue-800 dark:text-blue-200">
                    Session Active: {currentSession.subject}
                  </h3>
                  <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">In Progress</Badge>
                </div>
                <p className="text-sm text-blue-600 dark:text-blue-300 mb-3">
                  Started at {new Date(currentSession.startTime).toLocaleTimeString()}
                </p>
                <div className="space-y-2">
                  <div className="text-sm font-medium">Goals:</div>
                  <div className="flex flex-wrap gap-2">
                    {currentSession.goals.map((goal: string, index: number) => (
                      <Badge key={index} variant="outline">
                        {goal}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex space-x-2">
                <Button variant="outline">
                  <Pause className="h-4 w-4 mr-2" />
                  Pause
                </Button>
                <Button onClick={endSession} variant="destructive">
                  <Square className="h-4 w-4 mr-2" />
                  End Session
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Input
                    id="subject"
                    placeholder="e.g., Machine Learning"
                    value={newSession.subject}
                    onChange={(e) => setNewSession({ ...newSession, subject: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="duration">Duration (minutes)</Label>
                  <Input
                    id="duration"
                    type="number"
                    value={newSession.duration}
                    onChange={(e) => setNewSession({ ...newSession, duration: Number.parseInt(e.target.value) })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="goals">Goals (comma-separated)</Label>
                <Textarea
                  id="goals"
                  placeholder="e.g., Understand neural networks, Practice coding"
                  value={newSession.goals}
                  onChange={(e) => setNewSession({ ...newSession, goals: e.target.value })}
                />
              </div>
              <Button onClick={startSession} className="w-full" disabled={!newSession.subject}>
                <Play className="h-4 w-4 mr-2" />
                Start Learning Session
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Session History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="h-5 w-5" />
            <span>Session History</span>
          </CardTitle>
          <CardDescription>Review your past learning sessions and progress</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {sessions.map((session) => (
              <Card key={session.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="text-lg font-semibold">{session.subject}</div>
                      <Badge className={getStatusColor(session.status)}>{session.status}</Badge>
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">{session.date}</div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-3">
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-gray-400" />
                      <span className="text-sm">{session.duration} min</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Target className="h-4 w-4 text-gray-400" />
                      <span className="text-sm">{session.conceptsLearned} concepts</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <TrendingUp className="h-4 w-4 text-gray-400" />
                      <span className="text-sm">{session.focusScore}% focus</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Progress value={session.focusScore} className="w-16" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="text-sm font-medium">Goals achieved:</div>
                    <div className="flex flex-wrap gap-2">
                      {session.goals.map((goal, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {goal}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Session Analytics */}
      <Card>
        <CardHeader>
          <CardTitle>Session Analytics</CardTitle>
          <CardDescription>Insights from your learning sessions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {sessions.reduce((sum, s) => sum + s.duration, 0)} min
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Total Study Time</div>
            </div>
            <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                {Math.round(sessions.reduce((sum, s) => sum + s.focusScore, 0) / sessions.length)}%
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Average Focus Score</div>
            </div>
            <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {sessions.reduce((sum, s) => sum + s.conceptsLearned, 0)}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Concepts Learned</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
