"use client"

import { ThemeProvider as MUIThemeProvider, createTheme } from "@mui/material/styles"
import { StyledEngineProvider } from "@mui/material/styles"
import CssBaseline from "@mui/material/CssBaseline"
import { createContext, useContext, useEffect, useState, type ReactNode } from "react"

interface ThemeContextType {
  darkMode: boolean
  toggleDarkMode: () => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }
  return context
}

interface ThemeProviderProps {
  children: ReactNode
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [darkMode, setDarkMode] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const savedTheme = localStorage.getItem("synapse-theme")
    if (savedTheme) {
      setDarkMode(savedTheme === "dark")
    } else {
      // Check system preference
      setDarkMode(window.matchMedia("(prefers-color-scheme: dark)").matches)
    }
  }, [])

  const toggleDarkMode = () => {
    const newMode = !darkMode
    setDarkMode(newMode)
    localStorage.setItem("synapse-theme", newMode ? "dark" : "light")
  }

  const theme = createTheme({
    palette: {
      mode: darkMode ? "dark" : "light",
      primary: {
        main: darkMode ? "#90caf9" : "#1976d2",
      },
      secondary: {
        main: darkMode ? "#f48fb1" : "#dc004e",
      },
      background: {
        default: darkMode ? "#121212" : "#ffffff",
        paper: darkMode ? "#1e1e1e" : "#ffffff",
      },
    },
    typography: {
      fontFamily: "Inter, sans-serif",
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            transition: "background-color 0.3s ease, color 0.3s ease",
          },
        },
      },
    },
  })

  // Prevent hydration mismatch
  if (!mounted) {
    return null
  }

  return (
    <ThemeContext.Provider value={{ darkMode, toggleDarkMode }}>
      <StyledEngineProvider injectFirst>
        <MUIThemeProvider theme={theme}>
          <CssBaseline />
          {children}
        </MUIThemeProvider>
      </StyledEngineProvider>
    </ThemeContext.Provider>
  )
}
