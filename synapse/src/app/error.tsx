'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import * as Sentry from '@sentry/nextjs';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorPage({ error, reset }: ErrorProps) {
  const router = useRouter();

  useEffect(() => {
    // Log the error to Sentry
    Sentry.captureException(error);
    
    console.error('An error occurred:', error);
  }, [error]);

  const handleReset = () => {
    // Attempt to recover by trying to re-render the segment
    reset();
    // If that doesn't work, redirect to home
    setTimeout(() => {
      router.push('/');
    }, 100);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Something went wrong
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            We're sorry, but an unexpected error occurred. Our team has been notified.
          </p>
        </div>

        <div className="mt-8 space-y-6">
          <div>
            <button
              onClick={handleReset}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Try again
            </button>
          </div>
          
          <div>
            <button
              onClick={() => router.push('/')}
              className="group relative w-full flex justify-center py-2 px-4 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Return to Home
            </button>
          </div>
        </div>

        {process.env.NODE_ENV === 'development' && (
          <details className="mt-8 p-4 bg-gray-50 rounded-md">
            <summary className="font-medium text-sm text-gray-700 cursor-pointer">
              Error details (only visible in development)
            </summary>
            <pre className="mt-2 text-xs text-red-600 overflow-auto max-h-60 p-2 bg-white rounded">
              {error.message}
              {error.digest && (
                <>
                  <div className="mt-2 pt-2 border-t border-gray-200">
                    <span className="font-semibold">Digest:</span> {error.digest}
                  </div>
                </>
              )}
              <div className="mt-2 pt-2 border-t border-gray-200">
                <span className="font-semibold">Stack:</span>
                <pre className="mt-1 overflow-auto">
                  {error.stack || 'No stack trace available'}
                </pre>
              </div>
            </pre>
          </details>
        )}
      </div>
    </div>
  );
}
