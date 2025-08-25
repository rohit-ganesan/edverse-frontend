import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate, Link } from 'react-router-dom';
// Route registry temporarily disabled
// import { ROUTES } from '../config/routes';
import { useFeature, useCan, useAccess } from '../context/AccessContext';
import { useAuth } from '../features/auth/AuthContext';
import { Box, Text } from '@radix-ui/themes';

// Import core module components
import {
  StudentsPage,
  CoursesPage,
  ClassesPage,
  AttendancePage,
  ResultPage,
  NoticePage,
  InstructorsPage,
  FeePage,
  AdminsPage,
  OrganizationPage,
  SettingsPage,
} from '../modules/core';

// Import Dashboard page
import { DashboardPage } from '../pages/DashboardPage';

// Import public route components
import { LoginPage } from '../pages/LoginPage';
import { SignUpPage } from '../pages/SignUpPage';
import { ForgotPasswordPage } from '../pages/ForgotPasswordPage';
import { ResetPasswordPage } from '../pages/ResetPasswordPage';
import AuthCallbackPage from '../pages/AuthCallbackPage';
import { BillingPage } from '../pages/BillingPage';
import { EmailVerificationPage } from '../pages/EmailVerificationPage';
import { IntegrationTestPage } from '../pages/IntegrationTestPage';
import { WhatsNewPage } from '../pages/WhatsNewPage';
import { SupportPage } from '../pages/SupportPage';

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

// Simple route protection that only checks authentication
function ProtectedRoute({ element }: { element: React.ReactNode }) {
  const { user, loading: authLoading } = useAuth();

  // Show loading while auth is being checked
  if (authLoading) {
    return <LoadingSpinner message="Checking authentication..." />;
  }

  // Redirect to login if not authenticated
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{element}</>;
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
  const { user, loading: authLoading } = useAuth();

  // Show loading while auth is being checked
  if (authLoading) {
    return <LoadingSpinner message="Checking authentication..." />;
  }

  // Redirect to login if not authenticated
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // TODO: Re-enable access checks once we implement proper hook handling
  // For now, just return the element without access checks
  // This prevents infinite loops and hook rule violations
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
  const { user, loading: authLoading } = useAuth();

  // Show loading while auth is being checked
  if (authLoading) {
    return <LoadingSpinner message="Checking authentication..." />;
  }

  // Redirect to login if not authenticated
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // TODO: Re-enable access checks once we implement proper hook handling
  // For now, just load the module without access checks
  // This prevents infinite loops and hook rule violations
  const ModuleComponent = module === 'growth' ? GrowthModule : EnterpriseModule;

  return (
    <Suspense
      fallback={<LoadingSpinner message={`Loading ${module} features...`} />}
    >
      <ModuleComponent />
    </Suspense>
  );
}

// Core module components are now imported from modules/core

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignUpPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />
      <Route path="/auth/callback" element={<AuthCallbackPage />} />
      <Route path="/auth/verify" element={<EmailVerificationPage />} />
      <Route path="/billing" element={<BillingPage />} />

      {/* Core module routes (eagerly loaded) */}
      <Route
        path="/students/:tab"
        element={
          <GuardedRoute
            feature="students.view"
            cap="students.view"
            element={<StudentsPage />}
          />
        }
      />
      <Route
        path="/courses/:tab"
        element={
          <GuardedRoute
            feature="courses.view"
            cap="courses.view"
            element={<CoursesPage />}
          />
        }
      />
      <Route
        path="/classes/:tab"
        element={
          <GuardedRoute
            feature="classes.view"
            cap="classes.view"
            element={<ClassesPage />}
          />
        }
      />
      <Route
        path="/attendance/:tab"
        element={
          <GuardedRoute
            feature="attendance.view"
            cap="attendance.view"
            element={<AttendancePage />}
          />
        }
      />
      <Route
        path="/results/:tab"
        element={
          <GuardedRoute
            feature="results.view"
            cap="results.view"
            element={<ResultPage />}
          />
        }
      />
      <Route
        path="/notices/:tab"
        element={
          <GuardedRoute
            feature="notices.view"
            cap="notices.view"
            element={<NoticePage />}
          />
        }
      />
      <Route
        path="/instructors/:tab"
        element={
          <GuardedRoute
            feature="instructors.view"
            cap="instructors.view"
            element={<InstructorsPage />}
          />
        }
      />
      <Route
        path="/fees/:tab"
        element={
          <GuardedRoute
            feature="fees.view_overview"
            cap="fees.view_overview"
            element={<FeePage />}
          />
        }
      />
      <Route
        path="/admins/:tab"
        element={
          <GuardedRoute
            feature="staff.invite"
            cap="staff.invite"
            element={<AdminsPage />}
          />
        }
      />
      <Route
        path="/organization/:tab"
        element={
          <GuardedRoute
            feature="org.manage"
            cap="org.manage"
            element={<OrganizationPage />}
          />
        }
      />
      <Route
        path="/settings/:tab"
        element={
          <GuardedRoute
            feature="settings.integrations"
            cap="settings.integrations"
            element={<SettingsPage />}
          />
        }
      />

      {/* Additional utility routes */}
      <Route
        path="/test"
        element={<ProtectedRoute element={<IntegrationTestPage />} />}
      />
      <Route
        path="/whats-new"
        element={<ProtectedRoute element={<WhatsNewPage />} />}
      />
      <Route
        path="/support"
        element={<ProtectedRoute element={<SupportPage />} />}
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
      <Route
        path="/dashboard"
        element={<ProtectedRoute element={<DashboardPage />} />}
      />

      {/* Catch all */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}
