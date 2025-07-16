import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { KnowledgeGraph } from "@/lib/knowledge-graph"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const knowledgeGraph = new KnowledgeGraph()
    const graph = await knowledgeGraph.getUserGraph(session.user.id)

    return NextResponse.json(graph)
  } catch (error) {
    console.error("Knowledge graph fetch error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { sourceId, targetId } = body

    const knowledgeGraph = new KnowledgeGraph()
    await knowledgeGraph.addConnection(session.user.id, sourceId, targetId)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Knowledge graph connection error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
