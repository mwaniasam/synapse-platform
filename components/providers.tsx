"use client"

import { ThemeProvider } from "@/components/theme-provider"
import { SessionProvider } from "next-auth/react"
import type { ReactNode } from "react"

interface ProvidersProps {
  children: ReactNode
}

export function Providers({ children }: ProvidersProps) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <SessionProvider>{children}</SessionProvider>
    </ThemeProvider>
  )
}
