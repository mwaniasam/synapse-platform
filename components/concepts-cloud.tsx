"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Brain, TrendingUp } from "lucide-react"

interface Concept {
  name: string
  frequency: number
  confidence: number
  domain: string
  growth: number
}

export function ConceptsCloud() {
  // Mock data - in real app, this would come from API
  const concepts: Concept[] = [
    { name: "React Hooks", frequency: 15, confidence: 0.85, domain: "Programming", growth: 12 },
    { name: "Machine Learning", frequency: 12, confidence: 0.72, domain: "AI", growth: 8 },
    { name: "Database Design", frequency: 10, confidence: 0.9, domain: "Backend", growth: -2 },
    { name: "TypeScript", frequency: 18, confidence: 0.88, domain: "Programming", growth: 15 },
    { name: "UI/UX Design", frequency: 8, confidence: 0.65, domain: "Design", growth: 5 },
    { name: "API Development", frequency: 14, confidence: 0.82, domain: "Backend", growth: 10 },
    { name: "Data Structures", frequency: 9, confidence: 0.78, domain: "CS", growth: 3 },
    { name: "Authentication", frequency: 7, confidence: 0.75, domain: "Security", growth: 7 },
  ]

  const getConceptSize = (frequency: number) => {
    const maxFreq = Math.max(...concepts.map((c) => c.frequency))
    const minSize = 12
    const maxSize = 20
    return minSize + (frequency / maxFreq) * (maxSize - minSize)
  }

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
    if (confidence >= 0.6) return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
    return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
  }

  const getDomainColor = (domain: string) => {
    const colors: Record<string, string> = {
      Programming: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
      AI: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
      Backend: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
      Design: "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200",
      CS: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
      Security: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
    }
    return colors[domain] || "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5" />
          Knowledge Map
        </CardTitle>
        <CardDescription>Concepts you've been learning about</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Concepts cloud */}
          <div className="flex flex-wrap gap-2 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg min-h-[120px]">
            {concepts.map((concept, index) => (
              <div
                key={index}
                className="relative group cursor-pointer"
                style={{
                  fontSize: `${getConceptSize(concept.frequency)}px`,
                }}
              >
                <span className="font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  {concept.name}
                </span>
                {concept.growth > 0 && <TrendingUp className="inline-block h-3 w-3 text-green-500 ml-1" />}

                {/* Tooltip */}
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-black text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                  <div className="space-y-1">
                    <div>Frequency: {concept.frequency}</div>
                    <div>Confidence: {(concept.confidence * 100).toFixed(0)}%</div>
                    <div>Growth: +{concept.growth}%</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Domain breakdown */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium">By Domain</h4>
            <div className="flex flex-wrap gap-2">
              {Array.from(new Set(concepts.map((c) => c.domain))).map((domain) => {
                const domainConcepts = concepts.filter((c) => c.domain === domain)
                return (
                  <Badge key={domain} variant="outline" className={getDomainColor(domain)}>
                    {domain} ({domainConcepts.length})
                  </Badge>
                )
              })}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
