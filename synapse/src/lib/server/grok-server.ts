// This is a server-side only version of the Grok client
// It should only be used in server components or API routes

import { env } from '../env';

interface GrokMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface ChatOptions {
  temperature?: number;
  maxTokens?: number;
}

type GrokApiType = {
  chat: {
    completions: {
      create: (params: {
        model: string;
        messages: GrokMessage[];
        temperature?: number;
        max_tokens?: number;
      }) => Promise<{
        choices: Array<{
          message: {
            content: string;
          };
        }>;
      }>;
    };
  };
};

export class GrokServerClient {
  generateLearningPath(arg0: { topic: any; level: any; durationWeeks: any; }) {
    throw new Error('Method not implemented.');
  }
  generatePersonalizedRecommendations(arg0: { userPreferences: any; learningGoals: any; pastInteractions: any; }) {
    throw new Error('Method not implemented.');
  }
  private grok: GrokApiType;
  private model: string;
  private isInitialized = false;

  constructor() {
    this.model = env.GROK_MODEL || 'grok-1';
    
    if (!env.GROK_API_KEY) {
      throw new Error('GROK_API_KEY is not set');
    }

    // Import the Grok API only on the server side
    const Grok = require('grok-api-ts').Grok;
    this.grok = new Grok(env.GROK_API_KEY) as unknown as GrokApiType;
    this.isInitialized = true;
  }

  async chat(messages: GrokMessage[], options: { temperature?: number } = {}): Promise<string> {
    if (!this.isInitialized) {
      throw new Error('Grok client is not initialized');
    }

    try {
      const response = await this.grok.chat.completions.create({
        model: this.model,
        messages,
        temperature: options.temperature ?? 0.7,
      });

      return response.choices[0]?.message?.content || '';
    } catch (error) {
      console.error('Error in Grok chat:', error);
      throw error;
    }
  }

  async answerQuestion(question: string, context: string): Promise<string> {
    const messages: GrokMessage[] = [
      {
        role: 'system',
        content: 'You are a helpful assistant that answers questions based on the provided context.\n\nContext:\n' + context
      },
      {
        role: 'user',
        content: question
      }
    ];

    return this.chat(messages);
  }

  async summarizeContent(content: string, options: { maxLength?: number } = {}): Promise<string> {
    const maxLength = options.maxLength || 200;
    
    const messages: GrokMessage[] = [
      {
        role: 'system',
        content: `You are a helpful assistant that summarizes content concisely. Create a summary that is at most ${maxLength} characters long.`
      },
      {
        role: 'user',
        content: `Please summarize the following content:\n\n${content}`
      }
    ];

    return this.chat(messages);
  }
}

// Export a singleton instance
export const grokServer = new GrokServerClient();
