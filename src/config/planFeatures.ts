export const PLAN_FEATURES: Record<
  'free' | 'starter' | 'growth' | 'scale' | 'enterprise',
  string[]
> = {
  free: [
    'attendance.view',
    'attendance.mark',
    'results.view',
    'classes.view',
    'courses.view',
    'students.view',
    'fees.view_overview',
    'fees.structures.basic',
    'fees.record_manual',
    'notices.view',
    'notices.send',
    'org.manage',
    'staff.invite',
    'settings.integrations',
  ],
  starter: [
    'attendance.bulk_import',
    'results.enter',
    'results.export',
    'classes.crud',
    'classes.reschedule',
    'courses.crud',
    'courses.export',
    'students.crud',
    'analytics.view',
  ],
  growth: [
    'fees.online',
    'fees.reminders.email',
    'notices.analytics',
    'analytics.view',
    'portal.parent',
    'api.read',
  ],
  scale: [
    'auth.sso',
    'audit.logs',
    'fees.reminders.smswa',
    'fees.reconcile',
    'api.rw',
  ],
  enterprise: [
    'settings.branding',
    'admissions.view',
    'admissions.stages',
    'admissions.templates',
  ],
};

/**
 * Get all features for a plan (including features from lower tiers)
 */
export function getFeaturesForPlan(plan: keyof typeof PLAN_FEATURES): string[] {
  const planOrder = ['free', 'starter', 'growth', 'scale', 'enterprise'];
  const planIndex = planOrder.indexOf(plan);

  if (planIndex === -1) return PLAN_FEATURES.free;

  const features = new Set<string>();

  // Include features from current plan and all lower tiers
  for (let i = 0; i <= planIndex; i++) {
    const tierPlan = planOrder[i] as keyof typeof PLAN_FEATURES;
    PLAN_FEATURES[tierPlan].forEach((feature) => features.add(feature));
  }

  return Array.from(features);
}

/**
 * Get the minimum plan required for a specific feature
 */
export function getMinPlanForFeature(
  feature: string
): keyof typeof PLAN_FEATURES | null {
  for (const plan of [
    'free',
    'starter',
    'growth',
    'scale',
    'enterprise',
  ] as const) {
    if (PLAN_FEATURES[plan].includes(feature)) {
      return plan;
    }
  }
  return null;
}
