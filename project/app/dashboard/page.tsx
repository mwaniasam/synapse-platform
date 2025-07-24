"use client"

import { useSession } from "next-auth/react"
import { redirect } from "next/navigation"
import { StatsCards } from "@/components/dashboard/stats-cards"
import { LearningProgress } from "@/components/dashboard/learning-progress"
import { CognitiveStateIndicator } from "@/components/cognitive/cognitive-state-indicator"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { 
  Brain, 
  Timer, 
  BookOpen, 
  Target, 
  TrendingUp, 
  Zap,
  Clock,
  Sparkles,
  Rocket
} from "lucide-react"
import Link from "next/link"

export default function Dashboard() {
  const { data: session, status } = useSession()

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-muted-foreground">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  if (!session) {
    redirect("/auth/signin")
  }

  // Mock data - replace with real data from your API
  const stats = {
    totalStudyTime: 0, // minutes
    completedSessions: 0,
    resourcesCompleted: 0,
    currentStreak: 0,
    averageFocus: 0,
    comprehensionScore: 0
  }

  const recentResources: any[] = []

  const todayGoal = {
    target: 4, // sessions
    completed: 0,
    timeRemaining: 0 // minutes
  }

  const recentActivity: any[] = []

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <div className="container mx-auto py-12 space-y-12">
      {/* Welcome Section */}
        <div className="glass-card rounded-3xl p-8 border-0 shadow-2xl">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-accent/20 rounded-2xl flex items-center justify-center">
                  <Sparkles className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold gradient-text">
                    Welcome back, {session.user?.name || 'Learner'}!
                  </h1>
                  <p className="text-muted-foreground text-lg">
                    Ready to continue your learning journey?
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex gap-4 mt-6 md:mt-0">
              <Button size="lg" className="px-6 py-3 rounded-2xl glow-effect hover:scale-105 transition-all duration-300" asChild>
                <Link href="/app/pomodoro">
                  <Timer className="h-5 w-5 mr-2" />
                  Start Session
                </Link>
              </Button>
              <Button variant="outline" size="lg" className="px-6 py-3 rounded-2xl border-2 hover:scale-105 transition-all duration-300" asChild>
                <Link href="/app/resources">
                  <BookOpen className="h-5 w-5 mr-2" />
                  Browse Resources
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Cognitive State Section */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Brain className="h-6 w-6 text-primary" />
            Your Cognitive State
          </h2>
          <CognitiveStateIndicator showDetails={true} />
        </div>

      {/* Stats Cards */}
      <StatsCards stats={stats} />

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {/* Daily Goal */}
          <Card className="glass-card border-0 shadow-xl hover:shadow-2xl transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-xl">
                <div className="w-10 h-10 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-xl flex items-center justify-center">
                  <Target className="h-5 w-5 text-green-600" />
                </div>
                Today's Goal
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <div className="flex justify-between text-sm font-medium">
                  <span>Study Sessions</span>
                  <span>{todayGoal.completed}/{todayGoal.target}</span>
                </div>
                <Progress value={(todayGoal.completed / todayGoal.target) * 100} className="h-3 rounded-full" />
              </div>
            
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                Ready to start your first session
              </div>
            
              <Button className="w-full rounded-xl py-3 hover:scale-105 transition-all duration-300" asChild>
                <Link href="/app/pomodoro">
                  <Rocket className="h-4 w-4 mr-2" />
                  Start Learning
                </Link>
              </Button>
            </CardContent>
          </Card>

        {/* Learning Progress */}
        <LearningProgress recentResources={recentResources} />

        {/* Recent Activity */}
          <Card className="glass-card border-0 shadow-xl hover:shadow-2xl transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-xl">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500/20 to-indigo-500/20 rounded-xl flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 text-purple-600" />
                </div>
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center py-12 text-muted-foreground">
                <div className="w-16 h-16 bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="h-8 w-8 text-primary" />
                </div>
                <p className="text-lg font-medium mb-2">No activity yet</p>
                <p className="text-sm">Your learning activities will appear here</p>
              </div>
            </CardContent>
          </Card>
        </div>

      {/* Quick Actions */}
        <Card className="glass-card border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <Button variant="outline" className="h-24 flex-col gap-3 rounded-2xl border-2 hover:scale-105 transition-all duration-300 group" asChild>
                <Link href="/app/pomodoro">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Timer className="h-6 w-6 text-blue-600" />
                  </div>
                  <span className="font-medium">Start Pomodoro</span>
                </Link>
              </Button>
            
              <Button variant="outline" className="h-24 flex-col gap-3 rounded-2xl border-2 hover:scale-105 transition-all duration-300 group" asChild>
                <Link href="/app/resources">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <BookOpen className="h-6 w-6 text-green-600" />
                  </div>
                  <span className="font-medium">Browse Resources</span>
                </Link>
              </Button>
            
              <Button variant="outline" className="h-24 flex-col gap-3 rounded-2xl border-2 hover:scale-105 transition-all duration-300 group" asChild>
                <Link href="/cognitive">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500/20 to-indigo-500/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Brain className="h-6 w-6 text-purple-600" />
                  </div>
                  <span className="font-medium">Cognitive Tests</span>
                </Link>
              </Button>
            
              <Button variant="outline" className="h-24 flex-col gap-3 rounded-2xl border-2 hover:scale-105 transition-all duration-300 group" asChild>
                <Link href="/app/knowledge-map">
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Zap className="h-6 w-6 text-orange-600" />
                  </div>
                  <span className="font-medium">Knowledge Map</span>
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
          </div>
  )
}