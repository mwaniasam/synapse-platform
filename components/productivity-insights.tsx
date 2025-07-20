"use client"

import type React from "react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Lightbulb, TrendingUp, Target, Award } from "lucide-react"

interface Insight {
  type: "tip" | "achievement" | "goal" | "trend"
  title: string
  description: string
  value?: number
  target?: number
  change?: number
  icon: React.ReactNode
}

export function ProductivityInsights() {
  const insights: Insight[] = [
    {
      type: "tip",
      title: "Peak Focus Time",
      description: "You're most focused between 10-11 AM. Schedule important tasks during this time.",
      icon: <Lightbulb className="h-4 w-4" />,
    },
    {
      type: "achievement",
      title: "Consistency Streak",
      description: "12 days of meeting your daily focus goal! Keep it up.",
      icon: <Award className="h-4 w-4" />,
    },
    {
      type: "trend",
      title: "Focus Improvement",
      description: "Your average focus score increased by 15% this week.",
      change: 15,
      icon: <TrendingUp className="h-4 w-4" />,
    },
    {
      type: "goal",
      title: "Weekly Target",
      description: "You're 75% towards your weekly learning goal.",
      value: 75,
      target: 100,
      icon: <Target className="h-4 w-4" />,
    },
  ]

  const getInsightColor = (type: string) => {
    switch (type) {
      case "tip":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
      case "achievement":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "trend":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
      case "goal":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    }
  }

  const getInsightBadge = (type: string) => {
    switch (type) {
      case "tip":
        return "Tip"
      case "achievement":
        return "Achievement"
      case "trend":
        return "Trend"
      case "goal":
        return "Goal"
      default:
        return "Insight"
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lightbulb className="h-5 w-5" />
          Productivity Insights
        </CardTitle>
        <CardDescription>AI-powered recommendations for better learning</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {insights.map((insight, index) => (
            <div key={index} className="p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors">
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-lg ${getInsightColor(insight.type)}`}>{insight.icon}</div>

                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium text-sm">{insight.title}</h4>
                    <Badge variant="outline" className="text-xs">
                      {getInsightBadge(insight.type)}
                    </Badge>
                  </div>

                  <p className="text-sm text-muted-foreground">{insight.description}</p>

                  {insight.type === "trend" && insight.change && (
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-3 w-3 text-green-500" />
                      <span className="text-xs text-green-600 dark:text-green-400 font-medium">
                        +{insight.change}% improvement
                      </span>
                    </div>
                  )}

                  {insight.type === "goal" && insight.value && insight.target && (
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span>Progress</span>
                        <span>{insight.value}%</span>
                      </div>
                      <Progress value={insight.value} className="h-1" />
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
