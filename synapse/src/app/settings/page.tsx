"use client"

import { useState, useEffect } from "react"
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Switch,
  FormControlLabel,
  Slider,
  Button,
  Alert,
  CircularProgress,
  TextField,
  MenuItem,
} from "@mui/material"
import { Navbar } from "@/components/layout/navbar"
import { Settings as SettingsIcon, Save, ErrorOutline } from "@mui/icons-material"
import { useTheme } from "@/components/providers/theme-provider"

interface UserPreferences {
  enableCognitiveDetection: boolean
  detectionSensitivity: number
  enableContentAdaptation: boolean
  adaptationIntensity: number
  enableKnowledgeMapping: boolean
  theme: string
  dashboardLayout: string
}

export default function SettingsPage() {
  const { darkMode, toggleDarkMode } = useTheme()
  const [preferences, setPreferences] = useState<UserPreferences | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  useEffect(() => {
    fetchPreferences()
  }, [])

  const fetchPreferences = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch("/api/preferences")
      if (!response.ok) {
        throw new Error("Failed to fetch preferences")
      }
      const data: UserPreferences = await response.json()
      setPreferences(data)
      // Sync theme with global theme provider if different
      if ((data.theme === "dark" && !darkMode) || (data.theme === "light" && darkMode)) {
        toggleDarkMode() // This will also update localStorage
      }
    } catch (err: any) {
      console.error("Error fetching preferences:", err)
      setError(err.message || "Failed to load settings.")
    } finally {
      setLoading(false)
    }
  }

  const handlePreferenceChange = (key: keyof UserPreferences, value: any) => {
    if (preferences) {
      setPreferences({ ...preferences, [key]: value })
    }
  }

  const handleSavePreferences = async () => {
    if (!preferences) return

    setSaving(true)
    setError(null)
    setSuccess(null)
    try {
      const response = await fetch("/api/preferences", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(preferences),
      })

      if (!response.ok) {
        throw new Error("Failed to save preferences")
      }
      setSuccess("Settings saved successfully!")
      // Re-sync theme after saving if it was changed
      if ((preferences.theme === "dark" && !darkMode) || (preferences.theme === "light" && darkMode)) {
        toggleDarkMode()
      }
    } catch (err: any) {
      console.error("Error saving preferences:", err)
      setError(err.message || "Failed to save settings.")
    } finally {
      setSaving(false)
      setTimeout(() => setSuccess(null), 3000) // Clear success message after 3 seconds
    }
  }

  if (loading) {
    return (
      <>
        <Navbar />
        <Container maxWidth="xl" sx={{ mt: 8, mb: 4, textAlign: "center" }}>
          <CircularProgress size={60} sx={{ mb: 3 }} />
          <Typography variant="h5" color="text.secondary">
            Loading settings...
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
          <Alert severity="error" icon={<ErrorOutline />}>
            {error}
          </Alert>
        </Container>
      </>
    )
  }

  if (!preferences) {
    return null // Should not happen if loading and error are handled
  }

  return (
    <>
      <Navbar />
      <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ textAlign: "center", mb: 4 }}>
          <SettingsIcon sx={{ fontSize: 60, color: "primary.main", mb: 1 }} />
          <Typography variant="h4" component="h1" gutterBottom>
            Application Settings
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage your preferences for Synapse.
          </Typography>
        </Box>

        {success && (
          <Alert severity="success" sx={{ mb: 3, animation: "slideUp 0.3s ease-out" }}>
            {success}
          </Alert>
        )}

        <Card sx={{ p: { xs: 2, md: 4 }, borderRadius: 2, boxShadow: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
              General Preferences
            </Typography>

            <FormControlLabel
              control={
                <Switch
                  checked={preferences.theme === "dark"}
                  onChange={() => handlePreferenceChange("theme", preferences.theme === "dark" ? "light" : "dark")}
                />
              }
              label="Dark Mode"
              sx={{ mb: 2 }}
            />

            <TextField
              select
              fullWidth
              label="Dashboard Layout"
              value={preferences.dashboardLayout}
              onChange={(e) => handlePreferenceChange("dashboardLayout", e.target.value)}
              sx={{ mb: 3 }}
            >
              <MenuItem value="default">Default</MenuItem>
              <MenuItem value="compact">Compact</MenuItem>
              <MenuItem value="expanded">Expanded</MenuItem>
            </TextField>

            <Typography variant="h6" gutterBottom sx={{ mt: 4, mb: 3 }}>
              Cognitive Detection
            </Typography>

            <FormControlLabel
              control={
                <Switch
                  checked={preferences.enableCognitiveDetection}
                  onChange={(e) => handlePreferenceChange("enableCognitiveDetection", e.target.checked)}
                />
              }
              label="Enable Real-time Cognitive Detection"
              sx={{ mb: 2 }}
            />

            <Typography gutterBottom>Detection Sensitivity: {preferences.detectionSensitivity.toFixed(1)}</Typography>
            <Slider
              value={preferences.detectionSensitivity}
              onChange={(_e, newValue) => handlePreferenceChange("detectionSensitivity", newValue as number)}
              step={0.1}
              min={0}
              max={1}
              valueLabelDisplay="auto"
              sx={{ mb: 3 }}
            />

            <Typography variant="h6" gutterBottom sx={{ mt: 4, mb: 3 }}>
              Content Adaptation
            </Typography>

            <FormControlLabel
              control={
                <Switch
                  checked={preferences.enableContentAdaptation}
                  onChange={(e) => handlePreferenceChange("enableContentAdaptation", e.target.checked)}
                />
              }
              label="Enable Adaptive Content Presentation"
              sx={{ mb: 2 }}
            />

            <Typography gutterBottom>Adaptation Intensity: {preferences.adaptationIntensity.toFixed(1)}</Typography>
            <Slider
              value={preferences.adaptationIntensity}
              onChange={(_e, newValue) => handlePreferenceChange("adaptationIntensity", newValue as number)}
              step={0.1}
              min={0}
              max={1}
              valueLabelDisplay="auto"
              sx={{ mb: 3 }}
            />

            <Typography variant="h6" gutterBottom sx={{ mt: 4, mb: 3 }}>
              Knowledge Mapping
            </Typography>

            <FormControlLabel
              control={
                <Switch
                  checked={preferences.enableKnowledgeMapping}
                  onChange={(e) => handlePreferenceChange("enableKnowledgeMapping", e.target.checked)}
                />
              }
              label="Enable Knowledge Graph Mapping"
              sx={{ mb: 3 }}
            />

            <Button
              variant="contained"
              startIcon={saving ? <CircularProgress size={20} color="inherit" /> : <Save />}
              onClick={handleSavePreferences}
              disabled={saving}
              fullWidth
              sx={{ mt: 4, py: 1.5 }}
            >
              {saving ? "Saving..." : "Save Changes"}
            </Button>
          </CardContent>
        </Card>
      </Container>
    </>
  )
}
