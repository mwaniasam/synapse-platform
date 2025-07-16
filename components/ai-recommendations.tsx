"use client"

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { Sparkles, ArrowRight } from "lucide-react"

interface Recommendation {
  id: string
  title: string
  type: "course" | "topic" | "resource"
  description: string
}

interface AiRecommendationsProps {
  recommendations: Recommendation[]
}

export function AiRecommendations({ recommendations }: AiRecommendationsProps) {
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
      <Card className="w-full bg-gradient-to-br from-blue-50 to-cyan-50 shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-lg font-semibold text-gray-800">AI Recommendations</CardTitle>
          <Sparkles className="h-6 w-6 text-blue-600" />
        </CardHeader>
        <CardContent className="space-y-4">
          {recommendations.length > 0 ? (
            <div className="space-y-3">
              {recommendations.map((rec, index) => (
                <motion.div
                  key={rec.id}
                  variants={itemVariants}
                  initial="hidden"
                  animate="visible"
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="flex items-start gap-3 p-3 border rounded-lg bg-white/50 hover:bg-white/70 transition-colors">
                    <div className="flex-shrink-0">
                      <Sparkles className="h-5 w-5 text-blue-500" />
                    </div>
                    <div className="flex-grow">
                      <h3 className="font-semibold text-gray-800">{rec.title}</h3>
                      <p className="text-sm text-gray-600">{rec.description}</p>
                      <span className="text-xs text-blue-700 font-medium mt-1 block">
                        {rec.type.charAt(0).toUpperCase() + rec.type.slice(1)}
                      </span>
                    </div>
                    <Button variant="ghost" size="sm" className="flex-shrink-0 text-blue-600 hover:text-blue-700">
                      View <ArrowRight className="ml-1 h-4 w-4" />
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">
              No recommendations available yet. Engage with content to get personalized suggestions!
            </p>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}
