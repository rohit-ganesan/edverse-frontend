import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react';
import {
  User,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
} from 'firebase/auth';
import { auth } from 'lib/firebase';
import { AuthContextType } from 'types/auth';
import { logError, ErrorContext } from 'lib/errorUtils';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps): JSX.Element {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log(
        'Auth state changed:',
        user ? `User: ${user.email}` : 'No user'
      );
      setUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signUp = async (email: string, password: string): Promise<void> => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
    } catch (error: unknown) {
      const context: ErrorContext = {
        component: 'AuthContext',
        action: 'signUp',
        userId: email,
      };
      const appError = logError(error, context);

      const newError = new Error(appError.userFriendlyMessage);
      newError.name = 'AuthError';
      throw newError;
    }
  };

  const signIn = async (email: string, password: string): Promise<void> => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error: unknown) {
      const context: ErrorContext = {
        component: 'AuthContext',
        action: 'signIn',
        userId: email,
      };
      const appError = logError(error, context);

      const newError = new Error(appError.userFriendlyMessage);
      newError.name = 'AuthError';
      throw newError;
    }
  };

  const signInWithGoogle = async (): Promise<void> => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (error: unknown) {
      const context: ErrorContext = {
        component: 'AuthContext',
        action: 'signInWithGoogle',
      };
      const appError = logError(error, context);

      const newError = new Error(appError.userFriendlyMessage);
      newError.name = 'AuthError';
      throw newError;
    }
  };

  const signOut = async (): Promise<void> => {
    await firebaseSignOut(auth);
  };

  const value: AuthContextType = {
    user,
    loading,
    signUp,
    signIn,
    signInWithGoogle,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
