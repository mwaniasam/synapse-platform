// This file is required for Next.js 13+ instrumentation
import { register } from './sentry.server.config';

export async function register() {
  // Initialize Sentry
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    const { init } = await import('@sentry/nextjs');
    init({
      dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
      environment: process.env.NODE_ENV,
      tracesSampleRate: 1.0,
      debug: process.env.NODE_ENV !== 'production',
    });
  }
}
