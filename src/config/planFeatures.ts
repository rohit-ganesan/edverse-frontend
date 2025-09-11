// src/config/planFeatures.ts
import type { Plan } from '../types/access';

// NOTE: Features gate PLAN access. Caps gate ROLE ability.
// UI must check BOTH when rendering write controls.
// Free: view-only. Starter: daily ops. Growth: Starter + analytics.

export const FEATURES_BY_PLAN: Record<Plan, string[]> = {
  free: [
    // read-only
    'students.view',
    'courses.view',
    'classes.view',
    'attendance.view',
    'results.view',
    'notices.view',
    'fees.view',
  ],

  starter: [
    // inherits free (duplicated here to keep single-source list)
    'students.view',
    'courses.view',
    'classes.view',
    'attendance.view',
    'results.view',
    'notices.view',
    'fees.view',

    // ---- WRITE (Starter enables daily ops) ----
    // Students
    'students.create',
    'students.update',
    'students.delete',
    // Courses
    'courses.create',
    'courses.update',
    'courses.delete',
    // Classes
    'classes.create',
    'classes.update',
    'classes.delete',
    'classes.reschedule',
    // Attendance
    'attendance.record',
    'attendance.import',
    // Results
    'results.enter',
    'results.publish',
    'results.export',
    // Notices
    'notices.send',
    // Fees
    'fees.record_manual',
    'fees.export',
    // Org/Integrations
    'staff.invite',
    'org.manage',
    'settings.integrations',

    // ---- Basic portals ----
    'portal.parent',
    'portal.student',
  ],

  growth: [
    // inherits starter (duplicated for explicitness)
    'students.view',
    'courses.view',
    'classes.view',
    'attendance.view',
    'results.view',
    'notices.view',
    'fees.view',
    'students.create',
    'students.update',
    'students.delete',
    'courses.create',
    'courses.update',
    'courses.delete',
    'classes.create',
    'classes.update',
    'classes.delete',
    'classes.reschedule',
    'attendance.record',
    'attendance.import',
    'results.enter',
    'results.publish',
    'results.export',
    'notices.send',
    'fees.record_manual',
    'fees.export',
    'staff.invite',
    'org.manage',
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

/** Get the minimum plan required for a specific feature */
export function getMinPlanForFeature(feature: string): Plan | undefined {
  for (const plan of ['free', 'starter', 'growth'] as const) {
    if (FEATURES_BY_PLAN[plan].includes(feature)) return plan;
  }
  return undefined;
}

/** Check if a feature is available in a plan */
export function isFeatureAvailableInPlan(feature: string, plan: Plan): boolean {
  return getFeaturesForPlan(plan).includes(feature);
}
