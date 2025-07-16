import { prisma } from "./prisma"

export interface KnowledgeGraphNode {
  id: string
  concept: string
  domain: string
  importance: number
  mastery: number
  connections: string[]
  position?: { x: number; y: number }
}

export interface KnowledgeGraphLink {
  source: string
  target: string
  strength: number
  type: string
}

export class KnowledgeGraph {
  async getUserGraph(userId: string) {
    const nodes = await prisma.knowledgeNode.findMany({
      where: { userId },
      orderBy: { importance: "desc" },
    })

    const graphNodes: KnowledgeGraphNode[] = nodes.map((node) => ({
      id: node.id,
      concept: node.concept,
      domain: node.domain,
      importance: node.importance,
      mastery: node.mastery,
      connections: Array.isArray(node.connections) ? (node.connections as string[]) : [],
    }))

    const links = this.generateLinks(graphNodes)

    return {
      nodes: this.calculatePositions(graphNodes),
      links,
    }
  }

  private generateLinks(nodes: KnowledgeGraphNode[]): KnowledgeGraphLink[] {
    const links: KnowledgeGraphLink[] = []

    nodes.forEach((node) => {
      node.connections.forEach((connectionId) => {
        const targetNode = nodes.find((n) => n.id === connectionId)
        if (targetNode) {
          links.push({
            source: node.id,
            target: connectionId,
            strength: this.calculateConnectionStrength(node, targetNode),
            type: this.determineConnectionType(node, targetNode),
          })
        }
      })
    })

    return links
  }

  private calculateConnectionStrength(node1: KnowledgeGraphNode, node2: KnowledgeGraphNode): number {
    // Calculate connection strength based on domain similarity and mastery levels
    const domainSimilarity = node1.domain === node2.domain ? 1 : 0.5
    const masteryFactor = (node1.mastery + node2.mastery) / 2
    const importanceFactor = (node1.importance + node2.importance) / 2

    return domainSimilarity * 0.4 + masteryFactor * 0.3 + importanceFactor * 0.3
  }

  private determineConnectionType(node1: KnowledgeGraphNode, node2: KnowledgeGraphNode): string {
    if (node1.domain === node2.domain) {
      return "domain"
    }
    if (node1.mastery > 0.7 && node2.mastery > 0.7) {
      return "mastery"
    }
    return "conceptual"
  }

  private calculatePositions(nodes: KnowledgeGraphNode[]): KnowledgeGraphNode[] {
    // Simple force-directed layout algorithm
    const width = 800
    const height = 600
    const centerX = width / 2
    const centerY = height / 2

    return nodes.map((node, index) => {
      const angle = (index / nodes.length) * 2 * Math.PI
      const radius = Math.min(width, height) * 0.3 * (1 + node.importance)

      return {
        ...node,
        position: {
          x: centerX + Math.cos(angle) * radius,
          y: centerY + Math.sin(angle) * radius,
        },
      }
    })
  }

  async addConnection(userId: string, sourceId: string, targetId: string) {
    const sourceNode = await prisma.knowledgeNode.findFirst({
      where: { id: sourceId, userId },
    })

    if (sourceNode) {
      const connections = Array.isArray(sourceNode.connections) ? (sourceNode.connections as string[]) : []

      if (!connections.includes(targetId)) {
        connections.push(targetId)

        await prisma.knowledgeNode.update({
          where: { id: sourceId },
          data: { connections },
        })
      }
    }
  }

  async findRelatedConcepts(userId: string, concept: string, limit = 5) {
    const nodes = await prisma.knowledgeNode.findMany({
      where: {
        userId,
        OR: [
          { concept: { contains: concept, mode: "insensitive" } },
          { description: { contains: concept, mode: "insensitive" } },
        ],
      },
      orderBy: { importance: "desc" },
      take: limit,
    })

    return nodes
  }

  async updateMastery(userId: string, nodeId: string, masteryDelta: number) {
    const node = await prisma.knowledgeNode.findFirst({
      where: { id: nodeId, userId },
    })

    if (node) {
      const newMastery = Math.max(0, Math.min(1, node.mastery + masteryDelta))

      await prisma.knowledgeNode.update({
        where: { id: nodeId },
        data: {
          mastery: newMastery,
          lastAccessed: new Date(),
        },
      })
    }
  }
}
