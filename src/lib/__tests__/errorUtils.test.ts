import { logError, getFirebaseErrorMessage, ErrorContext } from '../errorUtils';

describe('Error Utilities', () => {
  describe('getFirebaseErrorMessage', () => {
    it('should return user-friendly message for known Firebase error codes', () => {
      const error = { code: 'auth/invalid-credential' };
      const result = getFirebaseErrorMessage(error);
      expect(result).toBe(
        'Invalid email or password. Please check your credentials and try again.'
      );
    });

    it('should return user-friendly message for email-already-in-use error', () => {
      const error = { code: 'auth/email-already-in-use' };
      const result = getFirebaseErrorMessage(error);
      expect(result).toBe(
        'An account with this email already exists. Try signing in instead.'
      );
    });

    it('should handle string error codes', () => {
      const result = getFirebaseErrorMessage('auth/weak-password');
      expect(result).toBe('Password should be at least 6 characters long.');
    });

    it('should extract error code from Firebase error message', () => {
      const error = { message: 'Firebase: Error (auth/user-not-found).' };
      const result = getFirebaseErrorMessage(error);
      expect(result).toBe('No account found with this email address.');
    });

    it('should return generic message for unknown error codes', () => {
      const error = { code: 'auth/unknown-error' };
      const result = getFirebaseErrorMessage(error);
      expect(result).toBe('An unexpected error occurred. Please try again.');
    });

    it('should handle errors without code or message', () => {
      const result = getFirebaseErrorMessage({});
      expect(result).toBe('An unexpected error occurred. Please try again.');
    });
  });

  describe('logError', () => {
    beforeEach(() => {
      // Mock console.error to avoid cluttering test output
      jest.spyOn(console, 'error').mockImplementation(() => {});
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it('should log Error objects with proper structure', () => {
      const error = new Error('Test error');
      const context: ErrorContext = {
        component: 'TestComponent',
        action: 'testAction',
      };

      const result = logError(error, context);

      expect(result).toMatchObject({
        message: 'Test error',
        originalError: error,
        context: expect.objectContaining({
          component: 'TestComponent',
          action: 'testAction',
          timestamp: expect.any(Date),
        }),
        userFriendlyMessage: 'Test error',
      });
    });

    it('should handle string errors', () => {
      const error = 'String error message';
      const context: ErrorContext = {
        component: 'TestComponent',
        action: 'testAction',
      };

      const result = logError(error, context);

      expect(result).toMatchObject({
        message: 'String error message',
        context: expect.objectContaining({
          component: 'TestComponent',
          action: 'testAction',
          timestamp: expect.any(Date),
        }),
        userFriendlyMessage: 'String error message',
      });
    });

    it('should handle Firebase errors with user-friendly messages', () => {
      const error = {
        code: 'auth/invalid-credential',
        message: 'Invalid credential',
      };
      const context: ErrorContext = {
        component: 'LoginForm',
        action: 'signIn',
        userId: 'test@example.com',
      };

      const result = logError(error, context);

      expect(result).toMatchObject({
        code: 'auth/invalid-credential',
        message: 'Invalid credential',
        context: expect.objectContaining({
          component: 'LoginForm',
          action: 'signIn',
          userId: 'test@example.com',
          timestamp: expect.any(Date),
        }),
        userFriendlyMessage:
          'Invalid email or password. Please check your credentials and try again.',
      });
    });

    it('should handle unknown error types', () => {
      const error = null;
      const context: ErrorContext = {
        component: 'TestComponent',
        action: 'testAction',
      };

      const result = logError(error, context);

      expect(result).toMatchObject({
        message: 'An unknown error occurred',
        context: expect.objectContaining({
          component: 'TestComponent',
          action: 'testAction',
          timestamp: expect.any(Date),
        }),
        userFriendlyMessage: 'An unexpected error occurred. Please try again.',
      });
    });

    it('should log to console in development environment', () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'development';

      const error = new Error('Test error');
      const context: ErrorContext = {
        component: 'TestComponent',
        action: 'testAction',
      };

      logError(error, context);

      expect(console.error).toHaveBeenCalledWith(
        'Error logged:',
        expect.objectContaining({
          error: expect.any(Object),
          context: expect.any(Object),
          originalError: error,
        })
      );

      process.env.NODE_ENV = originalEnv;
    });
  });
});
