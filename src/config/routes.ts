/** Route registry with plan/feature gating & basic i18n keys */
export type RouteItem = {
  path: string;
  labelKey: string; // i18n key, e.g., 'nav.students'
  icon?: string; // your icon id/component mapping
  /** Feature flag needed to show the route at all */
  feature?: string;
  /** Capability needed to view the route content */
  cap?: string;
  /** Minimum plan required for this route */
  neededPlan?: 'free' | 'starter' | 'growth' | 'scale' | 'enterprise';
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
    neededPlan: 'free',
    module: 'core',
  },
  {
    path: '/courses',
    labelKey: 'nav.courses',
    feature: 'courses.view',
    cap: 'courses.view',
    neededPlan: 'free',
    module: 'core',
  },
  {
    path: '/classes',
    labelKey: 'nav.classes',
    feature: 'classes.view',
    cap: 'classes.view',
    neededPlan: 'free',
    module: 'core',
  },
  {
    path: '/attendance',
    labelKey: 'labels.attendance',
    feature: 'attendance.view',
    cap: 'attendance.view',
    neededPlan: 'free',
    module: 'core',
  },
  {
    path: '/results',
    labelKey: 'labels.results',
    feature: 'results.view',
    cap: 'results.view',
    neededPlan: 'free',
    module: 'core',
  },
  {
    path: '/fees',
    labelKey: 'nav.fees',
    feature: 'fees.view_overview',
    cap: 'fees.view_overview',
    neededPlan: 'free',
    module: 'core',
  },

  // Growth
  {
    path: '/announcements',
    labelKey: 'nav.announcements',
    feature: 'notices.view',
    cap: 'notices.view',
    neededPlan: 'free',
    module: 'growth',
  },
  {
    path: '/analytics',
    labelKey: 'nav.analytics',
    feature: 'analytics.view',
    cap: 'analytics.view',
    neededPlan: 'growth',
    module: 'growth',
  },
  {
    path: '/parents',
    labelKey: 'portal.parents',
    feature: 'portal.parent',
    cap: 'portal.parent',
    neededPlan: 'growth',
    module: 'growth',
  },
  {
    path: '/payments-online',
    labelKey: 'nav.online_payments',
    feature: 'fees.online',
    cap: 'fees.online',
    neededPlan: 'growth',
    module: 'growth',
  },

  // Scale
  {
    path: '/fees-advanced',
    labelKey: 'nav.advanced_fees',
    feature: 'fees.reconcile',
    cap: 'fees.reconcile',
    neededPlan: 'scale',
    module: 'enterprise',
  },
  {
    path: '/settings/sso',
    labelKey: 'labels.sso',
    feature: 'auth.sso',
    cap: 'auth.sso',
    neededPlan: 'scale',
    module: 'enterprise',
  },

  // Enterprise
  {
    path: '/admissions',
    labelKey: 'labels.admissions',
    feature: 'admissions.view',
    cap: 'admissions.view',
    neededPlan: 'enterprise',
    module: 'enterprise',
  },
  {
    path: '/settings/branding',
    labelKey: 'nav.branding',
    feature: 'settings.branding',
    cap: 'settings.branding',
    neededPlan: 'enterprise',
    module: 'enterprise',
  },

  // Basic settings
  {
    path: '/settings',
    labelKey: 'nav.settings',
    feature: 'org.manage',
    cap: 'org.manage',
    neededPlan: 'free',
    module: 'core',
  },
];
