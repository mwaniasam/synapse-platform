"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Container, Paper, Typography, Button, Box, TextField, Alert, CircularProgress, Divider } from "@mui/material"
import { PersonAdd, Login } from "@mui/icons-material"
import Link from "next/link"

export default function SignUp() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const router = useRouter()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.")
      setLoading(false)
      return
    }

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to create account.")
      }

      setSuccess(true)
      setTimeout(() => {
        router.push("/auth/signin") // Redirect to sign-in after successful signup
      }, 2000)
    } catch (error: any) {
      setError(error.message || "An unexpected error occurred.")
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <Container maxWidth="sm" sx={{ mt: 8, mb: 4 }}>
        <Paper elevation={6} sx={{ p: { xs: 3, md: 5 }, textAlign: "center", borderRadius: 2 }}>
          <Alert severity="success" sx={{ mb: 3, animation: "slideUp 0.3s ease-out" }}>
            Account created successfully! Redirecting to sign in...
          </Alert>
          <CircularProgress />
        </Paper>
      </Container>
    )
  }

  return (
    <Container maxWidth="sm" sx={{ mt: 8, mb: 4 }}>
      <Paper elevation={6} sx={{ p: { xs: 3, md: 5 }, borderRadius: 2 }}>
        <Box sx={{ textAlign: "center", mb: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 700, color: "primary.main" }}>
            Create Account
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Join Synapse and start your learning journey
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3, animation: "slideUp 0.3s ease-out" }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Full Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            sx={{ mb: 2 }}
            disabled={loading}
            variant="outlined"
          />

          <TextField
            fullWidth
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
            sx={{ mb: 2 }}
            disabled={loading}
            variant="outlined"
          />

          <TextField
            fullWidth
            label="Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            required
            helperText="Minimum 6 characters"
            sx={{ mb: 2 }}
            disabled={loading}
            variant="outlined"
          />

          <TextField
            fullWidth
            label="Confirm Password"
            name="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            sx={{ mb: 3 }}
            disabled={loading}
            variant="outlined"
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <PersonAdd />}
            sx={{ mb: 2, py: 1.5, fontSize: "1.1rem" }}
          >
            {loading ? "Creating Account..." : "Create Account"}
          </Button>
        </Box>

        <Divider sx={{ my: 3 }}>
          <Typography variant="body2" color="text.secondary">
            OR
          </Typography>
        </Divider>

        <Button
          fullWidth
          variant="outlined"
          size="large"
          component={Link}
          href="/auth/signin"
          startIcon={<Login />}
          sx={{ py: 1.5, fontSize: "1.1rem" }}
        >
          Sign In
        </Button>

        <Typography variant="body2" color="text.secondary" sx={{ mt: 3, textAlign: "center" }}>
          By creating an account, you agree to our Terms of Service and Privacy Policy
        </Typography>
      </Paper>
    </Container>
  )
}
