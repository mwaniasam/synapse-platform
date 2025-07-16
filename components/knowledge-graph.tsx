"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Plus, Brain, BookOpen, Code, SpaceIcon as Science } from "lucide-react"

interface KnowledgeNode {
  id: string
  concept: string
  domain: string
  frequency: number
  connections: string[]
  lastEncountered: Date
}

export function KnowledgeGraph() {
  const [nodes, setNodes] = useState<KnowledgeNode[]>([
    {
      id: "1",
      concept: "Machine Learning",
      domain: "AI",
      frequency: 15,
      connections: ["2", "3", "4"],
      lastEncountered: new Date(),
    },
    {
      id: "2",
      concept: "Neural Networks",
      domain: "AI",
      frequency: 12,
      connections: ["1", "5"],
      lastEncountered: new Date(),
    },
    {
      id: "3",
      concept: "Data Science",
      domain: "Analytics",
      frequency: 8,
      connections: ["1", "6"],
      lastEncountered: new Date(),
    },
    {
      id: "4",
      concept: "Python Programming",
      domain: "Programming",
      frequency: 20,
      connections: ["1", "2", "3"],
      lastEncountered: new Date(),
    },
    {
      id: "5",
      concept: "Deep Learning",
      domain: "AI",
      frequency: 10,
      connections: ["2"],
      lastEncountered: new Date(),
    },
    {
      id: "6",
      concept: "Statistics",
      domain: "Mathematics",
      frequency: 6,
      connections: ["3"],
      lastEncountered: new Date(),
    },
  ])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedDomain, setSelectedDomain] = useState<string | null>(null)

  const domains = Array.from(new Set(nodes.map((node) => node.domain)))

  const filteredNodes = nodes.filter((node) => {
    const matchesSearch = node.concept.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesDomain = !selectedDomain || node.domain === selectedDomain
    return matchesSearch && matchesDomain
  })

  const getDomainIcon = (domain: string) => {
    switch (domain.toLowerCase()) {
      case "ai":
        return Brain
      case "programming":
        return Code
      case "mathematics":
        return Science
      default:
        return BookOpen
    }
  }

  const getDomainColor = (domain: string) => {
    switch (domain.toLowerCase()) {
      case "ai":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
      case "programming":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "mathematics":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
      case "analytics":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Brain className="h-5 w-5" />
            <span>Knowledge Graph</span>
          </CardTitle>
          <CardDescription>Visualize the connections between concepts you've learned</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search concepts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              Add Concept
            </Button>
          </div>

          <div className="flex flex-wrap gap-2 mb-6">
            <Button
              variant={selectedDomain === null ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedDomain(null)}
            >
              All Domains
            </Button>
            {domains.map((domain) => (
              <Button
                key={domain}
                variant={selectedDomain === domain ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedDomain(domain)}
              >
                {domain}
              </Button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredNodes.map((node) => {
              const Icon = getDomainIcon(node.domain)
              return (
                <Card
                  key={node.id}
                  className="knowledge-node hover:shadow-lg transition-all duration-300 cursor-pointer"
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <Icon className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                      <Badge className={getDomainColor(node.domain)}>{node.domain}</Badge>
                    </div>
                    <CardTitle className="text-lg">{node.concept}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Frequency:</span>
                        <span className="font-medium">{node.frequency}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Connections:</span>
                        <span className="font-medium">{node.connections.length}</span>
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        Last seen: {node.lastEncountered.toLocaleDateString()}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {filteredNodes.length === 0 && (
            <div className="text-center py-12">
              <Brain className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400">No concepts found matching your search.</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Knowledge Insights</CardTitle>
          <CardDescription>Discover patterns in your learning journey</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{nodes.length}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Total Concepts</div>
            </div>
            <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">{domains.length}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Knowledge Domains</div>
            </div>
            <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {nodes.reduce((sum, node) => sum + node.connections.length, 0)}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Total Connections</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
