import { NextRequest } from 'next/server';

// This file extends the Next.js types to include our custom properties

declare module 'next/server' {
  interface NextRequest {
    /**
     * Validated request data from withValidation middleware
     */
    data: unknown;
  }
}

/**
 * Type for a NextRequest that has been validated with a specific schema
 */
export type ValidatedRequest<T = unknown> = NextRequest & {
  data: T;
};
