import { Container, Typography, Button, Box, Card, CardContent } from "@mui/material"
import { Psychology, TrendingUp, AccountTree, AutoAwesome } from "@mui/icons-material"
import Link from "next/link"
import { Grid as Grid } from "@mui/material"

export default function Home() {
  return (
    <Container maxWidth="lg" sx={{ py: { xs: 4, md: 8 } }}>
      {/* Hero Section */}
      <Box sx={{ textAlign: "center", py: { xs: 4, md: 8 } }}>
        <Typography
          variant="h2"
          component="h1"
          gutterBottom
          sx={{ fontSize: { xs: "2.5rem", sm: "3rem", md: "4rem" }, fontWeight: 700 }}
        >
          Synapse
        </Typography>
        <Typography
          variant="h5"
          component="h2"
          color="text.secondary"
          gutterBottom
          sx={{ fontSize: { xs: "1.25rem", sm: "1.5rem", md: "1.75rem" }, maxWidth: 800, mx: "auto" }}
        >
          Cognitive Learning Acceleration Platform
        </Typography>
        <Typography
          variant="body1"
          sx={{ mb: 4, maxWidth: 700, mx: "auto", px: 2, fontSize: { xs: "0.9rem", sm: "1rem" } }}
        >
          Transform your digital learning experience with AI-powered cognitive state detection, adaptive content
          presentation, and intelligent knowledge mapping.
        </Typography>
        <Box sx={{ display: "flex", gap: 2, justifyContent: "center", flexWrap: "wrap" }}>
          <Button
            variant="contained"
            size="large"
            component={Link}
            href="/auth/signup"
            sx={{ px: 4, py: 1.5, fontSize: "1.1rem" }}
          >
            Get Started
          </Button>
          <Button
            variant="outlined"
            size="large"
            component={Link}
            href="/auth/signin"
            sx={{ px: 4, py: 1.5, fontSize: "1.1rem" }}
          >
            Sign In
          </Button>
        </Box>
      </Box>

      {/* Features Section */}
      <Box sx={{ py: { xs: 4, md: 8 } }}>
        <Typography variant="h3" component="h2" textAlign="center" gutterBottom sx={{ mb: 6, fontWeight: 600 }}>
          Key Features
        </Typography>
        <Grid container spacing={{ xs: 2, md: 4 }}>
          <Grid xs={12} sm={6} md={3}>
            <Card sx={{ height: "100%", textAlign: "center", p: { xs: 2, md: 3 }, borderRadius: 2, boxShadow: 3 }}>
              <CardContent>
                <Psychology sx={{ fontSize: 56, color: "primary.main", mb: 2 }} />
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                  Cognitive Detection
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Real-time analysis of your cognitive state through interaction patterns.
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid xs={12} sm={6} md={3}>
            <Card sx={{ height: "100%", textAlign: "center", p: { xs: 2, md: 3 }, borderRadius: 2, boxShadow: 3 }}>
              <CardContent>
                <TrendingUp sx={{ fontSize: 56, color: "primary.main", mb: 2 }} />
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                  Adaptive Content
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Dynamic content adaptation based on your current cognitive state.
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid xs={12} sm={6} md={3}>
            <Card sx={{ height: "100%", textAlign: "center", p: { xs: 2, md: 3 }, borderRadius: 2, boxShadow: 3 }}>
              <CardContent>
                <AccountTree sx={{ fontSize: 56, color: "primary.main", mb: 2 }} />
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                  Knowledge Mapping
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Visualize connections between concepts and track learning progress.
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid xs={12} sm={6} md={3}>
            <Card sx={{ height: "100%", textAlign: "center", p: { xs: 2, md: 3 }, borderRadius: 2, boxShadow: 3 }}>
              <CardContent>
                <AutoAwesome sx={{ fontSize: 56, color: "primary.main", mb: 2 }} />
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                  AI Assistance
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Personalized learning recommendations powered by Gemini AI.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>

      {/* CTA Section */}
      <Box
        sx={{
          textAlign: "center",
          py: { xs: 4, md: 6 },
          bgcolor: "primary.light",
          color: "primary.contrastText",
          borderRadius: 3,
          mt: { xs: 4, md: 8 },
          p: { xs: 3, md: 5 },
        }}
      >
        <Typography
          variant="h4"
          component="h2"
          gutterBottom
          sx={{ fontWeight: 700, fontSize: { xs: "1.75rem", sm: "2.25rem" } }}
        >
          Ready to accelerate your learning?
        </Typography>
        <Typography
          variant="body1"
          sx={{ mb: 3, maxWidth: 700, mx: "auto", fontSize: { xs: "0.95rem", sm: "1.05rem" } }}
        >
          Join thousands of learners who are already using Synapse to enhance their cognitive abilities and achieve
          their learning goals.
        </Typography>
        <Button
          variant="contained"
          size="large"
          component={Link}
          href="/auth/signup"
          sx={{
            bgcolor: "white",
            color: "primary.main",
            "&:hover": { bgcolor: "grey.200" },
            px: 5,
            py: 1.5,
            fontSize: "1.2rem",
            fontWeight: 600,
          }}
        >
          Start Learning Today
        </Button>
      </Box>
    </Container>
  )
}
