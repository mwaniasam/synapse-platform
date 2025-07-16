"use client"

import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { fetchProgressData } from "@/lib/data"
import { ProgressOverview } from "@/components/progress-overview"
import { LearningAnalytics } from "@/components/learning-analytics"
import { SkillsRadarChart } from "@/components/skills-radar-chart"
import { DashboardLayout } from "@/components/dashboard-layout"
import { motion } from "framer-motion"

export default async function ProgressPage() {
  const session = await getServerSession()

  if (!session) {
    redirect("/auth/signin")
  }

  const userId = session.user?.id || "default-user-id" // Replace with actual user ID from session

  const { progressOverview, learningAnalytics, skillsRadarChart } = await fetchProgressData(userId)

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
        <h1 className="text-3xl font-bold text-gray-900">Your Progress</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <ProgressOverview
            overallProgress={progressOverview.overallProgress}
            masteryScore={progressOverview.masteryScore}
            completedModules={progressOverview.completedModules}
            totalModules={progressOverview.totalModules}
          />
          <LearningAnalytics timeSpent={learningAnalytics.timeSpent} quizScores={learningAnalytics.quizScores} />
          <SkillsRadarChart skills={skillsRadarChart.skills} />
        </div>

        {/* Additional progress components can be added here */}
        <div className="grid grid-cols-1 gap-6">
          {/* Example: A section for detailed report generation */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Detailed Performance Report</h2>
            <p className="text-gray-600">
              Generate a comprehensive report of your learning journey, including detailed analytics, skill breakdowns,
              and personalized recommendations for future growth.
            </p>
            <div className="mt-4 flex justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-purple-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-purple-700 transition-colors"
              >
                Generate Report
              </motion.button>
            </div>
          </div>
        </div>
      </motion.main>
    </DashboardLayout>
  )
}
