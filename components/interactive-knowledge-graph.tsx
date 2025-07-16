"use client"

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { motion } from "framer-motion"
import { GitGraph } from "lucide-react"

interface InteractiveKnowledgeGraphProps {
  nodesCount: number
  edgesCount: number
}

export function InteractiveKnowledgeGraph({ nodesCount, edgesCount }: InteractiveKnowledgeGraphProps) {
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  }

  return (
    <motion.div variants={cardVariants} initial="hidden" animate="visible">
      <Card className="w-full bg-gradient-to-br from-blue-50 to-cyan-50 shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-lg font-semibold text-gray-800">Interactive Knowledge Graph</CardTitle>
          <GitGraph className="h-6 w-6 text-blue-600" />
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="h-80 w-full bg-blue-100 rounded-md flex items-center justify-center text-blue-500 text-sm font-medium">
            [Dynamic Knowledge Graph Visualization Placeholder]
          </div>
          <div className="flex justify-between text-sm text-gray-700">
            <span>
              Total Nodes: <span className="font-semibold">{nodesCount}</span>
            </span>
            <span>
              Total Edges: <span className="font-semibold">{edgesCount}</span>
            </span>
          </div>
          <p className="text-sm text-gray-600">
            Explore the connections between concepts, identify knowledge gaps, and discover new learning paths.
          </p>
        </CardContent>
      </Card>
    </motion.div>
  )
}
