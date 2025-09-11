// src/config/planFeatures.ts
import type { Plan } from '../types/access';

export const FEATURES_BY_PLAN: Record<Plan, string[]> = {
  free: [
    'students.view',
    'courses.view',
    'classes.view',
    'attendance.view',
    'results.view',
    'notices.view',
    'fees.view',
  ],
  starter: [
    // inherits free
    'students.view',
    'courses.view',
    'classes.view',
    'attendance.view',
    'results.view',
    'notices.view',
    'fees.view',
    // adds
    'attendance.record',
    'results.enter',
    'notices.send',
    'staff.invite',
    'settings.integrations',
    // basic portals
    'portal.parent',
    'portal.student',
  ],
  growth: [
    // inherits starter
    'students.view',
    'courses.view',
    'classes.view',
    'attendance.view',
    'results.view',
    'notices.view',
    'fees.view',
    'attendance.record',
    'results.enter',
    'notices.send',
    'staff.invite',
    'settings.integrations',
    'portal.parent',
    'portal.student',
    // growth-only
    'analytics.view',
  ],
};

export function getFeaturesForPlan(plan: Plan): string[] {
  return FEATURES_BY_PLAN[plan] ?? FEATURES_BY_PLAN.free;
}

/**
 * Get the minimum plan required for a specific feature
 */
export function getMinPlanForFeature(feature: string): Plan | null {
  for (const plan of ['free', 'starter', 'growth'] as const) {
    if (FEATURES_BY_PLAN[plan].includes(feature)) {
      return plan;
    }
  }
  return null;
}

/**
 * Check if a feature is available in a plan (including inherited features)
 */
export function isFeatureAvailableInPlan(feature: string, plan: Plan): boolean {
  const planFeatures = getFeaturesForPlan(plan);
  return planFeatures.includes(feature);
}
