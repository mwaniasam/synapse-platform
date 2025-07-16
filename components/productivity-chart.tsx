"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp } from "lucide-react"

export default function ProductivityChart() {
  return (
    <Card className="border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-primary" />
          Productivity Score
        </CardTitle>
        <CardDescription>Daily productivity metrics and trends</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-64 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg flex items-center justify-center">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 bg-green-500/10 rounded-full flex items-center justify-center mx-auto">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
            <p className="text-sm text-gray-600 font-medium">No Data Available</p>
            <p className="text-xs text-gray-500">Complete sessions to track productivity</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
