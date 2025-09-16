// src/context/AccessContext.tsx
import React, {
  createContext,
  useContext,
  useMemo,
  useState,
  useEffect,
  useCallback,
  useRef,
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

const shallowEqual = (a: any, b: any) => {
  if (a === b) return true;
  if (!a || !b) return false;
  const ak = Object.keys(a);
  const bk = Object.keys(b);
  if (ak.length !== bk.length) return false;
  for (const k of ak) {
    if (a[k] !== b[k]) return false;
  }
  return true;
};

// Shallow array equality (order-sensitive)
const arraysEqual = (a: any[] = [], b: any[] = []) => {
  if (a === b) return true;
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) return false;
  return true;
};

// Return prevArr if same elements, else nextArr
const stableArray = (prevArr: string[] = [], nextArr: string[] = []) =>
  arraysEqual(prevArr, nextArr) ? prevArr : nextArr;

export function AccessProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AccessState>(DEFAULT_ACCESS);
  const { user, userProfile, ready } = useAuth();

  // Call token to cancel stale async returns
  const callTokenRef = useRef(0);

  // Derive a stable role string to avoid re-runs when role value is same but re-wrapped
  // Fallback to auth user's metadata role if profile hasn't loaded yet
  const effectiveRole =
    (userProfile?.role as Role | undefined) ||
    ((user as any)?.user_metadata?.role as Role | undefined) ||
    undefined;

  const initializeAccess = useCallback(async () => {
    const myToken = ++callTokenRef.current;

    // Guests: fast path
    if (!user) {
      const next: AccessState = {
        plan: 'free',
        role: 'student',
        features: getFeaturesForPlan('free'),
        capabilities: [],
        isLoading: false,
        isInitialized: true,
      };
      setState((prev) => (shallowEqual(prev, next) ? prev : next));
      return;
    }

    // Avoid no-op render when already loading
    setState((prev) => (prev.isLoading ? prev : { ...prev, isLoading: true }));

    let timeoutId: ReturnType<typeof setTimeout> | null = null;
    const timeoutMs = 4000;
    const timeoutPromise = new Promise<never>((_, reject) => {
      timeoutId = setTimeout(
        () => reject(new Error('access-timeout')),
        timeoutMs
      );
    });

    try {
      const remote = await Promise.race([
        getAccessData(),
        timeoutPromise,
      ]).catch(() => null as any);

      // Cancel if a newer call started
      if (callTokenRef.current !== myToken) return;

      const plan: Plan =
        remote?.plan === 'starter' || remote?.plan === 'growth'
          ? remote.plan
          : 'free';

      // Prefer server role; fall back to profile role; then auth metadata; else student
      const role: Role =
        (remote?.role as Role) ||
        (effectiveRole as Role) ||
        ((user as any)?.user_metadata?.role as Role) ||
        'student';

      const rawFeatures =
        Array.isArray(remote?.features) && remote.features.length
          ? remote.features
          : getFeaturesForPlan(plan);

      // Optional: ensure deterministic order
      const normalizedFeatures = [...rawFeatures].sort();

      const capabilities = ROLE_CAPS[role] || ROLE_CAPS.student;

      setState((prev) => {
        const next: AccessState = {
          plan,
          role,
          features: stableArray(prev.features, normalizedFeatures),
          capabilities: stableArray(prev.capabilities, capabilities),
          isLoading: false,
          isInitialized: true,
        };
        return shallowEqual(prev, next) ? prev : next;
      });
    } catch (err) {
      if (callTokenRef.current !== myToken) return;

      // If the network call failed (e.g., token refresh in-flight), use best-known role hint
      const role: Role =
        ((user as any)?.user_metadata?.role as Role) ||
        (effectiveRole as Role) ||
        'student';

      setState((prev) => {
        const fallbackFeatures = getFeaturesForPlan('free');
        const next: AccessState = {
          plan: 'free',
          role,
          features: stableArray(prev.features, fallbackFeatures),
          capabilities: stableArray(
            prev.capabilities,
            ROLE_CAPS[role] || ROLE_CAPS.student
          ),
          isLoading: false,
          isInitialized: true,
        };
        return shallowEqual(prev, next) ? prev : next;
      });
    } finally {
      if (timeoutId) clearTimeout(timeoutId);
    }
  }, [user, effectiveRole]);

  const refreshAccess = useCallback(async () => {
    await initializeAccess();
  }, [initializeAccess]);

  useEffect(() => {
    if (!ready) return;
    if (user?.id) {
      initializeAccess();
    } else {
      setState((s) =>
        s.isInitialized && !s.isLoading
          ? s
          : { ...s, isLoading: false, isInitialized: true }
      );
    }
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
  return caps.includes(cap);
};
