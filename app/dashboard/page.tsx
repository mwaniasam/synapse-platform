"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Brain, BookOpen, TrendingUp, Clock, Target, Zap, Calendar, Award } from "lucide-react"
import Link from "next/link"

interface FocusSession {
  id: string
  topic: string
  startTime: string
  endTime?: string
  duration?: number
  focusScore: number
  completed: boolean
}

export default function Dashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [sessions, setSessions] = useState<FocusSession[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin")
    }
  }, [status, router])

  useEffect(() => {
    if (session) {
      fetchSessions()
    }
  }, [session])

  const fetchSessions = async () => {
    try {
      const response = await fetch("/api/sessions")
      if (response.ok) {
        const data = await response.json()
        setSessions(data.sessions || [])
      }
    } catch (error) {
      console.error("Failed to fetch sessions:", error)
    } finally {
      setLoading(false)
    }
  }

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  const totalSessions = sessions.length
  const completedSessions = sessions.filter((s) => s.completed).length
  const averageFocusScore =
    sessions.length > 0 ? Math.round(sessions.reduce((sum, s) => sum + s.focusScore, 0) / sessions.length) : 0
  const totalLearningTime = sessions.reduce((sum, s) => sum + (s.duration || 0), 0)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Welcome back, {session.user?.name?.split(" ")[0]}! 👋
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Ready to continue your learning journey? Let's see how you're progressing.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <Link href="/learn">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Start Learning</h3>
                    <p className="text-blue-100">Begin a new AI-powered learning session</p>
                  </div>
                  <Brain className="h-12 w-12 text-blue-100" />
                </div>
              </CardContent>
            </Card>
          </Link>

          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-semibold mb-2">Continue Session</h3>
                  <p className="text-muted-foreground">Resume your last learning session</p>
                </div>
                <BookOpen className="h-12 w-12 text-green-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Sessions</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalSessions}</div>
              <p className="text-xs text-muted-foreground">{completedSessions} completed</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Focus Score</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{averageFocusScore}/100</div>
              <Progress value={averageFocusScore} className="mt-2" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Learning Time</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{Math.round(totalLearningTime / 60)}m</div>
              <p className="text-xs text-muted-foreground">This week</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Streak</CardTitle>
              <Award className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3</div>
              <p className="text-xs text-muted-foreground">Days in a row</p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Sessions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Recent Sessions
              </CardTitle>
              <CardDescription>Your latest learning activities</CardDescription>
            </CardHeader>
            <CardContent>
              {sessions.length === 0 ? (
                <div className="text-center py-8">
                  <Brain className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No sessions yet</p>
                  <p className="text-sm text-muted-foreground mb-4">
                    Start your first learning session to see your progress here
                  </p>
                  <Link href="/learn">
                    <Button>Start Learning</Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {sessions.slice(0, 5).map((session) => (
                    <div key={session.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-medium">{session.topic}</h4>
                        <p className="text-sm text-muted-foreground">
                          {new Date(session.startTime).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={session.completed ? "default" : "secondary"}>
                          {session.completed ? "Completed" : "In Progress"}
                        </Badge>
                        <div className="text-sm font-medium">{Math.round(session.focusScore)}/100</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Learning Insights
              </CardTitle>
              <CardDescription>AI-powered recommendations for you</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">🎯 Focus Improvement</h4>
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  Your focus score has improved by 15% this week! Try learning during your peak hours (2-4 PM) for even
                  better results.
                </p>
              </div>

              <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <h4 className="font-medium text-green-900 dark:text-green-100 mb-2">📚 Recommended Topics</h4>
                <p className="text-sm text-green-800 dark:text-green-200">
                  Based on your interests, try exploring "Machine Learning Fundamentals" or "Data Structures".
                </p>
              </div>

              <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <h4 className="font-medium text-purple-900 dark:text-purple-100 mb-2">⚡ Cognitive State</h4>
                <p className="text-sm text-purple-800 dark:text-purple-200">
                  You learn best when in a "curious" state. The AI will adapt content to maintain this optimal learning
                  zone.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
