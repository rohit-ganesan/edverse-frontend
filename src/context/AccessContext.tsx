// src/context/AccessContext.tsx
// JWT-First Access Control - Reads directly from JWT app_metadata
import React, {
  createContext,
  useContext,
  useMemo,
  useState,
  useEffect,
} from 'react';
import { supabase } from '../lib/supabase';
import type { Plan, Role, Capability } from '../types/access';
import { getFeaturesForPlan } from '../config/planFeatures';
import { ROLE_CAPS } from '../types/access';
import { logger } from '../lib/logger';

export type AccessState = {
  plan: Plan;
  role: Role;
  features: string[];
  capabilities: Capability[];
  tenantId: string | null;
  tenantName: string | null;
  trialEndsAt: string | null;
  isLoading: boolean;
  isInitialized: boolean;
};

const DEFAULT_ACCESS: AccessState = {
  plan: 'free',
  role: 'teacher',
  features: getFeaturesForPlan('free'),
  capabilities: [],
  tenantId: null,
  tenantName: null,
  trialEndsAt: null,
  isLoading: true,
  isInitialized: false,
};

const AccessContext = createContext<AccessState>(DEFAULT_ACCESS);

export function AccessProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AccessState>(DEFAULT_ACCESS);

  useEffect(() => {
    // Load access data from JWT
    const loadAccess = async () => {
      logger.info('[AccessContext] Loading access data from JWT');

      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.user) {
        logger.info(
          '[AccessContext] No user session - setting default (guest) access'
        );
        // No user - set default (guest) access
        setState({
          plan: 'free',
          role: 'teacher',
          features: getFeaturesForPlan('free'),
          capabilities: [],
          tenantId: null,
          tenantName: null,
          trialEndsAt: null,
          isLoading: false,
          isInitialized: true,
        });
        return;
      }

      // Extract access data from JWT app_metadata
      const metadata = session.user.app_metadata || {};

      logger.debug('[AccessContext] JWT app_metadata', {
        user_id: session.user.id,
        email: session.user.email,
        has_metadata: !!metadata,
        metadata_keys: Object.keys(metadata),
        raw_metadata: metadata,
      });

      const role = (metadata.role as Role) || 'teacher';
      const plan = (metadata.plan as Plan) || 'free';
      const features = Array.isArray(metadata.features)
        ? metadata.features
        : getFeaturesForPlan(plan);
      const capabilities = ROLE_CAPS[role] || [];
      const tenantId = metadata.tenant_id || null;
      const tenantName = metadata.tenant_name || null;
      const trialEndsAt = metadata.trial_ends_at || null;

      logger.info('[AccessContext] Extracted access data', {
        role,
        plan,
        features_count: features.length,
        capabilities_count: capabilities.length,
        tenantId,
        tenantName,
        trialEndsAt,
      });

      setState({
        plan,
        role,
        features: [...features].sort(), // Ensure deterministic order
        capabilities,
        tenantId,
        tenantName,
        trialEndsAt,
        isLoading: false,
        isInitialized: true,
      });

      logger.info('[AccessContext] Access state updated successfully');
    };

    loadAccess();

    // Listen for auth state changes (JWT refresh, sign in, etc.)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      logger.info('[AccessContext] Auth state changed', {
        event,
        has_session: !!session,
        user_id: session?.user?.id,
        timestamp: new Date().toISOString(),
      });

      if (
        event === 'TOKEN_REFRESHED' ||
        event === 'SIGNED_IN' ||
        event === 'USER_UPDATED'
      ) {
        // JWT updated - reload access data
        logger.info('[AccessContext] JWT updated - reloading access data');
        await loadAccess();
      } else if (event === 'SIGNED_OUT') {
        // User signed out - reset to default
        logger.info(
          '[AccessContext] User signed out - resetting to default access'
        );
        setState({
          plan: 'free',
          role: 'teacher',
          features: getFeaturesForPlan('free'),
          capabilities: [],
          tenantId: null,
          tenantName: null,
          trialEndsAt: null,
          isLoading: false,
          isInitialized: true,
        });
      } else {
        logger.debug('[AccessContext] Unhandled auth event', { event });
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <AccessContext.Provider value={state}>{children}</AccessContext.Provider>
  );
}

export const useAccess = () => {
  const context = useContext(AccessContext);
  if (!context) {
    throw new Error('useAccess must be used within AccessProvider');
  }
  return context;
};

export const usePlan = () => useAccess().plan;
export const useRole = () => useAccess().role;
export const useFeatures = () => useAccess().features;
export const useCapabilities = () => useAccess().capabilities;
export const useTenantId = () => useAccess().tenantId;
export const useTenantName = () => useAccess().tenantName;

export const useFeature = (feature: string): boolean => {
  const features = useFeatures();
  return features.includes(feature);
};

export const useCan = (cap: Capability): boolean => {
  const capabilities = useCapabilities();
  return capabilities.includes(cap);
};
