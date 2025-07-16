"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Brain, Zap, Target, TrendingUp, Users, Shield } from "lucide-react"
import Link from "next/link"

export function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
              <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-6xl">
                Learn Smarter with{" "}
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  AI-Powered
                </span>{" "}
                Adaptation
              </h1>
              <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300">
                Synapse Learning Pro uses advanced AI to detect your cognitive state and adapt content in real-time,
                making your learning experience more effective and personalized than ever before.
              </p>
              <div className="mt-10 flex items-center justify-center gap-x-6">
                <Link href="/auth/signup">
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  >
                    Start Learning Free
                  </Button>
                </Link>
                <Link href="/auth/signin">
                  <Button variant="outline" size="lg">
                    Sign In
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Floating Elements */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <motion.div
            animate={{
              y: [0, -20, 0],
              rotate: [0, 5, 0],
            }}
            transition={{
              duration: 6,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
            className="absolute left-[10%] top-[20%] h-32 w-32 rounded-full bg-blue-200/30 dark:bg-blue-800/30"
          />
          <motion.div
            animate={{
              y: [0, 20, 0],
              rotate: [0, -5, 0],
            }}
            transition={{
              duration: 8,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
            className="absolute right-[15%] top-[30%] h-24 w-24 rounded-full bg-purple-200/30 dark:bg-purple-800/30"
          />
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
              Intelligent Learning Features
            </h2>
            <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300">
              Experience the future of personalized education with our cutting-edge AI technology.
            </p>
          </div>

          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.2 }}
                >
                  <Card className="h-full hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <div className="rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 p-2">
                          <feature.icon className="h-6 w-6 text-white" />
                        </div>
                        <CardTitle className="text-xl">{feature.name}</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-base leading-7">{feature.description}</CardDescription>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 py-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Ready to Transform Your Learning?
              </h2>
              <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-blue-100">
                Join thousands of learners who are already experiencing the power of AI-adapted education.
              </p>
              <div className="mt-10 flex items-center justify-center gap-x-6">
                <Link href="/auth/signup">
                  <Button size="lg" variant="secondary" className="bg-white text-blue-600 hover:bg-gray-100">
                    Get Started Now
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  )
}

const features = [
  {
    name: "Cognitive State Detection",
    description:
      "Advanced AI monitors your focus, attention, and learning patterns in real-time to understand your current cognitive state.",
    icon: Brain,
  },
  {
    name: "Adaptive Content",
    description:
      "Content automatically adjusts difficulty, pace, and presentation style based on your cognitive state and learning preferences.",
    icon: Zap,
  },
  {
    name: "Personalized Learning Paths",
    description: "AI creates custom learning journeys tailored to your goals, strengths, and areas for improvement.",
    icon: Target,
  },
  {
    name: "Progress Analytics",
    description: "Detailed insights into your learning patterns, focus trends, and cognitive performance over time.",
    icon: TrendingUp,
  },
  {
    name: "Collaborative Learning",
    description: "Connect with other learners, share insights, and learn together in AI-moderated study groups.",
    icon: Users,
  },
  {
    name: "Privacy First",
    description:
      "Your learning data is encrypted and secure. You maintain full control over your personal information.",
    icon: Shield,
  },
]
