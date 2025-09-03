export type Plan = 'free' | 'starter' | 'growth' | 'scale' | 'enterprise';

export type Role =
  | 'owner'
  | 'admin'
  | 'teacher'
  | 'admissions'
  | 'finance'
  | 'parent'
  | 'student';

export type Capability = string;

export type GrantReason =
  | 'paid_addon'
  | 'trial'
  | 'promo'
  | 'contract'
  | 'support';

export interface FeatureGrant {
  id: string;
  feature: string;
  reason: GrantReason;
  granted_by?: string;
  starts_at: string;
  expires_at?: string;
  metadata?: Record<string, any>;
}

export interface AccessCheckResult {
  allowed: boolean;
  reason?: {
    neededPlan?: Plan;
    missingFeature?: string;
    missingCapability?: string;
    plan?: Plan;
    currentPlan?: Plan;
  };
}

/** Map each role to capability keys. Keep in sync with server/RLS. */
export const ROLE_CAPS: Record<Role, Capability[]> = {
  owner: ['*'], // or enumerate explicitly in the future
  admin: [
    // READ (route access)
    'students.view',
    'courses.view',
    'classes.view',
    'attendance.view',
    'results.view',
    'notices.view',
    'fees.view_overview',
    // WRITE / MGMT
    'courses.crud',
    'classes.crud',
    'classes.reschedule',
    'attendance.mark',
    'attendance.bulk_import',
    'results.enter',
    'results.publish',
    'results.export',
    'fees.record_manual',
    'fees.export',
    'staff.invite',
    'org.manage',
    'settings.integrations',
    // Growth / Enterprise (caps only; plan still gates)
    'analytics.view',
    'notices.analytics',
    'fees.online',
    'admissions.view',
    'audit.logs',
    'auth.sso',
    'settings.branding',
    'syllabus-advanced',
  ],
  teacher: [
    'classes.view',
    'classes.take_attendance',
    'results.enter',
    'notices.send',
    'students.view',
    'courses.view',
    'attendance.view',
    'attendance.mark',
    'results.view',
    'fees.view_overview',
    'notices.view',
  ],
  // Aligned admissions role capabilities with server
  admissions: [
    'students.view',
    'students.crud',
    'admissions.view',
    'admissions.crud',
  ],
  finance: [
    'fees.view_overview',
    'fees.structures.basic',
    'fees.record_manual',
    'fees.export',
    'fees.online',
    'fees.reconcile',
  ],
  parent: [
    'portal.parent',
    'students.view',
    'results.view',
    'attendance.view',
    'notices.view',
  ],
  student: [
    'portal.student',
    'courses.view',
    'results.view',
    'attendance.view',
    'notices.view',
  ],
};

// Plan rank for neededPlan enforcement
export const PLAN_RANKS: Record<Plan, number> = {
  free: 0,
  starter: 1,
  growth: 2,
  scale: 3,
  enterprise: 4,
};

// Add-on feature mapping (for UpgradeHint CTAs)
export const ADDON_FEATURES: Record<
  string,
  { label: string; price: string; description: string }
> = {
  'fees.online': {
    label: 'Online Payments',
    price: '$29/mo',
    description: 'Accept credit card and bank transfer payments online',
  },
  'fees.reminders.smswa': {
    label: 'SMS/WhatsApp Reminders',
    price: '$19/mo',
    description: 'Send automated payment reminders via SMS and WhatsApp',
  },
  'analytics.advanced': {
    label: 'Advanced Analytics',
    price: '$39/mo',
    description: 'Get detailed insights into your school performance',
  },
  'auth.sso': {
    label: 'Single Sign-On',
    price: '$49/mo',
    description: 'Integrate with your existing identity provider',
  },
  'audit.logs': {
    label: 'Audit Logs',
    price: '$29/mo',
    description: 'Track all system changes and user activities',
  },
  'settings.branding': {
    label: 'Custom Branding',
    price: '$39/mo',
    description: 'Customize your school portal with your branding',
  },
  'admissions.view': {
    label: 'Admissions Management',
    price: '$59/mo',
    description: 'Streamline your student admissions process',
  },
  'syllabus-advanced': {
    label: 'Advanced Curriculum',
    price: '$49/mo',
    description: 'Create and manage complex curriculum structures',
  },
};
