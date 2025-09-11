export type Plan = 'free' | 'starter' | 'growth' | 'scale' | 'enterprise';

export type Role =
  | 'owner'
  | 'admin'
  | 'teacher'
  | 'admissions'
  | 'finance'
  | 'parent'
  | 'student';

// If you want strong typing you can keep Capability = string,
// or derive a union from these constants via `as const` tricks.
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

/** Canonical capabilities by domain (flat list for easy diffing) */
export const CANON_CAPS = [
  // Students
  'students.view',
  'students.create',
  'students.update',
  'students.delete',

  // Courses
  'courses.view',
  'courses.create',
  'courses.update',
  'courses.delete',

  // Classes
  'classes.view',
  'classes.create',
  'classes.update',
  'classes.delete',
  'classes.reschedule',

  // Attendance
  'attendance.view',
  'attendance.record',
  'attendance.import',

  // Results / Grades
  'results.view',
  'results.enter',
  'results.publish',
  'results.export',

  // Notices / Messaging
  'notices.view',
  'notices.send',
  'notices.analytics',

  // Fees / Finance
  'fees.view',
  'fees.structures.basic',
  'fees.record_manual',
  'fees.export',
  'fees.online',
  'fees.reconcile',

  // Staff / Org / Settings
  'staff.invite',
  'org.manage',
  'settings.integrations',
  'settings.branding',

  // Analytics
  'analytics.view',
  'analytics.advanced',

  // Admissions
  'admissions.view',
  'admissions.create',
  'admissions.update',
  'admissions.delete',

  // Security / Compliance
  'audit.logs',
  'auth.sso',

  // Curriculum
  'syllabus.advanced',

  // Portals (scoped)
  'portal.parent',
  'portal.parent.attendance.view',
  'portal.parent.results.view',
  'portal.parent.notices.view',
  'portal.student',
  'portal.student.courses.view',
  'portal.student.results.view',
  'portal.student.attendance.view',
  'portal.student.notices.view',
] as const;

/** Map each role to capability keys. Keep in sync with server/RLS. */
export const ROLE_CAPS: Record<Role, Capability[]> = {
  owner: ['*'],

  admin: [
    // Students
    'students.view',
    'students.create',
    'students.update',
    'students.delete',
    // Courses
    'courses.view',
    'courses.create',
    'courses.update',
    'courses.delete',
    // Classes
    'classes.view',
    'classes.create',
    'classes.update',
    'classes.delete',
    'classes.reschedule',
    // Attendance
    'attendance.view',
    'attendance.record',
    'attendance.import',
    // Results
    'results.view',
    'results.enter',
    'results.publish',
    'results.export',
    // Notices
    'notices.view',
    'notices.send',
    'notices.analytics',
    // Fees
    'fees.view',
    'fees.structures.basic',
    'fees.record_manual',
    'fees.export',
    'fees.online',
    'fees.reconcile',
    // Admin ops
    'staff.invite',
    'org.manage',
    'settings.integrations',
    'settings.branding',
    // Analytics
    'analytics.view',
    'analytics.advanced',
    // Admissions
    'admissions.view',
    'admissions.create',
    'admissions.update',
    'admissions.delete',
    // Security / compliance
    'audit.logs',
    'auth.sso',
    // Curriculum
    'syllabus.advanced',
  ],

  teacher: [
    'classes.view',
    'attendance.view',
    'attendance.record',
    'results.view',
    'results.enter',
    'notices.view',
    'notices.send',
    'students.view',
    'courses.view',
    'fees.view',
  ],

  admissions: [
    'admissions.view',
    'admissions.create',
    'admissions.update',
    'admissions.delete',
    'students.view',
    'students.create',
    'students.update',
  ],

  finance: [
    'fees.view',
    'fees.structures.basic',
    'fees.record_manual',
    'fees.export',
    'fees.online', // plan/add-on gated
    'fees.reconcile', // usually enterprise
  ],

  parent: [
    'portal.parent',
    'portal.parent.attendance.view',
    'portal.parent.results.view',
    'portal.parent.notices.view',
  ],

  student: [
    'portal.student',
    'portal.student.courses.view',
    'portal.student.results.view',
    'portal.student.attendance.view',
    'portal.student.notices.view',
  ],
};

export const PLAN_RANKS: Record<Plan, number> = {
  free: 0,
  starter: 1,
  growth: 2,
  scale: 3,
  enterprise: 4,
};

export const ADDON_FEATURES = {
  'fees.online': {
    label: 'Online Payments',
    price: '$29/mo',
    description: 'Accept credit cards & bank transfers',
  },
  'fees.reminders.smswa': {
    label: 'SMS/WhatsApp Reminders',
    price: '$19/mo',
    description: 'Automated payment reminders',
  },
  'analytics.advanced': {
    label: 'Advanced Analytics',
    price: '$39/mo',
    description: 'Deeper insights & dashboards',
  },
  'auth.sso': {
    label: 'Single Sign-On',
    price: '$49/mo',
    description: 'Use your IdP (SAML/OIDC)',
  },
  'audit.logs': {
    label: 'Audit Logs',
    price: '$29/mo',
    description: 'Track changes & activity',
  },
  'settings.branding': {
    label: 'Custom Branding',
    price: '$39/mo',
    description: 'White-label the portal',
  },
  'admissions.view': {
    label: 'Admissions Management',
    price: '$59/mo',
    description: 'Streamline your student admissions process',
  },
  'syllabus.advanced': {
    label: 'Advanced Curriculum',
    price: '$49/mo',
    description: 'Complex curriculum structures',
  },
} as const;
