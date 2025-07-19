import { env } from '../env';
import https from 'https';
import { URL } from 'url';

// Create a custom HTTPS agent with better SSL/TLS handling
const httpsAgent = new https.Agent({
  // Security: In production, these should be set to true
  rejectUnauthorized: process.env.NODE_ENV !== 'development',
  requestCert: false,
  // Modern TLS configuration
  minVersion: 'TLSv1.2',
  // Workaround for self-signed certificates in development
  ...(process.env.NODE_ENV === 'development' ? {
    secureProtocol: 'TLS_method',
    secureOptions: require('constants').SSL_OP_LEGACY_SERVER_CONNECT,
  } : {})
});

interface GrokAIMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface GrokAIRequest {
  messages: GrokAIMessage[];
  model?: string;
  temperature?: number;
  max_tokens?: number;
  top_p?: number;
  frequency_penalty?: number;
  presence_penalty?: number;
  stop?: string[];
}

export class GrokAIClientError extends Error {
  status?: number;
  data?: any;

  constructor(message: string, status?: number, data?: any) {
    super(message);
    this.name = 'GrokAIClientError';
    this.status = status;
    this.data = data;
  }
}

export class GrokAIClient {
  private apiKey: string;
  private baseUrl: string;
  private defaultModel: string;

  constructor() {
    this.apiKey = env.GROK_API_KEY;
    this.baseUrl = 'https://api.grok.ai/v1';
    this.defaultModel = env.GROK_MODEL || 'grok-1';

    if (!this.apiKey) {
      throw new Error('GROK_API_KEY environment variable is not set');
    }
  }

  private async request<T = any>(endpoint: string, options: RequestInit = {}): Promise<T> {
    // Use fetch with the custom agent for better compatibility
    const fetch = (await import('node-fetch')).default;
    const url = new URL(endpoint, this.baseUrl);
    const method = options.method || 'GET';
    const requestId = Math.random().toString(36).substring(2, 9);
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.apiKey}`,
      ...(options.headers as Record<string, string>),
    };

    // Log the request for debugging
    if (process.env.NODE_ENV === 'development') {
      console.log(`[GrokAIClient][${requestId}] ${method} ${endpoint}`);
    }

    try {
      const fetchOptions: any = {
        method,
        headers,
        // Only use the agent in Node.js environment
        ...(typeof window === 'undefined' ? { agent: httpsAgent } : {}),
      };

      if (options.body) {
        fetchOptions.body = typeof options.body === 'string' 
          ? options.body 
          : JSON.stringify(options.body);
      }

      const response = await fetch(url.toString(), fetchOptions);
      const responseData = await response.json().catch(() => ({}));

      if (!response.ok) {
        const errorMessage = responseData.error?.message || 
                           `Request failed with status ${response.status}`;
        console.error(`[GrokAIClient][${requestId}] API Error:`, errorMessage);
        throw new GrokAIClientError(
          errorMessage,
          response.status,
          responseData
        );
      }

      return responseData as T;
    } catch (error) {
      console.error(`[GrokAIClient][${requestId}] Request error:`, error);
      
      if (error instanceof GrokAIClientError) throw error;
      
      throw new GrokAIClientError(
        `Request failed: ${error.message}`,
        500,
        { cause: error }
      );
    }
  }

  async chat(messages: GrokAIMessage[], options: {
    model?: string;
    temperature?: number;
    maxTokens?: number;
  } = {}): Promise<string> {
    const response = await this.request<{ choices: { message: { content: string } }[] }>('/chat/completions', {
      method: 'POST',
      body: JSON.stringify({
        model: options.model || this.defaultModel,
        messages,
        temperature: options.temperature ?? 0.7,
        max_tokens: options.maxTokens,
      } as GrokAIRequest),
    });

    return response.choices[0]?.message?.content || '';
  }

  async answerQuestion(question: string, context: string, options: {
    model?: string;
    temperature?: number;
  } = {}): Promise<string> {
    const messages: GrokAIMessage[] = [
      {
        role: 'system',
        content: 'You are a helpful assistant that answers questions based on the provided context. ' +
                 'If the answer cannot be found in the context, say so.',
      },
      {
        role: 'user',
        content: `Context: ${context}\n\nQuestion: ${question}`,
      },
    ];

    return this.chat(messages, {
      model: options.model,
      temperature: options.temperature,
      maxTokens: 1000,
    });
  }

  async summarizeContent(content: string, options: {
    model?: string;
    maxLength?: number;
  } = {}): Promise<string> {
    const messages: GrokAIMessage[] = [
      {
        role: 'system',
        content: 'You are a helpful assistant that summarizes content concisely. ' +
                 `Create a summary that's about ${options.maxLength || 200} characters long.`,
      },
      {
        role: 'user',
        content: `Please summarize the following content:\n\n${content}`,
      },
    ];

    return this.chat(messages, {
      model: options.model,
      temperature: 0.3, // Lower temperature for more focused summarization
      maxTokens: 500,
    });
  }

  async generateLearningPath(params: {
    topic: string;
    level: 'beginner' | 'intermediate' | 'advanced';
    durationWeeks?: number;
    model?: string;
  }): Promise<string> {
    const { topic, level, durationWeeks = 4, model } = params;
    
    const messages: GrokAIMessage[] = [
      {
        role: 'system',
        content: 'You are an expert learning path creator. Create a structured learning path for the given topic, level, and duration.'
      },
      {
        role: 'user',
        content: `Create a ${durationWeeks}-week learning path for ${topic} at ${level} level. Include weekly topics, key concepts, and recommended resources.`
      }
    ];

    return this.chat(messages, { model, temperature: 0.7 });
  }

  async generatePersonalizedRecommendations(params: {
    userPreferences: string;
    learningGoals: string[];
    pastInteractions?: string[];
    model?: string;
  }): Promise<string> {
    const { userPreferences, learningGoals, pastInteractions = [], model } = params;
    
    const messages: GrokAIMessage[] = [
      {
        role: 'system',
        content: 'You are a helpful assistant that provides personalized learning recommendations. ' +
                 'Based on the user\'s preferences, goals, and past interactions, suggest relevant learning resources.'
      },
      {
        role: 'user',
        content: `User preferences: ${userPreferences}\n\n` +
                `Learning goals: ${learningGoals.join(', ')}\n\n` +
                (pastInteractions.length > 0 
                  ? `Past interactions: ${pastInteractions.join('\n- ')}` 
                  : '')
      }
    ];

    return this.chat(messages, { 
      model,
      temperature: 0.7,
      maxTokens: 1000,
    });
  }
}

// Create a singleton instance
export const grokAIClient = new GrokAIClient();

export default grokAIClient;
