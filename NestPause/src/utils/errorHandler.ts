import { AppError } from '@/types';

export interface ErrorContext {
  operation: string;
  userId?: string;
  familyId?: string;
  deviceId?: string;
  ruleId?: string;
  requestId?: string;
  additionalData?: Record<string, any>;
}

export class ErrorHandler {
  private static instance: ErrorHandler;
  private errorQueue: Array<{ error: AppError; context: ErrorContext }> = [];

  static getInstance(): ErrorHandler {
    if (!ErrorHandler.instance) {
      ErrorHandler.instance = new ErrorHandler();
    }
    return ErrorHandler.instance;
  }

  /**
   * Handle and categorize errors
   */
  handleError(error: any, context: ErrorContext): AppError {
    const appError = this.categorizeError(error, context);
    
    // Log error for debugging
    this.logError(appError, context);
    
    // Add to error queue for potential retry
    this.errorQueue.push({ error: appError, context });
    
    // Notify error reporting service if available
    this.reportError(appError, context);
    
    return appError;
  }

  /**
   * Categorize errors based on type and context
   */
  private categorizeError(error: any, context: ErrorContext): AppError {
    let code = 'UNKNOWN_ERROR';
    let message = 'An unexpected error occurred';
    
    // Firebase Auth errors
    if (error.code?.startsWith('auth/')) {
      code = 'AUTH_ERROR';
      switch (error.code) {
        case 'auth/user-not-found':
          message = 'No account found with this email address';
          break;
        case 'auth/wrong-password':
          message = 'Incorrect password';
          break;
        case 'auth/email-already-in-use':
          message = 'An account with this email already exists';
          break;
        case 'auth/weak-password':
          message = 'Password should be at least 6 characters';
          break;
        case 'auth/invalid-email':
          message = 'Invalid email address';
          break;
        case 'auth/too-many-requests':
          message = 'Too many failed attempts. Please try again later';
          break;
        case 'auth/network-request-failed':
          message = 'Network error. Please check your connection';
          break;
        case 'auth/user-disabled':
          message = 'This account has been disabled';
          break;
        case 'auth/requires-recent-login':
          message = 'Please sign in again to continue';
          break;
        default:
          message = error.message || 'Authentication error';
      }
    }
    
    // Firebase Firestore errors
    else if (error.code?.startsWith('firestore/')) {
      code = 'FIRESTORE_ERROR';
      switch (error.code) {
        case 'firestore/permission-denied':
          message = 'You do not have permission to perform this action';
          break;
        case 'firestore/unavailable':
          message = 'Service temporarily unavailable. Please try again later';
          break;
        case 'firestore/deadline-exceeded':
          message = 'Request timed out. Please try again';
          break;
        case 'firestore/resource-exhausted':
          message = 'Too many requests. Please try again later';
          break;
        case 'firestore/unauthenticated':
          message = 'Please sign in to continue';
          break;
        case 'firestore/not-found':
          message = 'The requested resource was not found';
          break;
        case 'firestore/failed-precondition':
          message = 'Operation failed due to invalid state';
          break;
        default:
          message = error.message || 'Database error';
      }
    }
    
    // Network errors
    else if (error.code === 'NETWORK_ERROR' || error.message?.includes('network')) {
      code = 'NETWORK_ERROR';
      message = 'Network error. Please check your internet connection';
    }
    
    // Timeout errors
    else if (error.code === 'TIMEOUT' || error.message?.includes('timeout')) {
      code = 'TIMEOUT_ERROR';
      message = 'Request timed out. Please try again';
    }
    
    // Validation errors
    else if (error.code === 'VALIDATION_ERROR') {
      code = 'VALIDATION_ERROR';
      message = error.message || 'Invalid input provided';
    }
    
    // Permission errors
    else if (error.code === 'PERMISSION_ERROR') {
      code = 'PERMISSION_ERROR';
      message = error.message || 'You do not have permission to perform this action';
    }
    
    // Business logic errors
    else if (error.code === 'BUSINESS_ERROR') {
      code = 'BUSINESS_ERROR';
      message = error.message || 'Operation not allowed';
    }
    
    // Retry-able errors
    else if (this.isRetryableError(error)) {
      code = 'RETRYABLE_ERROR';
      message = 'Temporary error. Will retry automatically';
    }

    return {
      code,
      message,
      details: error,
      timestamp: new Date(),
    };
  }

  /**
   * Check if error is retryable
   */
  private isRetryableError(error: any): boolean {
    const retryableCodes = [
      'firestore/unavailable',
      'firestore/deadline-exceeded',
      'firestore/resource-exhausted',
      'NETWORK_ERROR',
      'TIMEOUT_ERROR',
    ];
    
    return retryableCodes.includes(error.code) || 
           error.message?.includes('network') ||
           error.message?.includes('timeout');
  }

