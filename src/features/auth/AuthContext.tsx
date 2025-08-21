import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  ReactNode,
} from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from 'lib/supabase';
import { logError, ErrorContext } from 'lib/errorUtils';

// Types for Auth (using PostgreSQL snake_case convention)
export interface UserProfile {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  address: string;
  role: 'Administrator' | 'Instructor' | 'Student' | 'Parent';
  created_at: string;
  updated_at: string;
}

export interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  session: Session | null;
  loading: boolean;
  signUp: (
    email: string,
    password: string,
    profile?: Partial<UserProfile>
  ) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  updateUserProfile: (profile: Partial<UserProfile>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps): JSX.Element {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  // Create default profile for new users
  const createDefaultProfile = useCallback(
    async (userId: string): Promise<void> => {
      const user = await supabase.auth.getUser();
      if (!user.data.user?.email) return;

      const defaultProfile: Partial<UserProfile> = {
        id: userId,
        email: user.data.user.email,
        first_name: '',
        last_name: '',
        address: '',
        role: 'Administrator', // Default role - can be changed
      };

      try {
        const { data, error } = await supabase
          .from('users')
          .insert([defaultProfile])
          .select()
          .single();

        if (error) throw error;

        if (data) {
          setUserProfile(data as UserProfile);
        }
      } catch (error) {
        console.error('Error creating default profile:', error);
      }
    },
    []
  );

  // Load user profile from PostgreSQL
  const loadUserProfile = useCallback(
    async (userId: string): Promise<void> => {
      if (!userId) {
        console.error('loadUserProfile: userId is required');
        setUserProfile(null);
        return;
      }

      try {
        const { data: profile, error } = await supabase
          .from('users')
          .select('*')
          .eq('id', userId)
          .single();

        if (error) {
          if (error.code === 'PGRST116') {
            // No rows found - create default profile
            console.log('Creating default profile for new user');
            await createDefaultProfile(userId);
          } else {
            throw error;
          }
          return;
        }

        if (profile) {
          setUserProfile(profile as UserProfile);
        }
      } catch (error) {
        console.error('Error loading user profile:', error);
        setUserProfile(null);
      }
    },
    [createDefaultProfile]
  );

  // Initialize auth state
  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);

      if (session?.user?.id) {
        loadUserProfile(session.user.id);
      } else {
        setUserProfile(null);
      }

      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log(
        'Auth state changed:',
        event,
        session?.user?.email || 'No user'
      );

      setSession(session);
      setUser(session?.user ?? null);

      if (session?.user?.id) {
        await loadUserProfile(session.user.id);
      } else {
        setUserProfile(null);
      }

      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [loadUserProfile]);

  const signUp = async (
    email: string,
    password: string,
    profile?: Partial<UserProfile>
  ): Promise<void> => {
    if (!email || !password) {
      throw new Error('Email and password are required');
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
          data: {
            first_name: profile?.first_name || '',
            last_name: profile?.last_name || '',
          },
        },
      });

      if (error) throw error;

      // If user is created and confirmed, create profile
      if (data.user && !data.user.email_confirmed_at) {
        console.log('User created, please check email for confirmation');
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
    if (!email || !password) {
      throw new Error('Email and password are required');
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      console.log('Successfully signed in:', data.user?.email);
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
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) throw error;

      console.log('Google OAuth initiated:', data);
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
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      // Clear local state
      setUser(null);
      setUserProfile(null);
      setSession(null);
    } catch (error: unknown) {
      console.error('Error signing out:', error);
      throw error;
    }
  };

  const updateUserProfile = async (
    profile: Partial<UserProfile>
  ): Promise<void> => {
    if (!user?.id) {
      throw new Error('No user logged in');
    }

    if (!profile || Object.keys(profile).length === 0) {
      throw new Error('Profile data is required');
    }

    try {
      const { data, error } = await supabase
        .from('users')
        .update(profile)
        .eq('id', user.id)
        .select()
        .single();

      if (error) throw error;

      if (data) {
        setUserProfile(data as UserProfile);
      }
    } catch (error: unknown) {
      const context: ErrorContext = {
        component: 'AuthContext',
        action: 'updateUserProfile',
        userId: user.id,
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
    session,
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
