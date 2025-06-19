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
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from 'lib/firebase';
import { AuthContextType, UserProfile } from 'types/auth';
import { logError, ErrorContext } from 'lib/errorUtils';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps): JSX.Element {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Load user profile from Firestore
  const loadUserProfile = async (userId: string): Promise<void> => {
    try {
      const userDoc = await getDoc(doc(db, 'users', userId));
      if (userDoc.exists()) {
        setUserProfile(userDoc.data() as UserProfile);
      } else {
        // Create default profile for new users
        const defaultProfile: UserProfile = {
          firstName: '',
          lastName: '',
          address: '',
          role: 'Administrator',
        };
        await setDoc(doc(db, 'users', userId), defaultProfile);
        setUserProfile(defaultProfile);
      }
    } catch (error) {
      console.error('Error loading user profile:', error);
      setUserProfile(null);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      console.log(
        'Auth state changed:',
        user ? `User: ${user.email}` : 'No user'
      );
      setUser(user);

      if (user) {
        await loadUserProfile(user.uid);
      } else {
        setUserProfile(null);
      }

      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signUp = async (
    email: string,
    password: string,
    profile?: Partial<UserProfile>
  ): Promise<void> => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      // If profile data is provided, save it to Firestore
      if (profile && userCredential.user) {
        const userProfile: UserProfile = {
          firstName: profile.firstName || '',
          lastName: profile.lastName || '',
          address: profile.address || '',
          role: profile.role || 'Student',
        };

        await setDoc(doc(db, 'users', userCredential.user.uid), userProfile);
        setUserProfile(userProfile);
      }
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

  const updateUserProfile = async (
    profile: Partial<UserProfile>
  ): Promise<void> => {
    if (!user) {
      throw new Error('No user logged in');
    }

    try {
      await updateDoc(doc(db, 'users', user.uid), profile);
      setUserProfile((prev) =>
        prev ? { ...prev, ...profile } : (profile as UserProfile)
      );
    } catch (error: unknown) {
      const context: ErrorContext = {
        component: 'AuthContext',
        action: 'updateUserProfile',
        userId: user.uid,
      };
      const appError = logError(error, context);

      const newError = new Error(appError.userFriendlyMessage);
      newError.name = 'ProfileUpdateError';
      throw newError;
    }
  };

  const value: AuthContextType = {
    user,
    userProfile,
    loading,
    signUp,
    signIn,
    signInWithGoogle,
    signOut,
    updateUserProfile,
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
