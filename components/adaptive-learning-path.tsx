"use client"

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { Lightbulb, ArrowRight } from "lucide-react"

interface LearningPathStep {
  id: string
  title: string
  description: string
  status: "completed" | "in-progress" | "upcoming"
}

interface AdaptiveLearningPathProps {
  path: LearningPathStep[]
}

export function AdaptiveLearningPath({ path }: AdaptiveLearningPathProps) {
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  }

  const stepVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.3 } },
  }

  return (
    <motion.div variants={cardVariants} initial="hidden" animate="visible">
      <Card className="w-full bg-gradient-to-br from-green-50 to-teal-50 shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-lg font-semibold text-gray-800">Adaptive Learning Path</CardTitle>
          <Lightbulb className="h-6 w-6 text-green-600" />
        </CardHeader>
        <CardContent className="space-y-4">
          {path.map((step, index) => (
            <motion.div
              key={step.id}
              variants={stepVariants}
              initial="hidden"
              animate="visible"
              transition={{ delay: index * 0.1 }}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-3 h-3 rounded-full ${
                    step.status === "completed"
                      ? "bg-green-500"
                      : step.status === "in-progress"
                        ? "bg-yellow-500 animate-pulse"
                        : "bg-gray-300"
                  }`}
                />
                <div>
                  <h3 className="font-medium text-gray-800">{step.title}</h3>
                  <p className="text-sm text-gray-600">{step.description}</p>
                </div>
                {step.status === "in-progress" && (
                  <Button variant="ghost" size="sm" className="ml-auto text-green-600 hover:text-green-700">
                    Continue <ArrowRight className="ml-1 h-4 w-4" />
                  </Button>
                )}
                {step.status === "upcoming" && (
                  <Button variant="ghost" size="sm" className="ml-auto text-gray-500 cursor-not-allowed">
                    Start <ArrowRight className="ml-1 h-4 w-4" />
                  </Button>
                )}
              </div>
            </motion.div>
          ))}
          <Button className="w-full bg-green-600 hover:bg-green-700 mt-4">View Full Path</Button>
        </CardContent>
      </Card>
    </motion.div>
  )
}
