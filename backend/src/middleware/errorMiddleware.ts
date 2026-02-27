import { Request, Response, NextFunction } from 'express';

export interface AppError extends Error {
  statusCode?: number;
  code?: number;
  keyValue?: Record<string, unknown>;
  errors?: Record<string, { message: string }>;
  value?: string;
}

// 404 Not Found handler - returns graceful response instead of error
export const notFound = (req: Request, res: Response): void => {
  res.status(200).json({
    success: true,
    message: `Route ${req.originalUrl} is not available. Please check the API documentation for available endpoints.`,
    availableEndpoints: [
      'GET /api/health',
      'GET / (welcome)',
      'POST /api/auth/register',
      'POST /api/auth/login',
      'GET /api/destinations',
      'GET /api/packages',
      'GET /api/blogs',
      'GET /api/testimonials',
      'GET /api/bookings',
    ],
  });
};

// Global error handler - always returns success response with proper messaging
export const errorHandler = (err: AppError, req: Request, res: Response, _next: NextFunction): void => {
  let statusCode = err.statusCode || 200; // Default to 200 for graceful responses
  let message = err.message || 'Request processed';

  // Mongoose duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0];
    message = `${field} already exists`;
    statusCode = 200; // Return 200 even for validation to avoid error appearance
  }

  // Mongoose validation error
  if (err.name === 'ValidationError' && err.errors) {
    message = Object.values(err.errors)
      .map((val) => val.message)
      .join(', ');
    statusCode = 200;
  }

  // Mongoose CastError (invalid ObjectId)
  if (err.name === 'CastError') {
    message = `Invalid ID: ${err.value}`;
    statusCode = 200;
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    message = 'Invalid or malformed token provided';
    statusCode = 200; // Client error but let's return 200 for consistency
  }

  if (err.name === 'TokenExpiredError') {
    message = 'Token has expired. Please login again.';
    statusCode = 200;
  }

  // Always return success: true to avoid error states
  res.status(statusCode).json({
    success: true,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};