  /**
   * Log error for debugging
   */
  private logError(error: AppError, context: ErrorContext): void {
    const logData = {
      error: {
        code: error.code,
        message: error.message,
        timestamp: error.timestamp,
      },
      context,
      stack: error.details?.stack,
    };
    
    if (__DEV__) {
      console.error('Error occurred:', logData);
    }
    
    // In production, you might want to send this to a logging service
    // like Sentry, LogRocket, or your own logging API
  }

  /**
   * Report error to external service
   */
  private reportError(error: AppError, context: ErrorContext): void {
    // Only report certain types of errors
    const reportableCodes = [
      'AUTH_ERROR',
      'FIRESTORE_ERROR',
      'NETWORK_ERROR',
      'UNKNOWN_ERROR',
    ];
    
    if (reportableCodes.includes(error.code)) {
      // In production, implement error reporting service
      // Example: Sentry.captureException(error.details, { extra: context });
    }
  }

  /**
   * Get user-friendly error message
   */
  getUserFriendlyMessage(error: AppError): string {
    const friendlyMessages: Record<string, string> = {
      'AUTH_ERROR': 'Please check your credentials and try again',
      'FIRESTORE_ERROR': 'Something went wrong with the database. Please try again',
      'NETWORK_ERROR': 'Please check your internet connection',
      'TIMEOUT_ERROR': 'The request is taking too long. Please try again',
      'VALIDATION_ERROR': 'Please check your input and try again',
      'PERMISSION_ERROR': 'You do not have permission to perform this action',
      'BUSINESS_ERROR': 'This operation is not allowed at this time',
      'RETRYABLE_ERROR': 'Please wait a moment and try again',
      'UNKNOWN_ERROR': 'Something unexpected happened. Please try again',
    };
    
    return friendlyMessages[error.code] || error.message;
  }

  /**
   * Check if error should trigger retry
   */
  shouldRetry(error: AppError): boolean {
    return error.code === 'RETRYABLE_ERROR' || 
           error.code === 'NETWORK_ERROR' ||
           error.code === 'TIMEOUT_ERROR';
  }

  /**
   * Get retry delay based on error type
   */
  getRetryDelay(error: AppError, attempt: number): number {
    const baseDelay = 1000; // 1 second
    const maxDelay = 30000; // 30 seconds
    const exponentialBackoff = Math.min(baseDelay * Math.pow(2, attempt), maxDelay);
    
    // Add jitter to prevent thundering herd
    const jitter = Math.random() * 1000;
    
    return exponentialBackoff + jitter;
  }

  /**
   * Clear error queue
   */
  clearErrorQueue(): void {
    this.errorQueue = [];
  }

  /**
   * Get error queue for debugging
   */
  getErrorQueue(): Array<{ error: AppError; context: ErrorContext }> {
    return [...this.errorQueue];
  }
}

// Export singleton instance
export const errorHandler = ErrorHandler.getInstance();

// Utility functions for common error scenarios
export const createAuthError = (message: string, details?: any): AppError => ({
  code: 'AUTH_ERROR',
  message,
  details,
  timestamp: new Date(),
});

export const createNetworkError = (message: string, details?: any): AppError => ({
  code: 'NETWORK_ERROR',
  message,
  details,
  timestamp: new Date(),
});

export const createValidationError = (message: string, details?: any): AppError => ({
  code: 'VALIDATION_ERROR',
  message,
  details,
  timestamp: new Date(),
});

export const createPermissionError = (message: string, details?: any): AppError => ({
  code: 'PERMISSION_ERROR',
  message,
  details,
  timestamp: new Date(),
});

export const createBusinessError = (message: string, details?: any): AppError => ({
  code: 'BUSINESS_ERROR',
  message,
  details,
  timestamp: new Date(),
});

// Error boundary helper
export const isError = (error: any): error is AppError => {
  return error && typeof error === 'object' && 'code' in error && 'message' in error;
};

// Retry utility
export const withRetry = async <T>(
  operation: () => Promise<T>,
  maxRetries = 3,
  context: ErrorContext
): Promise<T> => {
  let lastError: any;
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;
      const appError = errorHandler.handleError(error, context);
      
      // Don't retry on the last attempt or if error is not retryable
      if (attempt === maxRetries || !errorHandler.shouldRetry(appError)) {
        throw appError;
      }
      
      // Wait before retrying
      const delay = errorHandler.getRetryDelay(appError, attempt);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  throw lastError;
};
