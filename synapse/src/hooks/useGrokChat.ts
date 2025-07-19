import { useState, useCallback } from 'react';

interface GrokMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export function useGrokChat() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const sendMessage = useCallback(async (messages: GrokMessage[], options = {}) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/grok', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages,
          options,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch response from Grok API');
      }

      const data = await response.json();
      return data.response;
    } catch (err) {
      console.error('Error in useGrokChat:', err);
      setError(err instanceof Error ? err : new Error('An unknown error occurred'));
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { sendMessage, isLoading, error };
}
