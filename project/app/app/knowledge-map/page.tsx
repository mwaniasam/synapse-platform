"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import { redirect } from "next/navigation"
import { KnowledgeGraph } from "@/components/knowledge-map/knowledge-graph"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Brain, Target, TrendingUp, Zap } from "lucide-react"

interface KnowledgeNode {
  id: string
  concept: string
  subject: string
  masteryLevel: number
  connections: string[]
}

export default function KnowledgeMapPage() {
  const { data: session, status } = useSession()
  
  // Mock knowledge nodes - would come from user's learning data
  const [knowledgeNodes] = useState<KnowledgeNode[]>([
    // Empty array - knowledge nodes will be built from user's learning progress
  ])

  const [selectedNode, setSelectedNode] = useState<KnowledgeNode | null>(null)

  if (status === "loading") {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  if (!session) {
    redirect("/auth/signin")
  }

  const handleNodeClick = (node: KnowledgeNode) => {
    setSelectedNode(node)
  }

  const getSubjectStats = () => {
    const subjects = Array.from(new Set(knowledgeNodes.map(n => n.subject)))
    if (subjects.length === 0) return []
    return subjects.map(subject => {
      const subjectNodes = knowledgeNodes.filter(n => n.subject === subject)
      const avgMastery = subjectNodes.reduce((sum, n) => sum + n.masteryLevel, 0) / subjectNodes.length
      return {
        subject,
        nodes: subjectNodes.length,
        avgMastery: Math.round(avgMastery)
      }
    })
  }

  const overallMastery = knowledgeNodes.length > 0 ? Math.round(
    knowledgeNodes.reduce((sum, n) => sum + n.masteryLevel, 0) / knowledgeNodes.length
  ) : 0

  const strongestAreas = knowledgeNodes
    .filter(n => n.masteryLevel >= 80)
    .sort((a, b) => b.masteryLevel - a.masteryLevel)
    .slice(0, 3)

  const improvementAreas = knowledgeNodes
    .filter(n => n.masteryLevel < 60)
    .sort((a, b) => a.masteryLevel - b.masteryLevel)
    .slice(0, 3)

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Brain className="h-8 w-8 text-primary" />
            Knowledge Map
          </h1>
          <p className="text-muted-foreground mt-2">
            Visualize your learning connections and identify growth opportunities
          </p>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Knowledge Graph */}
        <div className="lg:col-span-2">
          <KnowledgeGraph 
            nodes={knowledgeNodes} 
            onNodeClick={handleNodeClick}
          />
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Overall Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Overall Progress
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <div className="text-3xl font-bold mb-2">{overallMastery}%</div>
                <p className="text-sm text-muted-foreground">Average Mastery</p>
                <Progress value={overallMastery} className="mt-2" />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Total Concepts</span>
                  <span>{knowledgeNodes.length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Mastered (≥80%)</span>
                  <span>{knowledgeNodes.filter(n => n.masteryLevel >= 80).length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>In Progress</span>
                  <span>{knowledgeNodes.filter(n => n.masteryLevel >= 40 && n.masteryLevel < 80).length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Needs Work</span>
                  <span>{knowledgeNodes.filter(n => n.masteryLevel < 40).length}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Subject Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Subject Breakdown
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {getSubjectStats().map((stat, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">{stat.subject}</span>
                    <Badge variant="outline">{stat.avgMastery}%</Badge>
                  </div>
                  <Progress value={stat.avgMastery} className="h-2" />
                  <p className="text-xs text-muted-foreground">{stat.nodes} concepts</p>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Selected Node Details */}
          {selectedNode && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  Concept Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <h3 className="font-semibold">{selectedNode.concept}</h3>
                  <Badge variant="secondary" className="mt-1">
                    {selectedNode.subject}
                  </Badge>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Mastery Level</span>
                    <span className="font-medium">{selectedNode.masteryLevel}%</span>
                  </div>
                  <Progress value={selectedNode.masteryLevel} />
                </div>
                
                <div>
                  <p className="text-sm font-medium mb-2">Connected Concepts:</p>
                  <div className="space-y-1">
                    {selectedNode.connections.map(connectionId => {
                      const connectedNode = knowledgeNodes.find(n => n.id === connectionId)
                      return connectedNode ? (
                        <Badge key={connectionId} variant="outline" className="mr-1 mb-1">
                          {connectedNode.concept}
                        </Badge>
                      ) : null
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Insights Section */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-green-600">Strongest Areas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {strongestAreas.map((node, index) => (
              <div key={node.id} className="flex justify-between items-center">
                <div>
                  <p className="font-medium">{node.concept}</p>
                  <p className="text-sm text-muted-foreground">{node.subject}</p>
                </div>
                <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                  {node.masteryLevel}%
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-orange-600">Areas for Improvement</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {improvementAreas.length > 0 ? (
              improvementAreas.map((node, index) => (
                <div key={node.id} className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">{node.concept}</p>
                    <p className="text-sm text-muted-foreground">{node.subject}</p>
                  </div>
                  <Badge className="bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300">
                    {node.masteryLevel}%
                  </Badge>
                </div>
              ))
            ) : (
              <p className="text-muted-foreground">Great job! No areas need immediate attention.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}