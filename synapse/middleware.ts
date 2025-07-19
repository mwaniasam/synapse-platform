import { NextResponse } from 'next/server';
import type { NextRequest, NextFetchEvent } from 'next/server';
import { securityMiddleware } from './src/middleware/security';
import { csrfProtection } from './src/middleware/csrf';
import { corsMiddleware } from './src/middleware/cors';

// List of public API routes that don't require CSRF protection
const publicApiRoutes = [
  '/api/auth/[...nextauth]',
  // Add other public API routes here
];

// List of API routes that should be protected with rate limiting
const rateLimitedRoutes = [
  '/api/grok',
  // Add other API routes that need rate limiting
];

// Create CORS middleware with default options
const cors = corsMiddleware({
  allowedOrigins: process.env.ALLOWED_ORIGINS?.split(',') || [],
  allowCredentials: true,
});

// Main middleware function
export async function middleware(request: NextRequest, event: NextFetchEvent) {
  const { pathname } = request.nextUrl;
  
  // Handle preflight requests first
  if (request.method === 'OPTIONS') {
    return cors(request);
  }
  
  // Apply rate limiting to protected routes
  if (rateLimitedRoutes.some(route => pathname.startsWith(route))) {
    const rateLimitedResponse = await securityMiddleware(request);
    if (rateLimitedResponse.status === 429) {
      return rateLimitedResponse;
    }
  }
  
  // Apply CSRF protection to non-public API routes
  if (pathname.startsWith('/api/') && !publicApiRoutes.some(route => pathname.startsWith(route))) {
    const csrfResponse = await csrfProtection(async (req) => {
      return NextResponse.next();
    })(request);
    
    if (csrfResponse.status === 403) {
      return csrfResponse;
    }
  }
  
  // Apply CORS to all other responses
  return cors(request);
}

// Configure which paths the middleware will run on
export const config = {
  matcher: [
    // Match all request paths except for the ones starting with:
    '/((?!_next/static|_next/image|favicon.ico|.*\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)',
    // Match all API routes
    '/api/:path*',
  ],
};
