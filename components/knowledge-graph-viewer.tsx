"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Network, Plus } from "lucide-react"

interface KnowledgeNode {
  id: string
  concept: string
  domain: string
  importance: number
  mastery: number
  connections: string[]
  position?: { x: number; y: number }
}

interface KnowledgeLink {
  source: string
  target: string
  strength: number
  type: string
}

interface KnowledgeGraphData {
  nodes: KnowledgeNode[]
  links: KnowledgeLink[]
}

export default function KnowledgeGraphViewer() {
  const [graphData, setGraphData] = useState<KnowledgeGraphData>({ nodes: [], links: [] })
  const [selectedNode, setSelectedNode] = useState<KnowledgeNode | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchKnowledgeGraph()
  }, [])

  const fetchKnowledgeGraph = async () => {
    try {
      const response = await fetch("/api/knowledge-graph")
      if (response.ok) {
        const data = await response.json()
        setGraphData(data)
      }
    } catch (error) {
      console.error("Failed to fetch knowledge graph:", error)
    } finally {
      setLoading(false)
    }
  }

  const getMasteryColor = (mastery: number) => {
    if (mastery >= 0.8) return "bg-green-500"
    if (mastery >= 0.6) return "bg-blue-500"
    if (mastery >= 0.4) return "bg-yellow-500"
    return "bg-red-500"
  }

  const getDomainColor = (domain: string) => {
    const colors = {
      technology: "bg-purple-100 text-purple-800",
      science: "bg-green-100 text-green-800",
      business: "bg-blue-100 text-blue-800",
      arts: "bg-pink-100 text-pink-800",
      general: "bg-gray-100 text-gray-800",
    }
    return colors[domain as keyof typeof colors] || colors.general
  }

  if (loading) {
    return (
      <Card className="w-full">
        <CardContent className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Network className="w-5 h-5" />
            Knowledge Graph
          </CardTitle>
        </CardHeader>
        <CardContent>
          {graphData.nodes.length === 0 ? (
            <div className="text-center py-12">
              <Network className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Knowledge Graph Yet</h3>
              <p className="text-muted-foreground mb-4">Start learning to build your personalized knowledge graph</p>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Start Learning Session
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Graph Visualization Placeholder */}
              <div className="relative h-96 bg-muted/20 rounded-lg border-2 border-dashed border-muted-foreground/25 flex items-center justify-center">
                <div className="text-center">
                  <Network className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">Interactive graph visualization would be rendered here</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    {graphData.nodes.length} concepts, {graphData.links.length} connections
                  </p>
                </div>
              </div>

              {/* Node List */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {graphData.nodes.slice(0, 6).map((node) => (
                  <Card
                    key={node.id}
                    className="cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => setSelectedNode(node)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-semibold text-sm">{node.concept}</h4>
                        <div
                          className={`w-3 h-3 rounded-full ${getMasteryColor(node.mastery)}`}
                          title={`Mastery: ${Math.round(node.mastery * 100)}%`}
                        />
                      </div>
                      <Badge className={getDomainColor(node.domain)} variant="outline">
                        {node.domain}
                      </Badge>
                      <div className="mt-2 text-xs text-muted-foreground">
                        Importance: {Math.round(node.importance * 100)}%
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Selected Node Details */}
      {selectedNode && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>{selectedNode.concept}</span>
              <Button variant="outline" size="sm" onClick={() => setSelectedNode(null)}>
                Close
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-sm font-medium">Domain:</span>
                <Badge className={getDomainColor(selectedNode.domain)} variant="outline">
                  {selectedNode.domain}
                </Badge>
              </div>
              <div>
                <span className="text-sm font-medium">Mastery:</span>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-muted rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${getMasteryColor(selectedNode.mastery)}`}
                      style={{ width: `${selectedNode.mastery * 100}%` }}
                    />
                  </div>
                  <span className="text-sm">{Math.round(selectedNode.mastery * 100)}%</span>
                </div>
              </div>
            </div>

            <div>
              <span className="text-sm font-medium">Connections:</span>
              <p className="text-sm text-muted-foreground">{selectedNode.connections.length} related concepts</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
