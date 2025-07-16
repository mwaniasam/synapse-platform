import { type NextRequest, NextResponse } from "next/server"

// API bridge between Chrome extension and Next.js app
export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    switch (data.type) {
      case "COGNITIVE_STATE_UPDATE":
        // Handle cognitive state updates from extension
        console.log("Cognitive state update:", data.payload)
        return NextResponse.json({ success: true })

      case "SESSION_DATA":
        // Handle session data from extension
        console.log("Session data:", data.payload)
        return NextResponse.json({ success: true })

      case "USER_PREFERENCES":
        // Handle user preferences sync
        console.log("User preferences:", data.payload)
        return NextResponse.json({ success: true })

      default:
        return NextResponse.json({ error: "Unknown message type" }, { status: 400 })
    }
  } catch (error) {
    console.error("Extension bridge error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({
    status: "Extension bridge active",
    timestamp: Date.now(),
  })
}
