import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '../../lib/supabase';
import { authAPI } from '../../lib/supabase-api';

// Helper function for display names
export const displayName = (u?: UserProfile | null) =>
  [u?.first_name, u?.last_name].filter(Boolean).join(' ').trim() ||
  (u?.email ?? '');

// Types
export interface UserProfile {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  address: string;
  role: 'owner' | 'admin' | 'teacher' | 'student' | 'parent';
  tenant_id?: string | null;
  onboarding_status?: 'pending' | 'complete';
  created_at?: string;
  updated_at?: string;
}

export interface AuthContextType {
  user: User | null;
  session: Session | null;
  userProfile: UserProfile | null;
  loading: boolean;
  ready: boolean;
  signUp: (email: string, password: string, userData: any) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateUserProfile: (updates: Partial<UserProfile>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [ready, setReady] = useState<boolean>(false);

  // Logging helper
  const log = useCallback((message: string, data?: any) => {
    const timestamp = new Date().toISOString().split('T')[1].split('.')[0];
    console.log(`🔵 [${timestamp}] AuthContext: ${message}`, data || '');
  }, []);

  // Debug state changes
  useEffect(() => {
    log('State changed', {
      loading,
      ready,
      hasUser: !!user,
      hasSession: !!session,
    });
  }, [loading, ready, user, session, log]);

  // SIMPLIFIED: Just listen to auth state changes, no complex prime() function
  useEffect(() => {
    let mounted = true;

    log('AuthContext: Setting up auth listener');

    // Set initial loading state
    setReady(false);

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      log(`Auth state changed: ${event}`, {
        hasSession: !!session,
        hasUser: !!session?.user,
      });

      if (!mounted) return;

      // Update auth state immediately
      setSession(session ?? null);
      setUser(session?.user ?? null);

      if (session?.user?.id) {
        // User is signed in - fetch profile
        log('Starting profile fetch process...');
        // STEP 1: Try ensure_profile with timeout
        log('STEP 1: Calling ensure_profile RPC...');
        try {
          const ensurePromise = supabase.rpc('ensure_profile');
          const timeoutPromise = new Promise((_, reject) =>
            setTimeout(() => reject(new Error('ensure_profile timeout')), 3000)
          );
          await Promise.race([ensurePromise, timeoutPromise]);
          log('STEP 1: ensure_profile RPC completed successfully');
        } catch (ensureError) {
          log(
            'STEP 1: ensure_profile failed',
            ensureError instanceof Error
              ? ensureError.message
              : String(ensureError)
          );
        }

        // STEP 2: Always try to fetch profile directly with timeout
        log('STEP 2: Fetching profile directly...');
        try {
          const profilePromise = supabase
            .from('users')
            .select(
              'id,email,first_name,last_name,address,role,tenant_id,onboarding_status,updated_at'
            )
            .eq('id', session.user.id)
            .maybeSingle();

          const timeoutPromise = new Promise((_, reject) =>
            setTimeout(() => reject(new Error('Profile fetch timeout')), 5000)
          );

          const { data: profile, error: profileError } = (await Promise.race([
            profilePromise,
            timeoutPromise,
          ])) as any;

          if (profileError) {
            log('STEP 2: Profile fetch error', profileError);
            setUserProfile(null);
          } else if (profile) {
            log('STEP 2: Profile found', {
              id: profile.id,
              email: profile.email,
              role: profile.role,
            });
            setUserProfile(profile);
          } else {
            log('STEP 2: No profile found in database');
            setUserProfile(null);
          }
        } catch (fetchError) {
          log(
            'STEP 2: Profile fetch exception',
            fetchError instanceof Error
              ? fetchError.message
              : String(fetchError)
          );
          setUserProfile(null);
        }
      } else {
        // User is signed out
        log('No user ID, clearing profile');
        setUserProfile(null);
      }

      // STEP 3: Always complete the auth flow
      log('STEP 3: Completing auth flow...');
      log('STEP 3: Setting loading=false, ready=true');
      setLoading(false);
      setReady(true);
      log('STEP 3: Auth flow completed successfully');
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  // STEP 2: Authentication functions
  const signUp = useCallback(
    async (email: string, password: string, userData: any): Promise<void> => {
      log('Starting enhanced sign up process', { email });

      try {
        setLoading(true);

        // First, create the auth user
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              first_name: userData.first_name || '',
              last_name: userData.last_name || '',
              address: userData.address || '',
              role: userData.role || 'student',
            },
            emailRedirectTo: `${window.location.origin}/auth/callback`,
          },
        });

        if (error) {
          throw error;
        }

        log('Sign up successful, email verification required');
        // Note: onAuthStateChange will handle setting user/session state when user verifies email
      } catch (error: any) {
        log('Sign up failed', { error: error.message });
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [log]
  );

  const signIn = useCallback(
    async (email: string, password: string): Promise<void> => {
      log('Starting sign in process', { email });

      try {
        setLoading(true);

        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          throw error;
        }

        log('Sign in successful', { email });
        // Note: onAuthStateChange will handle setting user/session state
      } catch (error: any) {
        log('Sign in failed', { error: error.message });
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [log]
  );

  const signOut = useCallback(async (): Promise<void> => {
    log('Starting sign out process');

    try {
      setUserProfile(null);
      setSession(null);
      setLoading(false);

      // Let Supabase handle its own cleanup
      const { error } = await supabase.auth.signOut();
      if (error) {
        log('Supabase signOut error (local state cleared)', {
          error: error.message,
        });
      } else {
        log('Sign out successful');
      }
    } catch (error: any) {
      log('Sign out error (local state cleared)', { error: error.message });
      setUserProfile(null);
      setSession(null);
      setLoading(false);
    }
  }, [log]);

  const updateUserProfile = useCallback(
    async (updates: Partial<UserProfile>): Promise<void> => {
      if (!user) {
        throw new Error('No user logged in');
      }

      try {
        await authAPI.updateUserProfile(user.id, updates);

        // Update local state
        setUserProfile((prev) => (prev ? { ...prev, ...updates } : null));

        log('Profile updated successfully', updates);
      } catch (error: any) {
        log('Profile update failed', { error: error.message });
        throw error;
      }
    },
    [user, log]
  );

  const value: AuthContextType = {
    user,
    session,
    userProfile,
    loading,
    ready,
    signUp,
    signIn,
    signOut,
    updateUserProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
