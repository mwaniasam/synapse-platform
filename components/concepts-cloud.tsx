"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface ConceptsCloudProps {
  concepts: Array<{
    word: string
    frequency: number
    domains: string[]
  }>
}

export function ConceptsCloud({ concepts }: ConceptsCloudProps) {
  const getConceptSize = (frequency: number, maxFreq: number) => {
    const ratio = frequency / maxFreq
    if (ratio > 0.8) return "text-lg font-bold"
    if (ratio > 0.6) return "text-base font-semibold"
    if (ratio > 0.4) return "text-sm font-medium"
    return "text-xs"
  }

  const getConceptColor = (frequency: number, maxFreq: number) => {
    const ratio = frequency / maxFreq
    if (ratio > 0.8) return "bg-blue-100 text-blue-800 border-blue-200"
    if (ratio > 0.6) return "bg-green-100 text-green-800 border-green-200"
    if (ratio > 0.4) return "bg-yellow-100 text-yellow-800 border-yellow-200"
    return "bg-gray-100 text-gray-800 border-gray-200"
  }

  const maxFrequency = Math.max(...concepts.map((c) => c.frequency))

  return (
    <Card className="col-span-3">
      <CardHeader>
        <CardTitle>Learning Concepts</CardTitle>
        <CardDescription>Key concepts you've encountered, sized by frequency</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {concepts.map((concept, index) => (
            <Badge
              key={index}
              variant="outline"
              className={`${getConceptSize(concept.frequency, maxFrequency)} ${getConceptColor(concept.frequency, maxFrequency)} cursor-pointer hover:scale-105 transition-transform`}
              title={`Seen ${concept.frequency} times on ${concept.domains.join(", ")}`}
            >
              {concept.word}
              <span className="ml-1 text-xs opacity-70">{concept.frequency}</span>
            </Badge>
          ))}
        </div>
        {concepts.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <p>No concepts detected yet.</p>
            <p className="text-sm">Start browsing to see your learning patterns!</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
