"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Brain } from "lucide-react"

export default function CognitiveChart() {
  return (
    <Card className="border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="w-5 h-5 text-primary" />
          Cognitive State Trends
        </CardTitle>
        <CardDescription>Your cognitive patterns over the past week</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-64 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg flex items-center justify-center">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
              <Brain className="w-6 h-6 text-primary" />
            </div>
            <p className="text-sm text-gray-600 font-medium">No Data Available</p>
            <p className="text-xs text-gray-500">Start learning to see your cognitive trends</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
