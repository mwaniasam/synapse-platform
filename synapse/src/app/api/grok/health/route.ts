import { NextResponse } from 'next/server';

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export async function GET() {
  try {
    return new NextResponse(
      JSON.stringify({ 
        status: 'ok',
        mock: true,
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development',
        version: process.env.npm_package_version || '1.0.0',
        message: 'API is running in demo mode with mock responses',
        endpoints: {
          chat: '/api/grok/chat',
          answer: '/api/grok/answer',
          health: '/api/grok/health'
        }
      }),
      { 
        status: 200, 
        headers: { 
          'Content-Type': 'application/json',
          ...corsHeaders 
        } 
      }
    );
  } catch (error) {
    console.error('Health check failed:', error);
    
    return new NextResponse(
      JSON.stringify({ 
        status: 'ok',
        mock: true,
        message: 'API is running in demo mode (error details hidden in demo)',
        timestamp: new Date().toISOString()
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
