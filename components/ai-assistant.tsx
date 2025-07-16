"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Bot, Send, Lightbulb, BookOpen, Target, Zap } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Message {
  id: string
  type: "user" | "assistant"
  content: string
  timestamp: Date
}

interface Suggestion {
  id: string
  title: string
  description: string
  type: "concept" | "resource" | "technique" | "break"
  icon: any
}

export function AIAssistant() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      type: "assistant",
      content:
        "Hello! I'm your AI learning assistant. I can help you optimize your learning sessions, suggest resources, and provide personalized guidance based on your cognitive patterns. How can I assist you today?",
      timestamp: new Date(),
    },
  ])
  const [inputMessage, setInputMessage] = useState("")
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const suggestions: Suggestion[] = [
    {
      id: "1",
      title: "Concept Reinforcement",
      description: "Review machine learning fundamentals based on your recent sessions",
      type: "concept",
      icon: Lightbulb,
    },
    {
      id: "2",
      title: "Resource Recommendation",
      description: "Advanced Python tutorials matching your current skill level",
      type: "resource",
      icon: BookOpen,
    },
    {
      id: "3",
      title: "Focus Technique",
      description: "Try the Pomodoro technique to improve your concentration",
      type: "technique",
      icon: Target,
    },
    {
      id: "4",
      title: "Take a Break",
      description: "Your cognitive state suggests a 10-minute break would be beneficial",
      type: "break",
      icon: Zap,
    },
  ]

  const sendMessage = async () => {
    if (!inputMessage.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: inputMessage,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputMessage("")
    setLoading(true)

    try {
      const response = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: inputMessage, context: "learning_assistant" }),
      })

      if (response.ok) {
        const data = await response.json()
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          type: "assistant",
          content: data.response,
          timestamp: new Date(),
        }
        setMessages((prev) => [...prev, assistantMessage])
      } else {
        throw new Error("Failed to get AI response")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to get AI response. Please try again.",
        variant: "destructive",
      })

      // Fallback response
      const fallbackMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "assistant",
        content:
          "I'm having trouble connecting right now, but I can still help! Based on your learning patterns, I'd suggest focusing on one concept at a time and taking regular breaks to maintain optimal cognitive performance.",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, fallbackMessage])
    } finally {
      setLoading(false)
    }
  }

  const handleSuggestionClick = (suggestion: Suggestion) => {
    const message = `Tell me more about: ${suggestion.title}`
    setInputMessage(message)
  }

  const getSuggestionColor = (type: string) => {
    switch (type) {
      case "concept":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
      case "resource":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "technique":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
      case "break":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    }
  }

  return (
    <div className="space-y-6">
      {/* AI Suggestions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Lightbulb className="h-5 w-5" />
            <span>AI Suggestions</span>
          </CardTitle>
          <CardDescription>Personalized recommendations based on your learning patterns</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {suggestions.map((suggestion) => {
              const Icon = suggestion.icon
              return (
                <Card
                  key={suggestion.id}
                  className="cursor-pointer hover:shadow-md transition-all duration-300 hover:-translate-y-1"
                  onClick={() => handleSuggestionClick(suggestion)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start space-x-3">
                      <div className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800">
                        <Icon className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-semibold text-sm">{suggestion.title}</h3>
                          <Badge className={getSuggestionColor(suggestion.type)}>{suggestion.type}</Badge>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{suggestion.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Chat Interface */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Bot className="h-5 w-5" />
            <span>AI Learning Assistant</span>
          </CardTitle>
          <CardDescription>Get personalized learning guidance and support</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <ScrollArea className="h-96 w-full border rounded-lg p-4">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div key={message.id} className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`max-w-[80%] p-3 rounded-lg ${
                        message.type === "user"
                          ? "bg-blue-600 text-white"
                          : "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                      }`}
                    >
                      <p className="text-sm">{message.content}</p>
                      <p className="text-xs opacity-70 mt-1">{message.timestamp.toLocaleTimeString()}</p>
                    </div>
                  </div>
                ))}
                {loading && (
                  <div className="flex justify-start">
                    <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-lg">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div
                          className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                          style={{ animationDelay: "0.1s" }}
                        ></div>
                        <div
                          className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                          style={{ animationDelay: "0.2s" }}
                        ></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>

            <div className="flex space-x-2">
              <Input
                placeholder="Ask me anything about learning..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                disabled={loading}
              />
              <Button onClick={sendMessage} disabled={loading || !inputMessage.trim()}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
