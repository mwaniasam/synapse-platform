import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

type CorsOptions = {
  /**
   * List of allowed origins (use '*' to allow all)
   * @default process.env.ALLOWED_ORIGINS?.split(',') || []
   */
  allowedOrigins?: string[];
  
  /**
   * List of allowed HTTP methods
   * @default ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS']
   */
  allowedMethods?: string[];
  
  /**
   * List of allowed headers
   * @default ['Content-Type', 'Authorization', 'X-Requested-With', 'X-XSRF-TOKEN']
   */
  allowedHeaders?: string[];
  
  /**
   * Whether to allow credentials
   * @default true
   */
  allowCredentials?: boolean;
  
  /**
   * Max age in seconds for preflight requests
   * @default 86400 (24 hours)
   */
  maxAge?: number;
};

export function corsMiddleware(options: CorsOptions = {}) {
  const {
    allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || [],
    allowedMethods = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders = ['Content-Type', 'Authorization', 'X-Requested-With', 'X-XSRF-TOKEN'],
    allowCredentials = true,
    maxAge = 86400, // 24 hours
  } = options;

  // This function will be called from the main middleware
  return function corsHandler(request: NextRequest) {
    // Create a response object to modify
    let response = NextResponse.next();
    
    // Handle preflight requests
    if (request.method === 'OPTIONS') {
      response = new NextResponse(null, { status: 204 });
    }
    
    // Set CORS headers on the response
    return setCorsHeaders(response, request, {
      allowedOrigins,
      allowedMethods,
      allowedHeaders,
      allowCredentials,
      maxAge: request.method === 'OPTIONS' ? maxAge : undefined,
    });
  };
}

function setCorsHeaders(
  response: NextResponse,
  request: NextRequest,
  options: Required<Omit<CorsOptions, 'maxAge'>> & { maxAge?: number }
) {
  const { allowedOrigins, allowedMethods, allowedHeaders, allowCredentials, maxAge } = options;
  const requestOrigin = request.headers.get('origin');
  
  // Determine if the origin is allowed
  const isAllowedOrigin = allowedOrigins.includes('*') || 
    (requestOrigin && allowedOrigins.includes(requestOrigin));
  
  // Set CORS headers
  if (isAllowedOrigin) {
    response.headers.set('Access-Control-Allow-Origin', requestOrigin || allowedOrigins[0] || '*');
  }
  
  if (allowCredentials) {
    response.headers.set('Access-Control-Allow-Credentials', 'true');
  }
  
  // For preflight requests
  if (request.method === 'OPTIONS') {
    response.headers.set('Access-Control-Allow-Methods', allowedMethods.join(', '));
    response.headers.set('Access-Control-Allow-Headers', allowedHeaders.join(', '));
    
    if (maxAge) {
      response.headers.set('Access-Control-Max-Age', maxAge.toString());
    }
  }
  
  // Add Vary header for caching
  const vary = response.headers.get('Vary') || '';
  if (!vary.includes('Origin')) {
    response.headers.set('Vary', vary ? `${vary}, Origin` : 'Origin');
  }
  
  return response;
}

// Helper function to apply CORS to API routes
export function withCors(handler: (req: NextRequest) => Promise<NextResponse>, options?: CorsOptions) {
  const cors = corsMiddleware(options);
  
  return async function (request: NextRequest) {
    const response = await handler(request);
    return cors(request)(response);
  };
}
