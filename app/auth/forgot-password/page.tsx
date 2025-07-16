"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Brain, ArrowLeft, Mail } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (response.ok) {
        setIsSubmitted(true)
        toast({
          title: "Email Sent",
          description: data.message,
        })
      } else {
        toast({
          title: "Error",
          description: data.error || "Something went wrong",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Network error. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
        <Card className="w-full max-w-md bg-gray-800/50 backdrop-blur-sm border-gray-700">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full">
                <Mail className="h-8 w-8 text-white" />
              </div>
            </div>
            <CardTitle className="text-2xl text-white">Check Your Email</CardTitle>
            <CardDescription className="text-gray-300">
              We've sent a password reset link to your email address.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center text-sm text-gray-400">
              Didn't receive the email? Check your spam folder or{" "}
              <button onClick={() => setIsSubmitted(false)} className="text-purple-400 hover:underline">
                try again
              </button>
            </div>
            <Link href="/auth/signin">
              <Button
                variant="outline"
                className="w-full border-gray-600 text-gray-300 hover:bg-gray-700 bg-transparent"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Sign In
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      <Card className="w-full max-w-md bg-gray-800/50 backdrop-blur-sm border-gray-700">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full">
              <Brain className="h-8 w-8 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl text-white">Forgot Password?</CardTitle>
          <CardDescription className="text-gray-300">
            Enter your email address and we'll send you a link to reset your password.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-300">
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Enter your email address"
                className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              disabled={isLoading}
            >
              {isLoading ? "Sending..." : "Send Reset Link"}
            </Button>
          </form>

          <div className="text-center">
            <Link href="/auth/signin" className="text-purple-400 hover:underline text-sm">
              <ArrowLeft className="inline mr-1 h-4 w-4" />
              Back to Sign In
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
