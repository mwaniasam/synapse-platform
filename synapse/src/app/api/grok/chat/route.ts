import { NextRequest, NextResponse } from 'next/server';
import { GrokAIClient } from '@/lib/server/grok-ai-client';
import { mockGrokClient } from '@/lib/server/mock-grok-client';

// Initialize clients
const grokAIClient = new GrokAIClient();

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

// Use mock client if explicitly set or in development
const useMock = process.env.USE_MOCK === 'true' || process.env.NODE_ENV !== 'production';
const client = useMock ? mockGrokClient : grokAIClient;

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders,
  });
}

export async function POST(request: NextRequest) {
  try {
    const { messages, temperature } = await request.json();
    
    if (!messages || !Array.isArray(messages)) {
      return new NextResponse(
        JSON.stringify({ 
          error: 'Messages array is required',
          mock: useMock
        }),
        { status: 400, headers: corsHeaders }
      );
    }

    const response = await client.chat(messages, { temperature });
    
    return new NextResponse(
      JSON.stringify({ 
        response,
        mock: useMock
      }),
      { 
        status: 200, 
        headers: corsHeaders 
      }
    );
  } catch (error) {
    console.error('Error in chat endpoint:', error);
    
    const status = (error as any)?.status || 500;
    const message = (error as Error)?.message || 'Internal Server Error';
    
    return new NextResponse(
      JSON.stringify({ 
        error: message,
        mock: useMock
      }),
      { 
        status, 
        headers: corsHeaders 
      }
    );
  }
}
