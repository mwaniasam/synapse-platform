"use client"

import { useState, useEffect, useRef } from "react"
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
  TextField,
  Paper,
  IconButton,
  Tooltip,
  Grid,
} from "@mui/material"
import { AccountTree, Visibility, Search, ZoomIn, ZoomOut, Refresh } from "@mui/icons-material"
import * as d3 from "d3"
import { KnowledgeExtractionEngine, type ConceptNode, type ConceptRelation } from "@/lib/knowledge-extraction"

interface GraphData {
  nodes: ConceptNode[]
  links: ConceptRelation[]
}

const domainColors = {
  "Computer Science": "#2196f3",
  "Machine Learning": "#4caf50",
  "Web Development": "#ff9800",
  "Data Science": "#9c27b0",
  Mathematics: "#f44336",
  Science: "#00bcd4",
  General: "#757575",
}

export function EnhancedKnowledgeGraph() {
  const [graphData, setGraphData] = useState<GraphData>({ nodes: [], links: [] })
  const [selectedNode, setSelectedNode] = useState<ConceptNode | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedDomain, setSelectedDomain] = useState<string>("All")
  const [zoomLevel, setZoomLevel] = useState(1)

  const svgRef = useRef<SVGSVGElement>(null)
  const extractionEngine = useRef(new KnowledgeExtractionEngine())

  useEffect(() => {
    // Simulate extracting knowledge from various sources
    const sampleTexts = [
      "Machine learning algorithms are used to build predictive models. Neural networks are a subset of machine learning that mimics the human brain. Deep learning uses multiple layers in neural networks to process complex data patterns.",
      "React is a JavaScript library for building user interfaces. It uses a component-based architecture and virtual DOM for efficient rendering. Next.js is a React framework that provides server-side rendering capabilities.",
      "Data science involves extracting insights from large datasets using statistical analysis and machine learning techniques. Python and R are popular programming languages for data science applications.",
    ]

    const allConcepts: ConceptNode[] = []
    sampleTexts.forEach((text) => {
      const concepts = extractionEngine.current.extractConcepts(text)
      allConcepts.push(...concepts)
    })

    const relations = extractionEngine.current.findRelations(allConcepts)

    setGraphData({
      nodes: allConcepts,
      links: relations,
    })
  }, [])

  useEffect(() => {
    if (graphData.nodes.length > 0) {
      renderGraph()
    }
  }, [graphData, searchTerm, selectedDomain, zoomLevel])

  const renderGraph = () => {
    if (!svgRef.current) return

    const svg = d3.select(svgRef.current)
    svg.selectAll("*").remove()

    const width = 800
    const height = 600

    // Filter data based on search and domain
    const filteredNodes = graphData.nodes.filter((node) => {
      const matchesSearch = searchTerm === "" || node.concept.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesDomain = selectedDomain === "All" || node.domain === selectedDomain
      return matchesSearch && matchesDomain
    })

    const filteredLinks = graphData.links.filter(
      (link) => filteredNodes.some((n) => n.id === link.source) && filteredNodes.some((n) => n.id === link.target),
    )

    // Create force simulation
    const simulation = d3
      .forceSimulation(filteredNodes as any)
      .force(
        "link",
        d3
          .forceLink(filteredLinks)
          .id((d: any) => d.id)
          .distance(100),
      )
      .force("charge", d3.forceManyBody().strength(-300))
      .force("center", d3.forceCenter(width / 2, height / 2))

    // Create zoom behavior
    const zoom = d3
      .zoom()
      .scaleExtent([0.1, 4])
      .on("zoom", (event: d3.D3ZoomEvent<SVGSVGElement, unknown>) => {
        g.attr("transform", event.transform.toString())
        setZoomLevel(event.transform.k)
      })

    svg.call(zoom as any)

    const g = svg.append("g")

    // Create links
    const link = g
      .append("g")
      .selectAll("line")
      .data(filteredLinks)
      .enter()
      .append("line")
      .attr("stroke", "#999")
      .attr("stroke-opacity", 0.6)
      .attr("stroke-width", (d: any) => Math.sqrt(d.strength * 5))

    // Create nodes
    const node = g
      .append("g")
      .selectAll("circle")
      .data(filteredNodes)
      .enter()
      .append("circle")
      .attr("r", (d: any) => Math.sqrt(d.weight) * 3 + 5)
      .attr("fill", (d: any) => domainColors[d.domain as keyof typeof domainColors] || domainColors.General)
      .attr("stroke", "#fff")
      .attr("stroke-width", 2)
      .style("cursor", "pointer")
      .call(d3.drag().on("start", dragstarted).on("drag", dragged).on("end", dragended) as any)

    // Add labels
    const label = g
      .append("g")
      .selectAll("text")
      .data(filteredNodes)
      .enter()
      .append("text")
      .text((d: any) => d.concept)
      .attr("font-size", "12px")
      .attr("dx", 15)
      .attr("dy", 4)
      .style("pointer-events", "none")

    // Add click handler
    node.on("click", (event: any, d: any) => {
      setSelectedNode(d)
      setDialogOpen(true)
    })

    // Update positions on simulation tick
    simulation.on("tick", () => {
      link
        .attr("x1", (d: any) => d.source.x)
        .attr("y1", (d: any) => d.source.y)
        .attr("x2", (d: any) => d.target.x)
        .attr("y2", (d: any) => d.target.y)

      node.attr("cx", (d: any) => d.x).attr("cy", (d: any) => d.y)

      label.attr("x", (d: any) => d.x).attr("y", (d: any) => d.y)
    })

    function dragstarted(event: any, d: any) {
      if (!event.active) simulation.alphaTarget(0.3).restart()
      d.fx = d.x
      d.fy = d.y
    }

    function dragged(event: any, d: any) {
      d.fx = event.x
      d.fy = event.y
    }

    function dragended(event: any, d: any) {
      if (!event.active) simulation.alphaTarget(0)
      d.fx = null
      d.fy = null
    }
  }

  const domains = ["All", ...new Set(graphData.nodes.map((n) => n.domain))]

  const getConnectedConcepts = (node: ConceptNode) => {
    return graphData.links
      .filter((link) => link.source === node.id || link.target === node.id)
      .map((link) => {
        const targetId = link.source === node.id ? link.target : link.source
        return {
          concept: graphData.nodes.find((n) => n.id === targetId),
          strength: link.strength,
          type: link.type,
        }
      })
      .filter((item) => item.concept)
  }

  return (
    <>
      <Card>
        <CardContent>
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
            <Typography variant="h6" component="div" sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <AccountTree />
              Enhanced Knowledge Graph
            </Typography>
            <Box sx={{ display: "flex", gap: 1 }}>
              <Tooltip title="Zoom In">
                <IconButton onClick={() => setZoomLevel((prev) => Math.min(prev * 1.2, 4))}>
                  <ZoomIn />
                </IconButton>
              </Tooltip>
              <Tooltip title="Zoom Out">
                <IconButton onClick={() => setZoomLevel((prev) => Math.max(prev / 1.2, 0.1))}>
                  <ZoomOut />
                </IconButton>
              </Tooltip>
              <Tooltip title="Refresh Graph">
                <IconButton onClick={() => window.location.reload()}>
                  <Refresh />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>

          <Grid container spacing={2} sx={{ mb: 2 }}>
            <Grid xs={12} md={6}>
              <TextField
                fullWidth
                size="small"
                placeholder="Search concepts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: <Search sx={{ mr: 1, color: "text.secondary" }} />,
                }}
              />
            </Grid>
            <Grid xs={12} md={6}>
              <TextField
                select
                fullWidth
                size="small"
                label="Filter by Domain"
                value={selectedDomain}
                onChange={(e) => setSelectedDomain(e.target.value)}
                SelectProps={{ native: true }}
              >
                {domains.map((domain) => (
                  <option key={domain} value={domain}>
                    {domain}
                  </option>
                ))}
              </TextField>
            </Grid>
          </Grid>

          <Paper sx={{ p: 1, mb: 2 }}>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
              {Object.entries(domainColors).map(([domain, color]) => (
                <Chip key={domain} label={domain} size="small" sx={{ backgroundColor: color, color: "white" }} />
              ))}
            </Box>
          </Paper>

          <Box sx={{ border: 1, borderColor: "divider", borderRadius: 1 }}>
            <svg ref={svgRef} width="100%" height="600" viewBox="0 0 800 600" style={{ background: "transparent" }} />
          </Box>

          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Click on nodes to explore connections • Drag to reposition • Zoom: {zoomLevel.toFixed(1)}x
          </Typography>
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Visibility />
          {selectedNode?.concept}
        </DialogTitle>
        <DialogContent>
          {selectedNode && (
            <Grid container spacing={2}>
              <Grid xs={12} md={6}>
                <Typography variant="body1" gutterBottom>
                  <strong>Domain:</strong> {selectedNode.domain}
                </Typography>
                <Typography variant="body1" gutterBottom>
                  <strong>Weight:</strong> {selectedNode.weight.toFixed(2)}
                </Typography>
                <Typography variant="body1" gutterBottom>
                  <strong>Context:</strong>
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ fontStyle: "italic" }}>
                  {selectedNode.context}
                </Typography>
              </Grid>

              <Grid xs={12} md={6}>
                <Typography variant="h6" sx={{ mb: 1 }}>
                  Connected Concepts:
                </Typography>
                <List dense>
                  {getConnectedConcepts(selectedNode).map((connection, index) => (
                    <ListItem key={index}>
                      <ListItemText
                        primary={connection.concept?.concept}
                        secondary={`Strength: ${connection.strength.toFixed(2)} • Type: ${connection.type}`}
                      />
                    </ListItem>
                  ))}
                </List>
              </Grid>
            </Grid>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
