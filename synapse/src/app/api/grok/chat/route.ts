import { NextRequest, NextResponse } from 'next/server';

// Simple mock responses
const mockResponses = {
  greeting: "Hello! I'm your AI assistant. How can I help you today? (Demo Mode)",
  question: "That's an interesting question! In a real implementation, I would provide a detailed response based on your query. (Demo Mode)",
  summary: "This is a mock summary of your content. In a real implementation, I would analyze and summarize the provided text. (Demo Mode)",
  default: "I'm here to help! What would you like to know? (Demo Mode)"
};

// CORS headers
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
    const { messages } = await request.json();
    
    if (!messages || !Array.isArray(messages)) {
      return new NextResponse(
        JSON.stringify({ 
          error: 'Messages array is required',
          mock: true
        }),
        { status: 400, headers: corsHeaders }
      );
    }

    // Get the last user message
    const lastMessage = messages[messages.length - 1]?.content?.toLowerCase() || '';
    
    // Generate a mock response based on the message content
    let response = mockResponses.default;
    if (lastMessage.includes('hello') || lastMessage.includes('hi')) {
      response = mockResponses.greeting;
    } else if (lastMessage.includes('?')) {
      response = mockResponses.question;
    } else if (lastMessage.includes('summarize')) {
      response = mockResponses.summary;
    }
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    return new NextResponse(
      JSON.stringify({ 
        response,
        mock: true
      }),
      { 
        status: 200, 
        headers: corsHeaders 
      }
    );
  } catch (error) {
    console.error('Error in chat endpoint:', error);
    
    return new NextResponse(
      JSON.stringify({ 
        response: "I'm having some trouble right now. Please try again later. (Demo Mode)",
        mock: true
      }),
      { 
        status: 200, 
        headers: corsHeaders 
      }
    );
  }
}
