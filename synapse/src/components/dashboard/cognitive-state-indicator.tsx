"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, Typography, Box, Chip, LinearProgress, IconButton, Tooltip } from "@mui/material"
import { Psychology, Refresh, Remove } from "@mui/icons-material"

interface CognitiveState {
  state: "focused" | "fatigued" | "distracted" | "receptive"
  confidence: number
  timestamp: Date
}

const stateConfig = {
  focused: { color: "#4caf50", icon: "🎯", label: "Focused" },
  fatigued: { color: "#ff9800", icon: "😴", label: "Fatigued" },
  distracted: { color: "#f44336", icon: "🌀", label: "Distracted" },
  receptive: { color: "#2196f3", icon: "🧠", label: "Receptive" },
}

export function CognitiveStateIndicator() {
  const [currentState, setCurrentState] = useState<CognitiveState>({
    state: "focused",
    confidence: 0.8,
    timestamp: new Date(),
  })

  const [isDetecting, setIsDetecting] = useState(true)

  // Simulate cognitive state detection
  useEffect(() => {
    if (!isDetecting) return

    const interval = setInterval(() => {
      const states: CognitiveState["state"][] = ["focused", "fatigued", "distracted", "receptive"]
      const randomState = states[Math.floor(Math.random() * states.length)]
      const confidence = 0.6 + Math.random() * 0.4 // 0.6 to 1.0

      setCurrentState({
        state: randomState,
        confidence,
        timestamp: new Date(),
      })
    }, 5000) // Update every 5 seconds

    return () => clearInterval(interval)
  }, [isDetecting])

  const config = stateConfig[currentState.state]

  return (
    <Card>
      <CardContent>
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
          <Typography variant="h6" component="div" sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Psychology />
            Cognitive State
          </Typography>
          <Tooltip title={isDetecting ? "Pause Detection" : "Resume Detection"}>
            <IconButton onClick={() => setIsDetecting(!isDetecting)}>
              {isDetecting ? <Refresh /> : <Remove />}
            </IconButton>
          </Tooltip>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
          <Typography variant="h4" component="span">
            {config.icon}
          </Typography>
          <Box sx={{ flexGrow: 1 }}>
            <Chip
              label={config.label}
              sx={{
                backgroundColor: config.color,
                color: "white",
                fontWeight: "bold",
              }}
            />
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
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

        <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: "block" }}>
          Last updated: {currentState.timestamp.toLocaleTimeString()}
        </Typography>
      </CardContent>
    </Card>
  )
}
