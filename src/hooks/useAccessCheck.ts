import { useMemo } from 'react';
import { useAccess, useFeature, useCan } from '../context/AccessContext';
import {
  PLAN_RANKS,
  ADDON_FEATURES,
  type Plan,
  type AccessCheckResult,
} from '../types/access';

interface AccessCheckOptions {
  feature?: string;
  cap?: string;
  neededPlan?: Plan;
}

/**
 * Enhanced access check hook that enforces neededPlan and provides detailed reasons
 * for access denials. This is the primary hook for gating routes and actions.
 */
export function useAccessCheck({
  feature,
  cap,
  neededPlan,
}: AccessCheckOptions): AccessCheckResult {
  const { plan, features, capabilities } = useAccess();

  return useMemo(() => {
    // If no requirements specified, allow access
    if (!feature && !cap && !neededPlan) {
      return { allowed: true };
    }

    // 1. Plan-first enforcement (highest priority)
    if (neededPlan) {
      const currentRank = PLAN_RANKS[plan];
      const neededRank = PLAN_RANKS[neededPlan];

      if (currentRank < neededRank) {
        return {
          allowed: false,
          reason: {
            neededPlan,
            missingFeature: feature,
            currentPlan: plan,
            plan: neededPlan,
          },
        };
      }
    }

    // 2. Feature check (if required)
    if (feature) {
      const hasFeature = features.includes(feature);
      if (!hasFeature) {
        return {
          allowed: false,
          reason: {
            missingFeature: feature,
            currentPlan: plan,
            plan: neededPlan,
          },
        };
      }
    }

    // 3. Capability check (if required)
    if (cap) {
      const hasCapability =
        capabilities.includes('*') || capabilities.includes(cap);
      if (!hasCapability) {
        return {
          allowed: false,
          reason: {
            missingCapability: cap,
            currentPlan: plan,
            plan: neededPlan,
          },
        };
      }
    }

    // All checks passed
    return { allowed: true };
  }, [feature, cap, neededPlan, plan, features, capabilities]);
}

/**
 * Hook to check if a feature is an add-on (paid feature)
 */
export function useIsAddonFeature(feature: string): boolean {
  return feature in ADDON_FEATURES;
}

/**
 * Hook to get add-on information for a feature
 */
export function useAddonInfo(feature: string) {
  return (ADDON_FEATURES as Record<string, any>)[feature] || null;
}

/**
 * Hook to check if access is blocked by plan (not feature/capability)
 */
export function useIsPlanBlocked(neededPlan?: Plan): boolean {
  const { plan } = useAccess();

  if (!neededPlan) return false;

  const currentRank = PLAN_RANKS[plan];
  const neededRank = PLAN_RANKS[neededPlan];

  return currentRank < neededRank;
}

/**
 * Hook to check if access is blocked by missing feature
 */
export function useIsFeatureBlocked(feature?: string): boolean {
  const { features } = useAccess();

  if (!feature) return false;

  return !features.includes(feature);
}

/**
 * Hook to check if access is blocked by missing capability
 */
export function useIsCapabilityBlocked(cap?: string): boolean {
  const { capabilities } = useAccess();

  if (!cap) return false;

  return !capabilities.includes('*') && !capabilities.includes(cap);
}
