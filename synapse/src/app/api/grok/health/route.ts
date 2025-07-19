import { NextResponse } from 'next/server';

// Enable CORS
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders,
  });
}

export async function GET() {
  try {
    return new NextResponse(
      JSON.stringify({
        status: 'ok',
        timestamp: new Date().toISOString(),
        service: 'grok-ai-api',
        environment: process.env.NODE_ENV,
      }),
      { 
        status: 200, 
        headers: { 
          'Content-Type': 'application/json',
          ...corsHeaders,
        } 
      }
    );
  } catch (error) {
    console.error('Health check error:', error);
    return new NextResponse(
      JSON.stringify({
        status: 'error',
        error: 'Health check failed',
        details: error instanceof Error ? error.message : 'Unknown error',
      }),
      { 
        status: 500, 
        headers: { 
          'Content-Type': 'application/json',
          ...corsHeaders,
        } 
      }
    );
  }
}
