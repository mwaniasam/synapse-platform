"use client"

import { ThemeProvider as MUIThemeProvider, createTheme } from "@mui/material/styles"
import CssBaseline from "@mui/material/CssBaseline"
import type { ReactNode } from "react"

const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#1976d2",
    },
    secondary: {
      main: "#dc004e",
    },
  },
  typography: {
    fontFamily: "Inter, sans-serif",
  },
})

interface ThemeProviderProps {
  children: ReactNode
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  return (
    <MUIThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </MUIThemeProvider>
  )
}
