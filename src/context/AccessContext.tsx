import React, {
  createContext,
  useContext,
  useMemo,
  useState,
  useEffect,
  useCallback,
} from 'react';
import type { Plan, Role, Capability } from '../types/access';
import { getFeaturesForPlan } from '../config/planFeatures';
import { getAccessData } from '../lib/supabase-api';
import { useAuth } from '../features/auth/AuthContext';

export type AccessState = {
  plan: Plan;
  role: Role;
  features: string[];
  capabilities: Capability[];
  isLoading: boolean;
  isInitialized: boolean;
};

const DEFAULT_ACCESS: AccessState = {
  plan: 'free',
  role: 'student', // Default to student instead of teacher
  features: getFeaturesForPlan('free'),
  capabilities: [
    'classes.view',
    'attendance.view',
    'attendance.record',
    'results.view',
    'results.enter',
    'notices.view',
    'notices.send',
    'students.view',
    'courses.view',
    'fees.view',
  ],
  isLoading: false,
  isInitialized: false,
};

const AccessContext = createContext<
  AccessState & {
    initializeAccess: () => Promise<void>;
    refreshAccess: () => Promise<void>;
  }
>({
  ...DEFAULT_ACCESS,
  initializeAccess: async () => {},
  refreshAccess: async () => {},
});

export function AccessProvider({ children }: { children: React.ReactNode }) {
  const [accessState, setAccessState] = useState<AccessState>(DEFAULT_ACCESS);
  const { user, ready } = useAuth();

  const initializeAccess = useCallback(async () => {
    console.log('🟢 AccessContext: Initializing...', { hasUser: !!user });

    if (!user) {
      // No user - set default state and mark as initialized
      setAccessState({
        plan: 'free',
        role: 'student',
        features: getFeaturesForPlan('free'),
        capabilities: [],
        isLoading: false,
        isInitialized: true,
      });
      return;
    }

    try {
      setAccessState((prev) => ({ ...prev, isLoading: true }));

      // Add timeout to getAccessData call
      const accessPromise = getAccessData();
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Access data timeout')), 5000)
      );

      const accessData = (await Promise.race([
        accessPromise,
        timeoutPromise,
      ])) as any;
      console.log('🟢 AccessContext: Got access data', accessData);

      setAccessState({
        plan: accessData.plan as Plan,
        role: accessData.role as Role,
        features: accessData.features ?? [],
        capabilities: accessData.capabilities ?? [],
        isLoading: false,
        isInitialized: true,
      });
    } catch (error) {
      console.error(
        '🟢 AccessContext: Error',
        error instanceof Error ? error.message : String(error)
      );
      // Fallback to free plan
      setAccessState({
        plan: 'free',
        role: 'student',
        features: getFeaturesForPlan('free'),
        capabilities: [],
        isLoading: false,
        isInitialized: true,
      });
    }
  }, [user]);

  const refreshAccess = useCallback(async () => {
    await initializeAccess();
  }, [initializeAccess]);

  // Initialize access when user changes
  // useEffect(() => {
  //   // Only initialize if user is authenticated and auth is not loading
  //   if (ready && user) {
  //     initializeAccess();
  //   } else if (ready && !user) {
  //     // Set initialized to true for unauthenticated users
  //     setAccessState((prev) => ({
  //       ...prev,
  //       isLoading: false,
  //       isInitialized: true,
  //     }));
  //   }
  // }, [initializeAccess, ready, user]);

  useEffect(() => {
    if (!ready) return;
    if (user?.id) initializeAccess();
    else
      setAccessState((p) => ({ ...p, isLoading: false, isInitialized: true }));
    // only re-run when user id changes or ready flips
  }, [ready, user?.id, initializeAccess]);

  const contextValue = useMemo(
    () => ({
      ...accessState,
      initializeAccess,
      refreshAccess,
    }),
    [accessState, initializeAccess, refreshAccess]
  );

  return (
    <AccessContext.Provider value={contextValue}>
      {children}
    </AccessContext.Provider>
  );
}

export const useAccess = () => useContext(AccessContext);
export const usePlan = () => useAccess().plan;
export const useRole = () => useAccess().role;
export const useFeatures = () => useAccess().features;
export const useCapabilities = () => useAccess().capabilities;

export const useFeature = (feature: string) => {
  const features = useFeatures();
  return features.includes(feature);
};

export const useCan = (cap: Capability) => {
  const capabilities = useCapabilities();
  return capabilities.includes('*') || capabilities.includes(cap);
};
