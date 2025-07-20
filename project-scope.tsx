"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, AlertCircle, XCircle } from "lucide-react"

export default function ProjectScope() {
  const features = [
    {
      category: "Core MVP Features (Achievable)",
      status: "achievable",
      items: [
        "Basic activity tracking (mouse, keyboard, scrolling)",
        "Simple reading mode with text adjustments",
        "Keyword extraction and highlighting",
        "Personal reading history and basic analytics",
        "Extension popup and settings interface",
        "Local data storage and user preferences",
      ],
    },
    {
      category: "Simplified Features (Reduced Scope)",
      status: "modified",
      items: [
        "Activity level detection (not cognitive states)",
        "Rule-based content adaptation (not ML-driven)",
        "Basic concept tagging (not knowledge graphs)",
        "Simple reading recommendations",
        "Basic session tracking",
      ],
    },
    {
      category: "Post-MVP Features (Not in 11 weeks)",
      status: "deferred",
      items: [
        "Advanced cognitive state detection",
        "Machine learning-based adaptations",
        "Sophisticated knowledge mapping",
        "Cross-device synchronization",
        "Collaborative features",
        "AI guidance integration",
      ],
    },
  ]

  const getIcon = (status: string) => {
    switch (status) {
      case "achievable":
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case "modified":
        return <AlertCircle className="w-5 h-5 text-yellow-500" />
      case "deferred":
        return <XCircle className="w-5 h-5 text-red-500" />
      default:
        return null
    }
  }

  const getBadgeVariant = (status: string) => {
    switch (status) {
      case "achievable":
        return "default"
      case "modified":
        return "secondary"
      case "deferred":
        return "destructive"
      default:
        return "outline"
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Synapse MVP: Realistic Project Scope</h1>
        <p className="text-muted-foreground">
          Assessment of what can be delivered as a working application in 11 weeks
        </p>
      </div>

      {features.map((feature, index) => (
        <Card key={index}>
          <CardHeader>
            <div className="flex items-center gap-3">
              {getIcon(feature.status)}
              <div>
                <CardTitle className="text-lg">{feature.category}</CardTitle>
                <Badge variant={getBadgeVariant(feature.status) as any}>
                  {feature.status.charAt(0).toUpperCase() + feature.status.slice(1)}
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {feature.items.map((item, itemIndex) => (
                <li key={itemIndex} className="flex items-start gap-2">
                  <span className="w-2 h-2 bg-current rounded-full mt-2 flex-shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      ))}

      <Card className="border-blue-200 bg-blue-50">
        <CardHeader>
          <CardTitle className="text-blue-800">Recommended Approach</CardTitle>
        </CardHeader>
        <CardContent className="text-blue-700">
          <p className="mb-4">
            Build a <strong>functional demonstration</strong> of the core concepts with room for future enhancement:
          </p>
          <ul className="space-y-2">
            <li>• Focus on user experience and interface design</li>
            <li>• Implement basic functionality that works reliably</li>
            <li>• Create extensible architecture for future ML integration</li>
            <li>• Prioritize privacy and performance from the start</li>
            <li>• Document limitations and future enhancement plans</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
