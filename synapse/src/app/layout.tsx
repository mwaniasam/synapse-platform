import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/providers/theme-provider"
import { AuthProvider } from "@/components/providers/auth-provider"
import { AppRouterCacheProvider } from "@mui/material-nextjs/v14-appRouter"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Synapse - Cognitive Learning Acceleration Platform",
  description: "Adaptive learning platform that responds to your cognitive patterns",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <AppRouterCacheProvider options={{ enableCssLayer: true }}>
          <AuthProvider>
            <ThemeProvider>{children}</ThemeProvider>
          </AuthProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  )
}
