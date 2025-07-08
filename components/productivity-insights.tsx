"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, Target, Lightbulb } from "lucide-react"

interface ProductivityInsightsProps {
  insights: {
    weeklyTrend: number
    topProductiveDomain: string
    improvementAreas: string[]
    achievements: string[]
  }
}

export function ProductivityInsights({ insights }: ProductivityInsightsProps) {
  return (
    <Card className="col-span-3">
      <CardHeader>
        <CardTitle>Productivity Insights</CardTitle>
        <CardDescription>AI-powered analysis of your learning patterns</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Weekly Trend */}
        <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
          <div className="flex items-center space-x-3">
            {insights.weeklyTrend > 0 ? (
              <TrendingUp className="h-5 w-5 text-green-600" />
            ) : (
              <TrendingDown className="h-5 w-5 text-red-600" />
            )}
            <div>
              <p className="font-medium">Weekly Trend</p>
              <p className="text-sm text-muted-foreground">
                {insights.weeklyTrend > 0 ? "Improving" : "Declining"} by {Math.abs(insights.weeklyTrend)}%
              </p>
            </div>
          </div>
          <Badge variant={insights.weeklyTrend > 0 ? "default" : "destructive"}>
            {insights.weeklyTrend > 0 ? "+" : ""}
            {insights.weeklyTrend}%
          </Badge>
        </div>

        {/* Top Productive Domain */}
        <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
          <div className="flex items-center space-x-3">
            <Target className="h-5 w-5 text-blue-600" />
            <div>
              <p className="font-medium">Most Productive</p>
              <p className="text-sm text-muted-foreground">{insights.topProductiveDomain}</p>
            </div>
          </div>
          <Badge variant="secondary">Top Site</Badge>
        </div>

        {/* Achievements */}
        {insights.achievements.length > 0 && (
          <div>
            <h4 className="font-medium mb-2 flex items-center">
              <TrendingUp className="h-4 w-4 mr-2 text-green-600" />
              Recent Achievements
            </h4>
            <div className="space-y-2">
              {insights.achievements.map((achievement, index) => (
                <div key={index} className="text-sm text-green-700 bg-green-50 p-2 rounded">
                  🎉 {achievement}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Improvement Areas */}
        {insights.improvementAreas.length > 0 && (
          <div>
            <h4 className="font-medium mb-2 flex items-center">
              <Lightbulb className="h-4 w-4 mr-2 text-yellow-600" />
              Suggestions
            </h4>
            <div className="space-y-2">
              {insights.improvementAreas.map((area, index) => (
                <div key={index} className="text-sm text-yellow-700 bg-yellow-50 p-2 rounded">
                  💡 {area}
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
