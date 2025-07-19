import { NextResponse } from 'next/server';
import { env } from '@/lib/env';

export async function GET() {
  // Return only non-sensitive environment information
  return NextResponse.json({
    nodeEnv: env.NODE_ENV,
    nextAuthUrl: env.NEXTAUTH_URL,
    isGeminiConfigured: !!env.GEMINI_API_KEY && env.GEMINI_API_KEY !== 'development-gemini-key',
    isDatabaseConfigured: !!env.DATABASE_URL && !env.DATABASE_URL.includes('localhost'),
  });
}

// Disable caching for this route
export const dynamic = 'force-dynamic';
