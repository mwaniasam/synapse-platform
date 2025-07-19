// Real implementation of Grok server using the Grok API
import { env } from '../env';

// Import the Grok API client dynamically to avoid server-side issues
let Grok: any;

// Define types for the Grok API
export interface GrokMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface ChatOptions {
  temperature?: number;
  maxTokens?: number;
}

export class GrokServerClient {
  private model: string;
  private grok: any;
  private isInitialized = false;

  constructor() {
    this.model = env.GROK_MODEL || 'grok-1';
    
    if (!env.GROK_API_KEY) {
      throw new Error('GROK_API_KEY is not set in environment variables');
    }

    // Initialize the Grok client
    this.initializeGrok();
  }

  private initializeGrok() {
    if (typeof window === 'undefined') {
      // Server-side only
      try {
        // Dynamic import to avoid server-side issues
        Grok = require('grok-api-ts').Grok;
        this.grok = new Grok(env.GROK_API_KEY);
        this.isInitialized = true;
      } catch (error) {
        console.error('Failed to initialize Grok API:', error);
        throw new Error('Failed to initialize Grok API. Please check your configuration.');
      }
    } else {
      throw new Error('Grok client should only be used server-side');
    }
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
      throw new Error(`Failed to get response from Grok API: ${error.message}`);
    }
  }

  async answerQuestion(question: string, context: string = ''): Promise<string> {
    const messages: GrokMessage[] = [];
    
    if (context) {
      messages.push({
        role: 'system',
        content: `You are a helpful assistant. Use the following context to answer the question:\n\n${context}`
      });
    }
    
    messages.push({
      role: 'user',
      content: question
    });

    return this.chat(messages);
  }

  async summarizeContent(content: string, options: { maxLength?: number } = {}): Promise<string> {
    const maxLength = options.maxLength || 200;
    
    const messages: GrokMessage[] = [
      {
        role: 'system',
        content: `You are a helpful assistant that summarizes content concisely. ` +
                 `Create a summary that is at most ${maxLength} characters long.`
      },
      {
        role: 'user',
        content: `Please summarize the following content concisely:\n\n${content}`
      }
    ];

    return this.chat(messages);
  }
  
  async generateLearningPath({ topic, level, durationWeeks }: { 
    topic: string; 
    level: string; 
    durationWeeks: number; 
  }): Promise<string> {
    const messages: GrokMessage[] = [
      {
        role: 'system',
        content: 'You are an expert educational assistant that creates structured learning paths.'
      },
      {
        role: 'user',
        content: `Create a ${durationWeeks}-week learning path for ${topic} at ${level} level. ` +
                 `Include key topics, resources, and milestones.`
      }
    ];

    return this.chat(messages);
  }
  
  async generatePersonalizedRecommendations({ 
    userPreferences, 
    learningGoals, 
    pastInteractions 
  }: { 
    userPreferences: any; 
    learningGoals: any; 
    pastInteractions: any; 
  }): Promise<string> {
    const messages: GrokMessage[] = [
      {
        role: 'system',
        content: 'You are a helpful assistant that provides personalized learning recommendations.'
      },
      {
        role: 'user',
        content: `Based on these details, please provide personalized learning recommendations:
        
        User Preferences: ${JSON.stringify(userPreferences, null, 2)}
        Learning Goals: ${JSON.stringify(learningGoals, null, 2)}
        Past Interactions: ${JSON.stringify(pastInteractions, null, 2)}`
      }
    ];

    return this.chat(messages);
  }
}

// Export a singleton instance
export const grokServer = new GrokServerClient();
