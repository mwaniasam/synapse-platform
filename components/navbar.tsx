"use client"

import { useState } from "react"
import { useSession, signOut } from "next-auth/react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Brain, Moon, Sun, User, Settings, LogOut, Activity, Timer, BarChart3 } from "lucide-react"
import Link from "next/link"

export function Navbar() {
  const { data: session } = useSession()
  const { theme, setTheme } = useTheme()
  const [showUserMenu, setShowUserMenu] = useState(false)

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <div className="relative">
            <Brain className="h-8 w-8 text-primary" />
            <div className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 animate-pulse" />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Synapse
          </span>
          <Badge variant="secondary" className="text-xs">
            Beta
          </Badge>
        </Link>

        {/* Navigation Links */}
        {session && (
          <div className="hidden md:flex items-center space-x-6">
            <Link
              href="/dashboard"
              className="flex items-center space-x-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              <BarChart3 className="h-4 w-4" />
              <span>Dashboard</span>
            </Link>
            <Link
              href="/focus"
              className="flex items-center space-x-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              <Timer className="h-4 w-4" />
              <span>Focus</span>
            </Link>
            <Link
              href="/activity"
              className="flex items-center space-x-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              <Activity className="h-4 w-4" />
              <span>Activity</span>
            </Link>
          </div>
        )}

        {/* Right Side */}
        <div className="flex items-center space-x-4">
          {/* Theme Toggle */}
          <div className="flex items-center space-x-2">
            <Sun className="h-4 w-4" />
            <Switch checked={theme === "dark"} onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")} />
            <Moon className="h-4 w-4" />
          </div>

          {/* User Menu */}
          {session ? (
            <div className="relative">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center space-x-2"
              >
                <User className="h-4 w-4" />
                <span className="hidden sm:inline">{session.user?.name || session.user?.email}</span>
              </Button>

              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-48 rounded-md border bg-popover p-1 shadow-md">
                  <Link
                    href="/settings"
                    className="flex items-center space-x-2 rounded-sm px-2 py-1.5 text-sm hover:bg-accent"
                    onClick={() => setShowUserMenu(false)}
                  >
                    <Settings className="h-4 w-4" />
                    <span>Settings</span>
                  </Link>
                  <button
                    onClick={() => {
                      setShowUserMenu(false)
                      signOut()
                    }}
                    className="flex w-full items-center space-x-2 rounded-sm px-2 py-1.5 text-sm hover:bg-accent"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/auth/signin">Sign In</Link>
              </Button>
              <Button size="sm" asChild>
                <Link href="/auth/signup">Sign Up</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}
