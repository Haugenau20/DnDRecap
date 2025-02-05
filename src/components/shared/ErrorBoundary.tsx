// components/shared/ErrorBoundary.tsx
import React from 'react';
import Typography from '../core/Typography';
import Button from '../core/Button';
import { AlertCircle } from 'lucide-react';

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4">
          <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
          <Typography variant="h2" className="mb-4">
            Something went wrong
          </Typography>
          <Typography color="secondary" className="mb-6 text-center">
            We're sorry, but something unexpected happened. Please try refreshing the page.
          </Typography>
          <Button
            onClick={() => window.location.reload()}
            startIcon={<AlertCircle size={18} />}
          >
            Refresh Page
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;