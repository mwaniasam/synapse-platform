import { type NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

// Mock user database - replace with actual database
const users = [
  {
    id: "1",
    email: "demo@synapse.com",
    password: "$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi", // password
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

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    // Find user
    const user = users.find((u) => u.email === email)
    if (!user) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    // Verify password
    const isValid = await bcrypt.compare(password, user.password)
    if (!isValid) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    // Create JWT token
    const token = jwt.sign({ userId: user.id, email: user.email }, process.env.JWT_SECRET || "fallback-secret", {
      expiresIn: "7d",
    })

    // Create response
    const response = NextResponse.json({
      id: user.id,
      email: user.email,
      name: user.name,
      createdAt: user.createdAt,
      preferences: user.preferences,
    })

    // Set HTTP-only cookie
    response.cookies.set("auth-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60, // 7 days
    })

    return response
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
