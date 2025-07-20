"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, Minus } from "lucide-react"

interface MetricData {
  label: string
  value: number
  target: number
  change: number
  unit: string
}

export function MetricsOverview() {
  const metrics: MetricData[] = [
    {
      label: "Daily Goal",
      value: 6,
      target: 8,
      change: 12.5,
      unit: "sessions",
    },
    {
      label: "Focus Time",
      value: 165,
      target: 240,
      change: -5.2,
      unit: "minutes",
    },
    {
      label: "Productivity",
      value: 87,
      target: 90,
      change: 3.1,
      unit: "%",
    },
    {
      label: "Concepts",
      value: 23,
      target: 30,
      change: 8.7,
      unit: "learned",
    },
  ]

  const getTrendIcon = (change: number) => {
    if (change > 0) return <TrendingUp className="h-3 w-3 text-green-500" />
    if (change < 0) return <TrendingDown className="h-3 w-3 text-red-500" />
    return <Minus className="h-3 w-3 text-gray-500" />
  }

  const getTrendColor = (change: number) => {
    if (change > 0) return "text-green-600"
    if (change < 0) return "text-red-600"
    return "text-gray-600"
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Today's Progress</CardTitle>
        <CardDescription>Your learning metrics for today</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {metrics.map((metric, index) => {
          const progress = (metric.value / metric.target) * 100
          return (
            <div key={index} className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{metric.label}</span>
                <div className="flex items-center gap-1">
                  {getTrendIcon(metric.change)}
                  <span className={`text-xs ${getTrendColor(metric.change)}`}>
                    {metric.change > 0 ? "+" : ""}
                    {metric.change.toFixed(1)}%
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">
                  {metric.value} / {metric.target} {metric.unit}
                </span>
                <Badge variant={progress >= 100 ? "default" : "secondary"}>{progress.toFixed(0)}%</Badge>
              </div>
              <Progress value={Math.min(progress, 100)} className="h-2" />
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}
