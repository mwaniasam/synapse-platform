import { env } from './env';

export interface GrokMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface ChatOptions {
  temperature?: number;
  maxTokens?: number;
}

// Custom error class for Grok client errors
export class GrokClientError extends Error {
  status?: number;
  data?: any;

  constructor(message: string, status?: number, data?: any) {
    super(message);
    this.name = 'GrokClientError';
    this.status = status;
    this.data = data;
  }
}

// Client-side Grok client that uses API routes
// This ensures server-side dependencies are not bundled in the client
export class GrokClient {
  private baseUrl: string;
  private isServer: boolean;

  constructor() {
    this.isServer = typeof window === 'undefined';
    
    // In the browser, use relative URL
    // On the server, use absolute URL if available, otherwise default to localhost
    this.baseUrl = this.isServer
      ? `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/grok`
      : '/api/grok';
  }

  private async fetchFromApi<T = any>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const method = options.method || 'GET';
    const requestId = Math.random().toString(36).substring(2, 9);
    
    // Log the request for debugging
    const logRequest = () => {
      if (process.env.NODE_ENV === 'development') {
        console.log(`[GrokClient][${requestId}] ${method} ${url}`, {
          isServer: this.isServer,
          headers: options.headers
        });
      }
    };

    // Log the response for debugging
    const logResponse = (status: number, data?: any) => {
      if (process.env.NODE_ENV === 'development') {
        console.log(`[GrokClient][${requestId}] ${method} ${url} → ${status}`, {
          data
        });
      }
    };

    logRequest();

    try {
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
        ...(this.isServer ? { 'x-internal-request': 'true' } : {}),
        ...options.headers,
      };

      const response = await fetch(url, {
        ...options,
        method,
        headers,
        credentials: 'same-origin',
        cache: 'no-store', // Prevent caching for dynamic data
      });

      const responseData = await (async () => {
        try {
          return await response.json();
        } catch (error) {
          return { message: response.statusText };
        }
      })();

      if (!response.ok) {
        logResponse(response.status, responseData);
        throw new GrokClientError(
          responseData.message || `Request failed with status ${response.status}`,
          response.status,
          responseData
        );
      }

      logResponse(response.status);
      return responseData;
    } catch (error) {
      if (error instanceof GrokClientError) throw error;
      
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error(`[GrokClient][${requestId}] Error in ${method} ${url}:`, error);
      
      throw new GrokClientError(
        `Failed to fetch from Grok API: ${errorMessage}`,
        (error as any).status || 500,
        (error as any).data
      );
    }
  }

  async chat(
    messages: GrokMessage[],
    options: { temperature?: number } = {}
  ): Promise<string> {
    const response = await this.fetchFromApi<{ response: string }>('', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        endpoint: 'chat',
        messages,
        temperature: options.temperature ?? 0.7,
      }),
    });
    return response.response;
  }

  async answerQuestion(question: string, context: string): Promise<string> {
    const response = await this.fetchFromApi<{ response: string }>('', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        endpoint: 'answer',
        question, 
        context 
      }),
    });
    return response.response;
  }

  async summarizeContent(content: string, options: { maxLength?: number } = {}): Promise<string> {
    const response = await this.fetchFromApi<{ response: string }>('', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        endpoint: 'summarize',
        content,
        maxLength: options.maxLength || 200,
      }),
    });
    return response.response;
  }

  async generatePersonalizedRecommendations(params: {
    userPreferences: string;
    learningGoals: string[];
    pastInteractions?: string[];
  }): Promise<string[]> {
    const response = await this.fetchFromApi<{ recommendations: string[] }>('/recommendations', {
      method: 'POST',
      body: JSON.stringify(params),
    });
    return response.recommendations;
  }

  async generateLearningPath(params: {
    topic: string;
    level: 'beginner' | 'intermediate' | 'advanced';
    durationWeeks?: number;
  }): Promise<string> {
    const { topic, level, durationWeeks = 4 } = params;
    
    const messages: GrokMessage[] = [
      {
        role: 'system',
        content: 'You are an expert learning path creator. Create a structured learning path for the given topic, level, and duration.'
      },
      {
        role: 'user',
        content: `Create a ${durationWeeks}-week learning path for ${topic} at ${level} level. Include weekly topics, key concepts, and recommended resources.`
      }
    ];

    return this.chat(messages);
  }

  private async mockChatResponse(messages: GrokMessage[]): Promise<string> {
    // This is a simple mock implementation for development
    if (process.env.NODE_ENV !== 'test') {
      console.log('Mock Grok response for messages:', messages);
    }
    
    // Simple mock response based on the last user message
    const lastUserMessage = messages
      .slice()
      .reverse()
      .find((m: GrokMessage) => m.role === 'user');

    if (lastUserMessage) {
      return `Mock response to: ${lastUserMessage.content}`;
    }
    
    return 'Mock response: No user message found';
  }
}

export default GrokClient;
