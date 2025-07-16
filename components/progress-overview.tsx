"use client"

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { motion } from "framer-motion"
import { TrendingUp, Target, Award } from "lucide-react"

interface ProgressOverviewProps {
  overallProgress: number
  masteryScore: number
  completedModules: number
  totalModules: number
}

export function ProgressOverview({
  overallProgress,
  masteryScore,
  completedModules,
  totalModules,
}: ProgressOverviewProps) {
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  }

  return (
    <motion.div variants={cardVariants} initial="hidden" animate="visible">
      <Card className="w-full bg-gradient-to-br from-blue-50 to-purple-50 shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-lg font-semibold text-gray-800">Your Progress</CardTitle>
          <TrendingUp className="h-6 w-6 text-blue-600" />
        </CardHeader>
        <CardContent className="grid gap-4">
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-medium text-gray-700">Overall Learning Progress</span>
              <span className="text-sm font-semibold text-gray-900">{overallProgress}%</span>
            </div>
            <Progress value={overallProgress} className="w-full" indicatorColor="bg-blue-500" />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <Target className="h-4 w-4 text-purple-500" /> Mastery Score
              </span>
              <span className="text-sm font-semibold text-gray-900">{masteryScore}/100</span>
            </div>
            <Progress value={masteryScore} className="w-full" indicatorColor="bg-purple-500" />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <Award className="h-4 w-4 text-green-500" /> Modules Completed
              </span>
              <span className="text-sm font-semibold text-gray-900">
                {completedModules} / {totalModules}
              </span>
            </div>
            <Progress
              value={(completedModules / totalModules) * 100}
              className="w-full"
              indicatorColor="bg-green-500"
            />
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
