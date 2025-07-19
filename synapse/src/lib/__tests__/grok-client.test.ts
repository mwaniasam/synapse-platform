import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { GrokClient } from '../grok-client';

// Mock the env module
jest.mock('../../env', () => ({
  env: {
    GROK_API_KEY: '',
    GROK_MODEL: 'grok-1',
  },
}));

describe('GrokClient', () => {
  let grokClient: GrokClient;

  beforeEach(() => {
    grokClient = new GrokClient();
  });

  it('should be defined', () => {
    expect(grokClient).toBeDefined();
  });

  describe('chat', () => {
    it('should return a mock response when no API key is provided', async () => {
      const messages = [
        { role: 'user' as const, content: 'Hello, world!' },
      ];
      
      const response = await grokClient.chat(messages);
      expect(response).toContain('Mock response to:');
    });
  });

  describe('answerQuestion', () => {
    it('should return a response to a question with context', async () => {
      const question = 'What is the capital of France?';
      const context = 'France is a country in Europe.';
      
      const response = await grokClient.answerQuestion(question, context);
      expect(response).toBeDefined();
    });
  });

  describe('summarizeContent', () => {
    it('should return a summary of the provided content', async () => {
      const content = 'This is a long piece of text that needs to be summarized.';
      
      const response = await grokClient.summarizeContent(content, { maxLength: 50 });
      expect(response).toBeDefined();
      expect(response.length).toBeLessThanOrEqual(100); // Mock response should be reasonably short
    });
  });

  describe('generatePersonalizedRecommendations', () => {
    it('should return an array of recommendations', async () => {
      const params = {
        userPreferences: 'Machine Learning, AI, Data Science',
        learningGoals: ['Learn Python', 'Understand Neural Networks'],
      };
      
      const response = await grokClient.generatePersonalizedRecommendations(params);
      expect(Array.isArray(response)).toBe(true);
      expect(response.length).toBeGreaterThan(0);
    });
  });

  describe('generateLearningPath', () => {
    it('should return a learning path for the given topic', async () => {
      const params = {
        topic: 'Machine Learning',
        level: 'beginner' as const,
        durationWeeks: 4,
      };
      
      const response = await grokClient.generateLearningPath(params);
      expect(typeof response).toBe('string');
      expect(response.length).toBeGreaterThan(0);
    });
  });
});
