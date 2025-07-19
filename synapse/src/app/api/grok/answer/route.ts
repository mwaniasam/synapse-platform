import { NextRequest, NextResponse } from 'next/server';

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

// Mock response generator
function generateMockAnswer(question: string, context: string): string {
  const contextPreview = context.length > 100 
    ? `${context.substring(0, 100)}...` 
    : context;
    
  return `Based on the context: "${contextPreview}"\n\n` +
         `Answer to "${question}": This is a mock response. In a real implementation, ` +
         `I would analyze the context and provide a detailed answer. (Demo Mode)`;
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders,
  });
}

export async function POST(request: NextRequest) {
  try {
    const { question, context } = await request.json();
    
    if (!question || !context) {
      return new NextResponse(
        JSON.stringify({ 
          error: 'Question and context are required',
          mock: true
        }),
        { status: 400, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      );
    }

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const response = generateMockAnswer(question, context);
    
    return new NextResponse(
      JSON.stringify({ 
        response,
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
  } catch (error) {
    console.error('Error in answer endpoint:', error);
    
    return new NextResponse(
      JSON.stringify({ 
        response: "I'm having some trouble processing your question right now. Please try again later. (Demo Mode)",
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
