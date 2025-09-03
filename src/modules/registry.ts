import { StudentsPage } from './core/Students/StudentsPage';
import { CoursesPage } from './core/Courses/CoursesPage';
import { ClassesPage } from './core/Classes/ClassesPage';
import { AttendancePage } from './core/Attendance/AttendancePage';
import { ResultPage } from './core/Result/ResultPage';
import { NoticePage } from './core/Notice/NoticePage';
import { InstructorsPage } from './core/Instructors/InstructorsPage';
import { FeePage } from './core/Fee/FeePage';
import { AdminsPage } from './core/AdminsPage';
import { OrganizationPage } from './core/OrganizationPage';
import { SettingsPage } from './core/SettingsPage';

// Growth modules
import AnalyticsPage from './growth/AnalyticsPage';
import ParentPortalPage from './growth/ParentPortalPage';
import NoticeBoardAdvancedPage from './growth/NoticeBoardAdvancedPage';
import JoinCodesPage from './growth/JoinCodesPage';
import PaymentsOnlinePage from './growth/PaymentsOnlinePage';

// Enterprise modules
import AdmissionsPage from './enterprise/Admission/AdmissionsPage';
import FeeAdvancedPage from './enterprise/FeeAdvancedPage';
import AuditLogsPage from './enterprise/AuditLogsPage';
import SSOSAMLPage from './enterprise/SSOSAMLPage';
import BrandingPage from './enterprise/BrandingPage';
import SyllabusAdvancedPage from './enterprise/Syllabus/SyllabusAdvancedPage';
import IntegrationsPage from './enterprise/IntegrationsPage';

export const MODULES = {
  // Core modules (eagerly loaded)
  'students:core': StudentsPage,
  'courses:core': CoursesPage,
  'classes:core': ClassesPage,
  'attendance:core': AttendancePage,
  'results:core': ResultPage,
  'notices:core': NoticePage,
  'instructors:core': InstructorsPage,
  'fees:core': FeePage,
  'admins:core': AdminsPage,
  'organization:core': OrganizationPage,
  'settings:core': SettingsPage,

  // Growth modules
  'analytics:growth': AnalyticsPage,
  'parent-portal:growth': ParentPortalPage,
  'notices-advanced:growth': NoticeBoardAdvancedPage,
  'join-codes:growth': JoinCodesPage,
  'payments-online:growth': PaymentsOnlinePage,

  // Enterprise modules
  'admissions:enterprise': AdmissionsPage,
  'fees-advanced:enterprise': FeeAdvancedPage,
  'audit-logs:enterprise': AuditLogsPage,
  'sso-saml:enterprise': SSOSAMLPage,
  'branding:enterprise': BrandingPage,
  'syllabus-advanced:enterprise': SyllabusAdvancedPage,
  'integrations:enterprise': IntegrationsPage,
} as const;

export type ModuleKey = keyof typeof MODULES;

/** Gets a component directly from the registry. */
export function getComponent(key: ModuleKey) {
  return MODULES[key];
}
