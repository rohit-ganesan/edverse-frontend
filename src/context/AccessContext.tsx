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
  role: 'teacher',
  features: getFeaturesForPlan('free'),
  capabilities: [
    'classes.view',
    'classes.take_attendance',
    'results.enter',
    'notices.send',
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
  const { user, loading: authLoading } = useAuth();

  const initializeAccess = useCallback(async () => {
    // Only fetch access data if user is authenticated
    if (!user) {
      setAccessState((prev) => ({
        ...prev,
        isLoading: false,
        isInitialized: true,
      }));
      return;
    }

    try {
      setAccessState((prev) => ({ ...prev, isLoading: true }));

      const accessData = await getAccessData();

      setAccessState({
        plan: accessData.plan as Plan,
        role: accessData.role as Role,
        features: accessData.features,
        capabilities: accessData.capabilities as Capability[],
        isLoading: false,
        isInitialized: true,
      });
    } catch (error) {
      console.error('Failed to initialize access:', error);
      setAccessState((prev) => ({
        ...prev,
        isLoading: false,
        isInitialized: true,
      }));
    }
  }, [user]);

  const refreshAccess = useCallback(async () => {
    await initializeAccess();
  }, [initializeAccess]);

  // Initialize access when user changes
  useEffect(() => {
    // Only initialize if user is authenticated and auth is not loading
    if (!authLoading && user) {
      initializeAccess();
    } else if (!authLoading && !user) {
      // Set initialized to true for unauthenticated users
      setAccessState((prev) => ({
        ...prev,
        isLoading: false,
        isInitialized: true,
      }));
    }
  }, [initializeAccess, authLoading, user]);

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
