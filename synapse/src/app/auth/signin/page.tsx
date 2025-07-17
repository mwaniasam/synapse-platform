"use client"

import { signIn, getSession } from "next-auth/react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Container, Paper, Typography, Button, Box, CircularProgress, Alert } from "@mui/material"
import GoogleIcon from "@mui/icons-material/Google"

export default function SignIn() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    getSession().then((session) => {
      if (session) {
        router.push("/dashboard")
      }
    })
  }, [router])

  const handleGoogleSignIn = async () => {
    setLoading(true)
    setError(null)
    try {
      const result = await signIn("google", {
        callbackUrl: "/dashboard",
        redirect: false,
      })

      if (result?.error) {
        setError("Failed to sign in. Please try again.")
      }
    } catch (error) {
      console.error("Sign in error:", error)
      setError("An unexpected error occurred. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Paper elevation={3} sx={{ p: 4, textAlign: "center" }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Welcome to Synapse
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          Your cognitive learning acceleration platform
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Box sx={{ mb: 3 }}>
          <Button
            variant="contained"
            size="large"
            startIcon={loading ? <CircularProgress size={20} /> : <GoogleIcon />}
            onClick={handleGoogleSignIn}
            disabled={loading}
            fullWidth
          >
            {loading ? "Signing in..." : "Sign in with Google"}
          </Button>
        </Box>

        <Typography variant="body2" color="text.secondary">
          By signing in, you agree to our Terms of Service and Privacy Policy
        </Typography>

        {process.env.NODE_ENV === "development" && (
          <Alert severity="info" sx={{ mt: 2 }}>
            <Typography variant="caption">
              Development Mode: Authentication is configured for local development. Set up your Google OAuth credentials
              in .env.local for full functionality.
            </Typography>
          </Alert>
        )}
      </Paper>
    </Container>
  )
}
