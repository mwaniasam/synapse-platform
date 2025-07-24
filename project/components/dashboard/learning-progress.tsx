"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { BookOpen, Clock, Target, Sparkles } from "lucide-react"

interface LearningProgressProps {
  recentResources: {
    id: string
    title: string
    subject: string
    progress: number
    timeSpent: number
    difficultyLevel: string
  }[]
}

export function LearningProgress({ recentResources }: LearningProgressProps) {
  const getDifficultyColor = (level: string) => {
    switch (level) {
      case 'beginner': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
      case 'intermediate': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
      case 'advanced': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
    }
  }

  return (
    <Card className="glass-card border-0 shadow-xl hover:shadow-2xl transition-all duration-300">
      <CardHeader>
        <CardTitle className="flex items-center gap-3 text-xl">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500/20 to-indigo-500/20 rounded-xl flex items-center justify-center">
            <BookOpen className="h-5 w-5 text-blue-600" />
          </div>
          Recent Learning Progress
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {recentResources.length > 0 ? recentResources.map((resource) => (
          <div key={resource.id} className="space-y-3 p-6 rounded-2xl border bg-gradient-to-r from-primary/5 to-accent/5 hover:shadow-lg transition-all duration-300">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">{resource.title}</h3>
              <Badge className={getDifficultyColor(resource.difficultyLevel)}>
                {resource.difficultyLevel}
              </Badge>
            </div>
            
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Target className="h-3 w-3" />
                {resource.subject}
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {Math.floor(resource.timeSpent / 60)}m
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm font-medium">
                <span>Progress</span>
                <span>{resource.progress}%</span>
              </div>
              <Progress value={resource.progress} className="h-3 rounded-full" />
            </div>
          </div>
        )) : (
          <div className="text-center py-16 text-muted-foreground">
            <div className="w-20 h-20 bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Sparkles className="h-10 w-10 text-primary" />
            </div>
            <p className="text-lg font-medium mb-2">Ready to start learning?</p>
            <p className="text-sm">Your progress will be tracked here as you explore resources</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}