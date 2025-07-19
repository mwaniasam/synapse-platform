"use client"

import { useState, useEffect } from "react"
import { Container, Typography, Box, Card, CardContent, CircularProgress, Alert, Paper } from "@mui/material"
import { Navbar } from "@/components/layout/navbar"
import { BarChart as MuiBarChart, TrendingUp, AccessTime, Psychology } from "@mui/icons-material"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart as RechartsBarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts"
import { Grid as Grid } from "@mui/material"

interface AnalyticsData {
  totalSessions: number
  totalDuration: number
  averageFocusScore: number
  cognitiveStateDistribution: Array<{ state: string; _count: { state: number } }>
  aiInteractionDistribution: Array<{ type: string; _count: { type: number } }>
  recentSessions: Array<{ id: string; title: string; startTime: string; focusScore: number }>
  recentCognitiveStates: Array<{ state: string; confidence: number; createdAt: string }>
}

const COLORS = ["#4caf50", "#ff9800", "#f44336", "#2196f3", "#9c27b0", "#00bcd4"] // For pie charts

export default function AnalyticsPage() {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchAnalyticsData()
  }, [])

  const fetchAnalyticsData = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch("/api/analytics")
      if (!response.ok) {
        throw new Error("Failed to fetch analytics data")
      }
      const data: AnalyticsData = await response.json()
      setAnalyticsData(data)
    } catch (err: any) {
      console.error("Error fetching analytics:", err)
      setError(err.message || "Failed to load analytics data.")
    } finally {
      setLoading(false)
    }
  }

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    if (hours > 0) {
      return `${hours}h ${minutes}m`
    }
    return `${minutes}m`
  }

  const cognitiveStatePieData =
    analyticsData?.cognitiveStateDistribution.map((item) => ({
      name: item.state,
      value: item._count.state,
    })) || []

  const aiInteractionPieData =
    analyticsData?.aiInteractionDistribution.map((item) => ({
      name: item.type,
      value: item._count.type,
    })) || []

  const focusScoreLineData =
    analyticsData?.recentSessions.map((session) => ({
      date: new Date(session.startTime).toLocaleDateString(),
      focusScore: Math.round(session.focusScore * 100),
    })) || []

  if (loading) {
    return (
      <>
        <Navbar />
        <Container maxWidth="xl" sx={{ mt: 8, mb: 4, textAlign: "center" }}>
          <CircularProgress size={60} sx={{ mb: 3 }} />
          <Typography variant="h5" color="text.secondary">
            Loading analytics...
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
        </Container>
      </>
    )
  }

  if (!analyticsData) {
    return null // Should not happen if loading and error are handled
  }

  return (
    <>
      <Navbar />
      <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ textAlign: "center", mb: 4 }}>
          <MuiBarChart sx={{ fontSize: 60, color: "primary.main", mb: 1 }} />
          <Typography variant="h4" component="h1" gutterBottom>
            Your Learning Analytics
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Insights into your learning patterns and progress.
          </Typography>
        </Box>

        <Grid container spacing={3}>
          {/* Summary Cards */}
          <Grid xs={12} sm={6} md={4}>
            <Card sx={{ height: "100%", p: 2, borderRadius: 2, boxShadow: 3 }}>
              <CardContent sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <AccessTime sx={{ fontSize: 48, color: "primary.main" }} />
                <Box>
                  <Typography variant="h5" component="div" fontWeight="bold">
                    {formatDuration(analyticsData.totalDuration)}
                  </Typography>
                  <Typography color="text.secondary">Total Learning Time</Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid xs={12} sm={6} md={4}>
            <Card sx={{ height: "100%", p: 2, borderRadius: 2, boxShadow: 3 }}>
              <CardContent sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <TrendingUp sx={{ fontSize: 48, color: "success.main" }} />
                <Box>
                  <Typography variant="h5" component="div" fontWeight="bold">
                    {Math.round(analyticsData.averageFocusScore * 100)}%
                  </Typography>
                  <Typography color="text.secondary">Average Focus Score</Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid xs={12} sm={6} md={4}>
            <Card sx={{ height: "100%", p: 2, borderRadius: 2, boxShadow: 3 }}>
              <CardContent sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Psychology sx={{ fontSize: 48, color: "info.main" }} />
                <Box>
                  <Typography variant="h5" component="div" fontWeight="bold">
                    {analyticsData.totalSessions}
                  </Typography>
                  <Typography color="text.secondary">Learning Sessions</Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Focus Score Over Time Chart */}
          <Grid xs={12} md={6}>
            <Card sx={{ p: 2, borderRadius: 2, boxShadow: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Focus Score Over Time
                </Typography>
                {focusScoreLineData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={focusScoreLineData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis domain={[0, 100]} />
                      <Tooltip />
                      <Line type="monotone" dataKey="focusScore" stroke="#8884d8" activeDot={{ r: 8 }} />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <Alert severity="info">No focus score data available yet. Start a learning session!</Alert>
                )}
              </CardContent>
            </Card>
          </Grid>

          {/* Cognitive State Distribution Chart */}
          <Grid xs={12} md={6}>
            <Card sx={{ p: 2, borderRadius: 2, boxShadow: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Cognitive State Distribution
                </Typography>
                {cognitiveStatePieData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={cognitiveStatePieData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {cognitiveStatePieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <Alert severity="info">No cognitive state data available yet.</Alert>
                )}
              </CardContent>
            </Card>
          </Grid>

          {/* AI Interaction Distribution Chart */}
          <Grid xs={12} md={6}>
            <Card sx={{ p: 2, borderRadius: 2, boxShadow: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  AI Interaction Types
                </Typography>
                {aiInteractionPieData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <RechartsBarChart data={aiInteractionPieData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="value" fill="#82ca9d" />
                    </RechartsBarChart>
                  </ResponsiveContainer>
                ) : (
                  <Alert severity="info">No AI interaction data available yet. Try using the AI Assistant!</Alert>
                )}
              </CardContent>
            </Card>
          </Grid>

          {/* Recent Cognitive States (Raw Data) */}
          <Grid xs={12} md={6}>
            <Card sx={{ p: 2, borderRadius: 2, boxShadow: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Recent Cognitive States
                </Typography>
                {analyticsData.recentCognitiveStates.length > 0 ? (
                  <Box sx={{ maxHeight: 300, overflowY: "auto" }}>
                    {analyticsData.recentCognitiveStates.map((state, index) => (
                      <Paper key={index} sx={{ p: 1, mb: 1, bgcolor: "grey.100" }}>
                        <Typography variant="body2">
                          <strong>State:</strong> {state.state} ({(state.confidence * 100).toFixed(0)}%)
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {new Date(state.createdAt).toLocaleTimeString()}
                        </Typography>
                      </Paper>
                    ))}
                  </Box>
                ) : (
                  <Alert severity="info">No recent cognitive state data.</Alert>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </>
  )
}
