import { type NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"

// Mock user database - replace with actual database
const users = [
  {
    id: "1",
    email: "demo@synapse.com",
    name: "Demo User",
    createdAt: new Date(),
    preferences: {
      theme: "system",
      adaptationIntensity: 0.7,
      cognitiveDetectionEnabled: true,
      knowledgeMappingEnabled: true,
      aiGuidanceEnabled: true,
    },
  },
]

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("auth-token")?.value

    if (!token) {
      return NextResponse.json({ error: "No token provided" }, { status: 401 })
    }

    // Verify JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "fallback-secret") as any

    // Find user
    const user = users.find((u) => u.id === decoded.userId)
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json({
      id: user.id,
      email: user.email,
      name: user.name,
      createdAt: user.createdAt,
      preferences: user.preferences,
    })
  } catch (error) {
    console.error("Auth check error:", error)
    return NextResponse.json({ error: "Invalid token" }, { status: 401 })
  }
}
