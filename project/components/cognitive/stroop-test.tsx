"use client"

import { useState, useEffect, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { 
  Brain, 
  Zap, 
  Timer, 
  Target, 
  TrendingUp,
  Play,
  Pause,
  RotateCcw
} from "lucide-react"

interface StroopTestProps {
  onComplete: (results: StroopTestResults) => void
}

interface StroopTestResults {
  correctAnswers: number
  totalQuestions: number
  avgResponseTime: number
  colorCongruency: {
    congruentCorrect: number
    incongruentCorrect: number
    interferenceEffect: number
  }
  responseVariability: number
  responses: Array<{
    word: string
    color: string
    isCongruent: boolean
    userResponse: string
    isCorrect: boolean
    responseTime: number
  }>
}

const COLORS = ['red', 'blue', 'green', 'yellow', 'purple']
const COLOR_WORDS = ['RED', 'BLUE', 'GREEN', 'YELLOW', 'PURPLE']

export function StroopTest({ onComplete }: StroopTestProps) {
  const [gameState, setGameState] = useState<'instructions' | 'playing' | 'completed'>('instructions')
  const [currentTrial, setCurrentTrial] = useState(0)
  const [currentWord, setCurrentWord] = useState('')
  const [currentColor, setCurrentColor] = useState('')
  const [isCongruent, setIsCongruent] = useState(false)
  const [startTime, setStartTime] = useState(0)
  const [responses, setResponses] = useState<StroopTestResults['responses']>([])
  const [score, setScore] = useState(0)
  
  const TOTAL_TRIALS = 30
  const PROGRESS = (currentTrial / TOTAL_TRIALS) * 100

  const generateTrial = useCallback(() => {
    const wordIndex = Math.floor(Math.random() * COLOR_WORDS.length)
    const colorIndex = Math.floor(Math.random() * COLORS.length)
    const word = COLOR_WORDS[wordIndex]
    const color = COLORS[colorIndex]
    const congruent = wordIndex === colorIndex
    
    setCurrentWord(word)
    setCurrentColor(color)
    setIsCongruent(congruent)
    setStartTime(Date.now())
  }, [])

  const handleColorChoice = (chosenColor: string) => {
    const responseTime = Date.now() - startTime
    const isCorrect = chosenColor === currentColor
    
    const response = {
      word: currentWord,
      color: currentColor,
      isCongruent,
      userResponse: chosenColor,
      isCorrect,
      responseTime
    }
    
    setResponses(prev => [...prev, response])
    
    if (isCorrect) {
      setScore(prev => prev + 1)
    }

    if (currentTrial + 1 >= TOTAL_TRIALS) {
      // Test completed
      const allResponses = [...responses, response]
      calculateResults(allResponses)
    } else {
      setCurrentTrial(prev => prev + 1)
      generateTrial()
    }
  }

  const calculateResults = (allResponses: StroopTestResults['responses']) => {
    const correctAnswers = allResponses.filter(r => r.isCorrect).length
    const responseTimes = allResponses.map(r => r.responseTime)
    const avgResponseTime = responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length
    
    const congruentTrials = allResponses.filter(r => r.isCongruent)
    const incongruentTrials = allResponses.filter(r => !r.isCongruent)
    
    const congruentCorrect = congruentTrials.filter(r => r.isCorrect).length
    const incongruentCorrect = incongruentTrials.filter(r => r.isCorrect).length
    
    const congruentAvgTime = congruentTrials.reduce((sum, r) => sum + r.responseTime, 0) / congruentTrials.length
    const incongruentAvgTime = incongruentTrials.reduce((sum, r) => sum + r.responseTime, 0) / incongruentTrials.length
    
    const interferenceEffect = incongruentAvgTime - congruentAvgTime
    
    // Calculate response time variability (standard deviation)
    const mean = avgResponseTime
    const variance = responseTimes.reduce((sum, time) => sum + Math.pow(time - mean, 2), 0) / responseTimes.length
    const responseVariability = Math.sqrt(variance)

    const results: StroopTestResults = {
      correctAnswers,
      totalQuestions: TOTAL_TRIALS,
      avgResponseTime,
      colorCongruency: {
        congruentCorrect,
        incongruentCorrect,
        interferenceEffect
      },
      responseVariability,
      responses: allResponses
    }

    setGameState('completed')
    onComplete(results)
  }

  const startGame = () => {
    setGameState('playing')
    setCurrentTrial(0)
    setResponses([])
    setScore(0)
    generateTrial()
  }

  const resetGame = () => {
    setGameState('instructions')
    setCurrentTrial(0)
    setResponses([])
    setScore(0)
  }

  if (gameState === 'instructions') {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-6 w-6 text-blue-500" />
            Stroop Test - Cognitive Assessment
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center">
            <div className="text-6xl mb-4">🧠</div>
            <h3 className="text-xl font-semibold mb-3">Test Your Attention & Processing Speed</h3>
            <p className="text-muted-foreground mb-6">
              This test measures your cognitive flexibility and attention control. 
              You'll see color words displayed in different colors.
            </p>
          </div>
          
          <div className="bg-muted/50 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">Instructions:</h4>
            <ul className="space-y-2 text-sm">
              <li>• You'll see words like "RED" or "BLUE" displayed in various colors</li>
              <li>• <strong>Click the color the word is displayed in, NOT what the word says</strong></li>
              <li>• For example: If you see <span className="text-red-500 font-bold">BLUE</span>, click "Red"</li>
              <li>• Work as quickly and accurately as possible</li>
              <li>• There will be {TOTAL_TRIALS} trials</li>
            </ul>
          </div>

          <div className="flex justify-center">
            <Button onClick={startGame} size="lg" className="gap-2">
              <Play className="h-4 w-4" />
              Start Assessment
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (gameState === 'playing') {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-yellow-500" />
              Stroop Test
            </CardTitle>
            <Badge variant="outline">
              {currentTrial + 1} / {TOTAL_TRIALS}
            </Badge>
          </div>
          <Progress value={PROGRESS} className="mt-2" />
        </CardHeader>
        <CardContent className="space-y-8">
          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-4">
              Click the COLOR of the word, not what it says
            </p>
            
            <div className="mb-8">
              <div 
                className="text-8xl font-bold mb-4"
                style={{ color: currentColor }}
              >
                {currentWord}
              </div>
            </div>

            <div className="grid grid-cols-5 gap-3 max-w-md mx-auto">
              {COLORS.map((color) => (
                <Button
                  key={color}
                  onClick={() => handleColorChoice(color)}
                  variant="outline"
                  className="h-12 capitalize"
                  style={{ 
                    borderColor: color,
                    color: color
                  }}
                >
                  {color}
                </Button>
              ))}
            </div>
          </div>

          <div className="flex justify-center items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Target className="h-4 w-4" />
              Score: {score}/{currentTrial + 1}
            </div>
            <div className="flex items-center gap-1">
              <Timer className="h-4 w-4" />
              Trial {currentTrial + 1}
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-6 w-6 text-green-500" />
          Assessment Complete!
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-center">
          <div className="text-6xl mb-4">✨</div>
          <h3 className="text-xl font-semibold mb-3">Your cognitive state is being analyzed...</h3>
          <p className="text-muted-foreground">
            Final score: {score}/{TOTAL_TRIALS} ({Math.round((score/TOTAL_TRIALS) * 100)}% accuracy)
          </p>
        </div>

        <div className="flex justify-center">
          <Button onClick={resetGame} variant="outline" className="gap-2">
            <RotateCcw className="h-4 w-4" />
            Take Test Again
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
