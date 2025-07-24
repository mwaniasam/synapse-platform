import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const assessmentData = await request.json()
    const {
      gameResults,
      sessionDuration,
      timestamp,
      gameType
    } = assessmentData

    // Calculate cognitive state based on game performance
    const cognitiveState = calculateCognitiveState(gameResults, gameType)
    
    const cognitiveAssessment = await prisma.cognitiveData.create({
      data: {
        userId: session.user.id,
        gameType: gameType as any,
        gameResults: gameResults,
        sessionDuration: sessionDuration,
        cognitiveState: cognitiveState.state,
        focusLevel: cognitiveState.focusLevel,
        attentionSpan: cognitiveState.attentionSpan,
        processingSpeed: cognitiveState.processingSpeed,
        memoryPerformance: cognitiveState.memoryPerformance,
        decisionMaking: cognitiveState.decisionMaking,
        overallScore: cognitiveState.overallScore,
        recommendations: cognitiveState.recommendations,
        sessionType: gameType,
        attentionLevel: cognitiveState.focusLevel,
        comprehensionRate: cognitiveState.attentionSpan,
        responseTime: cognitiveState.processingSpeed,
        accuracyScore: cognitiveState.overallScore,
        cognitiveLoad: cognitiveState.memoryPerformance,
        metadata: {
          gameType,
          gameResults,
          cognitiveState: cognitiveState.state,
          recommendations: cognitiveState.recommendations,
          sessionDuration,
          allMetrics: cognitiveState
        },
      }
    })

    return NextResponse.json({
      state: cognitiveState.state,
      recommendations: cognitiveState.recommendations,
      metrics: {
        focusLevel: cognitiveState.focusLevel,
        attentionSpan: cognitiveState.attentionSpan,
        processingSpeed: cognitiveState.processingSpeed,
        memoryPerformance: cognitiveState.memoryPerformance,
        decisionMaking: cognitiveState.decisionMaking,
        overallScore: cognitiveState.overallScore,
      },
      assessmentId: cognitiveAssessment.id
    })
  } catch (error) {
    console.error('Error processing cognitive assessment:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

function calculateCognitiveState(gameResults: any, gameType: string) {
  let focusLevel = 0
  let attentionSpan = 0
  let processingSpeed = 0
  let memoryPerformance = 0
  let decisionMaking = 0

  switch (gameType) {
    case 'stroop-test':
      const { correctAnswers, totalQuestions, avgResponseTime, colorCongruency } = gameResults
      const accuracy = (correctAnswers / totalQuestions) * 100
      
      if (avgResponseTime < 1000) {
        processingSpeed = 100
      } else if (avgResponseTime < 2000) {
        processingSpeed = Math.max(60, 100 - ((avgResponseTime - 1000) / 1000) * 40)
      } else if (avgResponseTime < 3000) {
        processingSpeed = Math.max(20, 60 - ((avgResponseTime - 2000) / 1000) * 40)
      } else {
        processingSpeed = Math.max(0, 20 - ((avgResponseTime - 3000) / 1000) * 20)
      }
      
      focusLevel = accuracy
      
      if (colorCongruency && colorCongruency.interferenceEffect) {
        if (colorCongruency.interferenceEffect < 100) {
          focusLevel = Math.min(100, focusLevel + 10)
        } else if (colorCongruency.interferenceEffect > 300) {
          focusLevel = Math.max(0, focusLevel - 5)
        }
      }
      
      const variability = gameResults.responseVariability || 0
      if (variability < 300) {
        attentionSpan = Math.min(100, 90 + (300 - variability) / 30)
      } else if (variability < 600) {
        attentionSpan = Math.max(60, 90 - ((variability - 300) / 300) * 30)
      } else if (variability < 1000) {
        attentionSpan = Math.max(30, 60 - ((variability - 600) / 400) * 30)
      } else {
        attentionSpan = Math.max(10, 30 - ((variability - 1000) / 1000) * 20)
      }
      
      memoryPerformance = (focusLevel + attentionSpan) / 2
      
      decisionMaking = accuracy * 0.8 + (processingSpeed * 0.2)
      
      break

    case 'n-back':
      const { nLevel, accuracy: nAccuracy, avgReactionTime } = gameResults
      
      memoryPerformance = Math.min(100, nAccuracy * (1 + nLevel * 0.1))
      
      focusLevel = Math.min(100, nAccuracy)
      
      if (avgReactionTime < 800) {
        processingSpeed = 100
      } else if (avgReactionTime < 1500) {
        processingSpeed = Math.max(60, 100 - ((avgReactionTime - 800) / 700) * 40)
      } else if (avgReactionTime < 2000) {
        processingSpeed = Math.max(30, 60 - ((avgReactionTime - 1500) / 500) * 30)
      } else {
        processingSpeed = Math.max(0, 30 - ((avgReactionTime - 2000) / 1000) * 30)
      }
      
      attentionSpan = Math.min(100, memoryPerformance * 0.9)
      
      decisionMaking = memoryPerformance
      
      break

    case 'attention-network':
      const { alerting, orienting, executiveAttention, overallAccuracy } = gameResults
      
      focusLevel = Math.min(100, overallAccuracy)
      
      const alertingScore = Math.min(100, Math.max(0, alerting))
      const orientingScore = Math.min(100, Math.max(0, orienting))
      const executiveScore = Math.min(100, Math.max(0, executiveAttention))
      attentionSpan = (alertingScore + orientingScore + executiveScore) / 3
      
      if (gameResults.avgResponseTime) {
        if (gameResults.avgResponseTime < 600) {
          processingSpeed = 100
        } else if (gameResults.avgResponseTime < 1200) {
          processingSpeed = Math.max(60, 100 - ((gameResults.avgResponseTime - 600) / 600) * 40)
        } else {
          processingSpeed = Math.max(20, 60 - ((gameResults.avgResponseTime - 1200) / 800) * 40)
        }
      } else {
        processingSpeed = (focusLevel + attentionSpan) / 2
      }
      
      memoryPerformance = attentionSpan
      
      decisionMaking = (executiveScore * 0.7) + (focusLevel * 0.3)
      
      break

    case 'cognitive-battery':
      focusLevel = gameResults.focusScore || 0
      attentionSpan = gameResults.attentionScore || 0
      processingSpeed = gameResults.speedScore || 0
      memoryPerformance = gameResults.memoryScore || 0
      decisionMaking = gameResults.decisionScore || 0
      
      break
  }

  const overallScore = (focusLevel + attentionSpan + processingSpeed + memoryPerformance + decisionMaking) / 5

  let state = 'unknown'
  let recommendations = []

  if (overallScore >= 80) {
    state = 'highly-focused'
    recommendations = [
      'Perfect time for challenging tasks and complex learning',
      'Tackle your most difficult subjects',
      'Consider extending your study session',
      'Try advanced problem-solving exercises'
    ]
  } else if (overallScore >= 60) {
    state = 'focused'
    recommendations = [
      'Good time for regular study activities',
      'Focus on active learning techniques',
      'Take notes and practice problems',
      'Continue with planned learning goals'
    ]
  } else if (overallScore >= 40) {
    state = 'moderate-focus'
    recommendations = [
      'Consider lighter learning activities',
      'Review previously learned material',
      'Use visual aids and interactive content',
      'Take more frequent breaks'
    ]
  } else if (overallScore >= 20) {
    state = 'low-focus'
    recommendations = [
      'Take a short break before continuing',
      'Try relaxation or mindfulness exercises',
      'Switch to easier review activities',
      'Consider physical exercise to boost alertness'
    ]
  } else {
    state = 'fatigued'
    recommendations = [
      'Take a longer break (15-30 minutes)',
      'Get some fresh air or light exercise',
      'Stay hydrated and have a healthy snack',
      'Consider ending the study session if fatigue persists'
    ]
  }

  if (processingSpeed < 40) {
    recommendations.push('Slow down and focus on accuracy over speed')
  }
  if (memoryPerformance < 40) {
    recommendations.push('Use spaced repetition and memory techniques')
  }
  if (attentionSpan < 40) {
    recommendations.push('Use the Pomodoro technique with shorter intervals')
  }
  if (focusLevel < 40) {
    recommendations.push('Eliminate distractions and find a quieter environment')
  }

  return {
    state,
    focusLevel,
    attentionSpan,
    processingSpeed,
    memoryPerformance,
    decisionMaking,
    overallScore,
    recommendations
  }
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const recentAssessments = await prisma.cognitiveData.findMany({
      where: { 
        userId: session.user.id,
        createdAt: {
          gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
        }
      },
      orderBy: { createdAt: 'desc' },
      take: 20
    })

    return NextResponse.json({ assessments: recentAssessments })
  } catch (error) {
    console.error('Error fetching cognitive assessments:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
