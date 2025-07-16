"use client"

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { motion } from "framer-motion"
import { Radar } from "lucide-react"

interface SkillData {
  skill: string
  level: number // 0-100
}

interface SkillsRadarChartProps {
  skills: SkillData[]
}

export function SkillsRadarChart({ skills }: SkillsRadarChartProps) {
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  }

  return (
    <motion.div variants={cardVariants} initial="hidden" animate="visible">
      <Card className="w-full bg-gradient-to-br from-pink-50 to-red-50 shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-lg font-semibold text-gray-800">Skill Proficiency</CardTitle>
          <Radar className="h-6 w-6 text-pink-600" />
        </CardHeader>
        <CardContent>
          <div className="h-64 w-full bg-pink-100 rounded-md flex items-center justify-center text-pink-500 text-sm font-medium">
            [Radar Chart Placeholder: Skill levels]
          </div>
          <div className="mt-4 text-sm text-gray-600">
            <p>This chart visualizes your proficiency across different skill areas.</p>
            <ul className="list-disc list-inside mt-2">
              {skills.map((skill, index) => (
                <li key={index}>
                  {skill.skill}: {skill.level}%
                </li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
