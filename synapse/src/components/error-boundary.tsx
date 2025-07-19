import { Component, ErrorInfo, ReactNode } from 'react';
import * as Sentry from '@sentry/nextjs';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, componentStack: string) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log the error to Sentry
    Sentry.captureException(error, { extra: { componentStack: errorInfo.componentStack } });
    
    // Call the onError handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo.componentStack);
    }
  }

  public render() {
    if (this.state.hasError) {
      // Render the fallback UI if provided, or a default error message
      return this.props.fallback || (
        <div className="p-4 bg-red-50 text-red-700 rounded-lg">
          <h2 className="text-lg font-semibold mb-2">Something went wrong</h2>
          <p className="mb-4">We're sorry, but an unexpected error occurred.</p>
          {process.env.NODE_ENV === 'development' && this.state.error && (
            <details className="mt-2 p-2 bg-red-100 rounded text-sm">
              <summary className="font-medium cursor-pointer">Error details</summary>
              <pre className="mt-2 whitespace-pre-wrap">
                {this.state.error.toString()}
              </pre>
            </details>
          )}
          <button
            onClick={() => {
              this.setState({ hasError: false, error: null });
              window.location.href = '/';
            }}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
          >
            Return to Home
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

// Higher-order component to wrap pages with the ErrorBoundary
export function withErrorBoundary<T extends object>(Component: React.ComponentType<T>, options?: Omit<Props, 'children'>) {
  return function WrappedComponent(props: T) {
    return (
      <ErrorBoundary {...options}>
        <Component {...props} />
      </ErrorBoundary>
    );
  };
}
