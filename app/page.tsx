"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { WelcomeScreen } from "@/components/welcome-screen"
import { PomodoroTimer } from "@/components/pomodoro-timer"
import { ActivityDetector } from "@/components/activity-detector"
import toast from "react-hot-toast"
import { Navbar } from "@/components/navbar"
import { DashboardHeader } from "@/components/dashboard-header"
import { MetricsOverview } from "@/components/metrics-overview"
import { ActivityChart } from "@/components/activity-chart"
import { ConceptsCloud } from "@/components/concepts-cloud"
import { RecentActivity } from "@/components/recent-activity"
import { ProductivityInsights } from "@/components/productivity-insights"

export default function HomePage() {
  const { data: session, status } = useSession()
  const [showWelcome, setShowWelcome] = useState(false)
  const [todayStats, setTodayStats] = useState({
    focusSessions: 0,
    totalFocusTime: 0,
    averageFocusScore: 0,
    activitiesTracked: 0,
  })

  useEffect(() => {
    // Check if user is new (you can implement this logic based on your needs)
    const hasSeenWelcome = localStorage.getItem("synapse-welcome-seen")
    if (session && !hasSeenWelcome) {
      setShowWelcome(true)
    }
  }, [session])

  const handleWelcomeComplete = () => {
    setShowWelcome(false)
    localStorage.setItem("synapse-welcome-seen", "true")
    toast.success("Welcome to Synapse! Let's start your cognitive enhancement journey.")
  }

  const handleSessionComplete = async (type: "work" | "break" | "long_break", duration: number) => {
    if (!session) return

    try {
      const response = await fetch("/api/focus-sessions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type,
          duration,
          completed: true,
        }),
      })

      if (response.ok) {
        setTodayStats((prev) => ({
          ...prev,
          focusSessions: prev.focusSessions + 1,
          totalFocusTime: prev.totalFocusTime + duration,
        }))
        toast.success(`${type === "work" ? "Work" : "Break"} session completed!`)
      }
    } catch (error) {
      console.error("Error saving focus session:", error)
    }
  }

  const handleActivityUpdate = async (metrics: any) => {
    if (!session) return

    try {
      await fetch("/api/activities", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          url: window.location.href,
          title: document.title,
          domain: window.location.hostname,
          ...metrics,
        }),
      })

      setTodayStats((prev) => ({
        ...prev,
        activitiesTracked: prev.activitiesTracked + 1,
        averageFocusScore: Math.round((prev.averageFocusScore + metrics.focusScore) / 2),
      }))
    } catch (error) {
      console.error("Error saving activity:", error)
    }
  }

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!session) {
    return <WelcomeScreen />
  }

  if (showWelcome) {
    return <WelcomeScreen onGetStarted={handleWelcomeComplete} userName={session.user?.name || undefined} />
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <ActivityDetector />

      <main className="container mx-auto px-4 py-8">
        <DashboardHeader />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2">
            <PomodoroTimer onSessionComplete={handleSessionComplete} />
          </div>
          <div>
            <MetricsOverview />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <ActivityChart />
          <ConceptsCloud />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <RecentActivity />
          <ProductivityInsights />
        </div>
      </main>
    </div>
  )
}
