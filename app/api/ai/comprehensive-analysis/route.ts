import { type NextRequest, NextResponse } from "next/server"
import { generateComprehensiveAnalysis } from "@/lib/content-adaptation" // Reusing the AI function

export async function POST(req: NextRequest) {
  try {
    const { learningData } = await req.json()

    if (!learningData) {
      return NextResponse.json({ error: "Missing learning data" }, { status: 400 })
    }

    const analysis = await generateComprehensiveAnalysis(learningData)

    return NextResponse.json({ analysis })
  } catch (error) {
    console.error("Error in comprehensive analysis API:", error)
    return NextResponse.json({ error: "Failed to generate comprehensive analysis" }, { status: 500 })
  }
}
