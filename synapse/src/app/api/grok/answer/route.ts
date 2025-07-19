import { NextRequest, NextResponse } from 'next/server';
import { grokAIClient } from '@/lib/server/grok-ai-client';

// Enable CORS
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders,
  });
}

export async function POST(request: NextRequest) {
  try {
    const { question, context = '', model, temperature } = await request.json();
    
    if (!question) {
      return new NextResponse(
        JSON.stringify({ error: 'Question is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      );
    }

    const response = await grokAIClient.answerQuestion(question, context, { 
      model,
      temperature,
    });
    
    return new NextResponse(
      JSON.stringify({ response }),
      { status: 200, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
    );
  } catch (error: any) {
    console.error('Error in answer endpoint:', error);
    const status = error.status || 500;
    const message = error.message || 'Failed to process answer';
    
    return new NextResponse(
      JSON.stringify({ 
        error: message,
        details: error.data || (error instanceof Error ? error.message : 'Unknown error')
      }),
      { 
        status,
        headers: { 'Content-Type': 'application/json', ...corsHeaders } 
      }
    );
  }
}
