"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { motion } from "framer-motion"

interface SettingsFormProps {
  initialName: string
  initialEmail: string
  initialLearningStyle: string
}

export function SettingsForm({ initialName, initialEmail, initialLearningStyle }: SettingsFormProps) {
  const [name, setName] = useState(initialName)
  const [email, setEmail] = useState(initialEmail)
  const [learningStyle, setLearningStyle] = useState(initialLearningStyle)
  const [isSaving, setIsSaving] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))
      console.log("Settings saved:", { name, email, learningStyle })
      toast({
        title: "Settings Saved!",
        description: "Your preferences have been updated successfully.",
        variant: "default",
      })
    } catch (error) {
      console.error("Failed to save settings:", error)
      toast({
        title: "Error",
        description: "Failed to save settings. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const formVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  }

  return (
    <motion.div initial="hidden" animate="visible" variants={formVariants} className="w-full max-w-md mx-auto">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-gray-800">User Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-2">
              <Label htmlFor="name" className="text-gray-700">
                Name
              </Label>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your Name"
                className="focus:ring-purple-500 focus:border-purple-500"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email" className="text-gray-700">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@example.com"
                className="focus:ring-purple-500 focus:border-purple-500"
                disabled
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="learningStyle" className="text-gray-700">
                Learning Style
              </Label>
              <Select value={learningStyle} onValueChange={setLearningStyle}>
                <SelectTrigger className="w-full focus:ring-purple-500 focus:border-purple-500">
                  <SelectValue placeholder="Select your preferred learning style" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="visual">Visual</SelectItem>
                  <SelectItem value="auditory">Auditory</SelectItem>
                  <SelectItem value="kinesthetic">Kinesthetic</SelectItem>
                  <SelectItem value="reading-writing">Reading/Writing</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <CardFooter className="p-0 pt-4">
              <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700" disabled={isSaving}>
                {isSaving ? "Saving..." : "Save Changes"}
              </Button>
            </CardFooter>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  )
}
