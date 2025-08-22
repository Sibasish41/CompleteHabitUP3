// Custom API Error class
class ApiError extends Error {
  constructor(message, statusCode, details = null) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    Error.captureStackTrace(this, this.constructor);
  }
}

// Error Handler Middleware
const errorHandler = (err, req, res, next) => {
  console.error('Error:', {
    message: err.message,
    stack: err.stack,
    timestamp: new Date().toISOString(),
    path: req.originalUrl,
    method: req.method
  });

  // Default error
  let error = { ...err };
  error.message = err.message;
  error.statusCode = err.statusCode || 500;

  // Handle different types of errors
  switch (err.name) {
    case 'SequelizeValidationError':
      error = new ApiError(
        'Validation Error',
        400,
        err.errors.map(e => ({ field: e.path, message: e.message }))
      );
      break;

    case 'SequelizeUniqueConstraintError':
      const field = err.errors[0].path;
      error = new ApiError(
        `${field} already exists`,
        400,
        { field, value: err.errors[0].value }
      );
      break;

    case 'JsonWebTokenError':
      error = new ApiError('Invalid token', 401);
      break;

    case 'TokenExpiredError':
      error = new ApiError('Token expired', 401);
      break;

    case 'SequelizeForeignKeyConstraintError':
      error = new ApiError(
        'Related record not found',
        400,
        { field: err.fields[0] }
      );
      break;

    case 'SequelizeConnectionError':
      error = new ApiError('Database connection error', 503);
      break;
  }

  // Handle file upload errors
  if (err.code === 'LIMIT_FILE_SIZE') {
    error = new ApiError('File too large', 400);
  }

  if (err.code === 'LIMIT_UNEXPECTED_FILE') {
    error = new ApiError('Unexpected file upload', 400);
  }

  // Handle multer errors
  if (err.code === 'LIMIT_PART_COUNT') {
    error = new ApiError('Too many parts in multipart form', 400);
  }

  if (err.code === 'LIMIT_FILE_COUNT') {
    error = new ApiError('Too many files uploaded', 400);
  }

  // Development vs Production error response
  const response = {
    success: false,
    status: error.status || 'error',
    message: error.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && {
      details: error.details || null,
      stack: error.stack
    })
  };

  res.status(error.statusCode || 500).json(response);
};

module.exports = { ApiError, errorHandler };
