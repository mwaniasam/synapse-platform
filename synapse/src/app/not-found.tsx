"use client"

import { Container, Typography, Button, Box } from "@mui/material"
import { Home, ArrowBack } from "@mui/icons-material"
import Link from "next/link"

export default function NotFound() {
  return (
    <Container maxWidth="sm" sx={{ mt: 8, textAlign: "center" }}>
      <Box sx={{ py: 8 }}>
        <Typography variant="h1" component="h1" sx={{ fontSize: "6rem", fontWeight: "bold", mb: 2 }}>
          404
        </Typography>
        <Typography variant="h4" component="h2" gutterBottom>
          Page Not Found
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          The page you're looking for doesn't exist or has been moved.
        </Typography>

        <Box sx={{ display: "flex", gap: 2, justifyContent: "center", flexWrap: "wrap" }}>
          <Button variant="contained" startIcon={<Home />} component={Link} href="/">
            Go Home
          </Button>
          <Button variant="outlined" startIcon={<ArrowBack />} onClick={() => window.history.back()}>
            Go Back
          </Button>
        </Box>
      </Box>
    </Container>
  )
}
