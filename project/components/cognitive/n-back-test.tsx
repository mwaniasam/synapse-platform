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
  RotateCcw,
  Square,
  CheckCircle,
  X
} from "lucide-react"

interface NBackTestProps {
  onComplete: (results: NBackTestResults) => void
}

interface NBackTestResults {
  nLevel: number
  totalTrials: number
  correctTargets: number
  falseAlarms: number
  missedTargets: number
  correctRejections: number
  accuracy: number
  sensitivity: number
  responseTime: number
  avgReactionTime: number
  responses: Array<{
    stimulus: string
    position: number
    isTarget: boolean
    userResponse: boolean
    isCorrect: boolean
    responseTime: number
  }>
}

const GRID_SIZE = 3
const STIMULUS_DURATION = 500 // ms
const ISI_DURATION = 2000 // inter-stimulus interval
const TOTAL_TRIALS = 20 + 2 // +2 for n-back buffer

const generatePosition = () => Math.floor(Math.random() * (GRID_SIZE * GRID_SIZE))

export function NBackTest({ onComplete }: NBackTestProps) {
  const [gameState, setGameState] = useState<'instructions' | 'playing' | 'completed'>('instructions')
  const [nLevel, setNLevel] = useState(2) // Default to 2-back
  const [currentTrial, setCurrentTrial] = useState(0)
  const [stimulusSequence, setStimulusSequence] = useState<number[]>([])
  const [currentPosition, setCurrentPosition] = useState<number | null>(null)
  const [showStimulus, setShowStimulus] = useState(false)
  const [responses, setResponses] = useState<NBackTestResults['responses']>([])
  const [startTime, setStartTime] = useState(0)
  const [trialStartTime, setTrialStartTime] = useState(0)
  const [userResponded, setUserResponded] = useState(false)
  const [score, setScore] = useState({ correct: 0, total: 0 })

  const generateSequence = useCallback(() => {
    const sequence: number[] = []
    const targetProbability = 0.3 // 30% targets
    
    // Generate first n positions randomly
    for (let i = 0; i < nLevel; i++) {
      sequence.push(generatePosition())
    }
    
    // Generate remaining positions with controlled targets
    for (let i = nLevel; i < TOTAL_TRIALS; i++) {
      if (Math.random() < targetProbability) {
        // Create target (same as n positions back)
        sequence.push(sequence[i - nLevel])
      } else {
        // Create non-target (different from n positions back)
        let newPos
        do {
          newPos = generatePosition()
        } while (newPos === sequence[i - nLevel])
        sequence.push(newPos)
      }
    }
    
    return sequence
  }, [nLevel])

  const startGame = () => {
    const sequence = generateSequence()
    setStimulusSequence(sequence)
    setGameState('playing')
    setCurrentTrial(0)
    setResponses([])
    setScore({ correct: 0, total: 0 })
    setStartTime(Date.now())
    presentStimulus(sequence, 0)
  }

  const presentStimulus = (sequence: number[], trialIndex: number) => {
    if (trialIndex >= sequence.length) {
      completeTest()
      return
    }

    setCurrentTrial(trialIndex)
    setCurrentPosition(sequence[trialIndex])
    setShowStimulus(true)
    setUserResponded(false)
    setTrialStartTime(Date.now())

    // Hide stimulus after duration
    setTimeout(() => {
      setShowStimulus(false)
      setCurrentPosition(null)
      
      // Start ISI period
      setTimeout(() => {
        if (!userResponded) {
          recordResponse(false, Date.now() - trialStartTime)
        }
        presentStimulus(sequence, trialIndex + 1)
      }, ISI_DURATION)
    }, STIMULUS_DURATION)
  }

  const handleResponse = (isTarget: boolean) => {
    if (userResponded || !showStimulus) return
    
    const responseTime = Date.now() - trialStartTime
    setUserResponded(true)
    recordResponse(isTarget, responseTime)
  }

  const recordResponse = (userResponse: boolean, responseTime: number) => {
    if (currentTrial < nLevel) return // Skip first n trials
    
    const actualTarget = stimulusSequence[currentTrial] === stimulusSequence[currentTrial - nLevel]
    const isCorrect = userResponse === actualTarget
    
    const response = {
      stimulus: `${currentTrial}`,
      position: stimulusSequence[currentTrial],
      isTarget: actualTarget,
      userResponse,
      isCorrect,
      responseTime
    }

    setResponses(prev => [...prev, response])
    
    if (isCorrect) {
      setScore(prev => ({ correct: prev.correct + 1, total: prev.total + 1 }))
    } else {
      setScore(prev => ({ correct: prev.correct, total: prev.total + 1 }))
    }
  }

  const completeTest = () => {
    const validResponses = responses.filter((_, index) => index >= 0) // All responses are valid after n-level buffer
    
    const correctTargets = validResponses.filter(r => r.isTarget && r.userResponse).length
    const falseAlarms = validResponses.filter(r => !r.isTarget && r.userResponse).length
    const missedTargets = validResponses.filter(r => r.isTarget && !r.userResponse).length
    const correctRejections = validResponses.filter(r => !r.isTarget && !r.userResponse).length
    
    const totalTargets = validResponses.filter(r => r.isTarget).length
    const totalNonTargets = validResponses.filter(r => !r.isTarget).length
    
    const hitRate = totalTargets > 0 ? correctTargets / totalTargets : 0
    const falseAlarmRate = totalNonTargets > 0 ? falseAlarms / totalNonTargets : 0
    
    const accuracy = validResponses.length > 0 ? 
      (correctTargets + correctRejections) / validResponses.length * 100 : 0
    
    // Calculate d-prime (sensitivity)
    const zHit = hitRate === 1 ? 2.576 : hitRate === 0 ? -2.576 : normalInverse(hitRate)
    const zFA = falseAlarmRate === 1 ? 2.576 : falseAlarmRate === 0 ? -2.576 : normalInverse(falseAlarmRate)
    const sensitivity = zHit - zFA
    
    const avgReactionTime = validResponses.length > 0 ? 
      validResponses.reduce((sum, r) => sum + r.responseTime, 0) / validResponses.length : 0

    const results: NBackTestResults = {
      nLevel,
      totalTrials: validResponses.length,
      correctTargets,
      falseAlarms,
      missedTargets,
      correctRejections,
      accuracy,
      sensitivity,
      responseTime: avgReactionTime,
      avgReactionTime,
      responses: validResponses
    }

    setGameState('completed')
    onComplete(results)
  }

  // Simplified normal inverse approximation
  const normalInverse = (p: number): number => {
    if (p <= 0) return -3
    if (p >= 1) return 3
    
    const a = [0, -3.969683028665376e+01, 2.209460984245205e+02, -2.759285104469687e+02, 1.383577518672690e+02, -3.066479806614716e+01, 2.506628277459239e+00]
    const b = [0, -5.447609879822406e+01, 1.615858368580409e+02, -1.556989798598866e+02, 6.680131188771972e+01, -1.328068155288572e+01]
    
    const q = p - 0.5
    if (Math.abs(q) <= 0.425) {
      const r = 0.180625 - q * q
      return q * (((((a[6] * r + a[5]) * r + a[4]) * r + a[3]) * r + a[2]) * r + a[1]) * r + a[0] /
             (((((b[6] * r + b[5]) * r + b[4]) * r + b[3]) * r + b[2]) * r + b[1]) * r + 1
    }
    
    const r = q < 0 ? p : 1 - p
    const t = Math.sqrt(-Math.log(r))
    return (q < 0 ? -1 : 1) * (2.30753 + t * 0.27061) / (1 + t * (0.99229 + t * 0.04481))
  }

  const resetGame = () => {
    setGameState('instructions')
    setCurrentTrial(0)
    setResponses([])
    setScore({ correct: 0, total: 0 })
  }

  const renderGrid = () => {
    const cells = []
    for (let i = 0; i < GRID_SIZE * GRID_SIZE; i++) {
      const isActive = showStimulus && currentPosition === i
      cells.push(
        <div
          key={i}
          className={`w-16 h-16 border-2 border-gray-300 rounded-lg flex items-center justify-center transition-all duration-200 ${
            isActive ? 'bg-blue-500 border-blue-600' : 'bg-gray-100'
          }`}
        >
          {isActive && <Square className="h-8 w-8 text-white fill-current" />}
        </div>
      )
    }
    return cells
  }

  if (gameState === 'instructions') {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-6 w-6 text-purple-500" />
            N-Back Test - Working Memory Assessment
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center">
            <div className="text-6xl mb-4">🧩</div>
            <h3 className="text-xl font-semibold mb-3">Test Your Working Memory</h3>
            <p className="text-muted-foreground mb-6">
              This test measures your ability to remember and update information in working memory.
            </p>
          </div>
          
          <div className="bg-muted/50 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">Instructions:</h4>
            <ul className="space-y-2 text-sm">
              <li>• You&apos;ll see squares light up one at a time in a 3x3 grid</li>
              <li>• Your task: Press &quot;Target&quot; if the current square is in the same position as <strong>{nLevel} steps back</strong></li>
              <li>• Press &quot;No Target&quot; if it&apos;s in a different position</li>
              <li>• For example: If position 3 appears, then 2 trials later position 3 appears again, that&apos;s a target</li>
              <li>• React quickly but accurately - each square shows for only 0.5 seconds</li>
            </ul>
          </div>

          <div className="flex items-center justify-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm">Difficulty:</span>
              <div className="flex gap-1">
                {[1, 2, 3].map((level) => (
                  <Button
                    key={level}
                    variant={nLevel === level ? "default" : "outline"}
                    size="sm"
                    onClick={() => setNLevel(level)}
                  >
                    {level}-Back
                  </Button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-center">
            <Button onClick={startGame} size="lg" className="gap-2">
              <Play className="h-4 w-4" />
              Start {nLevel}-Back Test
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (gameState === 'playing') {
    const progress = currentTrial >= nLevel ? 
      ((currentTrial - nLevel) / (TOTAL_TRIALS - nLevel)) * 100 : 0

    return (
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-purple-500" />
              {nLevel}-Back Test
            </CardTitle>
            <Badge variant="outline">
              Trial {currentTrial + 1} / {TOTAL_TRIALS}
            </Badge>
          </div>
          <Progress value={progress} className="mt-2" />
        </CardHeader>
        <CardContent className="space-y-8">
          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-4">
              Is this square in the same position as {nLevel} steps back?
            </p>
            
            <div className="grid grid-cols-3 gap-2 max-w-48 mx-auto mb-8">
              {renderGrid()}
            </div>

            <div className="flex gap-4 justify-center">
              <Button
                onClick={() => handleResponse(true)}
                size="lg"
                variant="default"
                className="gap-2 bg-green-600 hover:bg-green-700"
                disabled={!showStimulus || userResponded}
              >
                <CheckCircle className="h-4 w-4" />
                Target
              </Button>
              <Button
                onClick={() => handleResponse(false)}
                size="lg"
                variant="outline"
                className="gap-2"
                disabled={!showStimulus || userResponded}
              >
                <X className="h-4 w-4" />
                No Target
              </Button>
            </div>
          </div>

          <div className="flex justify-center items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Target className="h-4 w-4" />
              Score: {score.correct}/{score.total}
            </div>
            {currentTrial >= nLevel && (
              <div className="flex items-center gap-1">
                <Timer className="h-4 w-4" />
                Accuracy: {score.total > 0 ? Math.round((score.correct / score.total) * 100) : 0}%
              </div>
            )}
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
          {nLevel}-Back Test Complete!
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-center">
          <div className="text-6xl mb-4">🎯</div>
          <h3 className="text-xl font-semibold mb-3">Working memory assessed!</h3>
          <p className="text-muted-foreground">
            Final accuracy: {Math.round(score.correct / score.total * 100)}% ({score.correct}/{score.total})
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
