// src/hooks/useAccessCheck.ts
import { useMemo } from 'react';
import { useAccess } from '../context/AccessContext';
import type { Plan } from '../types/access';

const PLAN_RANKS: Record<Plan, number> = { free: 0, starter: 1, growth: 2 };
const meetsPlan = (current: Plan, needed?: Plan) =>
  !needed || PLAN_RANKS[current] >= PLAN_RANKS[needed];

export function useAccessCheck(opts: {
  feature?: string;
  cap?: string;
  neededPlan?: Plan;
}) {
  const { plan, features, capabilities, isInitialized } = useAccess();
  const { feature, cap, neededPlan } = opts;

  return useMemo(() => {
    if (!isInitialized) {
      return { allowed: false, reason: { currentPlan: plan } };
    }
    if (!meetsPlan(plan, neededPlan)) {
      return { allowed: false, reason: { neededPlan, currentPlan: plan } };
    }
    if (feature && !features.includes(feature)) {
      return {
        allowed: false,
        reason: { missingFeature: feature, currentPlan: plan },
      };
    }
    if (cap && !(capabilities.includes('*') || capabilities.includes(cap))) {
      return {
        allowed: false,
        reason: { missingCapability: cap, currentPlan: plan },
      };
    }
    return { allowed: true, reason: { currentPlan: plan } };
  }, [plan, features, capabilities, isInitialized, feature, cap, neededPlan]);
}
