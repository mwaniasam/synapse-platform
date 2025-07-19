import { NextResponse } from 'next/server';

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

async function mockResponse(method: string, path: string) {
  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const response = {
      status: 'success',
      message: `${method} ${path} endpoint is working (demo mode)`,
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
    console.error(`${path} error:`, error);
    return new NextResponse(
      JSON.stringify({ 
        status: 'success',
        message: `${path} endpoint is working (demo mode)`,
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

export async function GET() { 
  return mockResponse('GET', '/api/route'); 
}

export async function POST() { 
  return mockResponse('POST', '/api/route'); 
}

export async function PUT() { 
  return mockResponse('PUT', '/api/route'); 
}

export async function DELETE() { 
  return mockResponse('DELETE', '/api/route'); 
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders,
  });
}
