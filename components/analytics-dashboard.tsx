"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts"
import { TrendingUp, Clock, Brain, Target, Award, Calendar, BookOpen, Zap } from "lucide-react"

interface AnalyticsData {
  totalFocusTime: number
  averageSessionDuration: number
  conceptsLearned: number
  productivityScore: number
  cognitiveStateBreakdown: Record<string, number>
  improvementAreas: string[]
  recommendations: string[]
}

interface WeeklyTrend {
  date: string
  focusTime: number
  productivity: number
  concepts: number
}

interface MonthlyInsights {
  totalFocusTime: number
  totalConcepts: number
  avgProductivity: number
  activeDays: number
  streak: number
}

export default function AnalyticsDashboard() {
  const [dailyData, setDailyData] = useState<AnalyticsData | null>(null)
  const [weeklyData, setWeeklyData] = useState<WeeklyTrend[]>([])
  const [monthlyData, setMonthlyData] = useState<MonthlyInsights | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAnalytics()
  }, [])

  const fetchAnalytics = async () => {
    try {
      const [dailyRes, weeklyRes, monthlyRes] = await Promise.all([
        fetch("/api/analytics?period=daily"),
        fetch("/api/analytics?period=weekly"),
        fetch("/api/analytics?period=monthly"),
      ])

      if (dailyRes.ok) setDailyData(await dailyRes.json())
      if (weeklyRes.ok) setWeeklyData(await weeklyRes.json())
      if (monthlyRes.ok) setMonthlyData(await monthlyRes.json())
    } catch (error) {
      console.error("Failed to fetch analytics:", error)
    } finally {
      setLoading(false)
    }
  }

  const cognitiveStateColors = {
    focused: "#10b981",
    receptive: "#3b82f6",
    distracted: "#f59e0b",
    fatigued: "#ef4444",
  }

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`
  }

  if (loading) {
    return (
      <div className="space-y-6">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardContent className="h-32 flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Focus Time Today</p>
                <p className="text-2xl font-bold">{formatTime(dailyData?.totalFocusTime || 0)}</p>
              </div>
              <Clock className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Productivity Score</p>
                <p className="text-2xl font-bold">{dailyData?.productivityScore || 0}%</p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Concepts Learned</p>
                <p className="text-2xl font-bold">{dailyData?.conceptsLearned || 0}</p>
              </div>
              <BookOpen className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Learning Streak</p>
                <p className="text-2xl font-bold">{monthlyData?.streak || 0} days</p>
              </div>
              <Award className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="daily" className="space-y-4">
        <TabsList>
          <TabsTrigger value="daily">Today</TabsTrigger>
          <TabsTrigger value="weekly">This Week</TabsTrigger>
          <TabsTrigger value="monthly">This Month</TabsTrigger>
        </TabsList>

        <TabsContent value="daily" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Cognitive State Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="w-5 h-5" />
                  Cognitive State Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                {dailyData?.cognitiveStateBreakdown ? (
                  <div className="space-y-3">
                    {Object.entries(dailyData.cognitiveStateBreakdown).map(([state, count]) => (
                      <div key={state} className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span className="capitalize">{state}</span>
                          <span>{count} sessions</span>
                        </div>
                        <Progress
                          value={
                            (count / Object.values(dailyData.cognitiveStateBreakdown).reduce((a, b) => a + b, 0)) * 100
                          }
                          className="h-2"
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-center py-8">No data available</p>
                )}
              </CardContent>
            </Card>

            {/* Recommendations */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  Recommendations
                </CardTitle>
              </CardHeader>
              <CardContent>
                {dailyData?.recommendations?.length ? (
                  <div className="space-y-3">
                    {dailyData.recommendations.map((rec, index) => (
                      <div key={index} className="p-3 bg-muted/50 rounded-lg">
                        <p className="text-sm">{rec}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-center py-8">
                    Keep learning to get personalized recommendations!
                  </p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Improvement Areas */}
          {dailyData?.improvementAreas?.length && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="w-5 h-5" />
                  Areas for Improvement
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {dailyData.improvementAreas.map((area, index) => (
                    <Badge key={index} variant="outline">
                      {area.replace(/_/g, " ")}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="weekly" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Weekly Learning Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={weeklyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="focusTime" stroke="#3b82f6" strokeWidth={2} name="Focus Time (min)" />
                  <Line type="monotone" dataKey="productivity" stroke="#10b981" strokeWidth={2} name="Productivity %" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="monthly" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-6 text-center">
                <Calendar className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">Active Days</p>
                <p className="text-2xl font-bold">{monthlyData?.activeDays || 0}</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <Clock className="w-8 h-8 text-green-500 mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">Total Focus Time</p>
                <p className="text-2xl font-bold">{formatTime(monthlyData?.totalFocusTime || 0)}</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <BookOpen className="w-8 h-8 text-purple-500 mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">Concepts Mastered</p>
                <p className="text-2xl font-bold">{monthlyData?.totalConcepts || 0}</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
