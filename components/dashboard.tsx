"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Brain, Zap, Target, TrendingUp, Play, Pause, Settings, LogOut, Moon, Sun } from "lucide-react"
import { useAuth } from "@/components/auth-provider"
import { useTheme } from "next-themes"
import { CognitiveStateIndicator } from "@/components/cognitive-state-indicator"
import { KnowledgeGraph } from "@/components/knowledge-graph"
import { LearningSession } from "@/components/learning-session"
import { AIAssistant } from "@/components/ai-assistant"
import { useToast } from "@/hooks/use-toast"
import Image from "next/image"

export function Dashboard() {
  const { user, logout } = useAuth()
  const { theme, setTheme } = useTheme()
  const { toast } = useToast()
  const [currentSession, setCurrentSession] = useState<any>(null)
  const [cognitiveState, setCognitiveState] = useState<"focused" | "fatigued" | "distracted" | "receptive">("focused")
  const [sessionStats, setSessionStats] = useState({
    totalSessions: 12,
    totalHours: 48,
    conceptsLearned: 156,
    averageFocus: 78,
  })

  const startSession = () => {
    const newSession = {
      id: Date.now().toString(),
      startTime: new Date(),
      subject: "General Learning",
      goals: ["Improve focus", "Learn new concepts"],
    }
    setCurrentSession(newSession)
    toast({
      title: "Learning session started",
      description: "Your cognitive patterns are now being monitored.",
    })
  }

  const endSession = () => {
    if (currentSession) {
      setCurrentSession(null)
      toast({
        title: "Session completed",
        description: "Great work! Your learning data has been saved.",
      })
    }
  }

  // Simulate cognitive state changes
  useEffect(() => {
    const interval = setInterval(() => {
      const states: Array<"focused" | "fatigued" | "distracted" | "receptive"> = [
        "focused",
        "fatigued",
        "distracted",
        "receptive",
      ]
      setCognitiveState(states[Math.floor(Math.random() * states.length)])
    }, 10000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900">
      {/* Header */}
      <header className="border-b bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <Brain className="h-8 w-8 text-blue-600 animate-pulse-glow" />
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Synapse
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">Welcome back, {user?.name}</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <CognitiveStateIndicator state={cognitiveState} />
            <Button variant="ghost" size="icon" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
              {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
            <Button variant="ghost" size="icon">
              <Settings className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" onClick={logout}>
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Hero Section with Brain Image */}
        <div className="mb-8 text-center">
          <div className="relative max-w-md mx-auto mb-6">
            <Image
              src="/brain-hero.jpeg"
              alt="Your learning brain"
              width={400}
              height={250}
              className="rounded-2xl shadow-lg animate-float"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-2xl"></div>
          </div>
          <h2 className="text-3xl font-bold mb-2 text-gray-800 dark:text-gray-200">Your Learning Command Center</h2>
          <p className="text-gray-600 dark:text-gray-400">
            Monitor your cognitive patterns and accelerate your learning journey
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="hover:shadow-lg transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Sessions</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{sessionStats.totalSessions}</div>
              <p className="text-xs text-muted-foreground">+2 from last week</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Learning Hours</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{sessionStats.totalHours}h</div>
              <p className="text-xs text-muted-foreground">+8h from last week</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Concepts Learned</CardTitle>
              <Brain className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{sessionStats.conceptsLearned}</div>
              <p className="text-xs text-muted-foreground">+23 from last week</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Focus</CardTitle>
              <Zap className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{sessionStats.averageFocus}%</div>
              <Progress value={sessionStats.averageFocus} className="mt-2" />
            </CardContent>
          </Card>
        </div>

        {/* Session Control */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Play className="h-5 w-5" />
              <span>Learning Session</span>
            </CardTitle>
            <CardDescription>Start a focused learning session with cognitive monitoring</CardDescription>
          </CardHeader>
          <CardContent>
            {currentSession ? (
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Session Active</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Started at {new Date(currentSession.startTime).toLocaleTimeString()}
                  </p>
                </div>
                <Button onClick={endSession} variant="destructive">
                  <Pause className="h-4 w-4 mr-2" />
                  End Session
                </Button>
              </div>
            ) : (
              <Button onClick={startSession} className="w-full">
                <Play className="h-4 w-4 mr-2" />
                Start Learning Session
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Main Content Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="knowledge">Knowledge Map</TabsTrigger>
            <TabsTrigger value="sessions">Sessions</TabsTrigger>
            <TabsTrigger value="ai-assistant">AI Assistant</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Cognitive State History</CardTitle>
                  <CardDescription>Your focus patterns over the last 7 days</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Focused</span>
                      <div className="flex items-center space-x-2">
                        <Progress value={75} className="w-24" />
                        <span className="text-sm">75%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Receptive</span>
                      <div className="flex items-center space-x-2">
                        <Progress value={60} className="w-24" />
                        <span className="text-sm">60%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Fatigued</span>
                      <div className="flex items-center space-x-2">
                        <Progress value={25} className="w-24" />
                        <span className="text-sm">25%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Distracted</span>
                      <div className="flex items-center space-x-2">
                        <Progress value={15} className="w-24" />
                        <span className="text-sm">15%</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Achievements</CardTitle>
                  <CardDescription>Your learning milestones</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <Badge variant="secondary">New</Badge>
                      <span className="text-sm">Completed 10 focused sessions</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Badge variant="secondary">Achievement</Badge>
                      <span className="text-sm">Learned 50 new concepts this week</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Badge variant="secondary">Milestone</Badge>
                      <span className="text-sm">Maintained 80%+ focus for 5 days</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="knowledge">
            <KnowledgeGraph />
          </TabsContent>

          <TabsContent value="sessions">
            <LearningSession />
          </TabsContent>

          <TabsContent value="ai-assistant">
            <AIAssistant />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
