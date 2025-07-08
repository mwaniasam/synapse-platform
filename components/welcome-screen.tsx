"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Brain, Zap, Target, BarChart3, Timer, Activity, ArrowRight, Sparkles } from "lucide-react"
import Image from "next/image"

interface WelcomeScreenProps {
  onGetStarted: () => void
  userName?: string
}

export function WelcomeScreen({ onGetStarted, userName }: WelcomeScreenProps) {
  const [currentStep, setCurrentStep] = useState(0)

  const features = [
    {
      icon: Brain,
      title: "Cognitive Enhancement",
      description:
        "Advanced algorithms track your learning patterns and optimize your cognitive performance in real-time.",
      color: "text-purple-500",
    },
    {
      icon: Timer,
      title: "Smart Pomodoro",
      description: "Intelligent focus sessions that adapt to your productivity patterns and energy levels.",
      color: "text-blue-500",
    },
    {
      icon: Activity,
      title: "Activity Detection",
      description: "Automatic tracking of typing, scrolling, and engagement patterns to measure focus quality.",
      color: "text-green-500",
    },
    {
      icon: BarChart3,
      title: "Learning Analytics",
      description: "Comprehensive insights into your learning progress, productivity trends, and cognitive growth.",
      color: "text-orange-500",
    },
  ]

  const steps = [
    {
      title: "Welcome to Synapse",
      content: (
        <div className="text-center space-y-6">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="relative mx-auto w-64 h-64 rounded-2xl overflow-hidden"
          >
            <Image
              src="/images/brain-neural.jpeg"
              alt="Neural Brain Visualization"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            <div className="absolute bottom-4 left-4 right-4">
              <Badge className="bg-white/20 backdrop-blur-sm text-white border-white/30">
                <Sparkles className="h-3 w-3 mr-1" />
                Cognitive AI
              </Badge>
            </div>
          </motion.div>

          <div className="space-y-2">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              {userName ? `Welcome back, ${userName}!` : "Welcome to Synapse"}
            </h1>
            <p className="text-muted-foreground max-w-md mx-auto">
              Your personal cognitive learning acceleration platform. Enhance your focus, track your progress, and
              unlock your learning potential.
            </p>
          </div>
        </div>
      ),
    },
    {
      title: "Powerful Features",
      content: (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="h-full hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center space-x-2 text-lg">
                    <feature.icon className={`h-5 w-5 ${feature.color}`} />
                    <span>{feature.title}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      ),
    },
    {
      title: "Ready to Begin?",
      content: (
        <div className="text-center space-y-6">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", duration: 0.8 }}
            className="mx-auto w-32 h-32 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center"
          >
            <Target className="h-16 w-16 text-white" />
          </motion.div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold">You're All Set!</h2>
            <p className="text-muted-foreground max-w-md mx-auto">
              Start your first focus session, explore your dashboard, or dive into activity tracking. Your cognitive
              enhancement journey begins now.
            </p>

            <div className="flex flex-wrap justify-center gap-2">
              <Badge variant="secondary">
                <Zap className="h-3 w-3 mr-1" />
                Real-time Tracking
              </Badge>
              <Badge variant="secondary">
                <Brain className="h-3 w-3 mr-1" />
                AI-Powered Insights
              </Badge>
              <Badge variant="secondary">
                <BarChart3 className="h-3 w-3 mr-1" />
                Progress Analytics
              </Badge>
            </div>
          </div>
        </div>
      ),
    },
  ]

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      onGetStarted()
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Brain className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Synapse
            </span>
          </div>

          {/* Progress Indicator */}
          <div className="flex justify-center space-x-2 mb-6">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-colors ${index <= currentStep ? "bg-primary" : "bg-muted"}`}
              />
            ))}
          </div>

          <CardTitle className="text-xl">{steps[currentStep].title}</CardTitle>
        </CardHeader>

        <CardContent className="space-y-8">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {steps[currentStep].content}
          </motion.div>

          {/* Navigation */}
          <div className="flex justify-between items-center pt-6">
            <Button variant="outline" onClick={prevStep} disabled={currentStep === 0}>
              Previous
            </Button>

            <div className="text-sm text-muted-foreground">
              {currentStep + 1} of {steps.length}
            </div>

            <Button onClick={nextStep} className="flex items-center space-x-2">
              <span>{currentStep === steps.length - 1 ? "Get Started" : "Next"}</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
