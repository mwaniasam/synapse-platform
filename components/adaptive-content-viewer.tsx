"use client"

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { Book, ChevronLeft, ChevronRight } from "lucide-react"
import { useState } from "react"

interface ContentItem {
  id: string
  title: string
  type: "text" | "video" | "quiz"
  content: string // Placeholder for actual content or URL
}

interface AdaptiveContentViewerProps {
  content: ContentItem[]
}

export function AdaptiveContentViewer({ content }: AdaptiveContentViewerProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const currentItem = content[currentIndex]

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % content.length)
  }

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + content.length) % content.length)
  }

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  }

  const contentVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.5 } },
  }

  return (
    <motion.div variants={cardVariants} initial="hidden" animate="visible">
      <Card className="w-full bg-white shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-lg font-semibold text-gray-800">Adaptive Content</CardTitle>
          <Book className="h-6 w-6 text-gray-600" />
        </CardHeader>
        <CardContent className="space-y-4">
          {currentItem ? (
            <motion.div key={currentItem.id} variants={contentVariants} initial="hidden" animate="visible">
              <h3 className="text-xl font-bold text-gray-900">{currentItem.title}</h3>
              <p className="text-sm text-gray-600 mb-4">
                Type: {currentItem.type.charAt(0).toUpperCase() + currentItem.type.slice(1)}
              </p>
              <div className="bg-gray-50 p-4 rounded-md h-48 overflow-auto text-sm text-gray-800">
                {currentItem.content}
              </div>
            </motion.div>
          ) : (
            <div className="h-48 flex items-center justify-center text-gray-500">No content available.</div>
          )}
          <div className="flex justify-between gap-2">
            <Button onClick={handlePrevious} disabled={content.length <= 1} variant="outline">
              <ChevronLeft className="h-4 w-4 mr-2" /> Previous
            </Button>
            <Button onClick={handleNext} disabled={content.length <= 1}>
              Next <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
