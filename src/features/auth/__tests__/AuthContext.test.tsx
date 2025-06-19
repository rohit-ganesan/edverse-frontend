// No React import needed with new JSX transform
import { render, screen } from '@testing-library/react';
import { AuthProvider, useAuth } from '../AuthContext';

// Mock Firebase Auth
jest.mock('lib/firebase', () => ({
  auth: {},
}));

jest.mock('firebase/auth', () => ({
  onAuthStateChanged: jest.fn(() => {
    // Return unsubscribe function
    return jest.fn();
  }),
  createUserWithEmailAndPassword: jest.fn(),
  signInWithEmailAndPassword: jest.fn(),
  signOut: jest.fn(),
  GoogleAuthProvider: jest.fn(),
  signInWithPopup: jest.fn(),
}));

// Simple test component that uses the auth context
function TestComponent(): JSX.Element {
  const auth = useAuth();

  return (
    <div data-testid="auth-context">
      {auth ? 'Auth context available' : 'No auth context'}
    </div>
  );
}

describe('AuthProvider', () => {
  test('provides auth context to children', () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    // Should provide auth context
    expect(screen.getByTestId('auth-context')).toHaveTextContent(
      'Auth context available'
    );
  });

  test('throws error when useAuth is used outside AuthProvider', () => {
    // Suppress console.error for this test
    const consoleSpy = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {});

    expect(() => {
      render(<TestComponent />);
    }).toThrow('useAuth must be used within an AuthProvider');

    consoleSpy.mockRestore();
  });
});
