"use client"

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { StroopTest } from '@/components/cognitive/stroop-test'
import { NBackTest } from '@/components/cognitive/n-back-test'
import { AttentionNetworkTest } from '@/components/cognitive/attention-network-test'
import { BrainAnimation } from "@/components/animations/brain-animation"
import { FocusAnimation } from "@/components/animations/focus-animation"
import { MemoryGridAnimation } from "@/components/animations/memory-grid-animation"
import { 
  Brain, 
  Zap, 
  Timer, 
  Target, 
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Lightbulb,
  Activity,
  BarChart3,
  Eye
} from "lucide-react"

interface CognitiveState {
  state: string
  recommendations: string[]
  metrics: {
    focusLevel: number
    attentionSpan: number
    processingSpeed: number
    memoryPerformance: number
    decisionMaking: number
    overallScore: number
  }
}

export default function CognitiveAssessmentPage() {
  const { data: session, status } = useSession()
  const [currentTest, setCurrentTest] = useState<'selection' | 'stroop' | 'n-back' | 'attention-network'>('selection')
  const [isAssessing, setIsAssessing] = useState(false)
  const [cognitiveState, setCognitiveState] = useState<CognitiveState | null>(null)
  const [assessmentHistory, setAssessmentHistory] = useState<any[]>([])
  const [startTime, setStartTime] = useState<number>(0)

  useEffect(() => {
    if (session?.user?.id) {
      fetchAssessmentHistory()
    }
  }, [session])

  const fetchAssessmentHistory = async () => {
    try {
      const response = await fetch('/api/cognitive/assess')
      if (response.ok) {
        const data = await response.json()
        setAssessmentHistory(data.assessments)
      }
    } catch (error) {
      console.error('Error fetching assessment history:', error)
    }
  }

  const submitAssessment = async (gameType: string, gameResults: any) => {
    setIsAssessing(true)
    const sessionDuration = Math.round((Date.now() - startTime) / 1000)

    try {
      const response = await fetch('/api/cognitive/assess', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          gameType,
          gameResults,
          sessionDuration,
          timestamp: new Date().toISOString(),
        }),
      })

      if (response.ok) {
        const result = await response.json()
        setCognitiveState(result)
        fetchAssessmentHistory()
      } else {
        console.error('Failed to submit assessment')
      }
    } catch (error) {
      console.error('Error submitting assessment:', error)
    } finally {
      setIsAssessing(false)
    }
  }

  const startTest = (testType: 'stroop' | 'n-back' | 'attention-network') => {
    setCurrentTest(testType)
    setStartTime(Date.now())
    setCognitiveState(null)
  }

  const getStateColor = (state: string) => {
    switch (state) {
      case 'highly-focused': return 'text-green-600 bg-green-50 border-green-200'
      case 'focused': return 'text-blue-600 bg-blue-50 border-blue-200'
      case 'moderate-focus': return 'text-yellow-600 bg-yellow-50 border-yellow-200'
      case 'low-focus': return 'text-orange-600 bg-orange-50 border-orange-200'
      case 'fatigued': return 'text-red-600 bg-red-50 border-red-200'
      default: return 'text-gray-600 bg-gray-50 border-gray-200'
    }
  }

  const getStateIcon = (state: string) => {
    switch (state) {
      case 'highly-focused': return <Zap className="h-5 w-5" />
      case 'focused': return <Target className="h-5 w-5" />
      case 'moderate-focus': return <Activity className="h-5 w-5" />
      case 'low-focus': return <AlertCircle className="h-5 w-5" />
      case 'fatigued': return <Timer className="h-5 w-5" />
      default: return <Brain className="h-5 w-5" />
    }
  }

  if (status === 'loading') {
    return (
      <div className="container mx-auto p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-64 mb-6"></div>
          <div className="grid gap-6">
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!session) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">
              Please sign in to access cognitive assessment.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Test rendering logic
  const renderTestResults = (cognitiveState: CognitiveState) => (
    <Card className="mt-6 max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {getStateIcon(cognitiveState.state)}
          Your Cognitive State
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-center">
          <Badge className={`text-lg py-2 px-4 ${getStateColor(cognitiveState.state)}`}>
            {cognitiveState.state.replace('-', ' ').toUpperCase()}
          </Badge>
          <p className="text-2xl font-bold mt-2">
            {Math.round(cognitiveState.metrics.overallScore)}% Overall Score
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {Math.round(cognitiveState.metrics.focusLevel)}%
            </div>
            <div className="text-sm text-muted-foreground">Focus Level</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {Math.round(cognitiveState.metrics.attentionSpan)}%
            </div>
            <div className="text-sm text-muted-foreground">Attention Span</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">
              {Math.round(cognitiveState.metrics.processingSpeed)}%
            </div>
            <div className="text-sm text-muted-foreground">Processing Speed</div>
          </div>
        </div>

        <Alert>
          <Lightbulb className="h-4 w-4" />
          <AlertDescription>
            <div className="font-semibold mb-2">Recommendations for your current state:</div>
            <ul className="space-y-1">
              {cognitiveState.recommendations.map((rec, index) => (
                <li key={index} className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">{rec}</span>
                </li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  )

  // Individual test pages
  if (currentTest === 'stroop') {
    return (
      <div className="container mx-auto p-6">
        <div className="mb-6">
          <Button 
            variant="outline" 
            onClick={() => setCurrentTest('selection')}
            className="mb-4"
          >
            ← Back to Tests
          </Button>
        </div>
        <StroopTest 
          onComplete={(results) => submitAssessment('stroop-test', results)} 
        />
        
        {isAssessing && (
          <Card className="mt-6 max-w-2xl mx-auto">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                <p>Analyzing your cognitive state...</p>
              </div>
            </CardContent>
          </Card>
        )}

        {cognitiveState && renderTestResults(cognitiveState)}
      </div>
    )
  }

  if (currentTest === 'n-back') {
    return (
      <div className="container mx-auto p-6">
        <div className="mb-6">
          <Button 
            variant="outline" 
            onClick={() => setCurrentTest('selection')}
            className="mb-4"
          >
            ← Back to Tests
          </Button>
        </div>
        <NBackTest 
          onComplete={(results) => submitAssessment('n-back-test', results)} 
        />
        
        {isAssessing && (
          <Card className="mt-6 max-w-2xl mx-auto">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                <p>Analyzing your cognitive state...</p>
              </div>
            </CardContent>
          </Card>
        )}

        {cognitiveState && renderTestResults(cognitiveState)}
      </div>
    )
  }

  if (currentTest === 'attention-network') {
    return (
      <div className="container mx-auto p-6">
        <div className="mb-6">
          <Button 
            variant="outline" 
            onClick={() => setCurrentTest('selection')}
            className="mb-4"
          >
            ← Back to Tests
          </Button>
        </div>
        <AttentionNetworkTest 
          onComplete={(results) => submitAssessment('attention-network-test', results)} 
        />
        
        {isAssessing && (
          <Card className="mt-6 max-w-2xl mx-auto">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                <p>Analyzing your cognitive state...</p>
              </div>
            </CardContent>
          </Card>
        )}

        {cognitiveState && renderTestResults(cognitiveState)}
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-8 text-center">
        <div className="flex justify-center mb-6">
          <BrainAnimation type="thinking" size="xl" />
        </div>
        <h1 className="text-3xl font-bold mb-3 flex items-center justify-center gap-2">
          <Brain className="h-8 w-8 text-blue-500" />
          Cognitive State Assessment
        </h1>
        <p className="text-muted-foreground text-lg">
          Discover your current cognitive state through scientifically-backed games and get personalized learning recommendations.
        </p>
      </div>

      {assessmentHistory.length > 0 && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Recent Assessment
            </CardTitle>
          </CardHeader>
          <CardContent>
            {(() => {
              const latest = assessmentHistory[0]
              const cognitiveState = latest.metadata?.cognitiveState || 'unknown'
              const overallScore = latest.metadata?.allMetrics?.overallScore || latest.accuracyScore || 0
              return (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Badge className={getStateColor(cognitiveState)}>
                      {cognitiveState.replace('-', ' ')}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      {new Date(latest.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="text-2xl font-bold">
                    {Math.round(overallScore)}%
                  </div>
                </div>
              )
            })()}
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="cursor-pointer hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="relative">
                <BrainAnimation type="processing" size="sm" />
              </div>
              Stroop Test
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-center mb-4">
              <div className="text-6xl animate-pulse">🎨</div>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Tests attention control and processing speed through color-word interference tasks.
            </p>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span>Duration:</span>
                <span>3-5 minutes</span>
              </div>
              <div className="flex justify-between">
                <span>Measures:</span>
                <span>Focus & Speed</span>
              </div>
            </div>
            <Button 
              onClick={() => startTest('stroop')} 
              className="w-full mt-4"
            >
              Start Test
            </Button>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="relative">
                <MemoryGridAnimation animationType="sequence" size="sm" />
              </div>
              N-Back Test
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-center mb-4">
              <div className="text-6xl animate-bounce">🧩</div>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Evaluates working memory and cognitive control through sequence recognition.
            </p>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span>Duration:</span>
                <span>5-8 minutes</span>
              </div>
              <div className="flex justify-between">
                <span>Measures:</span>
                <span>Memory & Attention</span>
              </div>
            </div>
            <Button 
              onClick={() => startTest('n-back')}
              className="w-full mt-4"
            >
              Start Test
            </Button>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="relative">
                <FocusAnimation type="target" size="sm" />
              </div>
              Attention Network
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-center mb-4">
              <div className="text-6xl animate-pulse">👁️</div>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Comprehensive test measuring alerting, orienting, and executive attention.
            </p>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span>Duration:</span>
                <span>8-12 minutes</span>
              </div>
              <div className="flex justify-between">
                <span>Measures:</span>
                <span>All Attention Types</span>
              </div>
            </div>
            <Button 
              onClick={() => startTest('attention-network')}
              className="w-full mt-4"
            >
              Start Test
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>How It Works</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div className="text-center">
              <div className="rounded-full bg-blue-100 p-3 w-fit mx-auto mb-2">
                <Brain className="h-6 w-6 text-blue-600" />
              </div>
              <h4 className="font-semibold mb-1">Take Assessment</h4>
              <p className="text-xs text-muted-foreground">Complete cognitive games that measure different aspects of mental performance</p>
            </div>
            <div className="text-center">
              <div className="rounded-full bg-green-100 p-3 w-fit mx-auto mb-2">
                <BarChart3 className="h-6 w-6 text-green-600" />
              </div>
              <h4 className="font-semibold mb-1">Analyze Results</h4>
              <p className="text-xs text-muted-foreground">AI analyzes your performance across multiple cognitive domains</p>
            </div>
            <div className="text-center">
              <div className="rounded-full bg-purple-100 p-3 w-fit mx-auto mb-2">
                <Target className="h-6 w-6 text-purple-600" />
              </div>
              <h4 className="font-semibold mb-1">Get State</h4>
              <p className="text-xs text-muted-foreground">Receive your current cognitive state classification</p>
            </div>
            <div className="text-center">
              <div className="rounded-full bg-yellow-100 p-3 w-fit mx-auto mb-2">
                <Lightbulb className="h-6 w-6 text-yellow-600" />
              </div>
              <h4 className="font-semibold mb-1">Follow Recommendations</h4>
              <p className="text-xs text-muted-foreground">Get personalized suggestions for optimal learning</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
