/** Route registry with plan/feature gating & basic i18n keys */
export type RouteItem = {
  path: string;
  labelKey: string; // i18n key, e.g., 'nav.students'
  icon?: string; // your icon id/component mapping
  /** Feature flag needed to show the route at all */
  feature?: string;
  /** Capability needed to view the route content */
  cap?: string;
  module: 'core' | 'growth' | 'enterprise';
  /** Optional children for nested menus */
  children?: RouteItem[];
};

export const ROUTES: RouteItem[] = [
  {
    path: '/students',
    labelKey: 'nav.students',
    feature: 'students.view',
    cap: 'students.view',
    module: 'core',
  },
  {
    path: '/courses',
    labelKey: 'nav.courses',
    feature: 'courses.view',
    cap: 'courses.view',
    module: 'core',
  },
  {
    path: '/classes',
    labelKey: 'nav.classes',
    feature: 'classes.view',
    cap: 'classes.view',
    module: 'core',
  },
  {
    path: '/attendance',
    labelKey: 'labels.attendance',
    feature: 'attendance.view',
    cap: 'attendance.view',
    module: 'core',
  },
  {
    path: '/results',
    labelKey: 'labels.results',
    feature: 'results.view',
    cap: 'results.view',
    module: 'core',
  },
  {
    path: '/fees',
    labelKey: 'nav.fees',
    feature: 'fees.view_overview',
    cap: 'fees.view_overview',
    module: 'core',
  },

  // Growth
  {
    path: '/announcements',
    labelKey: 'nav.announcements',
    feature: 'notices.view',
    cap: 'notices.view',
    module: 'growth',
  },
  {
    path: '/analytics',
    labelKey: 'nav.analytics',
    feature: 'analytics.view',
    cap: 'analytics.view',
    module: 'growth',
  },
  {
    path: '/parents',
    labelKey: 'portal.parents',
    feature: 'portal.parent',
    cap: 'portal.parent',
    module: 'growth',
  },

  // Enterprise
  {
    path: '/admissions',
    labelKey: 'labels.admissions',
    feature: 'admissions.view',
    cap: 'admissions.view',
    module: 'enterprise',
  },
  {
    path: '/settings/sso',
    labelKey: 'labels.sso',
    feature: 'auth.sso',
    cap: 'auth.sso',
    module: 'enterprise',
  },

  // Basic settings
  {
    path: '/settings',
    labelKey: 'nav.settings',
    feature: 'org.manage',
    cap: 'org.manage',
    module: 'core',
  },
];
