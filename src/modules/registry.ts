import React from 'react';

type Loader = () => Promise<{ default: React.ComponentType<any> }>;

export const MODULES: Record<string, Loader> = {
  // Core modules (eagerly loaded)
  'students:core': () =>
    import('./core').then((m) => ({ default: m.StudentsPage })),
  'courses:core': () =>
    import('./core').then((m) => ({ default: m.CoursesPage })),
  'classes:core': () =>
    import('./core').then((m) => ({ default: m.ClassesPage })),
  'attendance:core': () =>
    import('./core').then((m) => ({ default: m.AttendancePage })),
  'results:core': () =>
    import('./core').then((m) => ({ default: m.ResultPage })),
  'notices:core': () =>
    import('./core').then((m) => ({ default: m.NoticePage })),
  'instructors:core': () =>
    import('./core').then((m) => ({ default: m.InstructorsPage })),
  'fees:core': () => import('./core').then((m) => ({ default: m.FeePage })),
  'admins:core': () =>
    import('./core').then((m) => ({ default: m.AdminsPage })),
  'organization:core': () =>
    import('./core').then((m) => ({ default: m.OrganizationPage })),
  'settings:core': () =>
    import('./core').then((m) => ({ default: m.SettingsPage })),

  // Growth modules (lazy loaded)
  'analytics:growth': () => import('./growth/AnalyticsPage'),
  'parent-portal:growth': () => import('./growth/ParentPortalPage'),
  'notices-advanced:growth': () => import('./growth/NoticeBoardAdvancedPage'),
  'join-codes:growth': () => import('./growth/JoinCodesPage'),
  'payments-online:growth': () => import('./growth/PaymentsOnlinePage'),

  // Enterprise modules (lazy loaded)
  'admissions:enterprise': () =>
    import('./enterprise/Admission/AdmissionsPage'),
  'fees-advanced:enterprise': () => import('./enterprise/FeeAdvancedPage'),
  'audit-logs:enterprise': () => import('./enterprise/AuditLogsPage'),
  'sso-saml:enterprise': () => import('./enterprise/SSOSAMLPage'),
  'branding:enterprise': () => import('./enterprise/BrandingPage'),
  'syllabus-advanced:enterprise': () =>
    import('./enterprise/Syllabus/SyllabusAdvancedPage'),
  'integrations:enterprise': () => import('./enterprise/IntegrationsPage'),
};

/** Creates a stable lazy component from a registry key. */
export function lazyFromRegistry(key: keyof typeof MODULES) {
  const loader = MODULES[key];
  // React.lazy is called here (top-level when module is imported), not conditionally in render.
  return React.lazy(loader);
}
