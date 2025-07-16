"use client"

import type React from "react"

import { SessionProvider } from "next-auth/react"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "react-hot-toast"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        {children}
        <Toaster position="top-right" />
      </ThemeProvider>
    </SessionProvider>
  )
}
