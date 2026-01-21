// src/hooks/useAccessCheck.ts
import { useMemo } from 'react';
import { useAccess } from '../context/AccessContext';
import { getMinPlanForFeature } from '../config/planFeatures';
import type { Plan } from '../types/access';
import { PLAN_RANKS } from '../types/access';
import { logger } from '../lib/logger';

const meetsPlan = (current: Plan, needed?: Plan) =>
  !needed || PLAN_RANKS[current] >= PLAN_RANKS[needed];

export function useAccessCheck(opts: {
  feature?: string;
  cap?: string;
  neededPlan?: Plan;
}) {
  const { plan, role, features, capabilities, isInitialized } = useAccess();
  const { feature, cap, neededPlan } = opts;

  return useMemo(() => {
    if (!isInitialized) {
      logger.debug('[useAccessCheck] Not initialized yet', { feature, cap });
      return { allowed: false, reason: { currentPlan: plan } };
    }

    // Auto-compute neededPlan from feature if not provided (reduces human error)
    const effectiveNeededPlan =
      neededPlan || (feature ? getMinPlanForFeature(feature) : undefined);

    if (!meetsPlan(plan, effectiveNeededPlan)) {
      logger.debug('[useAccessCheck] Plan check failed', {
        feature,
        cap,
        currentPlan: plan,
        neededPlan: effectiveNeededPlan,
      });
      return {
        allowed: false,
        reason: { neededPlan: effectiveNeededPlan, currentPlan: plan },
      };
    }
    if (feature && !features.includes(feature)) {
      logger.debug('[useAccessCheck] Feature not available', {
        feature,
        currentPlan: plan,
        availableFeatures: features,
      });
      return {
        allowed: false,
        reason: { missingFeature: feature, currentPlan: plan },
      };
    }
    if (cap && !(capabilities.includes('*') || capabilities.includes(cap))) {
      logger.debug('[useAccessCheck] Capability not available', {
        cap,
        role,
        availableCapabilities: capabilities,
      });
      return {
        allowed: false,
        reason: { missingCapability: cap, currentPlan: plan },
      };
    }

    logger.debug('[useAccessCheck] Access granted', {
      feature,
      cap,
      plan,
      role,
    });
    return { allowed: true, reason: { currentPlan: plan } };
  }, [
    plan,
    role,
    features,
    capabilities,
    isInitialized,
    feature,
    cap,
    neededPlan,
  ]);
}
