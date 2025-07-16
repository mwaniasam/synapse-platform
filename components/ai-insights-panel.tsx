"use client"

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { motion } from "framer-motion"
import { Lightbulb, TrendingUp } from "lucide-react"

interface AiInsightsPanelProps {
  insights: string[]
}

export function AiInsightsPanel({ insights }: AiInsightsPanelProps) {
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  }

  const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.3 } },
  }

  return (
    <motion.div variants={cardVariants} initial="hidden" animate="visible">
      <Card className="w-full bg-gradient-to-br from-purple-50 to-pink-50 shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-lg font-semibold text-gray-800">AI Insights</CardTitle>
          <Lightbulb className="h-6 w-6 text-purple-600" />
        </CardHeader>
        <CardContent className="space-y-3">
          {insights.length > 0 ? (
            <ul className="list-disc list-inside space-y-2 text-sm text-gray-700">
              {insights.map((insight, index) => (
                <motion.li
                  key={index}
                  variants={itemVariants}
                  initial="hidden"
                  animate="visible"
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="flex items-start">
                    <TrendingUp className="h-4 w-4 text-purple-500 mr-2 mt-1 flex-shrink-0" />
                    <span>{insight}</span>
                  </div>
                </motion.li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-500">
              No insights available yet. Keep learning to generate personalized insights!
            </p>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}
