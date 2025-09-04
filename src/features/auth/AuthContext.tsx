import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  ReactNode,
} from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '../../lib/supabase';
import { authAPI } from '../../lib/supabase-api';
import { useAccess } from '../../context/AccessContext';

// Types
export interface UserProfile {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  address: string;
  role: 'owner' | 'admin' | 'teacher' | 'student' | 'parent';
  created_at?: string;
  updated_at?: string;
}

export interface AuthContextType {
  user: User | null;
  session: Session | null;
  userProfile: UserProfile | null;
  loading: boolean;
  creatingProfile: boolean;
  signUp: (email: string, password: string, userData: any) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateUserProfile: (updates: Partial<UserProfile>) => Promise<void>;
}

// Context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Hook
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Provider Component
interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  // State
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [creatingProfile, setCreatingProfile] = useState<boolean>(false);

  // Get access context with error handling
  let initializeAccess: (() => Promise<void>) | null = null;
  try {
    const accessContext = useAccess();
    initializeAccess = accessContext.initializeAccess;
  } catch (error) {
    // If AccessContext is not available, we'll handle it gracefully
    console.warn('AccessContext not available:', error);
  }

  // Simple logging utility
  const log = useCallback((message: string, data?: any) => {
    const timestamp = new Date().toISOString().split('T')[1].split('.')[0];
    console.log(`🔵 [${timestamp}] AuthContext: ${message}`, data || '');
  }, []);

  // STEP 2: Create profile from signup metadata
  const createProfileFromMetadata = useCallback(
    async (userId: string, metadata: any): Promise<void> => {
      log(`Creating profile from metadata for user: ${userId}`, metadata);

      try {
        const { data: userData } = await supabase.auth.getUser();

        if (!userData.user?.email) {
          throw new Error('No email found for user');
        }

        const userProfileData = {
          email: userData.user.email,
          first_name: metadata?.first_name || '',
          last_name: metadata?.last_name || '',
          address: metadata?.address || '',
          role: metadata?.role || 'student',
          school_name: metadata?.school_name || '',
        };

        log(
          'Creating profile via Edge Function from metadata',
          userProfileData
        );

        const { data, error } =
          await authAPI.createEnhancedUserProfile(userProfileData);

        if (error) {
          throw new Error(`Profile creation error: ${error}`);
        }

        if (data && data.success && data.data && data.data.user) {
          setUserProfile(data.data.user as UserProfile);
          log('Profile created successfully from metadata', {
            email: data.data.user.email,
            role: data.data.user.role,
          });
        } else {
          log('Unexpected response structure from Edge Function', data);
        }
      } catch (error: any) {
        log('Failed to create profile from metadata', {
          error: error.message,
          userId,
        });
        // Don't call loadUserProfile here to avoid circular dependency
        // The profile creation will be handled by the calling function
      }
    },
    [log, setUserProfile]
  );

  // STEP 3: Profile loading function
  const loadUserProfile = useCallback(
    async (userId: string): Promise<void> => {
      log(`Loading profile for user: ${userId}`);

      try {
        // First, let's check if the user exists in auth.users
        const { data: authUser, error: authError } =
          await supabase.auth.getUser();
        log('Auth user check:', {
          hasAuthUser: !!authUser.user,
          authUserId: authUser.user?.id,
          requestedUserId: userId,
          idsMatch: authUser.user?.id === userId,
          authError: authError?.message,
        });

        // Let's also check if there are ANY profiles in the users table
        const { data: allUsers, error: allUsersError } = await supabase
          .from('users')
          .select('id, email, role');

        log('All users check:', {
          hasAllUsers: !!allUsers,
          allUsersCount: allUsers?.length || 0,
          hasAllUsersError: !!allUsersError,
          allUsersErrorCode: allUsersError?.code,
          allUsersErrorMessage: allUsersError?.message,
          allUsers: allUsers,
        });

        // Check if the requested userId exists in the available users
        const userExists = allUsers?.some((user) => user.id === userId);
        log('User ID existence check:', {
          requestedUserId: userId,
          userExists: userExists,
          availableUserIds: allUsers?.map((u) => u.id) || [],
        });

        // Let's try a direct query for this specific user to see what happens
        const { data: specificUser, error: specificError } = await supabase
          .from('users')
          .select('*')
          .eq('id', userId);

        log('Specific user query:', {
          hasSpecificUser: !!specificUser,
          specificUserCount: specificUser?.length || 0,
          hasSpecificError: !!specificError,
          specificErrorCode: specificError?.code,
          specificErrorMessage: specificError?.message,
          specificUser: specificUser,
        });

        // Try to query the profile with detailed error logging
        const { data: profile, error } = await supabase
          .from('users')
          .select('*')
          .eq('id', userId)
          .single();

        // If the query fails, let's try a different approach
        if (error && error.code === 'PGRST116') {
          log('Profile not found with .single(), trying without .single()');
          const { data: profiles, error: multiError } = await supabase
            .from('users')
            .select('*')
            .eq('id', userId);

          log('Multi-profile query result:', {
            hasProfiles: !!profiles,
            profileCount: profiles?.length || 0,
            hasMultiError: !!multiError,
            multiErrorCode: multiError?.code,
            multiErrorMessage: multiError?.message,
          });

          if (profiles && profiles.length > 0) {
            log('Found profile without .single(), using first result');
            const firstProfile = profiles[0];
            setUserProfile(firstProfile as UserProfile);
            log('Profile loaded successfully from multi-query', {
              email: firstProfile.email,
              role: firstProfile.role,
            });
            return;
          }
        }

        log('Profile query result:', {
          hasProfile: !!profile,
          hasError: !!error,
          errorCode: error?.code,
          errorMessage: error?.message,
          profileId: profile?.id,
          profileEmail: profile?.email,
          profileRole: profile?.role,
        });

        if (error) {
          if (error.code === 'PGRST116') {
            log(
              'No profile found with .single(), checking if profile exists but is blocked by RLS'
            );

            // Try to check if the profile exists using a different approach
            // This will help us understand if it's an RLS issue or if the profile truly doesn't exist
            const { data: allProfiles, error: allError } = await supabase
              .from('users')
              .select('id, email, role')
              .eq('id', userId);

            log('All profiles query result:', {
              hasAllProfiles: !!allProfiles,
              allProfileCount: allProfiles?.length || 0,
              hasAllError: !!allError,
              allErrorCode: allError?.code,
              allErrorMessage: allError?.message,
              allProfiles: allProfiles,
            });

            if (allProfiles && allProfiles.length > 0) {
              log('Profile exists but .single() failed - likely RLS issue');
              const firstProfile = allProfiles[0];
              setUserProfile(firstProfile as UserProfile);
              log('Profile loaded successfully from all-profiles query', {
                email: firstProfile.email,
                role: firstProfile.role,
              });
              return;
            }

            log(
              'Profile truly does not exist - attempting to create from metadata'
            );
            log('Cannot find profile for user ID:', userId);
            log('Available users in table:', allUsers);

            // Try to create profile from user metadata if available
            const { data: authUser } = await supabase.auth.getUser();
            if (authUser.user?.user_metadata) {
              log(
                'Found user metadata, creating profile from metadata',
                authUser.user.user_metadata
              );
              setCreatingProfile(true);

              try {
                await createProfileFromMetadata(
                  userId,
                  authUser.user.user_metadata
                );

                // After creating profile, try to load it again with a small delay
                log(
                  'Profile created, waiting 1 second then attempting to reload...'
                );
                await new Promise((resolve) => setTimeout(resolve, 1000));

                const { data: newProfile, error: newError } = await supabase
                  .from('users')
                  .select('*')
                  .eq('id', userId)
                  .single();

                if (newProfile && !newError) {
                  log('Successfully loaded newly created profile', {
                    email: newProfile.email,
                    role: newProfile.role,
                  });
                  setUserProfile(newProfile as UserProfile);
                } else {
                  log('Failed to load newly created profile', {
                    error: newError?.message,
                    code: newError?.code,
                  });
                }
              } finally {
                setCreatingProfile(false);
              }
              return;
            } else {
              log('No user metadata found, cannot create profile');
              // TODO: Build UI for this case later
              return;
            }
          } else {
            throw new Error(`Database error: ${error.message}`);
          }
        }

        if (profile) {
          setUserProfile(profile as UserProfile);
          log('Profile loaded successfully', {
            email: profile.email,
            role: profile.role,
          });

          // Initialize access data after profile is loaded (with error handling)
          if (initializeAccess) {
            try {
              await initializeAccess();
              log('Access data initialized successfully');
            } catch (accessError) {
              log('Failed to initialize access data', { error: accessError });
              // Don't throw - this is not critical for auth to work
            }
          }
        }
      } catch (error: any) {
        log('Failed to load user profile', {
          error: error.message,
          userId,
        });
        setUserProfile(null);
      } finally {
        setLoading(false);
      }
    },
    [log, initializeAccess, createProfileFromMetadata]
  );

  // STEP 1: Basic auth state management
  useEffect(() => {
    log('AuthProvider mounted');

    // Set up auth state listener
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      log(`Auth state changed: ${event}`, {
        hasSession: !!session,
        hasUser: !!session?.user,
        userEmail: session?.user?.email,
      });

      setSession(session);
      setUser(session?.user ?? null);

      // Load profile if we have a user
      if (session?.user?.id) {
        // Always try to load profile first
        loadUserProfile(session.user.id);
      } else {
        setLoading(false);
      }
    });

    // Cleanup
    return () => {
      log('AuthProvider unmounting');
      subscription.unsubscribe();
    };
  }, [log, loadUserProfile, createProfileFromMetadata]);

  // STEP 3: Authentication functions
  const signUp = useCallback(
    async (email: string, password: string, userData: any): Promise<void> => {
      log('Starting enhanced sign up process', { email });

      try {
        setLoading(true);

        // First, create the auth user
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: userData,
          },
        });

        if (error) {
          throw error;
        }

        if (data.user && !data.session) {
          log('Sign up successful, email verification required');
          return;
        }

        // If we have a session, create the enhanced profile
        if (data.session && data.user) {
          log('Creating enhanced user profile');

          const { data: profileData, error: profileError } =
            await authAPI.createEnhancedUserProfile(userData);

          if (profileError) {
            log('Failed to create enhanced profile', { error: profileError });
            // Don't throw here - the user is created, just the profile failed
          } else {
            log('Enhanced profile created successfully', profileData);
          }
        }

        log('Enhanced sign up completed successfully');
      } catch (error: any) {
        log('Enhanced sign up failed', { error: error.message });
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

        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          if (error.message.includes('Email not confirmed')) {
            throw new Error(
              'Please verify your email address before signing in. Check your inbox for a verification link.'
            );
          }
          throw error;
        }

        log('Sign in successful', {
          userId: data.user?.id,
          email: data.user?.email,
        });
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
      // Clear local state immediately (React way)
      setUser(null);
      setUserProfile(null);
      setSession(null);
      setLoading(false);

      // Let Supabase handle its own cleanup
      const { error } = await supabase.auth.signOut();
      if (error) {
        log('Supabase signOut error (local state cleared)', {
          error: error.message,
        });
      }

      log('Sign out completed successfully');
    } catch (error: any) {
      log('Sign out error', { error: error.message });
      // Ensure local state is cleared even on error
      setUser(null);
      setUserProfile(null);
      setSession(null);
      setLoading(false);
    }
  }, [log]);

  const updateUserProfile = useCallback(
    async (updates: Partial<UserProfile>): Promise<void> => {
      if (!user?.id) {
        throw new Error('No authenticated user');
      }

      log('Updating user profile via Edge Function', { updates });

      try {
        const { data, error } = await authAPI.updateUserProfile(
          user.id,
          updates
        );

        if (error) {
          throw new Error(error);
        }

        if (data) {
          setUserProfile(data as UserProfile);
          log('Profile updated successfully via Edge Function');
        }
      } catch (error: any) {
        log('Failed to update profile', { error: error.message });
        throw error;
      }
    },
    [user?.id, log]
  );

  // Context value
  const value: AuthContextType = {
    user,
    session,
    userProfile,
    loading,
    creatingProfile,
    signUp,
    signIn,
    signOut,
    updateUserProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
