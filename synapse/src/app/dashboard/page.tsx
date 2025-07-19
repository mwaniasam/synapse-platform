"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { Container, Grid as Grid, Typography, Box, CircularProgress } from "@mui/material"
import { Navbar } from "@/components/layout/navbar"
import { EnhancedCognitiveIndicator } from "@/components/dashboard/enhanced-cognitive-indicator"
import { EnhancedKnowledgeGraph } from "@/components/dashboard/enhanced-knowledge-graph"
import { AIAssistant } from "@/components/ai/ai-assistant"
import { QuickActions } from "@/components/dashboard/quick-actions"
import { SessionSummary } from "@/components/dashboard/session-summary"
import { ServicesGrid } from "@/components/dashboard/services-grid"

export default function Dashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin")
    }
  }, [status, router])

  if (status === "loading") {
    return (
      <>
        <Navbar />
        <Container maxWidth="xl" sx={{ mt: 8, mb: 4, textAlign: "center" }}>
          <CircularProgress size={60} sx={{ mb: 3 }} />
          <Typography variant="h5" color="text.secondary">
            Loading your dashboard...
          </Typography>
        </Container>
      </>
    )
  }

  // If status is not loading and no session, it means unauthenticated and redirected by useEffect
  if (!session) {
    return null
  }

  const displayName = session?.user?.name || "User"

  return (
    <>
      <Navbar />
      <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 700 }}>
            Welcome back, {displayName}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Your cognitive learning dashboard - enhanced with AI assistance
          </Typography>
        </Box>

        <Grid container spacing={3}>
          {/* Quick Actions */}
          <Grid item xs={12} md={4}>
            <QuickActions />
          </Grid>

          {/* Cognitive State Indicator */}
          <Grid item xs={12} md={8}>
            <EnhancedCognitiveIndicator />
          </Grid>

          {/* AI Learning Assistant */}
          <Grid item xs={12} md={6}>
            <AIAssistant />
          </Grid>

          {/* Knowledge Graph Visualization */}
          <Grid item xs={12} md={6}>
            <EnhancedKnowledgeGraph />
          </Grid>

          {/* Recent Sessions Summary */}
          <Grid item xs={12}>
            <SessionSummary />
          </Grid>
          
          {/* Services Grid */}
          <Grid item xs={12}>
            <ServicesGrid />
          </Grid>
        </Grid>
      </Container>
    </>
  )
}
