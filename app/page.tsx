"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { WelcomeScreen } from "@/components/welcome-screen"
import { PomodoroTimer } from "@/components/pomodoro-timer"
import { ActivityDetector } from "@/components/activity-detector"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Brain, Timer, Activity, BarChart3, Target, Zap, TrendingUp, Clock } from "lucide-react"
import { motion } from "framer-motion"
import toast from "react-hot-toast"

export default function HomePage() {
  const { data: session, status } = useSession()
  const [showWelcome, setShowWelcome] = useState(false)
  const [todayStats, setTodayStats] = useState({
    focusSessions: 0,
    totalFocusTime: 0,
    averageFocusScore: 0,
    activitiesTracked: 0,
  })

  useEffect(() => {
    // Check if user is new (you can implement this logic based on your needs)
    const hasSeenWelcome = localStorage.getItem("synapse-welcome-seen")
    if (session && !hasSeenWelcome) {
      setShowWelcome(true)
    }
  }, [session])

  const handleWelcomeComplete = () => {
    setShowWelcome(false)
    localStorage.setItem("synapse-welcome-seen", "true")
    toast.success("Welcome to Synapse! Let's start your cognitive enhancement journey.")
  }

  const handleSessionComplete = async (type: "work" | "break" | "long_break", duration: number) => {
    if (!session) return

    try {
      const response = await fetch("/api/focus-sessions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type,
          duration,
          completed: true,
        }),
      })

      if (response.ok) {
        setTodayStats((prev) => ({
          ...prev,
          focusSessions: prev.focusSessions + 1,
          totalFocusTime: prev.totalFocusTime + duration,
        }))
        toast.success(`${type === "work" ? "Work" : "Break"} session completed!`)
      }
    } catch (error) {
      console.error("Error saving focus session:", error)
    }
  }

  const handleActivityUpdate = async (metrics: any) => {
    if (!session) return

    try {
      await fetch("/api/activities", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          url: window.location.href,
          title: document.title,
          domain: window.location.hostname,
          ...metrics,
        }),
      })

      setTodayStats((prev) => ({
        ...prev,
        activitiesTracked: prev.activitiesTracked + 1,
        averageFocusScore: Math.round((prev.averageFocusScore + metrics.focusScore) / 2),
      }))
    } catch (error) {
      console.error("Error saving activity:", error)
    }
  }

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <Brain className="h-12 w-12 mx-auto text-primary animate-pulse" />
          <p className="text-muted-foreground">Loading Synapse...</p>
        </div>
      </div>
    )
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-4"
            >
              <div className="flex items-center justify-center space-x-2">
                <Brain className="h-16 w-16 text-primary" />
                <span className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Synapse
                </span>
              </div>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Your personal cognitive learning acceleration platform. Enhance your focus, track your progress, and
                unlock your learning potential with AI-powered insights.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto"
            >
              <Card className="text-center">
                <CardHeader>
                  <Timer className="h-8 w-8 mx-auto text-blue-500" />
                  <CardTitle>Smart Focus Sessions</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Intelligent Pomodoro timer that adapts to your productivity patterns
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardHeader>
                  <Activity className="h-8 w-8 mx-auto text-green-500" />
                  <CardTitle>Real-time Tracking</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Automatic detection of typing, scrolling, and engagement patterns
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardHeader>
                  <BarChart3 className="h-8 w-8 mx-auto text-purple-500" />
                  <CardTitle>Learning Analytics</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Comprehensive insights into your learning progress and cognitive growth
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.8 }}
              className="space-y-4"
            >
              <div className="flex flex-wrap justify-center gap-2">
                <Badge variant="secondary">
                  <Zap className="h-3 w-3 mr-1" />
                  AI-Powered
                </Badge>
                <Badge variant="secondary">
                  <Target className="h-3 w-3 mr-1" />
                  Focus Enhancement
                </Badge>
                <Badge variant="secondary">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  Progress Tracking
                </Badge>
              </div>

              <div className="space-x-4">
                <Button size="lg" asChild>
                  <a href="/auth/signup">Get Started Free</a>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <a href="/auth/signin">Sign In</a>
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    )
  }

  if (showWelcome) {
    return <WelcomeScreen onGetStarted={handleWelcomeComplete} userName={session.user?.name || undefined} />
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold">Welcome back, {session.user?.name || "there"}!</h1>
          <p className="text-muted-foreground">Ready to enhance your cognitive performance today?</p>
        </div>

        {/* Today's Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Focus Sessions</CardTitle>
              <Timer className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{todayStats.focusSessions}</div>
              <p className="text-xs text-muted-foreground">
                {Math.round(todayStats.totalFocusTime / 60)} minutes total
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Focus Score</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{todayStats.averageFocusScore}%</div>
              <p className="text-xs text-muted-foreground">Average today</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Activities</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{todayStats.activitiesTracked}</div>
              <p className="text-xs text-muted-foreground">Tracked today</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Streak</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1</div>
              <p className="text-xs text-muted-foreground">Day streak</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="focus" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="focus">Focus Session</TabsTrigger>
            <TabsTrigger value="activity">Activity Monitor</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="focus" className="space-y-6">
            <div className="flex justify-center">
              <PomodoroTimer onSessionComplete={handleSessionComplete} />
            </div>
          </TabsContent>

          <TabsContent value="activity" className="space-y-6">
            <div className="flex justify-center">
              <ActivityDetector onActivityUpdate={handleActivityUpdate} />
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Weekly Progress</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8 text-muted-foreground">
                    <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Analytics coming soon...</p>
                    <p className="text-sm">Complete more sessions to see your progress</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Learning Insights</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8 text-muted-foreground">
                    <Brain className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>AI insights coming soon...</p>
                    <p className="text-sm">More data needed for personalized insights</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
