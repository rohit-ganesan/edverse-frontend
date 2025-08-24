/**
 * Maps Supabase error messages to user-friendly error messages
 */
export const supabaseErrorMessages: Record<string, string> = {
  // Authentication errors
  'Invalid login credentials':
    'Invalid email or password. Please check your credentials and try again.',
  'User not found': 'No account found with this email address.',
  'Invalid email': 'Please enter a valid email address.',
  'User already registered':
    'An account with this email already exists. Try signing in instead.',
  'Password should be at least 6 characters':
    'Password should be at least 6 characters long.',
  'Email not confirmed':
    'Please check your email and click the verification link.',
  'Too many requests': 'Too many failed attempts. Please try again later.',
  'Network error':
    'Network error. Please check your internet connection and try again.',
  'Invalid token': 'Your session has expired. Please sign in again.',
  'JWT expired': 'Your session has expired. Please sign in again.',
  'Invalid JWT': 'Your session is invalid. Please sign in again.',

  // Database errors
  'duplicate key value violates unique constraint':
    'This record already exists. Please use a different value.',
  'relation "users" does not exist':
    'Database schema error. Please contact support.',
  'column "email" of relation "users" does not exist':
    'Database schema error. Please contact support.',
  'null value in column "email" violates not-null constraint':
    'Email is required. Please provide a valid email address.',
  'new row for relation "users" violates check constraint':
    'Invalid data provided. Please check your input and try again.',

  // Permission errors
  'new row violates row-level security policy':
    'You do not have permission to perform this action.',
  'JWT must be a valid JWT': 'Authentication required. Please sign in.',
  'JWT token is missing': 'Authentication required. Please sign in.',

  // Generic errors
  'Internal server error': 'An internal error occurred. Please try again.',
  'Service unavailable':
    'Service is temporarily unavailable. Please try again later.',
  'Request timeout': 'The request timed out. Please try again.',
  'Bad request': 'Invalid request. Please check your input and try again.',
  'Not found': 'The requested resource was not found.',
  Forbidden: 'You do not have permission to access this resource.',
  Unauthorized: 'Authentication required. Please sign in.',
};

/**
 * Error context interface for logging purposes
 */
export interface ErrorContext {
  component?: string;
  action?: string;
  userId?: string;
  timestamp?: Date;
  additionalData?: Record<string, unknown>;
}

/**
 * Structured error interface
 */
export interface AppError {
  code?: string;
  message: string;
  originalError?: Error;
  context?: ErrorContext;
  userFriendlyMessage: string;
}

/**
 * Central error logging utility as specified in cursor rules
 */
export function logError(error: unknown, context: ErrorContext): AppError {
  const timestamp = new Date();
  const errorContext: ErrorContext = {
    ...context,
    timestamp,
  };

  let appError: AppError;

  if (error instanceof Error) {
    appError = {
      code: (error as any).code,
      message: error.message,
      originalError: error,
      context: errorContext,
      userFriendlyMessage: getSupabaseErrorMessage(error),
    };
  } else if (typeof error === 'string') {
    appError = {
      message: error,
      context: errorContext,
      userFriendlyMessage: error,
    };
  } else if (error && typeof error === 'object') {
    // Handle plain objects (like Supabase errors)
    const errorObj = error as any;
    appError = {
      code: errorObj.code || errorObj.status,
      message: errorObj.message || errorObj.error || 'Unknown error',
      originalError: error as Error,
      context: errorContext,
      userFriendlyMessage: getSupabaseErrorMessage(errorObj),
    };
  } else {
    appError = {
      message: 'An unexpected error occurred',
      context: errorContext,
      userFriendlyMessage: 'Something went wrong. Please try again.',
    };
  }

  // Log the error for debugging
  console.error('Application Error:', {
    ...appError,
    context: errorContext,
  });

  return appError;
}

/**
 * Converts Supabase error to user-friendly message
 */
