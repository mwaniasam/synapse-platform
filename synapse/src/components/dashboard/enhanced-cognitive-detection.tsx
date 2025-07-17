"use client"

import { useState, useEffect, useRef } from "react"
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  LinearProgress,
  IconButton,
  Tooltip,
  Grid,
  Paper,
} from "@mui/material"
import { Psychology, Pause, PlayArrow, TrendingUp, Speed, Mouse, TouchApp } from "@mui/icons-material"
import { CognitiveDetectionEngine } from "@/lib/cognitive-detection"

interface CognitiveState {
  state: "focused" | "fatigued" | "distracted" | "receptive"
  confidence: number
  timestamp: Date
  metrics: {
    typingSpeed: number
    typingRhythm: number
    mouseVelocity: number
    scrollPattern: number
    focusStability: number
    taskSwitching: number
  }
}

const stateConfig = {
  focused: { color: "#4caf50", icon: "🎯", label: "Focused", description: "High concentration and productivity" },
  fatigued: { color: "#ff9800", icon: "😴", label: "Fatigued", description: "Reduced energy and slower responses" },
  distracted: {
    color: "#f44336",
    icon: "🌀",
    label: "Distracted",
    description: "Frequent task switching and interruptions",
  },
  receptive: { color: "#2196f3", icon: "🧠", label: "Receptive", description: "Optimal for learning new information" },
}

export function EnhancedCognitiveIndicator() {
  const [currentState, setCurrentState] = useState<CognitiveState>({
    state: "focused",
    confidence: 0.8,
    timestamp: new Date(),
    metrics: {
      typingSpeed: 0,
      typingRhythm: 0,
      mouseVelocity: 0,
      scrollPattern: 0,
      focusStability: 0,
      taskSwitching: 0,
    },
  })

  const [isDetecting, setIsDetecting] = useState(true)
  const [stateHistory, setStateHistory] = useState<CognitiveState[]>([])
  const detectionEngine = useRef<CognitiveDetectionEngine | null>(null)

  useEffect(() => {
    if (typeof window !== "undefined") {
      detectionEngine.current = new CognitiveDetectionEngine()
    }
  }, [])

  useEffect(() => {
    if (!isDetecting || !detectionEngine.current) return

    const interval = setInterval(() => {
      const analysis = detectionEngine.current!.analyzeCognitiveState()

      const newState: CognitiveState = {
        state: analysis.state,
        confidence: analysis.confidence,
        timestamp: new Date(),
        metrics: analysis.metrics,
      }

      setCurrentState(newState)
      setStateHistory((prev) => [...prev.slice(-19), newState]) // Keep last 20 states
    }, 2000) // Update every 2 seconds

    return () => clearInterval(interval)
  }, [isDetecting])

  const config = stateConfig[currentState.state]

  const formatMetric = (value: number, decimals = 1): string => {
    return value.toFixed(decimals)
  }

  return (
    <Card>
      <CardContent>
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
          <Typography variant="h6" component="div" sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Psychology />
            Enhanced Cognitive Detection
          </Typography>
          <Tooltip title={isDetecting ? "Pause Detection" : "Resume Detection"}>
            <IconButton onClick={() => setIsDetecting(!isDetecting)}>
              {isDetecting ? <Pause /> : <PlayArrow />}
            </IconButton>
          </Tooltip>
        </Box>

        <Grid container spacing={2}>
          {/* Main State Display */}
          <Grid item xs={12} md={6}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
              <Typography variant="h3" component="span">
                {config.icon}
              </Typography>
              <Box sx={{ flexGrow: 1 }}>
                <Chip
                  label={config.label}
                  sx={{
                    backgroundColor: config.color,
                    color: "white",
                    fontWeight: "bold",
                    mb: 1,
                  }}
                />
                <Typography variant="body2" color="text.secondary">
                  {config.description}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Confidence: {Math.round(currentState.confidence * 100)}%
                </Typography>
              </Box>
            </Box>

            <LinearProgress
              variant="determinate"
              value={currentState.confidence * 100}
              sx={{
                height: 8,
                borderRadius: 4,
                backgroundColor: "rgba(0,0,0,0.1)",
                "& .MuiLinearProgress-bar": {
                  backgroundColor: config.color,
                },
              }}
            />
          </Grid>

          {/* Metrics Display */}
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" gutterBottom>
              Real-time Metrics
            </Typography>
            <Grid container spacing={1}>
              <Grid item xs={6}>
                <Paper sx={{ p: 1, textAlign: "center" }}>
                  <Speed fontSize="small" />
                  <Typography variant="caption" display="block">
                    Typing Speed
                  </Typography>
                  <Typography variant="body2" fontWeight="bold">
                    {formatMetric(currentState.metrics.typingSpeed)} WPM
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={6}>
                <Paper sx={{ p: 1, textAlign: "center" }}>
                  <Mouse fontSize="small" />
                  <Typography variant="caption" display="block">
                    Mouse Activity
                  </Typography>
                  <Typography variant="body2" fontWeight="bold">
                    {formatMetric(currentState.metrics.mouseVelocity, 3)}
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={6}>
                <Paper sx={{ p: 1, textAlign: "center" }}>
                  <TrendingUp fontSize="small" />
                  <Typography variant="caption" display="block">
                    Focus Stability
                  </Typography>
                  <Typography variant="body2" fontWeight="bold">
                    {formatMetric(currentState.metrics.focusStability * 100)}%
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={6}>
                <Paper sx={{ p: 1, textAlign: "center" }}>
                  <TouchApp fontSize="small" />
                  <Typography variant="caption" display="block">
                    Task Switches
                  </Typography>
                  <Typography variant="body2" fontWeight="bold">
                    {currentState.metrics.taskSwitching}
                  </Typography>
                </Paper>
              </Grid>
            </Grid>
          </Grid>
        </Grid>

        <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: "block" }}>
          Last updated: {currentState.timestamp.toLocaleTimeString()}
        </Typography>
      </CardContent>
    </Card>
  )
}
