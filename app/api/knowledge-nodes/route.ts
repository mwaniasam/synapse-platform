import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { extractConcepts, calculateConceptRelatedness } from "@/lib/utils"

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const data = await request.json()
    const { content, url, title, domain } = data

    // Extract concepts from content
    const concepts = extractConcepts(content)

    const createdNodes = []

    for (const concept of concepts) {
      // Check if concept already exists
      const existingNode = await prisma.knowledgeNode.findFirst({
        where: {
          userId: session.user.id,
          concept: concept,
        },
      })

      if (existingNode) {
        // Update frequency and last seen
        const updatedNode = await prisma.knowledgeNode.update({
          where: { id: existingNode.id },
          data: {
            frequency: existingNode.frequency + 1,
            lastSeen: new Date(),
            source: url,
          },
        })
        createdNodes.push(updatedNode)
      } else {
        // Create new knowledge node
        const newNode = await prisma.knowledgeNode.create({
          data: {
            userId: session.user.id,
            concept,
            domain,
            source: url,
            description: `Concept learned from: ${title}`,
          },
        })
        createdNodes.push(newNode)
      }
    }

    // Calculate connections between concepts
    for (let i = 0; i < createdNodes.length; i++) {
      for (let j = i + 1; j < createdNodes.length; j++) {
        const relatedness = calculateConceptRelatedness(createdNodes[i].concept, createdNodes[j].concept, content)

        if (relatedness > 0.3) {
          // Threshold for connection
          // Update connections for both nodes
          const node1Connections = JSON.parse(createdNodes[i].connections || "[]")
          const node2Connections = JSON.parse(createdNodes[j].connections || "[]")

          if (!node1Connections.includes(createdNodes[j].id)) {
            node1Connections.push(createdNodes[j].id)
            await prisma.knowledgeNode.update({
              where: { id: createdNodes[i].id },
              data: { connections: JSON.stringify(node1Connections) },
            })
          }

          if (!node2Connections.includes(createdNodes[i].id)) {
            node2Connections.push(createdNodes[i].id)
            await prisma.knowledgeNode.update({
              where: { id: createdNodes[j].id },
              data: { connections: JSON.stringify(node2Connections) },
            })
          }
        }
      }
    }

    return NextResponse.json({
      message: "Knowledge nodes created/updated successfully",
      concepts: concepts.length,
      nodes: createdNodes.length,
    })
  } catch (error) {
    console.error("Error creating knowledge nodes:", error)
    return NextResponse.json({ error: "Failed to create knowledge nodes" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const domain = searchParams.get("domain")
    const limit = Number.parseInt(searchParams.get("limit") || "100")

    const whereClause: any = {
      userId: session.user.id,
    }

    if (domain) {
      whereClause.domain = domain
    }

    const knowledgeNodes = await prisma.knowledgeNode.findMany({
      where: whereClause,
      orderBy: [{ frequency: "desc" }, { lastSeen: "desc" }],
      take: limit,
    })

    // Format for knowledge graph visualization
    const nodes = knowledgeNodes.map((node) => ({
      id: node.id,
      concept: node.concept,
      domain: node.domain,
      frequency: node.frequency,
      confidence: node.confidence,
      lastSeen: node.lastSeen,
    }))

    const edges = []
    for (const node of knowledgeNodes) {
      if (node.connections) {
        const connections = JSON.parse(node.connections)
        for (const connectionId of connections) {
          edges.push({
            source: node.id,
            target: connectionId,
            weight: 1,
          })
        }
      }
    }

    return NextResponse.json({
      nodes,
      edges,
      totalConcepts: nodes.length,
      totalConnections: edges.length,
    })
  } catch (error) {
    console.error("Error fetching knowledge nodes:", error)
    return NextResponse.json({ error: "Failed to fetch knowledge nodes" }, { status: 500 })
  }
}
