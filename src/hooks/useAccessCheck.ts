// src/hooks/useAccessCheck.ts
import { useMemo } from 'react';
import { useAccess } from '../context/AccessContext';
import { getMinPlanForFeature } from '../config/planFeatures';
import type { Plan } from '../types/access';
import { PLAN_RANKS } from '../types/access';

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
    // Auto-compute neededPlan from feature if not provided (reduces human error)
    const effectiveNeededPlan =
      neededPlan || (feature ? getMinPlanForFeature(feature) : undefined);

    if (!meetsPlan(plan, effectiveNeededPlan)) {
      return {
        allowed: false,
        reason: { neededPlan: effectiveNeededPlan, currentPlan: plan },
      };
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
