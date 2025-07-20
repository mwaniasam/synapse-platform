"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, ExternalLink, Globe } from "lucide-react"
import { formatDuration } from "@/lib/utils"

interface Activity {
  id: string
  title: string
  url: string
  domain: string
  timeSpent: number
  focusScore: number
  activityLevel: "low" | "medium" | "high"
  timestamp: Date
}

export function RecentActivity() {
  // Mock data - in real app, this would come from API
  const activities: Activity[] = [
    {
      id: "1",
      title: "React Documentation - Hooks",
      url: "https://react.dev/reference/react/hooks",
      domain: "react.dev",
      timeSpent: 1800, // 30 minutes in seconds
      focusScore: 92,
      activityLevel: "high",
      timestamp: new Date(Date.now() - 30 * 60 * 1000),
    },
    {
      id: "2",
      title: "TypeScript Handbook",
      url: "https://www.typescriptlang.org/docs/",
      domain: "typescriptlang.org",
      timeSpent: 1200, // 20 minutes
      focusScore: 85,
      activityLevel: "high",
      timestamp: new Date(Date.now() - 60 * 60 * 1000),
    },
    {
      id: "3",
      title: "Stack Overflow - Database Query",
      url: "https://stackoverflow.com/questions/...",
      domain: "stackoverflow.com",
      timeSpent: 600, // 10 minutes
      focusScore: 78,
      activityLevel: "medium",
      timestamp: new Date(Date.now() - 90 * 60 * 1000),
    },
    {
      id: "4",
      title: "GitHub - Project Repository",
      url: "https://github.com/user/project",
      domain: "github.com",
      timeSpent: 2400, // 40 minutes
      focusScore: 88,
      activityLevel: "high",
      timestamp: new Date(Date.now() - 120 * 60 * 1000),
    },
    {
      id: "5",
      title: "MDN Web Docs - CSS Grid",
      url: "https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Grid_Layout",
      domain: "developer.mozilla.org",
      timeSpent: 900, // 15 minutes
      focusScore: 82,
      activityLevel: "medium",
      timestamp: new Date(Date.now() - 150 * 60 * 1000),
    },
  ]

  const getActivityLevelColor = (level: string) => {
    switch (level) {
      case "high":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
      case "low":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    }
  }

  const getFocusScoreColor = (score: number) => {
    if (score >= 85) return "text-green-600 dark:text-green-400"
    if (score >= 70) return "text-yellow-600 dark:text-yellow-400"
    return "text-red-600 dark:text-red-400"
  }

  const formatTimeAgo = (timestamp: Date) => {
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - timestamp.getTime()) / (1000 * 60))

    if (diffInMinutes < 60) {
      return `${diffInMinutes}m ago`
    } else if (diffInMinutes < 1440) {
      return `${Math.floor(diffInMinutes / 60)}h ago`
    } else {
      return `${Math.floor(diffInMinutes / 1440)}d ago`
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Recent Activity
        </CardTitle>
        <CardDescription>Your latest learning sessions</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => (
            <div
              key={activity.id}
              className="flex items-start gap-3 p-3 rounded-lg border hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
            >
              <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                <Globe className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <h4 className="font-medium text-sm truncate">{activity.title}</h4>
                    <p className="text-xs text-muted-foreground truncate">{activity.domain}</p>
                  </div>
                  <a
                    href={activity.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200"
                  >
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>

                <div className="flex items-center gap-2 mt-2">
                  <Badge variant="outline" className={getActivityLevelColor(activity.activityLevel)}>
                    {activity.activityLevel}
                  </Badge>
                  <span className="text-xs text-muted-foreground">{formatDuration(activity.timeSpent * 1000)}</span>
                  <span className={`text-xs font-medium ${getFocusScoreColor(activity.focusScore)}`}>
                    {activity.focusScore}% focus
                  </span>
                  <span className="text-xs text-muted-foreground">{formatTimeAgo(activity.timestamp)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
