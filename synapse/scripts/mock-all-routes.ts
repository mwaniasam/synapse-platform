import fs from 'fs';
import path from 'path';

// Mock template for API routes
const mockRouteTemplate = (routePath: string) => `
import { NextResponse } from 'next/server';
import { mockAuth, mockApiCall } from '@/lib/mock-data';

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export async function GET() {
  return mockResponse('GET');
}

export async function POST() {
  return mockResponse('POST');
}

export async function PUT() {
  return mockResponse('PUT');
}

export async function DELETE() {
  return mockResponse('DELETE');
}

async function mockResponse(method: string) {
  try {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const response = {
      status: 'success',
      message: `${method} ${routePath} endpoint is working (demo mode)`,
      timestamp: new Date().toISOString(),
      mock: true
    };
    
    return new NextResponse(
      JSON.stringify(response),
      { 
        status: 200, 
        headers: { 
          'Content-Type': 'application/json',
          ...corsHeaders 
        } 
      }
    );
  } catch (error) {
    console.error('${routePath} error:', error);
    return new NextResponse(
      JSON.stringify({ 
        status: 'success',
        message: '${routePath} endpoint is working (demo mode)',
        mock: true
      }),
      { 
        status: 200, 
        headers: { 
          'Content-Type': 'application/json',
          ...corsHeaders 
        } 
      }
    );
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders,
  });
}
`;

// List of API routes to mock
const apiRoutes = [
  'ai-assist',
  'analytics',
  'auth/[...nextauth]',
  'cognitve-state',
  'debug/env',
  'env-test',
  'preferences',
  'sessions',
  'sessions/[id]'
];

// Create or update mock routes
apiRoutes.forEach(route => {
  const routePath = path.join(process.cwd(), 'src/app/api', route, 'route.ts');
  const routeDir = path.dirname(routePath);
  
  // Create directory if it doesn't exist
  if (!fs.existsSync(routeDir)) {
    fs.mkdirSync(routeDir, { recursive: true });
  }
  
  // Write mock route file
  fs.writeFileSync(routePath, mockRouteTemplate(`/api/${route}`));
  console.log(`✅ Created/Updated mock route: ${routePath}`);
});

console.log('\n🎉 All API routes have been mocked successfully!');
