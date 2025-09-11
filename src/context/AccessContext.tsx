// src/context/AccessContext.tsx
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
import { useAuth } from '../features/auth/AuthContext';
import { getAccessData } from '../lib/supabase-api';
import { ROLE_CAPS } from '../types/access';

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
  role: 'student',
  features: getFeaturesForPlan('free'),
  capabilities: [], // <— was ROLE_CAPS.student; make empty for guests/unauthenticated
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
  const [state, setState] = useState<AccessState>(DEFAULT_ACCESS);
  const { user, userProfile, ready } = useAuth();

  const initializeAccess = useCallback(async () => {
    // Unauthed: default free/student view
    if (!user) {
      setState({
        plan: 'free',
        role: 'student',
        features: getFeaturesForPlan('free'),
        capabilities: [], // <— was ROLE_CAPS.student
        isLoading: false,
        isInitialized: true,
      });
      return;
    }

    try {
      setState((prev) => ({ ...prev, isLoading: true }));

      // Try server; timeout fast
      const accessPromise = getAccessData();
      const timeout = new Promise<never>((_, rej) =>
        setTimeout(() => rej(new Error('access-timeout')), 4000)
      );
      const remote = await Promise.race([accessPromise, timeout]).catch(
        () => null as any
      );

      // Decide plan and role
      const plan: Plan =
        remote?.plan === 'starter' || remote?.plan === 'growth'
          ? remote.plan
          : 'free';
      const role: Role =
        (userProfile?.role as Role) || (remote?.role as Role) || 'student';

      // Merge features: prefer remote if present, otherwise local
      const features =
        Array.isArray(remote?.features) && remote.features.length
          ? remote.features
          : getFeaturesForPlan(plan);

      // Capabilities always from local ROLE_CAPS to keep client consistent
      const caps = ROLE_CAPS[role] || ROLE_CAPS.student;

      setState({
        plan,
        role,
        features,
        capabilities: caps,
        isLoading: false,
        isInitialized: true,
      });
    } catch {
      // Fallback – still usable
      const role: Role = (userProfile?.role as Role) || 'student';
      setState({
        plan: 'free',
        role,
        features: getFeaturesForPlan('free'),
        capabilities: ROLE_CAPS[role] || ROLE_CAPS.student,
        isLoading: false,
        isInitialized: true,
      });
    }
  }, [user, userProfile?.role]);

  const refreshAccess = useCallback(async () => {
    await initializeAccess();
  }, [initializeAccess]);

  useEffect(() => {
    if (!ready) return;
    if (user?.id) initializeAccess();
    else setState((s) => ({ ...s, isLoading: false, isInitialized: true }));
  }, [ready, user?.id, initializeAccess]);

  const value = useMemo(
    () => ({ ...state, initializeAccess, refreshAccess }),
    [state, initializeAccess, refreshAccess]
  );
  return (
    <AccessContext.Provider value={value}>{children}</AccessContext.Provider>
  );
}

export const useAccess = () => useContext(AccessContext);
export const usePlan = () => useAccess().plan;
export const useRole = () => useAccess().role;
export const useFeatures = () => useAccess().features;
export const useCapabilities = () => useAccess().capabilities;
export const useFeature = (feature: string) => useFeatures().includes(feature);
// NOTE: useCan only checks role caps. For plan gating, also verify a matching feature (or wrap with useAccessCheck/RouteGuard).
export const useCan = (cap: Capability) => {
  const caps = useCapabilities();
  return caps.includes('*') || caps.includes(cap);
};
