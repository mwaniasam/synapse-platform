"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/components/auth-provider"
import { useToast } from "@/hooks/use-toast"
import { Brain, Eye, EyeOff } from "lucide-react"

interface AuthModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  mode: "login" | "signup"
  onModeChange: (mode: "login" | "signup") => void
}

export function AuthModal({ open, onOpenChange, mode, onModeChange }: AuthModalProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const { login, signup } = useAuth()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      let success = false
      if (mode === "login") {
        success = await login(email, password)
      } else {
        success = await signup(email, password, name)
      }

      if (success) {
        toast({
          title: mode === "login" ? "Welcome back!" : "Welcome to Synapse!",
          description: mode === "login" ? "You have successfully logged in." : "Your account has been created.",
        })
        onOpenChange(false)
        setEmail("")
        setPassword("")
        setName("")
      } else {
        toast({
          title: "Authentication failed",
          description: "Please check your credentials and try again.",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-center mb-4">
            <Brain className="h-8 w-8 text-blue-600 animate-pulse-glow" />
          </div>
          <DialogTitle className="text-center text-2xl">
            {mode === "login" ? "Welcome Back" : "Join Synapse"}
          </DialogTitle>
          <DialogDescription className="text-center">
            {mode === "login"
              ? "Sign in to continue your learning journey"
              : "Create your account to start accelerating your learning"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === "signup" && (
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="Enter your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? <div className="spinner mr-2" /> : null}
            {mode === "login" ? "Sign In" : "Create Account"}
          </Button>
        </form>

        <div className="text-center text-sm text-gray-600 dark:text-gray-400">
          {mode === "login" ? "Don't have an account? " : "Already have an account? "}
          <Button
            variant="link"
            className="p-0 h-auto font-semibold"
            onClick={() => onModeChange(mode === "login" ? "signup" : "login")}
          >
            {mode === "login" ? "Sign up" : "Sign in"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
