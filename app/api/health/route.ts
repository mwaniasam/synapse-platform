import { NextResponse } from "next/server"

export async function GET() {
  try {
    // You can add more checks here, e.g., database connection, external service health
    return NextResponse.json({ status: "ok", timestamp: new Date().toISOString() })
  } catch (error) {
    console.error("Health check failed:", error)
    return NextResponse.json({ status: "error", message: "Service unhealthy" }, { status: 500 })
  }
}
