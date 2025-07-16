"use client"

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { motion } from "framer-motion"
import { LineChart } from "lucide-react"

interface CognitiveTrendsChartProps {
  data: {
    name: string
    focus: number
    energy: number
    comprehension: number
    engagement: number
  }[]
}

export function CognitiveTrendsChart({ data }: CognitiveTrendsChartProps) {
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  }

  return (
    <motion.div variants={cardVariants} initial="hidden" animate="visible">
      <Card className="w-full bg-white shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-lg font-semibold text-gray-800">Cognitive Trends</CardTitle>
          <LineChart className="h-6 w-6 text-green-600" />
        </CardHeader>
        <CardContent>
          <div className="h-64 w-full bg-gray-50 rounded-md flex items-center justify-center text-gray-400 text-sm">
            [Chart Placeholder: Focus, Energy, Comprehension, Engagement over time]
          </div>
          <div className="mt-4 text-sm text-gray-600">
            <p>This chart would display your cognitive performance trends over time.</p>
            <ul className="list-disc list-inside mt-2">
              <li>Focus: {data[data.length - 1]?.focus}%</li>
              <li>Energy: {data[data.length - 1]?.energy}%</li>
              <li>Comprehension: {data[data.length - 1]?.comprehension}%</li>
              <li>Engagement: {data[data.length - 1]?.engagement}%</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
