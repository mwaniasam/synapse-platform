"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  CircularProgress,
  Alert,
  List,
  ListItem,
  ListItemText,
  Chip,
  Divider,
  Button,
} from "@mui/material"
import { Navbar } from "@/components/layout/navbar"
import { Schedule } from "@mui/icons-material"
import Link from "next/link"

interface LearningSession {
  id: string
  title: string
  description?: string
  subject?: string
  goals: string[]
  startTime: string
  endTime?: string
  duration?: number
  focusScore?: number
  conceptsLearned: number
  adaptationsUsed: number
  cognitiveStates: Array<{
    state: string
    confidence: number
    createdAt: string
  }>
  knowledgeNodes: Array<{
    id: string
    concept: string
    domain?: string
    encounterCount: number
    lastEncounter: string
  }>
}

export default function SessionDetailPage() {
  const { id } = useParams()
  const [sessionData, setSessionData] = useState<LearningSession | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (id) {
      fetchSessionDetails(id as string)
    }
  }, [id])

  const fetchSessionDetails = async (sessionId: string) => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch(`/api/sessions/${sessionId}`)
      if (!response.ok) {
        throw new Error("Failed to fetch session details")
      }
      const data: LearningSession = await response.json()
      setSessionData(data)
    } catch (err: any) {
      console.error("Error fetching session details:", err)
      setError(err.message || "Failed to load session details.")
    } finally {
      setLoading(false)
    }
  }

  const formatDuration = (seconds: number) => {
    if (!seconds) return "N/A"
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    let result = ""
    if (hours > 0) result += `${hours}h `
    if (minutes > 0) result += `${minutes}m `
    if (secs > 0 || (hours === 0 && minutes === 0)) result += `${secs}s`
    return result.trim()
  }

  const getStateColor = (state: string) => {
    const colors = {
      focused: "#4caf50",
      fatigued: "#ff9800",
      distracted: "#f44336",
      receptive: "#2196f3",
    }
    return colors[state as keyof typeof colors] || "#757575"
  }

  if (loading) {
    return (
      <>
        <Navbar />
        <Container maxWidth="xl" sx={{ mt: 8, mb: 4, textAlign: "center" }}>
          <CircularProgress size={60} sx={{ mb: 3 }} />
          <Typography variant="h5" color="text.secondary">
            Loading session details...
          </Typography>
        </Container>
      </>
    )
  }

  if (error) {
    return (
      <>
        <Navbar />
        <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
          <Alert severity="error">{error}</Alert>
          <Box sx={{ mt: 3, textAlign: "center" }}>
            <Button variant="contained" component={Link} href="/dashboard">
              Back to Dashboard
            </Button>
          </Box>
        </Container>
      </>
    )
  }

  if (!sessionData) {
    return null // Should not happen if loading and error are handled
  }

  return (
    <>
      <Navbar />
      <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ textAlign: "center", mb: 4 }}>
          <Schedule sx={{ fontSize: 60, color: "primary.main", mb: 1 }} />
          <Typography variant="h4" component="h1" gutterBottom>
            Learning Session: {sessionData.title}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Details and insights from your session.
          </Typography>
        </Box>

        <Card sx={{ p: { xs: 2, md: 4 }, borderRadius: 2, boxShadow: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Session Overview
            </Typography>
            <List dense>
              <ListItem>
                <ListItemText primary="Description" secondary={sessionData.description || "No description provided."} />
              </ListItem>
              <ListItem>
                <ListItemText primary="Subject" secondary={sessionData.subject || "General"} />
              </ListItem>
              <ListItem>
                <ListItemText primary="Start Time" secondary={new Date(sessionData.startTime).toLocaleString()} />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="End Time"
                  secondary={sessionData.endTime ? new Date(sessionData.endTime).toLocaleString() : "Ongoing"}
                />
              </ListItem>
              <ListItem>
                <ListItemText primary="Duration" secondary={formatDuration(sessionData.duration || 0)} />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Focus Score"
                  secondary={sessionData.focusScore ? `${(sessionData.focusScore * 100).toFixed(1)}%` : "N/A"}
                />
              </ListItem>
              <ListItem>
                <ListItemText primary="Concepts Learned" secondary={sessionData.conceptsLearned} />
              </ListItem>
              <ListItem>
                <ListItemText primary="Adaptations Used" secondary={sessionData.adaptationsUsed} />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Goals"
                  secondary={
                    sessionData.goals.length > 0 ? (
                      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5, mt: 0.5 }}>
                        {sessionData.goals.map((goal, index) => (
                          <Chip key={index} label={goal} size="small" variant="outlined" />
                        ))}
                      </Box>
                    ) : (
                      "No goals set."
                    )
                  }
                />
              </ListItem>
            </List>

            <Divider sx={{ my: 3 }} />

            <Typography variant="h6" gutterBottom>
              Cognitive State Snapshots
            </Typography>
            {sessionData.cognitiveStates.length > 0 ? (
              <List dense sx={{ maxHeight: 200, overflowY: "auto" }}>
                {sessionData.cognitiveStates.map((state, index) => (
                  <ListItem key={index}>
                    <ListItemText
                      primary={
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          <Chip
                            label={state.state}
                            size="small"
                            sx={{
                              backgroundColor: getStateColor(state.state),
                              color: "white",
                              fontWeight: "bold",
                            }}
                          />
                          <Typography variant="body2">Confidence: {(state.confidence * 100).toFixed(0)}%</Typography>
                        </Box>
                      }
                      secondary={new Date(state.createdAt).toLocaleTimeString()}
                    />
                  </ListItem>
                ))}
              </List>
            ) : (
              <Typography variant="body2" color="text.secondary">
                No cognitive state data recorded for this session.
              </Typography>
            )}

            <Divider sx={{ my: 3 }} />

            <Typography variant="h6" gutterBottom>
              Knowledge Nodes Encountered
            </Typography>
            {sessionData.knowledgeNodes.length > 0 ? (
              <List dense sx={{ maxHeight: 200, overflowY: "auto" }}>
                {sessionData.knowledgeNodes.map((node, index) => (
                  <ListItem key={index}>
                    <ListItemText
                      primary={node.concept}
                      secondary={
                        <Box>
                          <Typography variant="caption" display="block">
                            Domain: {node.domain || "N/A"}
                          </Typography>
                          <Typography variant="caption" display="block">
                            Encounters: {node.encounterCount}
                          </Typography>
                          <Typography variant="caption" display="block">
                            Last Seen: {new Date(node.lastEncounter).toLocaleDateString()}
                          </Typography>
                        </Box>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            ) : (
              <Typography variant="body2" color="text.secondary">
                No knowledge concepts recorded for this session.
              </Typography>
            )}

            <Box sx={{ mt: 4, textAlign: "center" }}>
              <Button variant="contained" component={Link} href="/dashboard">
                Back to Dashboard
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </>
  )
}
