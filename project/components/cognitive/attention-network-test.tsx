"use client"

import { useState, useEffect, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { 
  Brain, 
  Eye, 
  Timer, 
  Target, 
  TrendingUp,
  Play,
  RotateCcw,
  ArrowLeft,
  ArrowRight,
  Focus
} from "lucide-react"

interface AttentionNetworkTestProps {
  onComplete: (results: AttentionNetworkResults) => void
}

interface AttentionNetworkResults {
  overallAccuracy: number
  meanRT: number
  alerting: number
  orienting: number
  executiveAttention: number
  rtData: {
    noCue: number[]
    centerCue: number[]
    spatialCue: number[]
    congruent: number[]
    incongruent: number[]
    neutral: number[]
  }
  accuracyData: {
    overall: number
    congruent: number
    incongruent: number
    neutral: number
  }
}

type CueType = 'none' | 'center' | 'spatial'
type FlankingType = 'congruent' | 'incongruent' | 'neutral'
type Direction = 'left' | 'right'

interface Trial {
  cueType: CueType
  flankingType: FlankingType
  targetDirection: Direction
  targetPosition: 'above' | 'below'
}

const CUE_DURATION = 100 // ms
const CUE_TARGET_INTERVAL = 400 // ms
const TARGET_DURATION = 1700 // ms
const ITI_DURATION = 1500 // inter-trial interval

export function AttentionNetworkTest({ onComplete }: AttentionNetworkTestProps) {
  const [gameState, setGameState] = useState<'instructions' | 'playing' | 'completed'>('instructions')
  const [currentTrial, setCurrentTrial] = useState(0)
  const [trials, setTrials] = useState<Trial[]>([])
  const [showCue, setShowCue] = useState(false)
  const [showTarget, setShowTarget] = useState(false)
  const [currentTrialData, setCurrentTrialData] = useState<Trial | null>(null)
  const [responses, setResponses] = useState<Array<{
    trial: Trial
    response: Direction | null
    correct: boolean
    reactionTime: number
  }>>([])
  const [trialStartTime, setTrialStartTime] = useState(0)
  const [score, setScore] = useState({ correct: 0, total: 0 })

  const TOTAL_TRIALS = 48 // 4 cue types × 3 flanking × 2 directions × 2 positions

  const generateTrials = useCallback((): Trial[] => {
    const trials: Trial[] = []
    const cueTypes: CueType[] = ['none', 'center', 'spatial', 'spatial']
    const flankingTypes: FlankingType[] = ['congruent', 'incongruent', 'neutral']
    const directions: Direction[] = ['left', 'right']
    const positions: ('above' | 'below')[] = ['above', 'below']

    for (const cue of cueTypes) {
      for (const flanking of flankingTypes) {
        for (const direction of directions) {
          for (const position of positions) {
            trials.push({
              cueType: cue,
              flankingType: flanking,
              targetDirection: direction,
              targetPosition: position
            })
          }
        }
      }
    }

    // Shuffle trials
    for (let i = trials.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [trials[i], trials[j]] = [trials[j], trials[i]]
    }

    return trials
  }, [])

  const startGame = () => {
    const generatedTrials = generateTrials()
    setTrials(generatedTrials)
    setGameState('playing')
    setCurrentTrial(0)
    setResponses([])
    setScore({ correct: 0, total: 0 })
    runTrial(generatedTrials[0], 0)
  }

  const runTrial = (trial: Trial, trialIndex: number) => {
    setCurrentTrial(trialIndex)
    setCurrentTrialData(trial)
    setShowCue(false)
    setShowTarget(false)

    // Start with fixation period
    setTimeout(() => {
      if (trial.cueType !== 'none') {
        setShowCue(true)
        setTimeout(() => {
          setShowCue(false)
          setTimeout(() => {
            presentTarget()
          }, CUE_TARGET_INTERVAL - CUE_DURATION)
        }, CUE_DURATION)
      } else {
        setTimeout(() => {
          presentTarget()
        }, CUE_TARGET_INTERVAL)
      }
    }, 400) // Initial fixation
  }

  const presentTarget = () => {
    setShowTarget(true)
    setTrialStartTime(Date.now())

    setTimeout(() => {
      if (showTarget) {
        // No response given, record as incorrect
        recordResponse(null)
      }
    }, TARGET_DURATION)
  }

  const handleResponse = (direction: Direction) => {
    if (!showTarget) return
    recordResponse(direction)
  }

  const recordResponse = (response: Direction | null) => {
    if (!currentTrialData) return

    const reactionTime = Date.now() - trialStartTime
    const correct = response === currentTrialData.targetDirection
    
    setResponses(prev => [...prev, {
      trial: currentTrialData,
      response,
      correct,
      reactionTime
    }])

    if (correct) {
      setScore(prev => ({ correct: prev.correct + 1, total: prev.total + 1 }))
    } else {
      setScore(prev => ({ correct: prev.correct, total: prev.total + 1 }))
    }

    setShowTarget(false)

    // Inter-trial interval
    setTimeout(() => {
      if (currentTrial + 1 < trials.length) {
        runTrial(trials[currentTrial + 1], currentTrial + 1)
      } else {
        completeTest()
      }
    }, ITI_DURATION)
  }

  const completeTest = () => {
    const correctResponses = responses.filter(r => r.correct && r.response !== null)
    
    // Calculate RT data
    const rtData = {
      noCue: correctResponses.filter(r => r.trial.cueType === 'none').map(r => r.reactionTime),
      centerCue: correctResponses.filter(r => r.trial.cueType === 'center').map(r => r.reactionTime),
      spatialCue: correctResponses.filter(r => r.trial.cueType === 'spatial').map(r => r.reactionTime),
      congruent: correctResponses.filter(r => r.trial.flankingType === 'congruent').map(r => r.reactionTime),
      incongruent: correctResponses.filter(r => r.trial.flankingType === 'incongruent').map(r => r.reactionTime),
      neutral: correctResponses.filter(r => r.trial.flankingType === 'neutral').map(r => r.reactionTime)
    }

    // Calculate mean RTs
    const meanRT = (arr: number[]) => arr.length > 0 ? arr.reduce((a, b) => a + b) / arr.length : 0

    const noCueRT = meanRT(rtData.noCue)
    const centerCueRT = meanRT(rtData.centerCue)
    const spatialCueRT = meanRT(rtData.spatialCue)
    const congruentRT = meanRT(rtData.congruent)
    const incongruentRT = meanRT(rtData.incongruent)
    const neutralRT = meanRT(rtData.neutral)

    // Calculate network efficiencies
    const alerting = noCueRT - centerCueRT
    const orienting = centerCueRT - spatialCueRT
    const executiveAttention = incongruentRT - congruentRT

    // Calculate accuracy data
    const overallAccuracy = (responses.filter(r => r.correct).length / responses.length) * 100
    const congruentAccuracy = responses.filter(r => r.trial.flankingType === 'congruent').filter(r => r.correct).length / responses.filter(r => r.trial.flankingType === 'congruent').length * 100
    const incongruentAccuracy = responses.filter(r => r.trial.flankingType === 'incongruent').filter(r => r.correct).length / responses.filter(r => r.trial.flankingType === 'incongruent').length * 100
    const neutralAccuracy = responses.filter(r => r.trial.flankingType === 'neutral').filter(r => r.correct).length / responses.filter(r => r.trial.flankingType === 'neutral').length * 100

    const results: AttentionNetworkResults = {
      overallAccuracy,
      meanRT: meanRT(correctResponses.map(r => r.reactionTime)),
      alerting: Math.max(0, alerting),
      orienting: Math.max(0, orienting),
      executiveAttention: Math.max(0, executiveAttention),
      rtData,
      accuracyData: {
        overall: overallAccuracy,
        congruent: congruentAccuracy || 0,
        incongruent: incongruentAccuracy || 0,
        neutral: neutralAccuracy || 0
      }
    }

    setGameState('completed')
    onComplete(results)
  }

  const renderCue = () => {
    if (!showCue || !currentTrialData) return null

    const position = currentTrialData.targetPosition
    const isAbove = position === 'above'

    return (
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className={`${isAbove ? 'mb-16' : 'mt-16'}`}>
          {currentTrialData.cueType === 'center' && (
            <div className="w-4 h-4 border-2 border-yellow-500"></div>
          )}
          {currentTrialData.cueType === 'spatial' && (
            <div className={`w-4 h-4 border-2 border-yellow-500 ${isAbove ? 'mb-32' : 'mt-32'}`}></div>
          )}
        </div>
      </div>
    )
  }

  const renderTarget = () => {
    if (!showTarget || !currentTrialData) return null

    const { flankingType, targetDirection, targetPosition } = currentTrialData
    const isAbove = targetPosition === 'above'

    const renderArrow = (direction: Direction, isTarget: boolean = false) => {
      const Icon = direction === 'left' ? ArrowLeft : ArrowRight
      return (
        <Icon 
          className={`h-8 w-8 ${isTarget ? 'text-red-500' : 'text-gray-600'}`} 
        />
      )
    }

    const renderArrowSet = () => {
      switch (flankingType) {
        case 'congruent':
          return (
            <div className="flex items-center">
              {renderArrow(targetDirection)}
              {renderArrow(targetDirection)}
              {renderArrow(targetDirection, true)}
              {renderArrow(targetDirection)}
              {renderArrow(targetDirection)}
            </div>
          )
        case 'incongruent':
          const oppositeDirection = targetDirection === 'left' ? 'right' : 'left'
          return (
            <div className="flex items-center">
              {renderArrow(oppositeDirection)}
              {renderArrow(oppositeDirection)}
              {renderArrow(targetDirection, true)}
              {renderArrow(oppositeDirection)}
              {renderArrow(oppositeDirection)}
            </div>
          )
        case 'neutral':
          return (
            <div className="flex items-center">
              <div className="w-8 h-8 flex items-center justify-center">
                <div className="w-4 h-1 bg-gray-600"></div>
              </div>
              <div className="w-8 h-8 flex items-center justify-center">
                <div className="w-4 h-1 bg-gray-600"></div>
              </div>
              {renderArrow(targetDirection, true)}
              <div className="w-8 h-8 flex items-center justify-center">
                <div className="w-4 h-1 bg-gray-600"></div>
              </div>
              <div className="w-8 h-8 flex items-center justify-center">
                <div className="w-4 h-1 bg-gray-600"></div>
              </div>
            </div>
          )
      }
    }

    return (
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className={isAbove ? 'mb-16' : 'mt-16'}>
          {renderArrowSet()}
        </div>
      </div>
    )
  }

  const resetGame = () => {
    setGameState('instructions')
    setCurrentTrial(0)
    setResponses([])
    setScore({ correct: 0, total: 0 })
  }

  if (gameState === 'instructions') {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-6 w-6 text-green-500" />
            Attention Network Test (ANT)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center">
            <div className="text-6xl mb-4">👁️</div>
            <h3 className="text-xl font-semibold mb-3">Test Your Attention Networks</h3>
            <p className="text-muted-foreground mb-6">
              This test measures three different attention networks: alerting, orienting, and executive attention.
            </p>
          </div>
          
          <div className="bg-muted/50 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">Instructions:</h4>
            <ul className="space-y-2 text-sm">
              <li>• Look at the <span className="font-bold text-red-500">center (red)</span> arrow in groups of 5 arrows</li>
              <li>• Press the left arrow key if the center arrow points ←</li>
              <li>• Press the right arrow key if the center arrow points →</li>
              <li>• Ignore the surrounding arrows - focus only on the center one</li>
              <li>• Sometimes you&apos;ll see cues (yellow boxes) before the arrows</li>
              <li>• Respond as quickly and accurately as possible</li>
            </ul>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded p-3">
            <h4 className="font-semibold text-blue-800 mb-2">Examples:</h4>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <div className="flex">
                  <ArrowLeft className="h-4 w-4 text-gray-600" />
                  <ArrowLeft className="h-4 w-4 text-gray-600" />
                  <ArrowLeft className="h-4 w-4 text-red-500" />
                  <ArrowLeft className="h-4 w-4 text-gray-600" />
                  <ArrowLeft className="h-4 w-4 text-gray-600" />
                </div>
                <span>→ Press Left (congruent)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex">
                  <ArrowRight className="h-4 w-4 text-gray-600" />
                  <ArrowRight className="h-4 w-4 text-gray-600" />
                  <ArrowLeft className="h-4 w-4 text-red-500" />
                  <ArrowRight className="h-4 w-4 text-gray-600" />
                  <ArrowRight className="h-4 w-4 text-gray-600" />
                </div>
                <span>→ Press Left (incongruent)</span>
              </div>
            </div>
          </div>

          <div className="flex justify-center">
            <Button onClick={startGame} size="lg" className="gap-2">
              <Play className="h-4 w-4" />
              Start Attention Test
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (gameState === 'playing') {
    const progress = (currentTrial / TOTAL_TRIALS) * 100

    return (
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5 text-green-500" />
              Attention Network Test
            </CardTitle>
            <Badge variant="outline">
              {currentTrial + 1} / {TOTAL_TRIALS}
            </Badge>
          </div>
          <Progress value={progress} className="mt-2" />
        </CardHeader>
        <CardContent className="space-y-8">
          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-4">
              Focus on the center arrow and respond with arrow keys
            </p>
            
            <div className="relative h-64 w-full flex items-center justify-center">
              {/* Fixation cross */}
              <div className="absolute text-2xl font-bold">+</div>
              
              {/* Cue */}
              {renderCue()}
              
              {/* Target */}
              {renderTarget()}
            </div>

            <div className="flex gap-4 justify-center mt-8">
              <Button
                onClick={() => handleResponse('left')}
                size="lg"
                variant="outline"
                className="gap-2"
                disabled={!showTarget}
              >
                <ArrowLeft className="h-4 w-4" />
                Left
              </Button>
              <Button
                onClick={() => handleResponse('right')}
                size="lg"
                variant="outline"
                className="gap-2"
                disabled={!showTarget}
              >
                <ArrowRight className="h-4 w-4" />
                Right
              </Button>
            </div>
          </div>

          <div className="flex justify-center items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Target className="h-4 w-4" />
              Score: {score.correct}/{score.total}
            </div>
            <div className="flex items-center gap-1">
              <Timer className="h-4 w-4" />
              Accuracy: {score.total > 0 ? Math.round((score.correct / score.total) * 100) : 0}%
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
          Attention Networks Assessed!
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-center">
          <div className="text-6xl mb-4">🎯</div>
          <h3 className="text-xl font-semibold mb-3">All attention networks measured!</h3>
          <p className="text-muted-foreground">
            Overall accuracy: {Math.round(score.correct / score.total * 100)}%
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
