"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { Container, Typography, Box, Card, CardContent, Button, Grid } from "@mui/material"
import { Add, Timeline, Psychology } from "@mui/icons-material"
import { Navbar } from "@/components/layout/navbar"
import { CognitiveStateIndicator } from "@/components/dashboard/cognitive-state-indicator"
import { KnowledgeGraphVisualization } from "@/components/dashboard/knowledge-graph-viz"

export default function Dashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin")
    }
  }, [status, router])

  if (status === "loading") {
    return <div>Loading...</div>
  }

  if (!session) {
    return null
  }

  return (
    <>
      <Navbar />
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Welcome back, {session.user?.name}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Your cognitive learning dashboard
          </Typography>
        </Box>

        <Grid container spacing={3}>
          {/* Quick Actions */}
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Quick Actions
                </Typography>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  <Button
                    variant="contained"
                    startIcon={<Add />}
                    onClick={() => router.push("/sessions/new")}
                    fullWidth
                  >
                    Start Learning Session
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<Timeline />}
                    onClick={() => router.push("/analytics")}
                    fullWidth
                  >
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
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Cognitive State */}
          <Grid item xs={12} md={8}>
            <CognitiveStateIndicator />
          </Grid>

          {/* Knowledge Graph */}
          <Grid item xs={12}>
            <KnowledgeGraphVisualization />
          </Grid>

          {/* Recent Sessions */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Recent Sessions
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  No recent sessions found. Start your first learning session!
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* AI Insights */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  AI Insights
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  AI-powered insights will appear here based on your learning patterns.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </>
  )
}
