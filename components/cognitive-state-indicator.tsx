"use client"

import { Badge } from "@/components/ui/badge"
import { Brain, Zap, AlertTriangle, Target } from "lucide-react"

interface CognitiveStateIndicatorProps {
  state: "focused" | "fatigued" | "distracted" | "receptive"
  confidence?: number
}

export function CognitiveStateIndicator({ state, confidence = 85 }: CognitiveStateIndicatorProps) {
  const getStateConfig = (state: string) => {
    switch (state) {
      case "focused":
        return {
          icon: Target,
          color: "bg-green-500",
          textColor: "text-green-700 dark:text-green-300",
          label: "Focused",
          description: "Optimal learning state",
        }
      case "fatigued":
        return {
          icon: Brain,
          color: "bg-yellow-500",
          textColor: "text-yellow-700 dark:text-yellow-300",
          label: "Fatigued",
          description: "Consider taking a break",
        }
      case "distracted":
        return {
          icon: AlertTriangle,
          color: "bg-red-500",
          textColor: "text-red-700 dark:text-red-300",
          label: "Distracted",
          description: "Minimize distractions",
        }
      case "receptive":
        return {
          icon: Zap,
          color: "bg-purple-500",
          textColor: "text-purple-700 dark:text-purple-300",
          label: "Receptive",
          description: "Great time for new concepts",
        }
      default:
        return {
          icon: Brain,
          color: "bg-gray-500",
          textColor: "text-gray-700 dark:text-gray-300",
          label: "Unknown",
          description: "Analyzing...",
        }
    }
  }

  const config = getStateConfig(state)
  const Icon = config.icon

  return (
    <div className="flex items-center space-x-2">
      <div className="relative">
        <div className={`w-3 h-3 rounded-full ${config.color} animate-pulse`}></div>
        <div className={`absolute inset-0 w-3 h-3 rounded-full ${config.color} animate-ping opacity-75`}></div>
      </div>
      <div className="flex flex-col">
        <div className="flex items-center space-x-1">
          <Icon className={`h-4 w-4 ${config.textColor}`} />
          <Badge variant="outline" className={config.textColor}>
            {config.label}
          </Badge>
        </div>
        <span className="text-xs text-gray-500 dark:text-gray-400">{confidence}% confidence</span>
      </div>
    </div>
  )
}
