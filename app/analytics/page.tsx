"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Brain, Clock, Target, PieChart, Activity, Play } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Navigation from "@/components/navigation"
import CognitiveChart from "@/components/cognitive-chart"
import ProductivityChart from "@/components/productivity-chart"

export default function Analytics() {
  const router = useRouter()

  useEffect(() => {
    const isAuthenticated = localStorage.getItem("synapse_auth")
    if (!isAuthenticated) {
      router.push("/auth")
    }
  }, [router])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Navigation />

      <main className="container mx-auto px-6 py-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Cognitive Analytics</h1>
            <p className="text-gray-600">Deep insights into your learning patterns and cognitive performance</p>
          </div>

          <div className="flex gap-3">
            <Select defaultValue="week" disabled>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="day">Today</SelectItem>
                <SelectItem value="week">This Week</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
                <SelectItem value="quarter">This Quarter</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Key Metrics - All Zero */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Avg Focus Duration</p>
                  <p className="text-2xl font-bold text-gray-900">0m</p>
                  <p className="text-xs text-gray-500 flex items-center mt-1">No data yet</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Clock className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Productivity Score</p>
                  <p className="text-2xl font-bold text-gray-900">0</p>
                  <p className="text-xs text-gray-500 flex items-center mt-1">Start learning to track</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Target className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Concepts Learned</p>
                  <p className="text-2xl font-bold text-gray-900">0</p>
                  <p className="text-xs text-gray-500 flex items-center mt-1">Begin your journey</p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Brain className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Peak Hours</p>
                  <p className="text-2xl font-bold text-gray-900">--</p>
                  <p className="text-xs text-gray-500 flex items-center mt-1">Data pending</p>
                </div>
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <PieChart className="w-6 h-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Empty State Notice */}
        <div className="mb-8">
          <Card className="border-0 shadow-lg bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <Brain className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-blue-900 mb-2">Start Your Cognitive Journey</h3>
                  <p className="text-blue-700 mb-4">
                    Your analytics dashboard will populate with insights as you use Synapse Learning Pro. Complete your
                    setup and start learning to see your cognitive patterns emerge.
                  </p>
                  <div className="flex gap-3">
                    <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
                      <Play className="w-4 h-4 mr-2" />
                      Start Learning Session
                    </Button>
                    <Button variant="outline">Complete Setup</Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Grid - Empty State */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <CognitiveChart />
          <ProductivityChart />
        </div>

        {/* Detailed Analytics - Empty States */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Cognitive State Distribution - Empty */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="w-5 h-5 text-primary" />
                Cognitive States
              </CardTitle>
              <CardDescription>Distribution over the past week</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <div className="w-16 h-16 bg-muted/50 rounded-full flex items-center justify-center mb-4">
                <Brain className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="font-semibold mb-2">No Cognitive Data</h3>
              <p className="text-sm text-muted-foreground text-center mb-4">
                Start using Synapse to track your cognitive states and see patterns emerge.
              </p>
              <Badge variant="outline" className="text-xs">
                Data will appear after first session
              </Badge>
            </CardContent>
          </Card>

          {/* Learning Patterns - Empty */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-primary" />
                Learning Patterns
              </CardTitle>
              <CardDescription>Your optimal learning times</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <div className="w-16 h-16 bg-muted/50 rounded-full flex items-center justify-center mb-4">
                <Activity className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="font-semibold mb-2">No Patterns Yet</h3>
              <p className="text-sm text-muted-foreground text-center mb-4">
                We'll identify your optimal learning times after you complete a few sessions.
              </p>
              <Badge variant="outline" className="text-xs">
                Requires 3+ learning sessions
              </Badge>
            </CardContent>
          </Card>

          {/* Recommendations - Empty */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5 text-primary" />
                Recommendations
              </CardTitle>
              <CardDescription>Personalized insights for improvement</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <div className="w-16 h-16 bg-muted/50 rounded-full flex items-center justify-center mb-4">
                <Target className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="font-semibold mb-2">No Insights Available</h3>
              <p className="text-sm text-muted-foreground text-center mb-4">
                Personalized recommendations will appear as we learn about your cognitive patterns.
              </p>
              <Badge variant="outline" className="text-xs">
                AI insights coming soon
              </Badge>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
