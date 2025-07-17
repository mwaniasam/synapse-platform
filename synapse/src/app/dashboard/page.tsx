import { Container, Typography, Button, Box, Card, CardContent } from "@mui/material"
import { Psychology, TrendingUp, AccountTree, AutoAwesome } from "@mui/icons-material"
import Link from "next/link"
import { Grid2 as Grid } from "@mui/material"

export default function Home() {
  return (
    <Container maxWidth="lg">
      {/* Hero Section */}
      <Box sx={{ textAlign: "center", py: 8 }}>
        <Typography variant="h2" component="h1" gutterBottom>
          Synapse
        </Typography>
        <Typography variant="h5" component="h2" color="text.secondary" gutterBottom>
          Cognitive Learning Acceleration Platform
        </Typography>
        <Typography variant="body1" sx={{ mb: 4, maxWidth: 600, mx: "auto" }}>
          Transform your digital learning experience with AI-powered cognitive state detection, adaptive content
          presentation, and intelligent knowledge mapping.
        </Typography>
        <Button variant="contained" size="large" component={Link} href="/auth/signin" sx={{ mr: 2 }}>
          Get Started
        </Button>
        <Button variant="outlined" size="large" component={Link} href="/about">
          Learn More
        </Button>
      </Box>

      {/* Features Section */}
      <Grid container spacing={4} sx={{ py: 8 }}>
        <Grid xs={12} md={3}>
          <Card sx={{ height: "100%", textAlign: "center" }}>
            <CardContent>
              <Psychology sx={{ fontSize: 48, color: "primary.main", mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                Cognitive Detection
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Real-time analysis of your cognitive state through interaction patterns
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid xs={12} md={3}>
          <Card sx={{ height: "100%", textAlign: "center" }}>
            <CardContent>
              <TrendingUp sx={{ fontSize: 48, color: "primary.main", mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                Adaptive Content
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Dynamic content adaptation based on your current cognitive state
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid xs={12} md={3}>
          <Card sx={{ height: "100%", textAlign: "center" }}>
            <CardContent>
              <AccountTree sx={{ fontSize: 48, color: "primary.main", mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                Knowledge Mapping
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Visualize connections between concepts and track learning progress
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid xs={12} md={3}>
          <Card sx={{ height: "100%", textAlign: "center" }}>
            <CardContent>
              <AutoAwesome sx={{ fontSize: 48, color: "primary.main", mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                AI Assistance
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Personalized learning recommendations powered by Gemini AI
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  )
}
