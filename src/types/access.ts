// src/types/access.ts
export type Plan = 'free' | 'starter' | 'growth';

export type Role =
  | 'owner'
  | 'admin'
  | 'teacher'
  | 'finance'
  | 'parent'
  | 'student';

export type Capability = string;

export interface AccessCheckResult {
  allowed: boolean;
  reason?: {
    neededPlan?: Plan;
    missingFeature?: string;
    missingCapability?: string;
    currentPlan?: Plan;
  };
}

// Uniform CRUD verbs: view | create | update | delete | manage | export | publish | reconcile | import | invite | brand

// IMPORTANT: ROLE_CAPS is plan-agnostic. Plan gating MUST be enforced via features/neededPlan.
// Do NOT put analytics.view (or other plan-gated features) here. Use features per plan.
/** Role → capabilities (RBAC). Keep synced with RLS/Edge. */
export const ROLE_CAPS: Record<Role, Capability[]> = {
  owner: [
    // All Admin capabilities plus billing rights (explicit list ensures plan-gating still works)
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
    // Fees
    'fees.view',
    'fees.record_manual',
    'fees.export',
    // Admin ops
    'staff.invite',
    'org.manage',
    'settings.integrations',
    // Owner-only
    'billing.manage',
  ],

  admin: [
    // READ
    'students.view',
    'courses.view',
    'classes.view',
    'attendance.view',
    'results.view',
    'notices.view',
    'fees.view',
    // WRITE / MGMT
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
    'fees.record_manual',
    'fees.export',
    'staff.invite',
    'org.manage',
    'settings.integrations',
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

  finance: ['fees.view', 'fees.record_manual', 'fees.export'],

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
};
