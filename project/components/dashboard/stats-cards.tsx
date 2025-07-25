"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Brain, Clock, BookOpen, Target, Trophy, Zap, TrendingUp } from "lucide-react"

interface StatsCardsProps {
  stats: {
    totalStudyTime: number
    completedSessions: number
    resourcesCompleted: number
    currentStreak: number
    averageFocus: number
    comprehensionScore: number
  }
}

export function StatsCards({ stats }: StatsCardsProps) {
  return (
    <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
      <Card className="glass-card border-0 shadow-xl hover:shadow-2xl transition-all duration-300 group">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 sm:pb-4">
          <CardTitle className="text-base sm:text-lg font-semibold">Study Time</CardTitle>
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
            <Clock className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
          </div>
        </CardHeader>
        <CardContent className="space-y-2 sm:space-y-3">
          <div className="text-2xl sm:text-3xl font-bold">{Math.floor(stats.totalStudyTime / 60)}h {stats.totalStudyTime % 60}m</div>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Ready to begin your learning journey
          </p>
        </CardContent>
      </Card>

      <Card className="glass-card border-0 shadow-xl hover:shadow-2xl transition-all duration-300 group">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 sm:pb-4">
          <CardTitle className="text-base sm:text-lg font-semibold">Sessions</CardTitle>
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
            <Target className="h-5 w-5 sm:h-6 sm:w-6 text-green-600" />
          </div>
        </CardHeader>
        <CardContent className="space-y-2 sm:space-y-3">
          <div className="text-2xl sm:text-3xl font-bold">{stats.completedSessions}</div>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Start your first session today
          </p>
        </CardContent>
      </Card>

      <Card className="glass-card border-0 shadow-xl hover:shadow-2xl transition-all duration-300 group">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 sm:pb-4">
          <CardTitle className="text-base sm:text-lg font-semibold">Resources</CardTitle>
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-purple-500/20 to-indigo-500/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
            <BookOpen className="h-5 w-5 sm:h-6 sm:w-6 text-purple-600" />
          </div>
        </CardHeader>
        <CardContent className="space-y-2 sm:space-y-3">
          <div className="text-2xl sm:text-3xl font-bold">{stats.resourcesCompleted}</div>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Explore our learning library
          </p>
        </CardContent>
      </Card>

      <Card className="glass-card border-0 shadow-xl hover:shadow-2xl transition-all duration-300 group">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 sm:pb-4">
          <CardTitle className="text-base sm:text-lg font-semibold">Streak</CardTitle>
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
            <Trophy className="h-5 w-5 sm:h-6 sm:w-6 text-orange-600" />
          </div>
        </CardHeader>
        <CardContent className="space-y-2 sm:space-y-3">
          <div className="text-2xl sm:text-3xl font-bold">{stats.currentStreak} days</div>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Build your learning streak
          </p>
        </CardContent>
      </Card>

      <Card className="glass-card border-0 shadow-xl hover:shadow-2xl transition-all duration-300 group">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 sm:pb-4">
          <CardTitle className="text-base sm:text-lg font-semibold">Focus Score</CardTitle>
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-pink-500/20 to-rose-500/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
            <Brain className="h-5 w-5 sm:h-6 sm:w-6 text-pink-600" />
          </div>
        </CardHeader>
        <CardContent className="space-y-2 sm:space-y-3">
          <div className="text-2xl sm:text-3xl font-bold">{stats.averageFocus}%</div>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Track your concentration levels
          </p>
        </CardContent>
      </Card>

      <Card className="glass-card border-0 shadow-xl hover:shadow-2xl transition-all duration-300 group">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 sm:pb-4">
          <CardTitle className="text-base sm:text-lg font-semibold">Comprehension</CardTitle>
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-teal-500/20 to-cyan-500/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
            <TrendingUp className="h-5 w-5 sm:h-6 sm:w-6 text-teal-600" />
          </div>
        </CardHeader>
        <CardContent className="space-y-2 sm:space-y-3">
          <div className="text-2xl sm:text-3xl font-bold">{stats.comprehensionScore}%</div>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Measure your understanding
          </p>
        </CardContent>
      </Card>
    </div>
  )
}