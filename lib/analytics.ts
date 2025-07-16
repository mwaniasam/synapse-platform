import { prisma } from "./prisma"
import { startOfDay, endOfDay, subDays, format } from "date-fns"

export class AnalyticsEngine {
  async generateDailyAnalytics(userId: string, date = new Date()) {
    const startDate = startOfDay(date)
    const endDate = endOfDay(date)

    const sessions = await prisma.learningSession.findMany({
      where: {
        userId,
        startTime: {
          gte: startDate,
          lte: endDate,
        },
      },
      include: {
        interactions: true,
        knowledgeNodes: true,
      },
    })

    const totalFocusTime =
      sessions.reduce((sum, session) => {
        return sum + (session.duration || 0)
      }, 0) / 60 // Convert to minutes

    const averageSessionDuration = sessions.length > 0 ? totalFocusTime / sessions.length : 0

    const conceptsLearned = sessions.reduce((sum, session) => {
      return sum + session.knowledgeNodes.length
    }, 0)

    const productivityScore = this.calculateProductivityScore(sessions)
    const cognitiveStateBreakdown = this.analyzeCognitiveStates(sessions)
    const improvementAreas = this.identifyImprovementAreas(sessions)
    const recommendations = this.generateRecommendations(sessions, improvementAreas)

    // Save analytics data
    await prisma.analyticsData.upsert({
      where: {
        userId_date: {
          userId,
          date: startDate,
        },
      },
      update: {
        totalFocusTime: Math.round(totalFocusTime),
        averageSessionDuration: Math.round(averageSessionDuration),
        conceptsLearned,
        productivityScore,
        cognitiveStateBreakdown,
        improvementAreas,
        recommendations,
      },
      create: {
        userId,
        date: startDate,
        totalFocusTime: Math.round(totalFocusTime),
        averageSessionDuration: Math.round(averageSessionDuration),
        conceptsLearned,
        productivityScore,
        cognitiveStateBreakdown,
        improvementAreas,
        recommendations,
      },
    })

    return {
      totalFocusTime,
      averageSessionDuration,
      conceptsLearned,
      productivityScore,
      cognitiveStateBreakdown,
      improvementAreas,
      recommendations,
    }
  }

  private calculateProductivityScore(sessions: any[]): number {
    if (sessions.length === 0) return 0

    const avgFocusScore = sessions.reduce((sum, s) => sum + s.focusScore, 0) / sessions.length
    const avgComprehension = sessions.reduce((sum, s) => sum + s.comprehensionRate, 0) / sessions.length
    const avgRetention = sessions.reduce((sum, s) => sum + s.retentionScore, 0) / sessions.length

    return Math.round(avgFocusScore * 0.4 + avgComprehension * 0.3 + avgRetention * 0.3)
  }

  private analyzeCognitiveStates(sessions: any[]) {
    const states = { focused: 0, receptive: 0, distracted: 0, fatigued: 0 }

    sessions.forEach((session) => {
      if (states.hasOwnProperty(session.cognitiveState)) {
        states[session.cognitiveState as keyof typeof states]++
      }
    })

    return states
  }

  private identifyImprovementAreas(sessions: any[]): string[] {
    const areas: string[] = []

    const avgFocusScore = sessions.reduce((sum, s) => sum + s.focusScore, 0) / sessions.length
    const avgSessionDuration = sessions.reduce((sum, s) => sum + (s.duration || 0), 0) / sessions.length / 60

    if (avgFocusScore < 60) {
      areas.push("focus_improvement")
    }
    if (avgSessionDuration < 15) {
      areas.push("session_duration")
    }

    const distractedSessions = sessions.filter((s) => s.cognitiveState === "distracted").length
    if (distractedSessions / sessions.length > 0.3) {
      areas.push("distraction_management")
    }

    return areas
  }

  private generateRecommendations(sessions: any[], improvementAreas: string[]): string[] {
    const recommendations: string[] = []

    if (improvementAreas.includes("focus_improvement")) {
      recommendations.push("Try the Pomodoro Technique: 25 minutes focused work, 5 minute breaks")
      recommendations.push("Eliminate distractions in your environment")
    }

    if (improvementAreas.includes("session_duration")) {
      recommendations.push("Gradually increase your learning session duration")
      recommendations.push("Set specific learning goals for each session")
    }

    if (improvementAreas.includes("distraction_management")) {
      recommendations.push("Use website blockers during learning sessions")
      recommendations.push("Practice mindfulness exercises before studying")
    }

    return recommendations
  }

  async getWeeklyTrends(userId: string) {
    const endDate = new Date()
    const startDate = subDays(endDate, 7)

    const analytics = await prisma.analyticsData.findMany({
      where: {
        userId,
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
      orderBy: { date: "asc" },
    })

    return analytics.map((data) => ({
      date: format(data.date, "MMM dd"),
      focusTime: data.totalFocusTime,
      productivity: data.productivityScore,
      concepts: data.conceptsLearned,
    }))
  }

  async getMonthlyInsights(userId: string) {
    const endDate = new Date()
    const startDate = subDays(endDate, 30)

    const analytics = await prisma.analyticsData.findMany({
      where: {
        userId,
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
    })

    const totalFocusTime = analytics.reduce((sum, a) => sum + a.totalFocusTime, 0)
    const totalConcepts = analytics.reduce((sum, a) => sum + a.conceptsLearned, 0)
    const avgProductivity = analytics.reduce((sum, a) => sum + a.productivityScore, 0) / analytics.length

    return {
      totalFocusTime,
      totalConcepts,
      avgProductivity: Math.round(avgProductivity),
      activeDays: analytics.length,
      streak: this.calculateStreak(analytics),
    }
  }

  private calculateStreak(analytics: any[]): number {
    if (analytics.length === 0) return 0

    let streak = 0
    const sortedAnalytics = analytics.sort((a, b) => b.date.getTime() - a.date.getTime())

    for (const data of sortedAnalytics) {
      if (data.totalFocusTime > 0) {
        streak++
      } else {
        break
      }
    }

    return streak
  }
}
