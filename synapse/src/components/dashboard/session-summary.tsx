"use client"

import { useState, useEffect } from "react"
import {
  Card,
  CardContent,
  Typography,
  Box,
  List,
  ListItem,
  ListItemText,
  Chip,
  LinearProgress,
  Divider,
} from "@mui/material"
import { Schedule, TrendingUp, Psychology } from "@mui/icons-material"

interface SessionData {
  id: string
  title: string
  startTime: string
  endTime?: string
  duration?: number
  focusScore?: number
  conceptsLearned: number
  cognitiveStates: Array<{
    state: string
    confidence: number
    createdAt: string
  }>
}

export function SessionSummary() {
  const [recentSessions, setRecentSessions] = useState<SessionData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchRecentSessions()
  }, [])

  const fetchRecentSessions = async () => {
    try {
      const response = await fetch("/api/sessions?limit=5")
      if (response.ok) {
        const sessions = await response.json()
        setRecentSessions(sessions)
      }
    } catch (error) {
      console.error("Error fetching sessions:", error)
    } finally {
      setLoading(false)
    }
  }

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`
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
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Recent Sessions
          </Typography>
          <LinearProgress />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Schedule />
          Recent Sessions
        </Typography>

        {recentSessions.length === 0 ? (
          <Typography variant="body2" color="text.secondary">
            No recent sessions found. Start your first learning session!
          </Typography>
        ) : (
          <List dense>
            {recentSessions.map((session, index) => (
              <Box key={session.id}>
                <ListItem sx={{ px: 0 }}>
                  <ListItemText
                    primary={<Box>{session.title}</Box>}
                    primaryTypographyProps={{ component: "div" }}
                    secondaryTypographyProps={{ component: "div" }}
                    secondary={
                      <Box>
                        <Typography variant="caption" component="div">
                          {new Date(session.startTime).toLocaleDateString()}
                        </Typography>
                        {session.duration && (
                          <Typography variant="caption" component="div">
                            Duration: {formatDuration(session.duration)}
                          </Typography>
                        )}
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 1 }}>
                          {session.focusScore && (
                            <Chip
                              label={`Focus: ${Math.round(session.focusScore * 100)}%`}
                              size="small"
                              icon={<TrendingUp />}
                            />
                          )}
                          <Chip label={`${session.conceptsLearned} concepts`} size="small" icon={<Psychology />} />
                        </Box>
                        {session.cognitiveStates.length > 0 && (
                          <Box sx={{ mt: 1 }}>
                            <Typography variant="caption" component="div">
                              Cognitive States:
                            </Typography>
                            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5, mt: 0.5 }}>
                              {session.cognitiveStates.slice(0, 3).map((state, i) => (
                                <Chip
                                  key={i}
                                  label={state.state}
                                  size="small"
                                  sx={{
                                    backgroundColor: getStateColor(state.state),
                                    color: "white",
                                    fontSize: "0.7rem",
                                  }}
                                />
                              ))}
                            </Box>
                          </Box>
                        )}
                      </Box>
                    }
                  />
                </ListItem>
                {index < recentSessions.length - 1 && <Divider />}
              </Box>
            ))}
          </List>
        )}
      </CardContent>
    </Card>
  )
}
