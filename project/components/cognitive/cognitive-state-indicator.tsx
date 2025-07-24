"use client"

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Brain, 
  Zap, 
  Timer, 
  Target, 
  AlertCircle,
  Activity,
  Lightbulb
} from "lucide-react"
import Link from 'next/link'

interface CognitiveIndicatorProps {
  showDetails?: boolean
  className?: string
}

export function CognitiveStateIndicator({ showDetails = false, className = "" }: CognitiveIndicatorProps) {
  const { data: session } = useSession()
  const [latestAssessment, setLatestAssessment] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (session?.user?.id) {
      fetchLatestAssessment()
    }
  }, [session])

  const fetchLatestAssessment = async () => {
    try {
      const response = await fetch('/api/cognitive/assess')
      if (response.ok) {
        const data = await response.json()
        if (data.assessments && data.assessments.length > 0) {
          setLatestAssessment(data.assessments[0])
        }
      }
    } catch (error) {
      console.error('Error fetching latest assessment:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStateColor = (state: string) => {
    switch (state) {
      case 'highly-focused': return 'bg-green-100 text-green-800 border-green-200'
      case 'focused': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'moderate-focus': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'low-focus': return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'fatigued': return 'bg-red-100 text-red-800 border-red-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getStateIcon = (state: string) => {
    switch (state) {
      case 'highly-focused': return <Zap className="h-4 w-4" />
      case 'focused': return <Target className="h-4 w-4" />
      case 'moderate-focus': return <Activity className="h-4 w-4" />
      case 'low-focus': return <AlertCircle className="h-4 w-4" />
      case 'fatigued': return <Timer className="h-4 w-4" />
      default: return <Brain className="h-4 w-4" />
    }
  }

  const getTimeAgo = (timestamp: string) => {
    const now = new Date()
    const assessmentTime = new Date(timestamp)
    const diffInHours = Math.abs(now.getTime() - assessmentTime.getTime()) / (1000 * 60 * 60)
    
    if (diffInHours < 1) {
      return `${Math.round(diffInHours * 60)} minutes ago`
    } else if (diffInHours < 24) {
      return `${Math.round(diffInHours)} hours ago`
    } else {
      return `${Math.round(diffInHours / 24)} days ago`
    }
  }

  const isStale = (timestamp: string) => {
    const now = new Date()
    const assessmentTime = new Date(timestamp)
    const diffInHours = Math.abs(now.getTime() - assessmentTime.getTime()) / (1000 * 60 * 60)
    return diffInHours > 4 // Consider stale after 4 hours
  }

  const getCognitiveState = (assessment: any) => {
    if (assessment.metadata?.cognitiveState) {
      return assessment.metadata.cognitiveState
    }
    // Fallback based on accuracy score
    if (assessment.accuracyScore >= 80) return 'highly-focused'
    if (assessment.accuracyScore >= 60) return 'focused'
    if (assessment.accuracyScore >= 40) return 'moderate-focus'
    if (assessment.accuracyScore >= 20) return 'low-focus'
    return 'fatigued'
  }

  const getMetrics = (assessment: any) => {
    if (assessment.metadata?.allMetrics) {
      return assessment.metadata.allMetrics
    }
    return {
      focusLevel: assessment.attentionLevel || 0,
      attentionSpan: assessment.comprehensionRate || 0,
      processingSpeed: assessment.responseTime || 0,
      overallScore: assessment.accuracyScore || 0
    }
  }

  const getRecommendations = (assessment: any) => {
    if (assessment.metadata?.recommendations) {
      return assessment.metadata.recommendations
    }
    return []
  }

  if (loading) {
    return (
      <div className={`animate-pulse ${className}`}>
        <div className="h-10 bg-gray-200 rounded"></div>
      </div>
    )
  }

  if (!latestAssessment) {
    return (
      <Card className={className}>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">No cognitive state data</span>
            </div>
            <Button asChild size="sm" variant="outline">
              <Link href="/cognitive">Take Assessment</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  const stale = isStale(latestAssessment.createdAt)
  const cognitiveState = getCognitiveState(latestAssessment)
  const metrics = getMetrics(latestAssessment)
  const recommendations = getRecommendations(latestAssessment)

  if (!showDetails) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <Badge className={`${getStateColor(cognitiveState)} flex items-center gap-1`}>
          {getStateIcon(cognitiveState)}
          {cognitiveState.replace('-', ' ')}
        </Badge>
        {stale && (
          <Button asChild size="sm" variant="ghost" className="text-xs">
            <Link href="/cognitive">Update</Link>
          </Button>
        )}
      </div>
    )
  }

  return (
    <Card className={className}>
      <CardContent className="p-4">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Badge className={`${getStateColor(cognitiveState)} flex items-center gap-1`}>
                {getStateIcon(cognitiveState)}
                {cognitiveState.replace('-', ' ')}
              </Badge>
              <span className="text-xs text-muted-foreground">
                {getTimeAgo(latestAssessment.createdAt)}
              </span>
            </div>
            <div className="text-lg font-bold">
              {Math.round(metrics.overallScore)}%
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 text-xs">
            <div className="text-center">
              <div className="font-semibold text-blue-600">
                {Math.round(metrics.focusLevel)}%
              </div>
              <div className="text-muted-foreground">Focus</div>
            </div>
            <div className="text-center">
              <div className="font-semibold text-green-600">
                {Math.round(metrics.attentionSpan)}%
              </div>
              <div className="text-muted-foreground">Attention</div>
            </div>
            <div className="text-center">
              <div className="font-semibold text-purple-600">
                {Math.round(metrics.processingSpeed)}%
              </div>
              <div className="text-muted-foreground">Speed</div>
            </div>
          </div>

          {recommendations.length > 0 && (
            <div className="bg-blue-50 border border-blue-200 rounded p-3">
              <div className="flex items-start gap-2">
                <Lightbulb className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                <div>
                  <div className="text-xs font-medium text-blue-800 mb-1">
                    Current Recommendation:
                  </div>
                  <div className="text-xs text-blue-700">
                    {recommendations[0]}
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-between items-center">
            {stale && (
              <div className="text-xs text-orange-600 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                Assessment may be outdated
              </div>
            )}
            <Button asChild size="sm" variant="outline" className="ml-auto">
              <Link href="/cognitive">
                {stale ? 'Retake Assessment' : 'View Details'}
              </Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
