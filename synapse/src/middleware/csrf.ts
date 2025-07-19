import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { randomBytes } from 'crypto';

const CSRF_SECRET = process.env.CSRF_SECRET || randomBytes(32).toString('hex');
const TOKEN_COOKIE_NAME = 'XSRF-TOKEN';
const TOKEN_HEADER_NAME = 'x-xsrf-token';

function generateToken(): string {
  return randomBytes(32).toString('hex');
}

async function verifyToken(request: NextRequest): Promise<boolean> {
  // Skip CSRF check for safe methods
  if (['GET', 'HEAD', 'OPTIONS', 'TRACE'].includes(request.method)) {
    return true;
  }

  // Get token from header or form data
  const csrfToken = 
    request.headers.get(TOKEN_HEADER_NAME) ||
    request.nextUrl.searchParams.get('_csrf');

  const cookieToken = request.cookies.get(TOKEN_COOKIE_NAME)?.value;

  // Verify token
  return !!csrfToken && !!cookieToken && csrfToken === cookieToken;
}

function applyToken(response: NextResponse): NextResponse {
  const token = generateToken();
  
  // Set token in HTTP-only cookie
  response.cookies.set({
    name: TOKEN_COOKIE_NAME,
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
  });

  // Also set a non-HTTP-only version for JavaScript to read
  response.cookies.set({
    name: 'XSRF-TOKEN',
    value: token,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
  });

  return response;
}

export function csrfProtection(handler: (req: NextRequest) => Promise<NextResponse>) {
  return async (request: NextRequest) => {
    // Skip CSRF check for API routes that don't need it
    const publicRoutes = [
      '/api/auth/[...nextauth]',
      // Add other public API routes here
    ];

    if (publicRoutes.some(route => request.nextUrl.pathname.startsWith(route))) {
      return handler(request);
    }

    // Verify CSRF token for non-GET requests
    const isValidToken = await verifyToken(request);
    if (!isValidToken) {
      return new NextResponse('Invalid CSRF token', { status: 403 });
    }

    // Process the request
    const response = await handler(request);

    // Add CSRF token to the response if it's a GET request
    if (request.method === 'GET') {
      return applyToken(response);
    }

    return response;
  };
}
