"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BarChart3, Clock, MousePointer, Keyboard } from "lucide-react"

interface ActivityData {
  time: string
  focusScore: number
  mouseMovements: number
  keystrokes: number
  duration: number
}

export function ActivityChart() {
  // Mock data - in real app, this would come from API
  const activityData: ActivityData[] = [
    { time: "09:00", focusScore: 85, mouseMovements: 120, keystrokes: 45, duration: 25 },
    { time: "10:00", focusScore: 92, mouseMovements: 95, keystrokes: 67, duration: 25 },
    { time: "11:00", focusScore: 78, mouseMovements: 150, keystrokes: 32, duration: 25 },
    { time: "14:00", focusScore: 88, mouseMovements: 110, keystrokes: 58, duration: 25 },
    { time: "15:00", focusScore: 95, mouseMovements: 85, keystrokes: 72, duration: 25 },
    { time: "16:00", focusScore: 82, mouseMovements: 135, keystrokes: 41, duration: 25 },
  ]

  const maxFocusScore = Math.max(...activityData.map((d) => d.focusScore))
  const avgFocusScore = activityData.reduce((sum, d) => sum + d.focusScore, 0) / activityData.length

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Focus Activity
            </CardTitle>
            <CardDescription>Your focus patterns throughout the day</CardDescription>
          </div>
          <Badge variant="outline">Avg: {avgFocusScore.toFixed(0)}%</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Chart visualization */}
          <div className="relative h-32 flex items-end justify-between gap-2">
            {activityData.map((data, index) => (
              <div key={index} className="flex flex-col items-center gap-1 flex-1">
                <div className="relative w-full bg-gray-100 dark:bg-gray-800 rounded-t">
                  <div
                    className="bg-gradient-to-t from-blue-500 to-blue-400 rounded-t transition-all duration-300 hover:from-blue-600 hover:to-blue-500"
                    style={{
                      height: `${(data.focusScore / 100) * 120}px`,
                      minHeight: "4px",
                    }}
                  />
                </div>
                <span className="text-xs text-muted-foreground">{data.time}</span>
              </div>
            ))}
          </div>

          {/* Activity summary */}
          <div className="grid grid-cols-3 gap-4 pt-4 border-t">
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Clock className="h-4 w-4 text-blue-500" />
                <span className="text-sm font-medium">Duration</span>
              </div>
              <p className="text-lg font-semibold">{activityData.reduce((sum, d) => sum + d.duration, 0)}m</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <MousePointer className="h-4 w-4 text-green-500" />
                <span className="text-sm font-medium">Mouse</span>
              </div>
              <p className="text-lg font-semibold">{activityData.reduce((sum, d) => sum + d.mouseMovements, 0)}</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Keyboard className="h-4 w-4 text-purple-500" />
                <span className="text-sm font-medium">Keys</span>
              </div>
              <p className="text-lg font-semibold">{activityData.reduce((sum, d) => sum + d.keystrokes, 0)}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
