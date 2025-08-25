import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ROUTES } from '../config/routes';
import { useFeature, useCan } from '../context/AccessContext';
import { Box, Text } from '@radix-ui/themes';

// Lazy load modules
const GrowthModule = lazy(() => import('../modules/growth'));
const EnterpriseModule = lazy(() => import('../modules/enterprise'));

// Loading component
function LoadingSpinner({ message }: { message: string }) {
  return (
    <Box className="flex items-center justify-center h-64">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <Text className="text-gray-600">{message}</Text>
      </div>
    </Box>
  );
}

function GuardedRoute({
  element,
  feature,
  cap,
}: {
  element: React.ReactNode;
  feature?: string;
  cap?: string;
}) {
  const hasFeature = useFeature(feature || '');
  const hasCap = useCan(cap || '');

  const okFeature = !feature || hasFeature;
  const okCap = !cap || hasCap;

  if (!okFeature || !okCap) {
    return <Navigate to="/billing" replace />;
  }
  return <>{element}</>;
}

function ModuleLoader({
  module,
  feature,
  cap,
}: {
  module: 'growth' | 'enterprise';
  feature?: string;
  cap?: string;
}) {
  const hasFeature = useFeature(feature || '');
  const hasCap = useCan(cap || '');

  if (!hasFeature || !hasCap) {
    return <Navigate to="/billing" replace />;
  }

  const ModuleComponent = module === 'growth' ? GrowthModule : EnterpriseModule;

  return (
    <Suspense
      fallback={<LoadingSpinner message={`Loading ${module} features...`} />}
    >
      <ModuleComponent />
    </Suspense>
  );
}

