export const PLAN_FEATURES: Record<
  'free' | 'starter' | 'growth' | 'scale' | 'enterprise',
  string[]
> = {
  free: [
    'students.view',
    'courses.view',
    'classes.view',
    'attendance.view',
    'attendance.mark',
    'results.view',
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
    'analytics.basic',
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
    'fees.reconcile', // Canonical advanced fees feature
    'fees.reminders.smswa',
    'api.rw',
  ],
  enterprise: [
    'settings.branding',
    'admissions.view',
    'syllabus-advanced',
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

/**
 * Check if a feature is available in a plan (including inherited features)
 */
export function isFeatureAvailableInPlan(
  feature: string,
  plan: keyof typeof PLAN_FEATURES
): boolean {
  const planFeatures = getFeaturesForPlan(plan);
  return planFeatures.includes(feature);
}

/**
 * Get features that are add-ons (not included in any plan)
 * These must be purchased separately
 */
export const ADDON_ONLY_FEATURES = [
  'analytics.advanced', // More advanced than basic analytics
  'fees.reminders.smswa', // SMS/WhatsApp reminders
  'auth.sso', // SSO integration
  'audit.logs', // Audit logging
  'settings.branding', // Custom branding
  'admissions.view', // Admissions management
  'syllabus-advanced', // Advanced curriculum
];
