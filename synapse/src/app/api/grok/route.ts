import { NextResponse } from 'next/server';
import { grokServer } from '@/lib/server/grok-server';
import { GrokClientError } from '@/lib/grok-client';

// Simple health check endpoint
export async function GET() {
  return NextResponse.json({ status: 'ok', message: 'Grok API is running' });
}

// Ensure this route is always dynamic
export const dynamic = 'force-dynamic';

type GrokApiHandler<T = any> = (body: any) => Promise<T>;

// Extend the Error type to include status
interface ErrorWithStatus extends Error {
  status?: number;
  data?: any;
}

// Helper to validate required fields in request body
const validateRequestBody = <T extends Record<string, any>>(
  body: any,
  requiredFields: (keyof T)[]
): T => {
  const missingFields = requiredFields.filter(field => {
    const value = body[field];
    return value === undefined || value === null || value === '';
  });
  
  if (missingFields.length > 0) {
    throw new GrokClientError(
      `Missing required fields: ${missingFields.join(', ')}`,
      400
    );
  }
  
  return body as T;
};

// Helper function to handle API responses
const handleApiResponse = async <T = any>(
  handler: GrokApiHandler<T>,
  request: Request
) => {
  try {
    // Parse request body
    let body: any = {};
    try {
      if (request.method !== 'GET' && request.body) {
        body = await request.json();
      }
    } catch (error) {
      throw new GrokClientError('Invalid JSON payload', 400);
    }

    // Add request metadata
    const metadata = {
      method: request.method,
      url: request.url,
      headers: Object.fromEntries(request.headers.entries()),
      timestamp: new Date().toISOString(),
    };

    // Log the request for debugging
    if (process.env.NODE_ENV === 'development') {
      console.log('[GrokAPI] Request:', {
        ...metadata,
        body,
      });
    }

    // Execute the handler
    const result = await handler(body);
    return NextResponse.json(result);
  } catch (error) {
    // Log the error
    console.error('[GrokAPI] Error:', error);

    // Handle GrokClientError specifically
    if (error instanceof GrokClientError) {
      return NextResponse.json(
        {
          error: 'Grok API Error',
          message: error.message,
          ...(process.env.NODE_ENV === 'development' && {
            stack: error.stack,
            ...(error.data && { details: error.data }),
          }),
        },
        { status: error.status || 500 }
      );
    }

    // Handle other errors
    const status = error instanceof Error && 'status' in error ? (error as any).status : 500;
    const message = error instanceof Error ? error.message : 'An unknown error occurred';

    return NextResponse.json(
      {
        error: 'Internal Server Error',
        message,
        ...(process.env.NODE_ENV === 'development' && {
          stack: error instanceof Error ? error.stack : undefined,
        }),
      },
      { status }
    );
  }
};

// Handler for chat endpoint
const handleChat = async (body: any) => {
  const { messages, temperature } = validateRequestBody<{ messages: any[], temperature?: number }>(body, ['messages']);
  return await grokServer.chat(messages, { temperature });
};

// Handler for answer endpoint
const handleAnswer = async (body: any) => {
  const { question, context } = validateRequestBody<{ 
    question: string, 
    context: string 
  }>(body, ['question', 'context']);
  return await grokServer.answerQuestion(question, context);
};

// Handler for summarize endpoint
const handleSummarize = async (body: any) => {
  const { content } = validateRequestBody<{ content: string }>(body, ['content']);
  return await grokServer.summarizeContent(content);
};

// Handler for recommendations endpoint
const handleRecommendations = async (body: any) => {
  const { userPreferences, learningGoals, pastInteractions } = validateRequestBody<{
    userPreferences: any;
    learningGoals: any;
    pastInteractions: any;
  }>(body, ['userPreferences', 'learningGoals', 'pastInteractions']);
  
  return await grokServer.generatePersonalizedRecommendations({
    userPreferences,
    learningGoals,
    pastInteractions,
  });
};

// Handler for learning path endpoint
const handleLearningPath = async (body: any) => {
  const { topic, level, durationWeeks } = validateRequestBody<{
    topic: string;
    level: string;
    durationWeeks: number;
  }>(body, ['topic', 'level', 'durationWeeks']);
  
  return await grokServer.generateLearningPath({
    topic,
    level,
    durationWeeks,
  });
};

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { endpoint, ...rest } = body;

    // Route to the appropriate handler based on the endpoint in the request body
    switch (endpoint) {
      case 'chat':
        return handleApiResponse(handleChat, { ...request, json: async () => rest } as Request);
      case 'answer':
        return handleApiResponse(handleAnswer, { ...request, json: async () => rest } as Request);
      case 'summarize':
        return handleApiResponse(handleSummarize, { ...request, json: async () => rest } as Request);
      case 'recommendations':
        return handleApiResponse(handleRecommendations, { ...request, json: async () => rest } as Request);
      case 'learning-path':
        return handleApiResponse(handleLearningPath, { ...request, json: async () => rest } as Request);
      default:
        throw new GrokClientError(`Endpoint '${endpoint}' not found`, 404);
    }
  } catch (error) {
    // This catch block is a fallback - most errors are already handled by handleApiResponse
    console.error('Unhandled error in Grok API route:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error',
        ...(process.env.NODE_ENV === 'development' && {
          message: error instanceof Error ? error.message : 'Unknown error',
          stack: error instanceof Error ? error.stack : undefined
        })
      },
      { status: 500 }
    );
  }
}

// Add OPTIONS handler for CORS preflight requests
export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}
