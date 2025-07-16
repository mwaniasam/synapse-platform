"use client"

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { motion } from "framer-motion"
import { BarChart, PieChart } from "lucide-react"

interface LearningAnalyticsProps {
  timeSpent: { topic: string; hours: number }[]
  quizScores: { topic: string; score: number }[]
}

export function LearningAnalytics({ timeSpent, quizScores }: LearningAnalyticsProps) {
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  }

  return (
    <motion.div variants={cardVariants} initial="hidden" animate="visible">
      <Card className="w-full bg-white shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-lg font-semibold text-gray-800">Learning Analytics</CardTitle>
          <BarChart className="h-6 w-6 text-gray-600" />
        </CardHeader>
        <CardContent className="grid gap-6 md:grid-cols-2">
          <div>
            <h3 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
              <BarChart className="h-5 w-5 text-blue-500" /> Time Spent by Topic
            </h3>
            <div className="h-48 bg-blue-100 rounded-md flex items-center justify-center text-blue-500 text-xs font-medium">
              [Bar Chart Placeholder]
            </div>
            <ul className="mt-4 text-sm text-gray-700 space-y-1">
              {timeSpent.map((data, index) => (
                <li key={index}>
                  {data.topic}: {data.hours} hours
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
              <PieChart className="h-5 w-5 text-green-500" /> Quiz Scores by Topic
            </h3>
            <div className="h-48 bg-green-100 rounded-md flex items-center justify-center text-green-500 text-xs font-medium">
              [Pie Chart Placeholder]
            </div>
            <ul className="mt-4 text-sm text-gray-700 space-y-1">
              {quizScores.map((data, index) => (
                <li key={index}>
                  {data.topic}: {data.score}%
                </li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
