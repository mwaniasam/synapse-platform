"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Brain, CheckCircle, XCircle, RefreshCw } from "lucide-react"
import { Resource } from "@/lib/resource-service"

interface ResourceViewerProps {
  resource: Resource
  onClose: () => void
}

export function ResourceViewer({ resource, onClose }: ResourceViewerProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<string>("")
  const [showResult, setShowResult] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)

  const handleQuizSubmit = () => {
    if (!resource.quizData || !selectedAnswer) return
    
    const correct = selectedAnswer === resource.quizData.correctAnswer
    setIsCorrect(correct)
    setShowResult(true)
  }

  const resetQuiz = () => {
    setSelectedAnswer("")
    setShowResult(false)
    setIsCorrect(false)
  }

  if (resource.format === 'quiz' && resource.quizData) {
    const { question, correctAnswer, incorrectAnswers } = resource.quizData
    const allAnswers = [correctAnswer, ...incorrectAnswers].sort(() => Math.random() - 0.5)

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
        <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5" />
                {resource.title}
              </CardTitle>
              <Button variant="outline" size="sm" onClick={onClose}>
                Close
              </Button>
            </div>
            <div className="flex gap-2">
              <Badge variant="secondary">{resource.subject}</Badge>
              <Badge className="bg-pink-100 text-pink-800">Quiz</Badge>
              <Badge className={
                resource.difficulty === 'beginner' ? 'bg-green-100 text-green-800' :
                resource.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              }>
                {resource.difficulty.charAt(0).toUpperCase() + resource.difficulty.slice(1)}
              </Badge>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="bg-muted p-4 rounded-lg">
              <h3 className="font-medium mb-2">Question:</h3>
              <p className="text-lg">{question}</p>
            </div>

            {!showResult ? (
              <div className="space-y-3">
                <h4 className="font-medium">Choose your answer:</h4>
                {allAnswers.map((answer, index) => (
                  <label
                    key={index}
                    className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${
                      selectedAnswer === answer ? 'border-primary bg-primary/5' : 'hover:bg-muted'
                    }`}
                  >
                    <input
                      type="radio"
                      name="quiz-answer"
                      value={answer}
                      checked={selectedAnswer === answer}
                      onChange={(e) => setSelectedAnswer(e.target.value)}
                      className="mr-3"
                    />
                    <span>{answer}</span>
                  </label>
                ))}
                
                <Button
                  onClick={handleQuizSubmit}
                  disabled={!selectedAnswer}
                  className="w-full mt-4"
                >
                  Submit Answer
                </Button>
              </div>
            ) : (
              <div className={`p-4 rounded-lg ${isCorrect ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                <div className="flex items-center gap-2 mb-3">
                  {isCorrect ? (
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-600" />
                  )}
                  <span className={`font-medium ${isCorrect ? 'text-green-800' : 'text-red-800'}`}>
                    {isCorrect ? 'Correct!' : 'Incorrect'}
                  </span>
                </div>
                
                {!isCorrect && (
                  <p className="mb-3">
                    <strong>Correct answer:</strong> {correctAnswer}
                  </p>
                )}
                
                <Button onClick={resetQuiz} variant="outline" className="flex items-center gap-2">
                  <RefreshCw className="h-4 w-4" />
                  Try Again
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    )
  }

  if (resource.provider === 'ai-generated' && resource.aiContent) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
        <Card className="max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5" />
                {resource.title}
              </CardTitle>
              <Button variant="outline" size="sm" onClick={onClose}>
                Close
              </Button>
            </div>
            <div className="flex gap-2">
              <Badge variant="secondary">{resource.subject}</Badge>
              <Badge className="bg-violet-100 text-violet-800">AI Generated</Badge>
              <Badge className={
                resource.difficulty === 'beginner' ? 'bg-green-100 text-green-800' :
                resource.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              }>
                {resource.difficulty.charAt(0).toUpperCase() + resource.difficulty.slice(1)}
              </Badge>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="prose max-w-none">
              <p className="text-muted-foreground text-lg">{resource.description}</p>
              
              <div className="bg-muted p-6 rounded-lg mt-6">
                <div className="whitespace-pre-wrap">{resource.aiContent.content}</div>
              </div>

              {resource.aiContent.keyPoints && resource.aiContent.keyPoints.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-xl font-semibold mb-3">Key Points</h3>
                  <ul className="space-y-2">
                    {resource.aiContent.keyPoints.map((point, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {resource.aiContent.exercises && resource.aiContent.exercises.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-xl font-semibold mb-3">Practice Exercises</h3>
                  <div className="space-y-3">
                    {resource.aiContent.exercises.map((exercise, index) => (
                      <div key={index} className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                        <div className="flex items-start gap-2">
                          <Badge variant="outline" className="text-xs">
                            {index + 1}
                          </Badge>
                          <span>{exercise}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return null
}
