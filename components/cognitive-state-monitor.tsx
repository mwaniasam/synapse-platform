"use client"

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { motion } from "framer-motion"
import { Brain, Zap, Lightbulb, Heart } from "lucide-react"

interface CognitiveStateMonitorProps {
  focusLevel: number
  energyLevel: number
  comprehension: number
  engagement: number
}

export function CognitiveStateMonitor({
  focusLevel,
  energyLevel,
  comprehension,
  engagement,
}: CognitiveStateMonitorProps) {
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  }

  const progressVariants = {
    hidden: { width: 0 },
    visible: { width: "100%", transition: { duration: 1, ease: "easeOut" } },
  }

  return (
    <Card className="w-full max-w-md bg-gradient-to-br from-purple-50 to-indigo-50 shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-semibold text-gray-800">Cognitive State</CardTitle>
        <Brain className="h-6 w-6 text-purple-600" />
      </CardHeader>
      <CardContent className="grid gap-4">
        <motion.div variants={cardVariants} initial="hidden" animate="visible">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <Zap className="h-4 w-4 text-yellow-500" /> Focus
            </span>
            <span className="text-sm font-semibold text-gray-900">{focusLevel}%</span>
          </div>
          <Progress value={focusLevel} className="w-full" indicatorColor="bg-yellow-500" />
        </motion.div>

        <motion.div variants={cardVariants} initial="hidden" animate="visible" transition={{ delay: 0.1 }}>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <Heart className="h-4 w-4 text-red-500" /> Energy
            </span>
            <span className="text-sm font-semibold text-gray-900">{energyLevel}%</span>
          </div>
          <Progress value={energyLevel} className="w-full" indicatorColor="bg-red-500" />
        </motion.div>

        <motion.div variants={cardVariants} initial="hidden" animate="visible" transition={{ delay: 0.2 }}>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <Lightbulb className="h-4 w-4 text-blue-500" /> Comprehension
            </span>
            <span className="text-sm font-semibold text-gray-900">{comprehension}%</span>
          </div>
          <Progress value={comprehension} className="w-full" indicatorColor="bg-blue-500" />
        </motion.div>

        <motion.div variants={cardVariants} initial="hidden" animate="visible" transition={{ delay: 0.3 }}>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <Brain className="h-4 w-4 text-green-500" /> Engagement
            </span>
            <span className="text-sm font-semibold text-gray-900">{engagement}%</span>
          </div>
          <Progress value={engagement} className="w-full" indicatorColor="bg-green-500" />
        </motion.div>
      </CardContent>
    </Card>
  )
}
