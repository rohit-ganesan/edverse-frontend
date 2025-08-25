import { useMemo } from 'react';
import { usePlan, useFeature, useCan } from '../context/AccessContext';

export type AccessCheckInput = {
  feature?: string; // e.g., 'fees.online'
  cap?: string; // e.g., 'fees.online'
  neededPlan?: 'starter' | 'growth' | 'scale' | 'enterprise'; // for better messaging
};

export type AccessCheck = {
  allowed: boolean;
  reason: null | {
    missingFeature?: string;
    missingCapability?: string;
    neededPlan?: AccessCheckInput['neededPlan'];
    currentPlan: string;
  };
};

export function useAccessCheck({
  feature,
  cap,
  neededPlan,
}: AccessCheckInput): AccessCheck {
  const plan = usePlan();
  // Hooks must be called unconditionally - always call them
  const hasFeature = useFeature(feature || '');
  const hasCap = useCan((cap as any) || '');

  return useMemo(() => {
    // Check if the feature/cap is actually required
    const featureRequired = !!feature;
    const capRequired = !!cap;

    // Only allow if both required features/caps are available
    const featureAllowed = !featureRequired || hasFeature;
    const capAllowed = !capRequired || hasCap;

    if (featureAllowed && capAllowed) return { allowed: true, reason: null };
    return {
      allowed: false,
      reason: {
        missingFeature: featureRequired && !hasFeature ? feature : undefined,
        missingCapability: capRequired && !hasCap ? cap : undefined,
        neededPlan,
        currentPlan: plan,
      },
    };
  }, [hasFeature, hasCap, feature, cap, neededPlan, plan]);
}
