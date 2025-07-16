"use client"

import { motion } from "framer-motion"
import { Brain, Lightbulb, TrendingUp, Award } from "lucide-react"

export function FeaturesSection() {
  const features = [
    {
      icon: <Brain className="h-8 w-8 text-purple-600" />,
      title: "Personalized Learning Paths",
      description: "AI-driven paths adapt to your pace and style, ensuring optimal learning.",
    },
    {
      icon: <Lightbulb className="h-8 w-8 text-blue-600" />,
      title: "Real-time Cognitive Insights",
      description: "Monitor your focus, energy, and comprehension to learn more effectively.",
    },
    {
      icon: <TrendingUp className="h-8 w-8 text-green-600" />,
      title: "Progress Tracking & Analytics",
      description: "Visualize your growth with detailed reports and performance trends.",
    },
    {
      icon: <Award className="h-8 w-8 text-yellow-600" />,
      title: "Gamified Challenges",
      description: "Engage with interactive quizzes and challenges to solidify your knowledge.",
    },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  }

  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-white">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.6 }}
            className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-gray-900"
          >
            Features Designed for Your Success
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="max-w-[900px] text-gray-700 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed"
          >
            Synapse combines cutting-edge AI with intuitive design to create an unparalleled learning experience.
          </motion.p>
        </div>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          className="mx-auto grid max-w-5xl items-start gap-8 py-12 sm:grid-cols-2 lg:grid-cols-4"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="flex flex-col items-center space-y-2 text-center p-6 bg-gradient-to-br from-gray-50 to-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300"
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-purple-100 text-purple-600">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-900">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
