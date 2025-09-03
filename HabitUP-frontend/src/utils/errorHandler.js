import { toast } from 'react-toastify';

// Error types
export const ErrorTypes = {
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  AUTH_ERROR: 'AUTH_ERROR',
  NETWORK_ERROR: 'NETWORK_ERROR',
  SERVER_ERROR: 'SERVER_ERROR',
  NOT_FOUND: 'NOT_FOUND',
};

// Parse error from API response
export const parseError = (error) => {
  if (!error.response) {
    return {
      type: ErrorTypes.NETWORK_ERROR,
      message: 'Network error. Please check your connection.',
      details: null,
    };
  }

  const { status, data } = error.response;

  switch (status) {
    case 400:
      return {
        type: ErrorTypes.VALIDATION_ERROR,
        message: data.message || 'Validation error',
        details: data.details || null,
      };
    case 401:
    case 403:
      return {
        type: ErrorTypes.AUTH_ERROR,
        message: data.message || 'Authentication error',
        details: null,
      };
    case 404:
      return {
        type: ErrorTypes.NOT_FOUND,
        message: data.message || 'Resource not found',
        details: null,
      };
    case 500:
    default:
      return {
        type: ErrorTypes.SERVER_ERROR,
        message: data.message || 'Internal server error',
        details: data.details || null,
      };
  }
};

// Handle API errors
export const handleApiError = (error, options = {}) => {
  const parsedError = parseError(error);

  // Handle authentication errors
  if (parsedError.type === ErrorTypes.AUTH_ERROR && options.onAuthError) {
    options.onAuthError();
  }

  // Show toast notification if enabled
  if (options.showToast !== false) {
    toast.error(parsedError.message);
  }

  return parsedError;
};

// Create loading and error state hook
export const useLoadingAndError = (initialLoading = false) => {
  const [loading, setLoading] = useState(initialLoading);
  const [error, setError] = useState(null);

  const handleError = (err, options = {}) => {
    const parsedError = handleApiError(err, options);
    setError(parsedError);
    return parsedError;
  };

  const clearError = () => setError(null);

  return {
    loading,
    setLoading,
    error,
    setError,
    handleError,
    clearError,
  };
};
