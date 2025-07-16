"use client"

import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { fetchPracticeData } from "@/lib/data"
import { SessionControls } from "@/components/session-controls"
import { CognitiveStateMonitor } from "@/components/cognitive-state-monitor"
import { CognitiveStateFeedback } from "@/components/cognitive-state-feedback"
import { DashboardLayout } from "@/components/dashboard-layout"
import { motion } from "framer-motion"

export default async function PracticePage() {
  const session = await getServerSession()

  if (!session) {
    redirect("/auth/signin")
  }

  const userId = session.user?.id || "default-user-id" // Replace with actual user ID from session

  const { sessionControls, cognitiveStateMonitor, cognitiveStateFeedback } = await fetchPracticeData(userId)

  const pageVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  }

  return (
    <DashboardLayout>
      <motion.main
        initial="hidden"
        animate="visible"
        variants={pageVariants}
        className="flex flex-1 flex-col gap-8 p-4 md:p-6 lg:p-8"
      >
        <h1 className="text-3xl font-bold text-gray-900">Practice Zone</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <SessionControls
            onStart={sessionControls.onStart}
            onPause={sessionControls.onPause}
            onReset={sessionControls.onReset}
            onEndSession={sessionControls.onEndSession}
          />
          <CognitiveStateMonitor
            focusLevel={cognitiveStateMonitor.focusLevel}
            energyLevel={cognitiveStateMonitor.energyLevel}
            comprehension={cognitiveStateMonitor.comprehension}
            engagement={cognitiveStateMonitor.engagement}
          />
          <CognitiveStateFeedback feedback={cognitiveStateFeedback.feedback} trend={cognitiveStateFeedback.trend} />
        </div>

        {/* Additional practice components can be added here */}
        <div className="grid grid-cols-1 gap-6">
          {/* Example: A section for practice exercises or quizzes */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Practice Exercises</h2>
            <p className="text-gray-600">
              This section would contain interactive exercises, quizzes, or coding challenges tailored to your current
              learning path and cognitive state.
            </p>
            <div className="mt-4 flex justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-blue-700 transition-colors"
              >
                Start New Exercise
              </motion.button>
            </div>
          </div>
        </div>
      </motion.main>
    </DashboardLayout>
  )
}
