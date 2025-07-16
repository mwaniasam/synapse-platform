"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Loader2, BookOpen, Brain, CheckCircle, XCircle } from "lucide-react"
import { CognitiveMonitor } from "./cognitive-monitor"

interface LearningContent {
  topic: string
  difficulty: "beginner" | "intermediate" | "advanced"
  content: string
  keyPoints: string[]
  exercises: Array<{
    question: string
    type: "multiple-choice" | "short-answer" | "essay"
    options?: string[]
    answer?: string
  }>
}

export function LearningInterface() {
  const [topic, setTopic] = useState("")
  const [difficulty, setDifficulty] = useState<"beginner" | "intermediate" | "advanced">("beginner")
  const [content, setContent] = useState<LearningContent | null>(null)
  const [loading, setLoading] = useState(false)
  const [currentExercise, setCurrentExercise] = useState(0)
  const [userAnswers, setUserAnswers] = useState<string[]>([])
  const [showResults, setShowResults] = useState(false)
  const [sessionStarted, setSessionStarted] = useState(false)

  const generateContent = async () => {
    if (!topic.trim()) return

    setLoading(true)
    try {
      const response = await fetch("/api/learning/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, difficulty }),
      })

      if (response.ok) {
        const data = await response.json()
        setContent(data.content)
        setUserAnswers(new Array(data.content.exercises?.length || 0).fill(""))
        setCurrentExercise(0)
        setShowResults(false)
        setSessionStarted(true)
      }
    } catch (error) {
      console.error("Failed to generate content:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleAnswerChange = (index: number, answer: string) => {
    const newAnswers = [...userAnswers]
    newAnswers[index] = answer
    setUserAnswers(newAnswers)
  }

  const submitExercises = () => {
    setShowResults(true)
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600"
    if (score >= 60) return "text-yellow-600"
    return "text-red-600"
  }

  const calculateScore = () => {
    if (!content?.exercises) return 0
    let correct = 0
    content.exercises.forEach((exercise, index) => {
      if (exercise.type === "multiple-choice" && exercise.answer === userAnswers[index]) {
        correct++
      }
    })
    return Math.round((correct / content.exercises.length) * 100)
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Learning Area */}
        <div className="lg:col-span-2 space-y-6">
          {/* Topic Input */}
          {!sessionStarted && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Start Learning
                </CardTitle>
                <CardDescription>
                  Enter a topic you'd like to learn about, and our AI will create personalized content for you.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="topic">What would you like to learn?</Label>
                  <Input
                    id="topic"
                    placeholder="e.g., Machine Learning, Photosynthesis, Spanish Grammar..."
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && generateContent()}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Difficulty Level</Label>
                  <div className="flex gap-2">
                    {(["beginner", "intermediate", "advanced"] as const).map((level) => (
                      <Button
                        key={level}
                        variant={difficulty === level ? "default" : "outline"}
                        size="sm"
                        onClick={() => setDifficulty(level)}
                      >
                        {level.charAt(0).toUpperCase() + level.slice(1)}
                      </Button>
                    ))}
                  </div>
                </div>

                <Button onClick={generateContent} disabled={loading || !topic.trim()} className="w-full">
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating Content...
                    </>
                  ) : (
                    "Generate Learning Content"
                  )}
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Learning Content */}
          {content && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="h-5 w-5" />
                    {content.topic}
                  </CardTitle>
                  <Badge variant="secondary">{content.difficulty}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="content" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="content">Content</TabsTrigger>
                    <TabsTrigger value="keypoints">Key Points</TabsTrigger>
                    <TabsTrigger value="exercises">Exercises</TabsTrigger>
                  </TabsList>

                  <TabsContent value="content" className="mt-4">
                    <div className="prose prose-sm max-w-none dark:prose-invert">
                      <div className="whitespace-pre-wrap text-sm leading-relaxed">{content.content}</div>
                    </div>
                  </TabsContent>

                  <TabsContent value="keypoints" className="mt-4">
                    <div className="space-y-3">
                      {content.keyPoints?.map((point, index) => (
                        <div key={index} className="flex items-start gap-3 p-3 bg-muted rounded-lg">
                          <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                          <span className="text-sm">{point}</span>
                        </div>
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="exercises" className="mt-4">
                    <div className="space-y-6">
                      {content.exercises?.map((exercise, index) => (
                        <Card key={index}>
                          <CardHeader className="pb-3">
                            <CardTitle className="text-base">Question {index + 1}</CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <p className="text-sm">{exercise.question}</p>

                            {exercise.type === "multiple-choice" && exercise.options && (
                              <div className="space-y-2">
                                {exercise.options.map((option, optionIndex) => (
                                  <label key={optionIndex} className="flex items-center space-x-2 cursor-pointer">
                                    <input
                                      type="radio"
                                      name={`question-${index}`}
                                      value={option}
                                      checked={userAnswers[index] === option}
                                      onChange={(e) => handleAnswerChange(index, e.target.value)}
                                      className="text-blue-600"
                                    />
                                    <span className="text-sm">{option}</span>
                                  </label>
                                ))}
                              </div>
                            )}

                            {exercise.type === "short-answer" && (
                              <Input
                                placeholder="Your answer..."
                                value={userAnswers[index] || ""}
                                onChange={(e) => handleAnswerChange(index, e.target.value)}
                              />
                            )}

                            {showResults && exercise.type === "multiple-choice" && (
                              <div className="mt-3 p-3 rounded-lg bg-muted">
                                {userAnswers[index] === exercise.answer ? (
                                  <div className="flex items-center gap-2 text-green-600">
                                    <CheckCircle className="h-4 w-4" />
                                    <span className="text-sm font-medium">Correct!</span>
                                  </div>
                                ) : (
                                  <div className="space-y-1">
                                    <div className="flex items-center gap-2 text-red-600">
                                      <XCircle className="h-4 w-4" />
                                      <span className="text-sm font-medium">Incorrect</span>
                                    </div>
                                    <p className="text-xs text-muted-foreground">Correct answer: {exercise.answer}</p>
                                  </div>
                                )}
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      ))}

                      {!showResults && content.exercises && content.exercises.length > 0 && (
                        <Button onClick={submitExercises} className="w-full">
                          Submit Exercises
                        </Button>
                      )}

                      {showResults && (
                        <Card>
                          <CardContent className="pt-6">
                            <div className="text-center space-y-2">
                              <h3 className="text-lg font-semibold">Your Score</h3>
                              <div className={`text-3xl font-bold ${getScoreColor(calculateScore())}`}>
                                {calculateScore()}%
                              </div>
                              <Progress value={calculateScore()} className="w-full" />
                            </div>
                          </CardContent>
                        </Card>
                      )}
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          )}

          {sessionStarted && (
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setSessionStarted(false)
                  setContent(null)
                  setTopic("")
                }}
              >
                New Topic
              </Button>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <CognitiveMonitor />

          {sessionStarted && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Session Progress</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Content Read</span>
                    <span>100%</span>
                  </div>
                  <Progress value={100} className="h-2" />
                </div>

                {content?.exercises && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Exercises</span>
                      <span>
                        {userAnswers.filter((a) => a).length}/{content.exercises.length}
                      </span>
                    </div>
                    <Progress
                      value={(userAnswers.filter((a) => a).length / content.exercises.length) * 100}
                      className="h-2"
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
