"use client"

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { motion } from "framer-motion"
import { GitGraph } from "lucide-react"

interface KnowledgeGraphCardProps {
  title: string
  description: string
  nodes: number
  edges: number
}

export function KnowledgeGraphCard({ title, description, nodes, edges }: KnowledgeGraphCardProps) {
  const cardVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } },
  }

  return (
    <motion.div variants={cardVariants} initial="hidden" animate="visible">
      <Card className="w-full bg-gradient-to-br from-blue-50 to-cyan-50 shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-lg font-semibold text-gray-800">{title}</CardTitle>
          <GitGraph className="h-6 w-6 text-blue-600" />
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-gray-600">{description}</p>
          <div className="flex justify-between text-sm text-gray-700">
            <span>
              Nodes: <span className="font-semibold">{nodes}</span>
            </span>
            <span>
              Edges: <span className="font-semibold">{edges}</span>
            </span>
          </div>
          <div className="h-24 bg-blue-100 rounded-md flex items-center justify-center text-blue-500 text-xs font-medium">
            [Interactive Graph Placeholder]
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
