import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../features/auth/AuthContext';
import { Box, Text } from '@radix-ui/themes';
import RouteGuard from '../components/routing/RouteGuard';

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
import { ProfilePage } from '../pages/ProfilePage';

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

      {/* Core module routes */}
      <Route
        path="/students/:tab"
        element={
          <RouteGuard
            moduleKey="students:core"
            feature="students.view"
            cap="students.view"
          />
        }
      />

      <Route
        path="/courses/:tab"
        element={
          <RouteGuard
            moduleKey="courses:core"
            feature="courses.view"
            cap="courses.view"
          />
        }
      />

      <Route
        path="/classes/:tab"
        element={
          <RouteGuard
            moduleKey="classes:core"
            feature="classes.view"
            cap="classes.view"
          />
        }
      />

      <Route
        path="/attendance/:tab"
        element={
          <RouteGuard
            moduleKey="attendance:core"
            feature="attendance.view"
            cap="attendance.mark"
          />
        }
      />

      <Route
        path="/results/:tab"
        element={
          <RouteGuard
            moduleKey="results:core"
            feature="results.view"
            cap="results.enter"
          />
        }
      />

      <Route
        path="/notices/:tab"
        element={
          <RouteGuard
            moduleKey="notices:core"
            feature="notices.view"
            cap="notices.send"
          />
        }
      />

      <Route
        path="/instructors/:tab"
        element={
          <RouteGuard
            moduleKey="instructors:core"
            feature="staff.invite"
            cap="staff.invite"
          />
        }
      />

      <Route
        path="/fees/:tab"
        element={
          <RouteGuard
            moduleKey="fees:core"
            feature="fees.view_overview"
            cap="fees.record_manual"
          />
        }
      />

      <Route
        path="/admins/:tab"
        element={
          <RouteGuard
            moduleKey="admins:core"
            feature="staff.invite"
            cap="staff.invite"
          />
        }
      />

      <Route
        path="/organization/:tab"
        element={
          <RouteGuard
            moduleKey="organization:core"
            feature="org.manage"
            cap="org.manage"
          />
        }
      />

      <Route
        path="/settings/:tab"
        element={
          <RouteGuard
            moduleKey="settings:core"
            feature="settings.integrations"
            cap="settings.integrations"
          />
        }
      />

      {/* Additional utility routes */}
      <Route
        path="/profile"
        element={<ProtectedRoute element={<ProfilePage />} />}
      />
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
          <RouteGuard
            moduleKey="analytics:growth"
            feature="analytics.view"
            cap="analytics.view"
            neededPlan="growth"
          />
        }
      />
      <Route
        path="/parent-portal"
        element={
          <RouteGuard
            moduleKey="parent-portal:growth"
            feature="portal.parent"
            cap="portal.parent"
            neededPlan="growth"
          />
        }
      />
      <Route
        path="/notices-advanced"
        element={
          <RouteGuard
            moduleKey="notices-advanced:growth"
            feature="notices.analytics"
            cap="notices.analytics"
            neededPlan="growth"
          />
        }
      />
      <Route
        path="/join-codes"
        element={
          <RouteGuard
            moduleKey="join-codes:growth"
            feature="staff.invite"
            cap="staff.invite"
            neededPlan="growth"
          />
        }
      />
      <Route
        path="/payments-online"
        element={
          <RouteGuard
            moduleKey="payments-online:growth"
            feature="fees.online"
            cap="fees.online"
            neededPlan="growth"
          />
        }
      />

      {/* Enterprise module routes (lazy loaded) */}
      <Route
        path="/admissions"
        element={
          <RouteGuard
            moduleKey="admissions:enterprise"
            feature="admissions.view"
            cap="admissions.view"
            neededPlan="enterprise"
          />
        }
      />
      <Route
        path="/fees-advanced"
        element={
          <RouteGuard
            moduleKey="fees-advanced:enterprise"
            feature="fees.advanced"
            cap="fees.advanced"
            neededPlan="enterprise"
          />
        }
      />
      <Route
        path="/audit-logs"
        element={
          <RouteGuard
            moduleKey="audit-logs:enterprise"
            feature="audit.logs"
            cap="audit.logs"
            neededPlan="enterprise"
          />
        }
      />
      <Route
        path="/sso-saml"
        element={
          <RouteGuard
            moduleKey="sso-saml:enterprise"
            feature="auth.sso"
            cap="auth.sso"
            neededPlan="enterprise"
          />
        }
      />
      <Route
        path="/branding"
        element={
          <RouteGuard
            moduleKey="branding:enterprise"
            feature="settings.branding"
            cap="settings.branding"
            neededPlan="enterprise"
          />
        }
      />
      <Route
        path="/syllabus-advanced"
        element={
          <RouteGuard
            moduleKey="syllabus-advanced:enterprise"
            feature="syllabus.advanced"
            cap="syllabus.advanced"
            neededPlan="enterprise"
          />
        }
      />
      <Route
        path="/integrations"
        element={
          <RouteGuard
            moduleKey="integrations:enterprise"
            feature="integrations.view"
            cap="integrations.view"
            neededPlan="enterprise"
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
