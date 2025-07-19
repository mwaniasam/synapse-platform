"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import TextField from "@mui/material/TextField"
import {
  Container,
  Typography,
  Box,
  Button,
  Card,
  CardContent,
  LinearProgress,
  Alert,
  CircularProgress,
} from "@mui/material"
import { Navbar } from "@/components/layout/navbar"
import { Psychology, PlayArrow, Stop, CheckCircleOutline, CancelOutlined } from "@mui/icons-material"
import { CognitiveDetectionEngine } from "@/lib/cognitive-detection"

export default function CognitiveTrainingPage() {
  const [trainingActive, setTrainingActive] = useState(false)
  const [score, setScore] = useState(0)
  const [targetNumber, setTargetNumber] = useState(0)
  const [inputNumber, setInputNumber] = useState("")
  const [feedback, setFeedback] = useState<"correct" | "incorrect" | null>(null)
  const [timeRemaining, setTimeRemaining] = useState(30) // 30 seconds per round
  const [round, setRound] = useState(0)
  const [cognitiveState, setCognitiveState] = useState<string | null>(null)
  const [cognitiveConfidence, setCognitiveConfidence] = useState<number | null>(null)

  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const cognitiveDetectionIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const detectionEngine = useRef<CognitiveDetectionEngine | null>(null)

  useEffect(() => {
    if (typeof window !== "undefined") {
      detectionEngine.current = new CognitiveDetectionEngine()
    }
  }, [])

  useEffect(() => {
    if (trainingActive) {
      startRound()
      timerRef.current = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            endTraining()
            return 0
          }
          return prev - 1
        })
      }, 1000)

      cognitiveDetectionIntervalRef.current = setInterval(() => {
        if (detectionEngine.current) {
          const { state, confidence } = detectionEngine.current.analyzeCognitiveState()
          setCognitiveState(state)
          setCognitiveConfidence(confidence)
        }
      }, 2000) // Update cognitive state every 2 seconds
    } else {
      if (timerRef.current) clearInterval(timerRef.current)
      if (cognitiveDetectionIntervalRef.current) clearInterval(cognitiveDetectionIntervalRef.current)
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
      if (cognitiveDetectionIntervalRef.current) clearInterval(cognitiveDetectionIntervalRef.current)
    }
  }, [trainingActive])

  const startTraining = () => {
    setTrainingActive(true)
    setScore(0)
    setRound(0)
    setTimeRemaining(30)
    setFeedback(null)
    setCognitiveState(null)
    setCognitiveConfidence(null)
  }

  const endTraining = () => {
    setTrainingActive(false)
    alert(`Training finished! Your score: ${score}`)
  }

  const startRound = () => {
    setRound((prev) => prev + 1)
    setTargetNumber(Math.floor(Math.random() * 900) + 100) // 3-digit number
    setInputNumber("")
    setFeedback(null)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (Number.parseInt(inputNumber) === targetNumber) {
      setScore((prev) => prev + 1)
      setFeedback("correct")
    } else {
      setFeedback("incorrect")
    }
    setTimeout(startRound, 500) // Next round after brief feedback
  }

  const getStateColor = (state: string | null) => {
    switch (state) {
      case "focused":
        return "#4caf50"
      case "fatigued":
        return "#ff9800"
      case "distracted":
        return "#f44336"
      case "receptive":
        return "#2196f3"
      default:
        return "#757575"
    }
  }

  return (
    <>
      <Navbar />
      <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ textAlign: "center", mb: 4 }}>
          <Psychology sx={{ fontSize: 60, color: "primary.main", mb: 1 }} />
          <Typography variant="h4" component="h1" gutterBottom>
            Cognitive Training
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Enhance your focus and mental agility with targeted exercises.
          </Typography>
        </Box>

        <Card sx={{ p: { xs: 2, md: 4 }, borderRadius: 2, boxShadow: 3 }}>
          <CardContent sx={{ textAlign: "center" }}>
            {!trainingActive ? (
              <Box>
                <Typography variant="h5" gutterBottom>
                  Number Matching Focus Test
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                  Type the number you see as quickly and accurately as possible.
                  <br />
                  Improve your focus and reaction time!
                </Typography>
                <Button variant="contained" size="large" startIcon={<PlayArrow />} onClick={startTraining}>
                  Start Training
                </Button>
              </Box>
            ) : (
              <Box>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                  <Typography variant="h6">Round: {round}</Typography>
                  <Typography variant="h6">Score: {score}</Typography>
                  <Typography variant="h6">Time: {timeRemaining}s</Typography>
                </Box>

                <LinearProgress variant="determinate" value={(timeRemaining / 30) * 100} sx={{ mb: 3 }} />

                <Typography variant="h3" component="div" sx={{ mb: 3, fontWeight: "bold", color: "primary.main" }}>
                  {targetNumber}
                </Typography>

                <Box
                  component="form"
                  onSubmit={handleSubmit}
                  sx={{ display: "flex", gap: 2, justifyContent: "center" }}
                >
                  <TextField
                    autoFocus
                    label="Your Number"
                    variant="outlined"
                    type="number"
                    value={inputNumber}
                    onChange={(e) => setInputNumber(e.target.value)}
                    sx={{ width: "200px" }}
                  />
                  <Button type="submit" variant="contained" size="large">
                    Submit
                  </Button>
                </Box>

                {feedback && (
                  <Box sx={{ mt: 2, display: "flex", alignItems: "center", justifyContent: "center", gap: 1 }}>
                    {feedback === "correct" ? (
                      <CheckCircleOutline sx={{ color: "success.main" }} />
                    ) : (
                      <CancelOutlined sx={{ color: "error.main" }} />
                    )}
                    <Typography color={feedback === "correct" ? "success.main" : "error.main"}>
                      {feedback === "correct" ? "Correct!" : "Incorrect!"}
                    </Typography>
                  </Box>
                )}

                <Box sx={{ mt: 4, display: "flex", alignItems: "center", justifyContent: "center", gap: 2 }}>
                  <Typography variant="body1" sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    Your Cognitive State:
                    {cognitiveState ? (
                      <span style={{ color: getStateColor(cognitiveState), fontWeight: "bold" }}>
                        {cognitiveState.charAt(0).toUpperCase() + cognitiveState.slice(1)}
                      </span>
                    ) : (
                      <CircularProgress size={20} />
                    )}
                    {cognitiveConfidence !== null && (
                      <Typography variant="caption" color="text.secondary">
                        ({(cognitiveConfidence * 100).toFixed(0)}% confidence)
                      </Typography>
                    )}
                  </Typography>
                </Box>

                <Button variant="outlined" size="small" startIcon={<Stop />} onClick={endTraining} sx={{ mt: 3 }}>
                  End Training
                </Button>
              </Box>
            )}
          </CardContent>
        </Card>

        <Alert severity="info" sx={{ mt: 4 }}>
          <Typography variant="body2">
            **How it works:** While you train, Synapse's cognitive detection engine analyzes your interaction patterns
            (typing speed, mouse movements, etc.) to estimate your real-time cognitive state. This helps you understand
            how different activities affect your focus.
          </Typography>
        </Alert>
      </Container>
    </>
  )
}
