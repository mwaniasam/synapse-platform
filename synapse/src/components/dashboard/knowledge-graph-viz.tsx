"use client"

import { useState } from "react"
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  List,
  ListItem,
  ListItemText,
} from "@mui/material"
import { AccountTree, Visibility } from "@mui/icons-material"

interface KnowledgeNode {
  id: string
  concept: string
  domain: string
  encounterCount: number
  connections: string[]
}

const mockNodes: KnowledgeNode[] = [
  {
    id: "1",
    concept: "Machine Learning",
    domain: "Computer Science",
    encounterCount: 15,
    connections: ["2", "3", "4"],
  },
  {
    id: "2",
    concept: "Neural Networks",
    domain: "Computer Science",
    encounterCount: 8,
    connections: ["1", "3"],
  },
  {
    id: "3",
    concept: "Deep Learning",
    domain: "Computer Science",
    encounterCount: 12,
    connections: ["1", "2", "4"],
  },
  {
    id: "4",
    concept: "Artificial Intelligence",
    domain: "Computer Science",
    encounterCount: 20,
    connections: ["1", "3"],
  },
]

export function KnowledgeGraphVisualization() {
  const [nodes, setNodes] = useState<KnowledgeNode[]>(mockNodes)
  const [selectedNode, setSelectedNode] = useState<KnowledgeNode | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)

  const handleNodeClick = (node: KnowledgeNode) => {
    setSelectedNode(node)
    setDialogOpen(true)
  }

  const getConnectedConcepts = (node: KnowledgeNode) => {
    return node.connections.map((id) => nodes.find((n) => n.id === id)).filter(Boolean) as KnowledgeNode[]
  }

  return (
    <>
      <Card>
        <CardContent>
          <Typography variant="h6" component="div" sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
            <AccountTree />
            Knowledge Graph
          </Typography>

          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 2 }}>
            {nodes.map((node) => (
              <Chip
                key={node.id}
                label={`${node.concept} (${node.encounterCount})`}
                onClick={() => handleNodeClick(node)}
                sx={{
                  cursor: "pointer",
                  "&:hover": {
                    backgroundColor: "primary.light",
                    color: "white",
                  },
                }}
              />
            ))}
          </Box>

          <Typography variant="body2" color="text.secondary">
            Click on a concept to explore its connections
          </Typography>
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Visibility />
          {selectedNode?.concept}
        </DialogTitle>
        <DialogContent>
          {selectedNode && (
            <Box>
              <Typography variant="body1" gutterBottom>
                <strong>Domain:</strong> {selectedNode.domain}
              </Typography>
              <Typography variant="body1" gutterBottom>
                <strong>Encounters:</strong> {selectedNode.encounterCount}
              </Typography>

              <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>
                Connected Concepts:
              </Typography>
              <List dense>
                {getConnectedConcepts(selectedNode).map((connectedNode) => (
                  <ListItem key={connectedNode.id}>
                    <ListItemText
                      primary={connectedNode.concept}
                      secondary={`${connectedNode.encounterCount} encounters`}
                    />
                  </ListItem>
                ))}
              </List>
            </Box>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
