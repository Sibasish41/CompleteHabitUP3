import React from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

class ApiErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Log error to your error tracking service
    console.error('API Error:', error, errorInfo);

    // Check if it's an authentication error
    if (error.response?.status === 401 || error.response?.status === 403) {
      // Clear auth state and redirect to login
      window.dispatchEvent(new CustomEvent('auth:expired'));
      this.props.navigate('/login');
      return;
    }

    // Show error toast for other errors
    toast.error(error.response?.data?.message || 'An unexpected error occurred');
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
    // Optionally reload the page or re-fetch data
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
          <div className="max-w-lg w-full">
            <div className="bg-white rounded-lg shadow-lg p-8 text-center">
              <div className="text-red-500 text-5xl mb-4">
                <i className="fas fa-exclamation-circle"></i>
              </div>
              <h1 className="text-2xl font-bold text-gray-800 mb-4">
                Oops! Something went wrong
              </h1>
              <p className="text-gray-600 mb-6">
                {this.state.error?.response?.data?.message ||
                 'We encountered an error while processing your request.'}
              </p>
              <div className="space-y-4">
                <button
                  onClick={this.handleRetry}
                  className="w-full bg-primary-500 text-white px-6 py-3 rounded-lg hover:bg-primary-600 transition-colors"
                >
                  Try Again
                </button>
                <button
                  onClick={() => this.props.navigate('/')}
                  className="w-full bg-gray-100 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Go Home
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Wrapper component to provide navigation
export default function ApiErrorBoundaryWithNavigation(props) {
  const navigate = useNavigate();
  return <ApiErrorBoundary {...props} navigate={navigate} />;
}