// Placeholder components for core modules
const StudentsPlaceholder = () => (
  <div className="p-6">Students Page (Core Module)</div>
);
const CoursesPlaceholder = () => (
  <div className="p-6">Courses Page (Core Module)</div>
);
const ClassesPlaceholder = () => (
  <div className="p-6">Classes Page (Core Module)</div>
);
const AttendancePlaceholder = () => (
  <div className="p-6">Attendance Page (Core Module)</div>
);
const ResultsPlaceholder = () => (
  <div className="p-6">Results Page (Core Module)</div>
);
const NoticesPlaceholder = () => (
  <div className="p-6">Notices Page (Core Module)</div>
);
const InstructorsPlaceholder = () => (
  <div className="p-6">Teachers Page (Core Module)</div>
);
const FeesPlaceholder = () => (
  <div className="p-6">Fees Page (Core Module)</div>
);
const AdminsPlaceholder = () => (
  <div className="p-6">Admins Page (Core Module)</div>
);
const OrganizationPlaceholder = () => (
  <div className="p-6">School Page (Core Module)</div>
);
const SettingsPlaceholder = () => (
  <div className="p-6">Settings Page (Core Module)</div>
);

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<div>Login Page</div>} />
      <Route path="/signup" element={<div>Sign Up Page</div>} />
      <Route
        path="/forgot-password"
        element={<div>Forgot Password Page</div>}
      />
      <Route path="/reset-password" element={<div>Reset Password Page</div>} />
      <Route path="/auth/callback" element={<div>Auth Callback Page</div>} />
      <Route path="/auth/verify" element={<div>Email Verification Page</div>} />
      <Route path="/billing" element={<div>Billing Page</div>} />

      {/* Core module routes (eagerly loaded) */}
      <Route
        path="/students"
        element={
          <GuardedRoute
            feature="students.view"
            cap="students.view"
            element={<StudentsPlaceholder />}
          />
        }
      />
      <Route
        path="/courses"
        element={
          <GuardedRoute
            feature="courses.view"
            cap="courses.view"
            element={<CoursesPlaceholder />}
          />
        }
      />
      <Route
        path="/classes"
        element={
          <GuardedRoute
            feature="classes.view"
            cap="classes.view"
            element={<ClassesPlaceholder />}
          />
        }
      />
      <Route
        path="/attendance"
        element={
          <GuardedRoute
            feature="attendance.view"
            cap="attendance.view"
            element={<AttendancePlaceholder />}
          />
        }
      />
      <Route
        path="/results"
        element={
          <GuardedRoute
            feature="results.view"
            cap="results.view"
            element={<ResultsPlaceholder />}
          />
        }
      />
      <Route
        path="/notices"
        element={
          <GuardedRoute
            feature="notices.view"
            cap="notices.view"
            element={<NoticesPlaceholder />}
          />
        }
      />
      <Route
        path="/instructors"
        element={
          <GuardedRoute
            feature="instructors.view"
            cap="instructors.view"
            element={<InstructorsPlaceholder />}
          />
        }
      />
      <Route
        path="/fees"
        element={
          <GuardedRoute
            feature="fees.view_overview"
            cap="fees.view_overview"
            element={<FeesPlaceholder />}
          />
        }
      />
      <Route
        path="/admins"
        element={
          <GuardedRoute
            feature="staff.invite"
            cap="staff.invite"
            element={<AdminsPlaceholder />}
          />
        }
      />
      <Route
        path="/organization"
        element={
          <GuardedRoute
            feature="org.manage"
            cap="org.manage"
            element={<OrganizationPlaceholder />}
          />
        }
      />
      <Route
        path="/settings"
        element={
          <GuardedRoute
            feature="settings.integrations"
            cap="settings.integrations"
            element={<SettingsPlaceholder />}
          />
        }
      />

      {/* Growth module routes (lazy loaded) */}
      <Route
        path="/analytics"
        element={
          <ModuleLoader
            module="growth"
            feature="analytics.view"
            cap="analytics.view"
          />
        }
      />
      <Route
        path="/parent-portal"
        element={
          <ModuleLoader
            module="growth"
            feature="portal.parent"
            cap="portal.parent"
          />
        }
      />
      <Route
        path="/notices-advanced"
        element={
          <ModuleLoader
            module="growth"
            feature="notices.analytics"
            cap="notices.analytics"
          />
        }
      />
      <Route
        path="/join-codes"
        element={
          <ModuleLoader
            module="growth"
            feature="staff.invite"
            cap="staff.invite"
          />
        }
      />
      <Route
        path="/payments-online"
        element={
          <ModuleLoader
            module="growth"
            feature="fees.online"
            cap="fees.online"
          />
        }
      />

      {/* Enterprise module routes (lazy loaded) */}
      <Route
        path="/admissions"
        element={
          <ModuleLoader
            module="enterprise"
            feature="admissions.view"
            cap="admissions.view"
          />
        }
      />
      <Route
        path="/fees-advanced"
        element={
          <ModuleLoader
            module="enterprise"
            feature="fees.advanced"
            cap="fees.advanced"
          />
        }
      />
      <Route
        path="/audit-logs"
        element={
          <ModuleLoader
            module="enterprise"
            feature="audit.logs"
            cap="audit.logs"
          />
        }
      />
      <Route
        path="/sso-saml"
        element={
          <ModuleLoader module="enterprise" feature="auth.sso" cap="auth.sso" />
        }
      />
      <Route
        path="/branding"
        element={
          <ModuleLoader
            module="enterprise"
            feature="settings.branding"
            cap="settings.branding"
          />
        }
      />
      <Route
        path="/syllabus-advanced"
        element={
          <ModuleLoader
            module="enterprise"
            feature="syllabus.advanced"
            cap="syllabus.advanced"
          />
        }
      />
      <Route
        path="/integrations"
        element={
          <ModuleLoader
            module="enterprise"
            feature="integrations.view"
            cap="integrations.view"
          />
        }
      />

      {/* Dashboard as default */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="/dashboard" element={<div>Dashboard Page</div>} />

      {/* Catch all */}
      <Route path="*" element={<Navigate to="/students" replace />} />
    </Routes>
  );
}
