"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Brain, Timer, BarChart3, Zap } from "lucide-react"
import Link from "next/link"

interface WelcomeScreenProps {
  onGetStarted?: () => void;
  userName?: string;
}

export function WelcomeScreen({ onGetStarted, userName }: WelcomeScreenProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-blue-600 rounded-full">
              <Brain className="h-12 w-12 text-white" />
            </div>
          </div>
          <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-4">
            {userName ? `Welcome back, ${userName}!` : 'Welcome to Synapse'}
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            The AI-powered learning platform that adapts to your cognitive state and maximizes your productivity
          </p>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <Card className="text-center">
            <CardHeader>
              <Timer className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <CardTitle className="text-lg">Pomodoro Timer</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>Boost focus with customizable work and break intervals</CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <BarChart3 className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <CardTitle className="text-lg">Activity Tracking</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>Monitor your learning patterns and productivity metrics</CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Brain className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <CardTitle className="text-lg">Cognitive Insights</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>AI-powered analysis of your learning and focus states</CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Zap className="h-8 w-8 text-orange-600 mx-auto mb-2" />
              <CardTitle className="text-lg">Adaptive Learning</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>Content that adapts to your cognitive state and preferences</CardDescription>
            </CardContent>
          </Card>
        </div>

        {/* CTA */}
        <div className="text-center">
          <div className="space-x-4">
            {onGetStarted ? (
              <Button size="lg" onClick={onGetStarted}>
                Get Started
              </Button>
            ) : (
              <Button asChild size="lg">
                <Link href="/auth/signup">Get Started</Link>
              </Button>
            )}
            <Button variant="outline" size="lg" asChild>
              <Link href="/auth/signin">Sign In</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
