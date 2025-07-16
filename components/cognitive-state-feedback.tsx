"use client"

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { motion } from "framer-motion"
import { MessageSquare, TrendingUp, TrendingDown } from "lucide-react"

interface CognitiveStateFeedbackProps {
  feedback: string
  trend: "improving" | "stable" | "declining"
}

export function CognitiveStateFeedback({ feedback, trend }: CognitiveStateFeedbackProps) {
  const cardVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } },
  }

  const getTrendIcon = (trend: CognitiveStateFeedbackProps["trend"]) => {
    switch (trend) {
      case "improving":
        return <TrendingUp className="h-5 w-5 text-green-500" />
      case "declining":
        return <TrendingDown className="h-5 w-5 text-red-500" />
      case "stable":
      default:
        return <MessageSquare className="h-5 w-5 text-gray-500" />
    }
  }

  const getTrendColor = (trend: CognitiveStateFeedbackProps["trend"]) => {
    switch (trend) {
      case "improving":
        return "text-green-600"
      case "declining":
        return "text-red-600"
      case "stable":
      default:
        return "text-gray-600"
    }
  }

  return (
    <motion.div variants={cardVariants} initial="hidden" animate="visible">
      <Card className="w-full bg-gradient-to-br from-purple-50 to-pink-50 shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-lg font-semibold text-gray-800">AI Feedback</CardTitle>
          <MessageSquare className="h-6 w-6 text-purple-600" />
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-gray-700">{feedback}</p>
          <div className="flex items-center gap-2">
            {getTrendIcon(trend)}
            <span className={`text-sm font-medium ${getTrendColor(trend)}`}>
              Trend: {trend.charAt(0).toUpperCase() + trend.slice(1)}
            </span>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
