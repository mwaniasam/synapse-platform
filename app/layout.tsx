import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Navigation } from "@/components/navigation"
import { SessionProvider } from "next-auth/react"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Synapse Learning Pro - AI-Powered Adaptive Learning",
  description:
    "Transform your learning experience with AI-powered cognitive state detection and adaptive content delivery.",
  keywords: ["AI learning", "adaptive education", "cognitive detection", "personalized learning"],
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions)

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <SessionProvider session={session}>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
            <div className="min-h-screen bg-background">
              <Navigation />
              <main>{children}</main>
            </div>
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  )
}
