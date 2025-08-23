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
      console.log('📝 Creating default profile for userId:', userId);

      try {
        const user = await supabase.auth.getUser();
        if (!user.data.user?.email) {
          console.error('❌ No email found for user during profile creation');
          setUserProfile(null);
          setLoading(false);
          return;
        }

        const defaultProfile: Partial<UserProfile> = {
          id: userId,
          email: user.data.user.email,
          first_name: user.data.user.user_metadata?.first_name || '',
          last_name: user.data.user.user_metadata?.last_name || '',
          address: '',
          role: 'Administrator', // Default role - can be changed
        };

        console.log('💾 Inserting default profile:', defaultProfile);

        const { data, error } = await supabase
          .from('users')
          .insert([defaultProfile])
          .select()
          .single();

        if (error) {
          console.error('❌ Failed to create default profile:', error);
          console.error('❌ Profile creation error details:', {
            code: error.code,
            message: error.message,
            details: error.details,
          });
          setUserProfile(null);
          setLoading(false);
          return;
        }

        if (data) {
          console.log('✅ Default profile created successfully:', data);
          setUserProfile(data as UserProfile);
        } else {
          console.warn('⚠️ Profile creation succeeded but no data returned');
          setUserProfile(null);
        }

        setLoading(false);
      } catch (error) {
        console.error('❌ Unexpected error creating default profile:', error);
        console.error('❌ Error details:', {
          name: (error as Error)?.name,
          message: (error as Error)?.message,
          stack: (error as Error)?.stack,
        });
        setUserProfile(null);
        setLoading(false);
      }
    },
    []
  );

  // Load user profile from PostgreSQL
  const loadUserProfile = useCallback(
    async (userId: string): Promise<void> => {
      if (!userId) {
        console.error('❌ loadUserProfile: userId is required');
        setUserProfile(null);
        setLoading(false);
        return;
      }

      console.log('🔍 Loading user profile for:', userId);

      try {
        console.log('📡 Making Supabase query to users table...');

        let profile: any = null;
        let error: any = null;

        // Try direct REST API call since Supabase client has issues
        try {
          const response = await fetch(
            `${process.env.REACT_APP_SUPABASE_URL}/rest/v1/users?id=eq.${userId}`,
            {
              headers: {
                apikey: process.env.REACT_APP_SUPABASE_ANON_KEY!,
                Authorization: `Bearer ${process.env.REACT_APP_SUPABASE_ANON_KEY!}`,
                'Content-Type': 'application/json',
              },
            }
          );

          if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
          }

          const profiles = await response.json();
          profile = profiles[0] || null;
          error =
            profiles.length === 0
              ? { code: 'PGRST116', message: 'No rows found' }
              : null;

          console.log('📡 Direct API query completed:', {
            hasData: !!profile,
            hasError: !!error,
            errorCode: error?.code,
            errorMessage: error?.message,
          });
        } catch (fetchError: any) {
          console.error('❌ Direct API fetch failed:', fetchError);
          // Fall back to original Supabase client as backup
          const supabaseResult = await supabase
            .from('users')
            .select('*')
            .eq('id', userId)
            .single();
          profile = supabaseResult.data;
          error = supabaseResult.error;
        }

        if (error) {
          console.error('❌ Profile query error:', error);

          if (error.code === 'PGRST116') {
            // No rows found - create default profile
            console.log(
              '📝 No profile found, creating default profile for new user'
            );
            await createDefaultProfile(userId);
            return; // createDefaultProfile handles setLoading(false)
          } else if (error.code === '42P01') {
            // Table doesn't exist
            console.error('❌ Database table "users" does not exist');
            setUserProfile(null);
            setLoading(false);
            return;
          } else if (error.code === 'PGRST301') {
            // RLS policy violation
            console.error(
              '❌ Row Level Security policy violation - user cannot access their profile'
            );
            console.log(
              '💡 This usually means RLS policies need to be configured in Supabase'
            );
            setUserProfile(null);
            setLoading(false);
            return;
          } else {
            console.error('❌ Unexpected database error:', error);
            setUserProfile(null);
            setLoading(false);
            return;
          }
        } else if (profile) {
          console.log('✅ Profile loaded successfully:', profile.email);
          setUserProfile(profile as UserProfile);
          setLoading(false);
        } else {
          // No profile and no error - shouldn't happen but handle it
          console.warn('⚠️ No profile returned and no error - this is unusual');
          setUserProfile(null);
          setLoading(false);
        }
      } catch (error) {
        console.error('❌ Unexpected error loading user profile:', error);
        console.error('❌ Error details:', {
          name: (error as Error)?.name,
          message: (error as Error)?.message,
          stack: (error as Error)?.stack,
        });
        setUserProfile(null);
        setLoading(false);
      }
    },
    [createDefaultProfile]
  );

  // Initialize auth state
  useEffect(() => {
    console.log('🔄 AuthContext: Initializing auth state...');

    // Set a timeout to prevent infinite loading
    const loadingTimeout = setTimeout(() => {
      console.warn(
        '⚠️ Auth loading timeout after 5 seconds - forcing loading to false'
      );
      console.warn(
        '💡 This suggests a database connection or RLS policy issue'
      );
      setLoading(false);
    }, 5000); // 5 second timeout

    // Listen for email verification completion from other tabs
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'auth_verification_complete') {
        console.log(
          '📧 Email verification completed in another tab, refreshing session...'
        );
        // Refresh the session to get the updated user data
        supabase.auth.getSession().then(({ data: { session } }) => {
          if (session?.user?.id) {
            console.log('✅ Session refreshed after email verification');
            setSession(session);
            setUser(session.user);
            loadUserProfile(session.user.id);
          }
        });
      }
    };

    window.addEventListener('storage', handleStorageChange);

    // Get initial session
    supabase.auth
      .getSession()
      .then(({ data: { session }, error }) => {
        console.log('🔍 Auth session result:', { session: !!session, error });

        clearTimeout(loadingTimeout); // Clear timeout since we got a response

        setSession(session);
        setUser(session?.user ?? null);

        if (session?.user?.id) {
          console.log(
            '👤 User found, loading profile for:',
            session.user.email
          );
          loadUserProfile(session.user.id);
        } else {
          console.log('❌ No authenticated user found');
          setUserProfile(null);
          setLoading(false); // Set loading to false when no user
        }
      })
      .catch((error) => {
        console.error('❌ Auth initialization failed:', error);
        clearTimeout(loadingTimeout);
        setLoading(false);
      });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log(
        '🔄 Auth state changed:',
        event,
        session?.user?.email || 'No user'
      );

      setSession(session);
      setUser(session?.user ?? null);

      try {
        if (session?.user?.id) {
          console.log('👤 User session found, loading profile...');
          await loadUserProfile(session.user.id);
        } else {
          console.log('❌ No user session, clearing profile');
          setUserProfile(null);
          setLoading(false);
        }
      } catch (error) {
        console.error('❌ Error in auth state change handler:', error);
        setLoading(false);
      }

      // For sign out events, ensure immediate redirect
      if (event === 'SIGNED_OUT') {
        console.log('🚪 Sign out event detected - user should be redirected');
      }
    });

    return () => {
      subscription.unsubscribe();
      clearTimeout(loadingTimeout);
      window.removeEventListener('storage', handleStorageChange);
    };
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

      console.log('Signup response:', {
        user: data.user,
        identities: data.user?.identities,
        session: data.session,
      });

      // Check if user already exists
      if (
        data.user &&
        data.user.identities &&
        data.user.identities.length === 0
      ) {
        throw new Error(
          'An account with this email address already exists. Please sign in instead.'
        );
      }

      // If user is created and confirmed, create profile
      if (data.user && !data.user.email_confirmed_at) {
        console.log('User created, please check email for confirmation');
      } else if (data.user && data.user.email_confirmed_at) {
        console.log('User created and confirmed');
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

      if (error) {
        console.error('Sign in error:', error);

        // Handle specific email confirmation error
        if (error.message?.includes('Email not confirmed')) {
          throw new Error(
            "Please check your email and click the verification link before signing in. If you can't find the email, please sign up again."
          );
        }

        throw error;
      }

      console.log('Successfully signed in:', data.user?.email);
      console.log(
        'Email confirmed:',
        data.user?.email_confirmed_at ? 'Yes' : 'No'
      );
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
      console.log('🚪 Signing out user...');

      // Clear local state immediately to trigger redirect
      setUser(null);
      setUserProfile(null);
      setSession(null);
      setLoading(false);

      console.log('🧹 Local state cleared immediately');

      // Then call Supabase signOut
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.warn(
          '⚠️ Supabase signOut error (but local state cleared):',
          error
        );
      } else {
        console.log('✅ Successfully signed out from Supabase');
      }

      console.log('🚪 Sign out complete - user should be redirected');
    } catch (error: unknown) {
      console.error('❌ Error signing out:', error);
      // Even if there's an error, ensure local state is cleared
      setUser(null);
      setUserProfile(null);
      setSession(null);
      setLoading(false);
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
