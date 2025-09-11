import { Routes, Route, Navigate } from 'react-router-dom';
import { RouteGuard } from '../components/routing/RouteGuard';
import OnboardingGate from '../components/OnboardingGate';

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
import { OnboardingPage } from '../pages/OnboardingPage';

// Protected routes component with OnboardingGate
function ProtectedRoutes() {
  return (
    <OnboardingGate>
      <Routes>
        {/* Onboarding route */}
        <Route path="/onboarding" element={<OnboardingPage />} />

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
              cap="attendance.record"
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
              feature="fees.view"
              cap="fees.view"
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
          element={
            <RouteGuard>
              <ProfilePage />
            </RouteGuard>
          }
        />
        <Route
          path="/test"
          element={
            <RouteGuard>
              <IntegrationTestPage />
            </RouteGuard>
          }
        />
        <Route
          path="/whats-new"
          element={
            <RouteGuard>
              <WhatsNewPage />
            </RouteGuard>
          }
        />
        <Route
          path="/support"
          element={
            <RouteGuard>
              <SupportPage />
            </RouteGuard>
          }
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
              feature="settings.integrations"
              cap="settings.integrations"
              neededPlan="enterprise"
            />
          }
        />

        {/* Dashboard as default */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route
          path="/dashboard"
          element={
            <RouteGuard>
              <DashboardPage />
            </RouteGuard>
          }
        />

        {/* Catch all */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </OnboardingGate>
  );
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

      {/* All protected routes with OnboardingGate */}
      <Route path="/*" element={<ProtectedRoutes />} />
    </Routes>
  );
}
