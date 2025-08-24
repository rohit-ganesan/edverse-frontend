import { logError, getSupabaseErrorMessage, ErrorContext } from '../errorUtils';

describe('getSupabaseErrorMessage', () => {
  it('should return user-friendly message for known Supabase error messages', () => {
    const error = { message: 'User not found' };
    const result = getSupabaseErrorMessage(error);
    expect(result).toBe('No account found with this email address.');
  });

  it('should return user-friendly message for authentication errors', () => {
    const error = { message: 'Invalid login credentials' };
    const result = getSupabaseErrorMessage(error);
    expect(result).toBe(
      'Invalid email or password. Please check your credentials and try again.'
    );
  });

  it('should extract error message from Supabase error object', () => {
    const error = { message: 'Invalid login credentials' };
    const result = getSupabaseErrorMessage(error);
    expect(result).toBe(
      'Invalid email or password. Please check your credentials and try again.'
    );
  });

  it('should handle string errors', () => {
    const error = 'User not found';
    const result = getSupabaseErrorMessage(error);
    expect(result).toBe('No account found with this email address.');
  });

  it('should handle null/undefined errors', () => {
    const result = getSupabaseErrorMessage(null);
    expect(result).toBe('An unexpected error occurred. Please try again.');
  });

  it('should handle unknown errors with generic message', () => {
    const error = { message: 'Some unknown error' };
    const result = getSupabaseErrorMessage(error);
    expect(result).toBe('Some unknown error');
  });

  it('should handle JWT errors', () => {
    const error = { message: 'JWT expired' };
    const result = getSupabaseErrorMessage(error);
    expect(result).toBe('Your session has expired. Please sign in again.');
  });

  it('should handle permission errors', () => {
    const error = { message: 'new row violates row-level security policy' };
    const result = getSupabaseErrorMessage(error);
    expect(result).toBe('You do not have permission to perform this action.');
  });

  it('should handle network errors', () => {
    const error = { message: 'Network error occurred' };
    const result = getSupabaseErrorMessage(error);
    expect(result).toBe(
      'Network error. Please check your internet connection and try again.'
    );
  });

  it('should handle database constraint errors', () => {
    const error = { message: 'duplicate key value violates unique constraint' };
    const result = getSupabaseErrorMessage(error);
    expect(result).toBe(
      'This record already exists. Please use a different value.'
    );
  });
});

describe('logError', () => {
  it('should create structured error object', () => {
    const error = new Error('Test error');
    const context: ErrorContext = {
      component: 'TestComponent',
      action: 'test',
      userId: 'test-user',
    };

    const result = logError(error, context);

    expect(result).toHaveProperty('message', 'Test error');
    expect(result).toHaveProperty('context');
    expect(result).toHaveProperty('userFriendlyMessage');
    expect(result.context?.component).toBe('TestComponent');
    expect(result.context?.action).toBe('test');
    expect(result.context?.userId).toBe('test-user');
  });

  it('should handle string errors', () => {
    const error = 'String error message';
    const context: ErrorContext = { component: 'TestComponent' };

    const result = logError(error, context);

    expect(result.message).toBe('String error message');
    expect(result.userFriendlyMessage).toBe('String error message');
  });

  it('should handle object errors', () => {
    const error = { message: 'Object error', code: 'TEST_ERROR' };
    const context: ErrorContext = { component: 'TestComponent' };

    const result = logError(error, context);

    expect(result.message).toBe('Object error');
    expect(result.code).toBe('TEST_ERROR');
  });

  it('should handle unknown error types', () => {
    const error = null;
    const context: ErrorContext = { component: 'TestComponent' };

    const result = logError(error, context);

    expect(result.message).toBe('An unexpected error occurred');
    expect(result.userFriendlyMessage).toBe(
      'Something went wrong. Please try again.'
    );
  });

  it('should include timestamp in context', () => {
    const error = new Error('Test error');
    const context: ErrorContext = { component: 'TestComponent' };

    const result = logError(error, context);

    expect(result.context?.timestamp).toBeInstanceOf(Date);
  });
});

describe('Error handling utilities', () => {
  it('should identify network errors', () => {
    const { isNetworkError } = require('../errorUtils');

    expect(isNetworkError({ message: 'Network error' })).toBe(true);
    expect(isNetworkError({ message: 'fetch failed' })).toBe(true);
    expect(isNetworkError({ message: 'connection lost' })).toBe(true);
    expect(isNetworkError({ message: 'User not found' })).toBe(false);
  });

  it('should identify authentication errors', () => {
    const { isAuthError } = require('../errorUtils');

    expect(isAuthError({ message: 'JWT expired' })).toBe(true);
    expect(isAuthError({ message: 'Unauthorized' })).toBe(true);
    expect(isAuthError({ message: 'Authentication failed' })).toBe(true);
    expect(isAuthError({ message: 'Network error' })).toBe(false);
  });
});
