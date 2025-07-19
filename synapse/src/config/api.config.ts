import { z } from 'zod';

// Define the schema for API configuration
const ApiConfigSchema = z.object({
  // Google Scholar API (using Serper API as example)
  GOOGLE_SCHOLAR_API_KEY: z.string().optional(),
  
  // Photomath API
  PHOTOMATH_API_KEY: z.string().optional(),
  
  // JSpell Checker API
  JSPELL_API_KEY: z.string().optional(),
  
  // Math Equations API
  MATH_EQUATIONS_API_KEY: z.string().optional(),
  
  // Words Dictionary API
  DICTIONARY_API_KEY: z.string().optional(),
  
  // Book Store API
  BOOKSTORE_API_KEY: z.string().optional(),
  
  // Photo Math Resolver API
  PHOTO_MATH_RESOLVER_API_KEY: z.string().optional(),
  
  // LearnLM 1.5 Pro API
  LEARN_LM_API_KEY: z.string().optional(),
  
  // Python Quiz Questions API
  PYTHON_QUIZ_API_KEY: z.string().optional(),
  
  // Deepseek API
  DEEPSEEK_API_KEY: z.string().optional(),
  
  // Common settings
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  API_TIMEOUT: z.string().default('10000'),
});

// Parse environment variables
const getApiConfig = () => {
  try {
    return ApiConfigSchema.parse({
      // Load from environment variables
      ...process.env,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('❌ Invalid API configuration:', error.errors);
    } else {
      console.error('❌ Failed to load API configuration:', error);
    }
    
    // Return default values in case of error
    return {
      NODE_ENV: 'development',
      API_TIMEOUT: '10000',
    };
  }
};

export const apiConfig = getApiConfig();

export const isDevelopment = apiConfig.NODE_ENV === 'development';

// API Base URLs
export const API_BASE_URLS = {
  GOOGLE_SCHOLAR: 'https://google.serper.dev',
  PHOTOMATH: 'https://photomath1.p.rapidapi.com',
  JSPELL: 'https://jspell-checker.p.rapidapi.com',
  MATH_EQUATIONS: 'https://math-equations-solver.p.rapidapi.com',
  DICTIONARY: 'https://wordsapiv1.p.rapidapi.com',
  BOOKSTORE: 'https://bookstore1.p.rapidapi.com',
  PHOTO_MATH_RESOLVER: 'https://math-solver1.p.rapidapi.com',
  LEARN_LM: 'https://learnlm1-5-pro.p.rapidapi.com',
  PYTHON_QUIZ: 'https://python-quiz1.p.rapidapi.com',
  DEEPSEEK: 'https://deepseek1.p.rapidapi.com',
} as const;

// API Headers
export const getApiHeaders = (apiKey: string, host: string) => ({
  'Content-Type': 'application/json',
  'X-RapidAPI-Key': apiKey,
  'X-RapidAPI-Host': host,
});

// API Timeout
export const API_TIMEOUT = parseInt(apiConfig.API_TIMEOUT, 10) || 10000;
