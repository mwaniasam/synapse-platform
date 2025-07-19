import { z } from 'zod';

// Base API client with common functionality
export class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = '') {
    this.baseUrl = baseUrl;
  }

  protected async request<T>(
    endpoint: string,
    options: RequestInit = {},
    schema: z.ZodType<T>
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || `API request failed with status ${response.status}`
        );
      }

      const data = await response.json();
      return schema.parse(data);
    } catch (error) {
      console.error(`API request failed: ${endpoint}`, error);
      throw error;
    }
  }
}

// Helper function to handle API errors in components
export const handleApiError = (error: unknown, defaultMessage: string = 'An error occurred'): string => {
  if (error instanceof Error) {
    return error.message || defaultMessage;
  }
  return defaultMessage;
};
