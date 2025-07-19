import { NextRequest, NextResponse } from 'next/server';

// Configure rate limiting
const RATE_LIMIT_WINDOW_MS = parseInt(process.env.RATE_LIMIT_WINDOW_MS || '60000', 10);
const RATE_LIMIT_MAX_REQUESTS = parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100', 10);
const RATE_LIMIT_MAX_IPS = 1000; // Maximum number of IPs to track

// Simple in-memory store for rate limiting
const requestCounts = new Map<string, { count: number; timer: NodeJS.Timeout }>();

// Clean up old entries to prevent memory leaks
setInterval(() => {
  const now = Date.now();
  requestCounts.forEach((value, key) => {
    if (value.count === 0) {
      requestCounts.delete(key);
    }
  });
}, RATE_LIMIT_WINDOW_MS);

export async function rateLimitMiddleware(request: NextRequest) {
  const ip = request.ip || request.headers.get('x-forwarded-for') || 'unknown';
  
  // Initialize or update the request count for this IP
  if (!requestCounts.has(ip)) {
    // If we've reached the maximum number of IPs, clean up the oldest entry
    if (requestCounts.size >= RATE_LIMIT_MAX_IPS) {
      const oldestIp = requestCounts.keys().next().value;
      if (oldestIp) {
        clearTimeout(requestCounts.get(oldestIp)?.timer);
        requestCounts.delete(oldestIp);
      }
    }
    
    // Set up a timer to clear this IP after the window expires
    const timer = setTimeout(() => {
      requestCounts.delete(ip);
    }, RATE_LIMIT_WINDOW_MS);
    
    requestCounts.set(ip, { count: 1, timer });
  } else {
    const entry = requestCounts.get(ip);
    if (entry) {
      entry.count += 1;
      
      // Check if rate limit is exceeded
      if (entry.count > RATE_LIMIT_MAX_REQUESTS) {
        return NextResponse.json(
          { 
            error: 'Too many requests, please try again later.',
            retryAfter: RATE_LIMIT_WINDOW_MS / 1000
          },
          { 
            status: 429,
            headers: {
              'Retry-After': (RATE_LIMIT_WINDOW_MS / 1000).toString(),
              'X-RateLimit-Limit': RATE_LIMIT_MAX_REQUESTS.toString(),
              'X-RateLimit-Remaining': '0',
              'X-RateLimit-Reset': (Date.now() + RATE_LIMIT_WINDOW_MS).toString()
            }
          }
        );
      }
    }
  }
  
  // Return null to indicate the request should continue
  // The headers will be set in the withRateLimit wrapper
  return null;
}

// Helper function to apply rate limiting to API routes
export async function withRateLimit(
  request: NextRequest,
  handler: (request: NextRequest) => Promise<NextResponse>
): Promise<NextResponse> {
  const response = await rateLimitMiddleware(request);
  if (response) return response;
  
  // Call the handler and get its response
  const handlerResponse = await handler(request);
  
  // Add rate limit headers to the response
  const ip = request.ip || request.headers.get('x-forwarded-for') || 'unknown';
  const entry = requestCounts.get(ip);
  const remaining = entry ? Math.max(0, RATE_LIMIT_MAX_REQUESTS - entry.count) : RATE_LIMIT_MAX_REQUESTS;
  
  // Clone the response to add headers
  const newResponse = new NextResponse(handlerResponse.body, {
    status: handlerResponse.status,
    statusText: handlerResponse.statusText,
    headers: handlerResponse.headers
  });
  
  // Add rate limit headers
  newResponse.headers.set('X-RateLimit-Limit', RATE_LIMIT_MAX_REQUESTS.toString());
  newResponse.headers.set('X-RateLimit-Remaining', remaining.toString());
  newResponse.headers.set('X-RateLimit-Reset', (Date.now() + RATE_LIMIT_WINDOW_MS).toString());
  
  return newResponse;
}
