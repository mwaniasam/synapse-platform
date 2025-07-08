"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Activity, Clock, Target, TrendingUp, Zap, BookOpen, Brain, Timer } from "lucide-react"

interface MetricsOverviewProps {
  data: {
    todayPages: number
    todayReading: number
    todayFocus: number
    todayProductivity: number
    currentStreak: number
    typingSpeed: number
    activityLevel: string
    sessionTime: number
  }
}

export function MetricsOverview({ data }: MetricsOverviewProps) {
  const getActivityColor = (level: string) => {
    switch (level) {
      case "high":
        return "bg-green-500"
      case "medium":
        return "bg-yellow-500"
      case "low":
        return "bg-orange-500"
      default:
        return "bg-gray-500"
    }
  }

  const getActivityText = (level: string) => {
    switch (level) {
      case "high":
        return "Highly Active"
      case "medium":
        return "Active"
      case "low":
        return "Reading"
      default:
        return "Idle"
    }
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Today's Pages</CardTitle>
          <BookOpen className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{data.todayPages}</div>
          <p className="text-xs text-muted-foreground">+12% from yesterday</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Reading Time</CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {Math.floor(data.todayReading / 60)}h {data.todayReading % 60}m
          </div>
          <p className="text-xs text-muted-foreground">Goal: 8h daily</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Focus Score</CardTitle>
          <Target className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{data.todayFocus}%</div>
          <p className="text-xs text-muted-foreground">+5% from last week</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Productivity</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{data.todayProductivity}%</div>
          <p className="text-xs text-muted-foreground">Above average</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Current Streak</CardTitle>
          <Zap className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{data.currentStreak}</div>
          <p className="text-xs text-muted-foreground">days in a row</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Typing Speed</CardTitle>
          <Activity className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{data.typingSpeed}</div>
          <p className="text-xs text-muted-foreground">WPM average</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Activity Level</CardTitle>
          <Brain className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${getActivityColor(data.activityLevel)}`} />
            <span className="text-sm font-medium">{getActivityText(data.activityLevel)}</span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">Real-time status</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Session Time</CardTitle>
          <Timer className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{Math.floor(data.sessionTime / 60)}m</div>
          <p className="text-xs text-muted-foreground">Current session</p>
        </CardContent>
      </Card>
    </div>
  )
}
