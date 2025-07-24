"use client"

import { useEffect, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Brain } from "lucide-react"

interface KnowledgeNode {
  id: string
  concept: string
  subject: string
  masteryLevel: number
  connections: string[]
  x?: number
  y?: number
}

interface KnowledgeGraphProps {
  nodes: KnowledgeNode[]
  onNodeClick?: (node: KnowledgeNode) => void
}

export function KnowledgeGraph({ nodes, onNodeClick }: KnowledgeGraphProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const container = containerRef.current
    if (!canvas || !container) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Set canvas size
    const rect = container.getBoundingClientRect()
    canvas.width = rect.width
    canvas.height = rect.height

    // Position nodes in a circular layout
    const centerX = canvas.width / 2
    const centerY = canvas.height / 2
    const radius = Math.min(centerX, centerY) * 0.8

    const positionedNodes = nodes.map((node, index) => {
      const angle = (2 * Math.PI * index) / nodes.length
      return {
        ...node,
        x: centerX + radius * Math.cos(angle),
        y: centerY + radius * Math.sin(angle)
      }
    })

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Draw connections
    ctx.strokeStyle = '#e5e7eb'
    ctx.lineWidth = 1
    positionedNodes.forEach(node => {
      node.connections.forEach(connectionId => {
        const connectedNode = positionedNodes.find(n => n.id === connectionId)
        if (connectedNode && node.x && node.y && connectedNode.x && connectedNode.y) {
          ctx.beginPath()
          ctx.moveTo(node.x, node.y)
          ctx.lineTo(connectedNode.x, connectedNode.y)
          ctx.stroke()
        }
      })
    })

    // Draw nodes
    positionedNodes.forEach(node => {
      if (!node.x || !node.y) return

      // Node circle
      const nodeRadius = 20 + (node.masteryLevel / 100) * 15
      ctx.beginPath()
      ctx.arc(node.x, node.y, nodeRadius, 0, 2 * Math.PI)
      
      // Color based on mastery level
      const hue = node.masteryLevel * 1.2 // 0-120 (red to green)
      ctx.fillStyle = `hsl(${hue}, 70%, 60%)`
      ctx.fill()
      
      ctx.strokeStyle = '#ffffff'
      ctx.lineWidth = 3
      ctx.stroke()

      // Node label
      ctx.fillStyle = '#1f2937'
      ctx.font = '12px sans-serif'
      ctx.textAlign = 'center'
      ctx.fillText(node.concept, node.x, node.y + nodeRadius + 15)
    })

    // Handle click events
    const handleClick = (event: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      const x = event.clientX - rect.left
      const y = event.clientY - rect.top

      const clickedNode = positionedNodes.find(node => {
        if (!node.x || !node.y) return false
        const distance = Math.sqrt((x - node.x) ** 2 + (y - node.y) ** 2)
        const nodeRadius = 20 + (node.masteryLevel / 100) * 15
        return distance <= nodeRadius
      })

      if (clickedNode && onNodeClick) {
        onNodeClick(clickedNode)
      }
    }

    canvas.addEventListener('click', handleClick)

    return () => {
      canvas.removeEventListener('click', handleClick)
    }
  }, [nodes, onNodeClick])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Knowledge Map</CardTitle>
        <p className="text-sm text-muted-foreground">
          Interactive visualization of your learning progress. Node size and color represent mastery level.
        </p>
      </CardHeader>
      <CardContent>
        {nodes.length > 0 ? (
          <div ref={containerRef} className="relative w-full h-96 border rounded-lg bg-background">
            <canvas
              ref={canvasRef}
              className="absolute inset-0 cursor-pointer"
              style={{ width: '100%', height: '100%' }}
            />
          </div>
        ) : (
          <div className="w-full h-96 border rounded-lg bg-background flex items-center justify-center">
            <div className="text-center text-muted-foreground">
              <Brain className="h-16 w-16 mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-semibold mb-2">No Knowledge Map Yet</h3>
              <p className="text-sm">Start learning to build your knowledge connections</p>
            </div>
          </div>
        )}
        
        <div className="mt-4 space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span>Mastery Level Legend:</span>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-red-400"></div>
              <span>Beginner (0-30%)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-yellow-400"></div>
              <span>Intermediate (31-70%)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-green-400"></div>
              <span>Advanced (71-100%)</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}