export function getSupabaseErrorMessage(error: unknown): string {
  if (!error) {
    return 'An unexpected error occurred. Please try again.';
  }

  let errorMessage = '';

  // Handle different error formats
  if (typeof error === 'string') {
    errorMessage = error;
  } else if (error instanceof Error) {
    errorMessage = error.message;
  } else if (error && typeof error === 'object') {
    const errorObj = error as any;
    errorMessage = errorObj.message || errorObj.error || errorObj.details || '';
  }

  // Check for exact matches in our error message mapping
  if (errorMessage && supabaseErrorMessages[errorMessage]) {
    return supabaseErrorMessages[errorMessage];
  }

  // Check for partial matches (case-insensitive)
  const lowerErrorMessage = errorMessage.toLowerCase();
  for (const [key, value] of Object.entries(supabaseErrorMessages)) {
    if (lowerErrorMessage.includes(key.toLowerCase())) {
      return value;
    }
  }

  // Check for common Supabase error patterns
  if (lowerErrorMessage.includes('jwt')) {
    return 'Authentication required. Please sign in again.';
  }
  if (
    lowerErrorMessage.includes('permission') ||
    lowerErrorMessage.includes('forbidden')
  ) {
    return 'You do not have permission to perform this action.';
  }
  if (lowerErrorMessage.includes('not found')) {
    return 'The requested resource was not found.';
  }
  if (lowerErrorMessage.includes('timeout')) {
    return 'The request timed out. Please try again.';
  }
  if (lowerErrorMessage.includes('network')) {
    return 'Network error. Please check your internet connection and try again.';
  }

  // Remove Supabase prefix from error messages
  const cleanMessage = errorMessage
    .replace(/^Supabase:\s*/i, '')
    .replace(/^Error:\s*/i, '');

  // Return the cleaned message or a generic fallback
  return cleanMessage || 'Something went wrong. Please try again.';
}

/**
 * Handle async operations with error logging
 */
export async function handleAsyncError<T>(
  operation: () => Promise<T>,
  context: ErrorContext,
  fallbackMessage = 'Operation failed'
): Promise<T | null> {
  try {
    return await operation();
  } catch (error) {
    const appError = logError(error, context);
    console.error(`${fallbackMessage}:`, appError);
    return null;
  }
}

/**
 * Create a user-friendly error message for display
 */
export function createUserFriendlyError(
  error: unknown,
  context?: string
): string {
  const errorContext: ErrorContext = {
    component: context || 'Unknown',
    action: 'display',
    timestamp: new Date(),
  };

  const appError = logError(error, errorContext);
  return appError.userFriendlyMessage;
}

/**
 * Check if error is a network error
 */
export function isNetworkError(error: unknown): boolean {
  if (!error) return false;

  const errorMessage =
    typeof error === 'string'
      ? error
      : error instanceof Error
        ? error.message
        : (error as any)?.message || '';

  return (
    errorMessage.toLowerCase().includes('network') ||
    errorMessage.toLowerCase().includes('fetch') ||
    errorMessage.toLowerCase().includes('connection')
  );
}

/**
 * Check if error is an authentication error
 */
export function isAuthError(error: unknown): boolean {
  if (!error) return false;

  const errorMessage =
    typeof error === 'string'
      ? error
      : error instanceof Error
        ? error.message
        : (error as any)?.message || '';

  return (
    errorMessage.toLowerCase().includes('jwt') ||
    errorMessage.toLowerCase().includes('unauthorized') ||
    errorMessage.toLowerCase().includes('authentication') ||
    errorMessage.toLowerCase().includes('login')
  );
}

/**
 * Validation error messages
 */
export const validationMessages = {
  emailRequired: 'Email address is required.',
  emailInvalid: 'Please enter a valid email address.',
  passwordRequired: 'Password is required.',
  passwordTooShort: 'Password must be at least 6 characters long.',
  passwordMismatch: 'Passwords do not match.',
  nameRequired: 'Full name is required.',
  termsRequired: 'You must accept the terms and conditions.',
} as const;

/**
 * Success messages
 */
export const successMessages = {
  signUpSuccess: 'Account created successfully! Welcome to EdVerse.',
  signInSuccess: 'Welcome back!',
  signOutSuccess: 'You have been signed out successfully.',
  passwordResetSent:
    'Password reset email has been sent to your email address.',
} as const;
