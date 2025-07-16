import { type NextRequest, NextResponse } from "next/server"
import { getToken } from "next-auth/jwt"

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
  const { pathname } = req.nextUrl

  // Allow access to auth pages and API routes without authentication
  if (pathname.startsWith("/auth") || pathname.startsWith("/api/auth") || pathname.startsWith("/api/health")) {
    return NextResponse.next()
  }

  // Redirect unauthenticated users to the sign-in page
  if (!token && !pathname.startsWith("/")) {
    // Allow root page for unauthenticated users
    const url = req.nextUrl.clone()
    url.pathname = "/auth/signin"
    return NextResponse.redirect(url)
  }

  // Allow authenticated users to access all other pages
  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
}
