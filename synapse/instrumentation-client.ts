// This file is required for Next.js 13+ client-side instrumentation
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 1.0,
  debug: process.env.NODE_ENV !== 'production',
  // Only enable in production or when explicitly enabled in development
  enabled: process.env.NODE_ENV === 'production' || process.env.NEXT_PUBLIC_SENTRY_ENABLED === 'true',
});

// Required for router instrumentation
export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
