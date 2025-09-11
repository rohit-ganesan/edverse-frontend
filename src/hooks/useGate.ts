// src/hooks/useGate.ts
import { useAccess } from '../context/AccessContext';
import { PLAN_RANKS, type Plan, type Capability } from '../types/access';

export function useGate(
  opts: { cap?: Capability; feature?: string; neededPlan?: Plan } = {}
) {
  const { capabilities, features, plan } = useAccess();
  const { cap, feature, neededPlan } = opts;

  if (feature && !features.includes(feature)) return false;
  if (neededPlan && PLAN_RANKS[plan] < PLAN_RANKS[neededPlan]) return false;
  if (!cap) return true; // only plan/feature gate requested

  return capabilities.includes('*') || capabilities.includes(cap);
}
