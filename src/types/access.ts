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

/** Map each role to capability keys. Keep in sync with server/RLS. */
export const ROLE_CAPS: Record<Role, Capability[]> = {
  owner: ['*'], // or enumerate explicitly in the future
  admin: [
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
  ],
  teacher: [
    'classes.view',
    'classes.take_attendance',
    'results.enter',
    'notices.send',
  ],
  admissions: ['admissions.view', 'admissions.stages', 'admissions.templates'],
  finance: [
    'fees.view_overview',
    'fees.structures.basic',
    'fees.record_manual',
    'fees.export',
  ],
  parent: ['portal.parent'],
  student: ['portal.student'],
};
