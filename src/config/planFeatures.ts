// src/config/planFeatures.ts
// Simplified plan features for core 5 features: Teachers, Students, Classes, Attendance, Fees

import type { Plan } from '../types/access';

// NOTE: Features gate PLAN access. Caps gate ROLE ability.
// UI must check BOTH when rendering write controls.
// Free: view-only. Starter: daily ops. Growth: Starter + online payments, SMS.

export const FEATURES_BY_PLAN: Record<Plan, string[]> = {
  free: [
    // View-only access to core 5 features
    'teachers.view',
    'students.view',
    'classes.view',
    'attendance.view',
    'fees.view',
  ],

  starter: [
    // View
    'teachers.view',
    'students.view',
    'classes.view',
    'attendance.view',
    'fees.view',
    // CRUD
    'teachers.create',
    'teachers.update',
    'teachers.delete',
    'students.create',
    'students.update',
    'students.delete',
    'classes.create',
    'classes.update',
    'classes.delete',
    'classes.reschedule',
    'attendance.record',
    'attendance.import',
    'fees.record_manual',
    'fees.export',
  ],

  growth: [
    // All Starter features
    'teachers.view',
    'teachers.create',
    'teachers.update',
    'teachers.delete',
    'students.view',
    'students.create',
    'students.update',
    'students.delete',
    'classes.view',
    'classes.create',
    'classes.update',
    'classes.delete',
    'classes.reschedule',
    'attendance.view',
    'attendance.record',
    'attendance.import',
    'fees.view',
    'fees.record_manual',
    'fees.export',
    // Growth-only
    'fees.online_payment',
    'fees.sms_reminders',
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
