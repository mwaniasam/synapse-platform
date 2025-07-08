"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatDistanceToNow } from "date-fns"
import { ExternalLink, Clock } from "lucide-react"

interface RecentActivityProps {
  activities: Array<{
    id: string
    timestamp: number
    domain: string
    title?: string
    activityLevel: string
    readingTime: number
    productivity: number
  }>
}

export function RecentActivity({ activities }: RecentActivityProps) {
  const getActivityColor = (level: string) => {
    switch (level) {
      case "high":
        return "bg-green-100 text-green-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "low":
        return "bg-orange-100 text-orange-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getProductivityColor = (score: number) => {
    if (score >= 80) return "text-green-600"
    if (score >= 60) return "text-yellow-600"
    if (score >= 40) return "text-orange-600"
    return "text-red-600"
  }

  return (
    <Card className="col-span-4">
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>Your latest browsing sessions and productivity metrics</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.slice(0, 10).map((activity) => (
            <div
              key={activity.id}
              className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  <img
                    src={`https://www.google.com/s2/favicons?domain=${activity.domain}&sz=32`}
                    alt={activity.domain}
                    className="w-6 h-6 rounded"
                    onError={(e) => {
                      e.currentTarget.src =
                        'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>'
                    }}
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center space-x-2">
                    <p className="text-sm font-medium truncate">{activity.domain}</p>
                    <Badge variant="outline" className={`text-xs ${getActivityColor(activity.activityLevel)}`}>
                      {activity.activityLevel}
                    </Badge>
                  </div>
                  <div className="flex items-center space-x-4 mt-1">
                    <div className="flex items-center text-xs text-muted-foreground">
                      <Clock className="w-3 h-3 mr-1" />
                      {Math.floor(activity.readingTime / 60000)}m
                    </div>
                    <div className={`text-xs font-medium ${getProductivityColor(activity.productivity)}`}>
                      {activity.productivity}% productive
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                <span>{formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}</span>
                <ExternalLink className="w-3 h-3" />
              </div>
            </div>
          ))}
          {activities.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <p>No recent activity found.</p>
              <p className="text-sm">Start browsing with Synapse extension to see your activity here!</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
