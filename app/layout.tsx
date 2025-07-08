import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Navbar } from "@/components/navbar"
import { Toaster } from "react-hot-toast"
import { AuthProvider } from "@/app/providers"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Synapse - Cognitive Learning Acceleration Platform",
  description:
    "Enhance your focus, track your progress, and unlock your learning potential with AI-powered cognitive enhancement.",
  keywords: ["learning", "productivity", "focus", "cognitive enhancement", "pomodoro", "analytics"],
  authors: [{ name: "Synapse Team" }],
  openGraph: {
    title: "Synapse - Cognitive Learning Acceleration Platform",
    description: "AI-powered cognitive enhancement for better learning and productivity",
    type: "website",
  },
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <AuthProvider>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
            <div className="min-h-screen bg-background">
              <Navbar />
              <main>{children}</main>
            </div>
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: "hsl(var(--card))",
                  color: "hsl(var(--card-foreground))",
                  border: "1px solid hsl(var(--border))",
                },
              }}
            />
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
