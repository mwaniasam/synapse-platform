"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Chip,
  Alert, // Ensure Alert is imported
} from "@mui/material"
import { Timeline, Psychology, AutoAwesome, PlayArrow, Settings } from "@mui/icons-material"

export function QuickActions() {
  const router = useRouter()
  const [sessionDialogOpen, setSessionDialogOpen] = useState(false)
  const [sessionTitle, setSessionTitle] = useState("")
  const [sessionGoals, setSessionGoals] = useState<string[]>([])
  const [currentGoal, setCurrentGoal] = useState("")
  const [apiError, setApiError] = useState<string | null>(null) // New state for API errors

  const handleStartSession = async () => {
    if (!sessionTitle.trim()) return

    setApiError(null) // Clear previous errors
    try {
      const response = await fetch("/api/sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: sessionTitle,
          goals: sessionGoals,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to start session.")
      }

      const session = await response.json()
      router.push(`/sessions/${session.id}`)
    } catch (error: any) {
      console.error("Error starting session:", error)
      setApiError(error.message || "An unexpected error occurred while starting the session.")
    }
  }

  const addGoal = () => {
    if (currentGoal.trim() && !sessionGoals.includes(currentGoal.trim())) {
      setSessionGoals([...sessionGoals, currentGoal.trim()])
      setCurrentGoal("")
    }
  }

  const removeGoal = (goalToRemove: string) => {
    setSessionGoals(sessionGoals.filter((goal) => goal !== goalToRemove))
  }

  return (
    <>
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Quick Actions
          </Typography>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <Button variant="contained" startIcon={<PlayArrow />} onClick={() => setSessionDialogOpen(true)} fullWidth>
              Start Learning Session
            </Button>
            <Button variant="outlined" startIcon={<Timeline />} onClick={() => router.push("/analytics")} fullWidth>
              View Analytics
            </Button>
            <Button
              variant="outlined"
              startIcon={<Psychology />}
              onClick={() => router.push("/cognitive-training")}
              fullWidth
            >
              Cognitive Training
            </Button>
            <Button variant="outlined" startIcon={<AutoAwesome />} onClick={() => router.push("/ai-tutor")} fullWidth>
              AI Tutor
            </Button>
            <Button variant="outlined" startIcon={<Settings />} onClick={() => router.push("/settings")} fullWidth>
              Settings
            </Button>
          </Box>
        </CardContent>
      </Card>

      <Dialog open={sessionDialogOpen} onClose={() => setSessionDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Start New Learning Session</DialogTitle>
        <DialogContent>
          {apiError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {apiError}
            </Alert>
          )}
          <TextField
            autoFocus
            margin="dense"
            label="Session Title"
            fullWidth
            variant="outlined"
            value={sessionTitle}
            onChange={(e) => setSessionTitle(e.target.value)}
            sx={{ mb: 2 }}
          />

          <Box sx={{ mb: 2 }}>
            <TextField
              label="Add Learning Goal"
              fullWidth
              variant="outlined"
              value={currentGoal}
              onChange={(e) => setCurrentGoal(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && addGoal()}
              sx={{ mb: 1 }}
            />
            <Button onClick={addGoal} disabled={!currentGoal.trim()}>
              Add Goal
            </Button>
          </Box>

          {sessionGoals.length > 0 && (
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" gutterBottom>
                Learning Goals:
              </Typography>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                {sessionGoals.map((goal, index) => (
                  <Chip key={index} label={goal} onDelete={() => removeGoal(goal)} color="primary" variant="outlined" />
                ))}
              </Box>
            </Box>
          )}

          <Alert severity="info">
            Your cognitive state will be monitored throughout the session to provide personalized adaptations.
          </Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSessionDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleStartSession} variant="contained" disabled={!sessionTitle.trim()}>
            Start Session
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
