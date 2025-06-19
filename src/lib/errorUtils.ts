/**
 * Maps Firebase error codes to user-friendly error messages
 */
export const firebaseErrorMessages: Record<string, string> = {
  // Authentication errors
  'auth/invalid-credential':
    'Invalid email or password. Please check your credentials and try again.',
  'auth/user-not-found': 'No account found with this email address.',
  'auth/wrong-password': 'Incorrect password. Please try again.',
  'auth/invalid-email': 'Please enter a valid email address.',
  'auth/user-disabled':
    'This account has been disabled. Please contact support.',
  'auth/email-already-in-use':
    'An account with this email already exists. Try signing in instead.',
  'auth/weak-password': 'Password should be at least 6 characters long.',
  'auth/operation-not-allowed':
    'This sign-in method is not enabled. Please contact support.',
  'auth/account-exists-with-different-credential':
    'An account already exists with the same email but different sign-in credentials.',
  'auth/credential-already-in-use':
    'This credential is already associated with a different user account.',
  'auth/requires-recent-login':
    'This operation requires recent authentication. Please sign in again.',
  'auth/too-many-requests': 'Too many failed attempts. Please try again later.',
  'auth/network-request-failed':
    'Network error. Please check your internet connection and try again.',
  'auth/popup-closed-by-user':
    'Sign-in popup was closed before completing the process.',
  'auth/popup-blocked':
    'Sign-in popup was blocked by your browser. Please allow popups and try again.',
  'auth/cancelled-popup-request': 'Sign-in was cancelled. Please try again.',
  'auth/unauthorized-domain': 'This domain is not authorized for sign-in.',

  // Configuration errors
  'auth/configuration-not-found':
    'Authentication service is not properly configured. Please contact support.',
  'auth/api-key-not-valid':
    'Authentication service configuration error. Please contact support.',
  'auth/invalid-api-key':
    'Authentication service configuration error. Please contact support.',

  // Network and generic errors
  'auth/timeout': 'The request timed out. Please try again.',
  'auth/quota-exceeded': 'Service quota exceeded. Please try again later.',
  'auth/app-deleted': 'The application has been deleted.',
  'auth/app-not-authorized': 'Application is not authorized for this service.',
  'auth/internal-error': 'An internal error occurred. Please try again.',
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
      userFriendlyMessage: getFirebaseErrorMessage(error),
    };
  } else if (typeof error === 'string') {
    appError = {
      message: error,
      context: errorContext,
      userFriendlyMessage: error,
    };
  } else if (error && typeof error === 'object') {
    // Handle plain objects (like Firebase errors)
    const errorObj = error as any;
    appError = {
      code: errorObj.code,
      message: errorObj.message || 'An error occurred',
      context: errorContext,
      userFriendlyMessage: getFirebaseErrorMessage(error),
    };
  } else {
    appError = {
      message: 'An unknown error occurred',
      context: errorContext,
      userFriendlyMessage: 'An unexpected error occurred. Please try again.',
    };
  }

  // Log to console in development
  if (process.env.NODE_ENV === 'development') {
    console.error('Error logged:', {
      error: appError,
      context: errorContext,
      originalError: error,
    });
  }

  // In production, you would send this to your error tracking service
  // e.g., Sentry, LogRocket, etc.

  return appError;
}

/**
 * Converts Firebase error to user-friendly message
 */
export function getFirebaseErrorMessage(error: unknown): string {
  // Handle different error formats
  let errorCode: string | undefined;

  if (typeof error === 'string') {
    errorCode = error;
  } else if (error && typeof error === 'object' && 'code' in error) {
    errorCode = (error as any).code;
  } else if (error && typeof error === 'object' && 'message' in error) {
    const message = (error as any).message;
    if (typeof message === 'string' && message.includes('auth/')) {
      // Extract error code from message
      const match = message.match(/auth\/[\w-]+/);
      errorCode = match?.[0];
    }
  }

  // Return user-friendly message or generic fallback
  if (errorCode && firebaseErrorMessages[errorCode]) {
    return firebaseErrorMessages[errorCode];
  }

  // Fallback for unknown errors
  if (error && typeof error === 'object' && 'message' in error) {
    const message = (error as any).message;
    if (typeof message === 'string') {
      // Remove Firebase prefix from error messages
      return message
        .replace(/^Firebase:\s*/i, '')
        .replace(/\s*\(auth\/[\w-]+\)\.?$/i, '');
    }
  }

  return 'An unexpected error occurred. Please try again.';
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
