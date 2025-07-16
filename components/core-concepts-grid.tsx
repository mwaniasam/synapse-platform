"use client"

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { motion } from "framer-motion"
import { BookOpen, CheckCircle, XCircle } from "lucide-react"

interface Concept {
  id: string
  title: string
  status: "mastered" | "review" | "new"
}

interface CoreConceptsGridProps {
  concepts: Concept[]
}

export function CoreConceptsGrid({ concepts }: CoreConceptsGridProps) {
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  }

  const conceptItemVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
  }

  const getStatusIcon = (status: Concept["status"]) => {
    switch (status) {
      case "mastered":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "review":
        return <XCircle className="h-5 w-5 text-yellow-500" />
      case "new":
        return <BookOpen className="h-5 w-5 text-gray-400" />
      default:
        return null
    }
  }

  return (
    <motion.div variants={cardVariants} initial="hidden" animate="visible">
      <Card className="w-full bg-white shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-lg font-semibold text-gray-800">Core Concepts</CardTitle>
          <BookOpen className="h-6 w-6 text-gray-600" />
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {concepts.map((concept, index) => (
              <motion.div
                key={concept.id}
                variants={conceptItemVariants}
                initial="hidden"
                animate="visible"
                transition={{ delay: index * 0.05 }}
              >
                <div className="flex flex-col items-center p-3 border rounded-lg hover:shadow-md transition-shadow cursor-pointer">
                  {getStatusIcon(concept.status)}
                  <span className="mt-2 text-sm text-center font-medium text-gray-700">{concept.title}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
