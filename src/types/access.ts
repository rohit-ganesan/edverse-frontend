// src/types/access.ts
// Simplified access types for core 5 features: Teachers, Students, Classes, Attendance, Fees

export type Plan = 'free' | 'starter' | 'growth';

export type Role = 'owner' | 'admin' | 'teacher' | 'finance';

export type Capability =
  // Teachers
  | 'teachers.view'
  | 'teachers.create'
  | 'teachers.update'
  | 'teachers.delete'
  // Students
  | 'students.view'
  | 'students.create'
  | 'students.update'
  | 'students.delete'
  // Classes
  | 'classes.view'
  | 'classes.create'
  | 'classes.update'
  | 'classes.delete'
  | 'classes.reschedule'
  // Attendance
  | 'attendance.view'
  | 'attendance.record'
  | 'attendance.import'
  // Fees
  | 'fees.view'
  | 'fees.record_manual'
  | 'fees.export'
  // Owner-only
  | 'billing.manage';

export interface AccessCheckResult {
  allowed: boolean;
  reason?: {
    neededPlan?: Plan;
    missingFeature?: string;
    missingCapability?: string;
    currentPlan?: Plan;
  };
}

// IMPORTANT: ROLE_CAPS is plan-agnostic. Plan gating MUST be enforced via features/neededPlan.
// Do NOT put plan-gated features here. Use features per plan.
/** Role → capabilities (RBAC). Plan gating handled via features. */
export const ROLE_CAPS: Record<Role, Capability[]> = {
  owner: [
    // Teachers
    'teachers.view',
    'teachers.create',
    'teachers.update',
    'teachers.delete',
    // Students
    'students.view',
    'students.create',
    'students.update',
    'students.delete',
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
    // Fees
    'fees.view',
    'fees.record_manual',
    'fees.export',
    // Owner-only
    'billing.manage',
  ],

  admin: [
    // Teachers
    'teachers.view',
    'teachers.create',
    'teachers.update',
    'teachers.delete',
    // Students
    'students.view',
    'students.create',
    'students.update',
    'students.delete',
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
    // Fees
    'fees.view',
    'fees.record_manual',
    'fees.export',
  ],

  teacher: [
    'classes.view',
    'attendance.view',
    'attendance.record',
    'students.view',
    'fees.view',
  ],

  finance: ['fees.view', 'fees.record_manual', 'fees.export'],
};

export const PLAN_RANKS: Record<Plan, number> = {
  free: 0,
  starter: 1,
  growth: 2,
};
