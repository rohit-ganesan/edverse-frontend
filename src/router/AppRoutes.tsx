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
// Students - standalone pages
import {
  ViewStudentPage,
  AddStudentPage,
  EditStudentPage,
} from '../modules/core/Students';
// Instructors - standalone pages
import {
  ViewInstructorPage,
  AddInstructorPage,
  EditInstructorPage,
} from '../modules/core/Instructors';
// Students - detail placeholders
import { StudentAttendancePage } from 'modules/core/Students/StudentAttendancePage';
import { StudentAcademicsPage } from 'modules/core/Students/StudentAcademicsPage';
import { StudentGradesPage } from 'modules/core/Students/StudentGradesPage';
import { StudentFeesPage } from 'modules/core/Students/StudentFeesPage';
import { StudentFeeCollectPage } from 'modules/core/Students/StudentFeeCollectPage';
// Attendance - mark placeholder
import { AttendanceMarkPage } from 'modules/core/Attendance/AttendanceMarkPage';
// Instructors - performance placeholder
import { InstructorPerformancePage } from 'modules/core/Instructors/InstructorPerformancePage';

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

        {/* Redirect bare paths to overview tabs */}
        <Route
          path="/students"
          element={<Navigate to="/students/overview" replace />}
        />
        <Route
          path="/instructors"
          element={<Navigate to="/instructors/overview" replace />}
        />

        {/* Students standalone pages */}
        <Route
          path="/students/view-student"
          element={
            <RouteGuard
              feature="students.view"
              cap="students.view"
              routePath="/students/view-student"
            >
              <ViewStudentPage />
            </RouteGuard>
          }
        />
        <Route
          path="/students/add-student"
          element={
            <RouteGuard
              feature="students.view"
              cap="students.create"
              neededPlan="starter"
              routePath="/students/add-student"
            >
              <AddStudentPage />
            </RouteGuard>
          }
        />
        <Route
          path="/students/edit-student"
          element={
            <RouteGuard
              feature="students.view"
              cap="students.update"
              neededPlan="starter"
              routePath="/students/edit-student"
            >
              <EditStudentPage />
            </RouteGuard>
          }
        />

        {/* Students detail routes */}
        <Route
          path="/students/:id/attendance"
          element={
            <RouteGuard
              feature="attendance.view"
              cap="attendance.view"
              routePath="/students/:id/attendance"
            >
              <StudentAttendancePage />
            </RouteGuard>
          }
        />
        <Route
          path="/students/:id/academics"
          element={
            <RouteGuard
              feature="results.view"
              cap="results.view"
              routePath="/students/:id/academics"
            >
              <StudentAcademicsPage />
            </RouteGuard>
          }
        />
        <Route
          path="/students/:id/grades"
          element={
            <RouteGuard
              feature="results.view"
              cap="results.view"
              routePath="/students/:id/grades"
            >
              <StudentGradesPage />
            </RouteGuard>
          }
        />
        <Route
          path="/students/:id/fees"
          element={
            <RouteGuard
              feature="fees.view"
              cap="fees.view"
              routePath="/students/:id/fees"
            >
              <StudentFeesPage />
            </RouteGuard>
          }
        />
        <Route
          path="/students/:id/fees/collect"
          element={
            <RouteGuard
              feature="fees.view"
              cap="fees.record_manual"
              neededPlan="starter"
              routePath="/students/:id/fees/collect"
            >
              <StudentFeeCollectPage />
            </RouteGuard>
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
              cap="attendance.view"
            />
          }
        />

        {/* Attendance mark */}
        <Route
          path="/attendance/mark"
          element={
            <RouteGuard
              feature="attendance.view"
              cap="attendance.record"
              neededPlan="starter"
              routePath="/attendance/mark"
            >
              <AttendanceMarkPage />
            </RouteGuard>
          }
        />

        <Route
          path="/results/:tab"
          element={
            <RouteGuard
              moduleKey="results:core"
              feature="results.view"
              cap="results.view"
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

        {/* Instructors standalone pages */}
        <Route
          path="/instructors/view-instructor"
          element={
            <RouteGuard
              feature="staff.invite"
              cap="staff.invite"
              routePath="/instructors/view-instructor"
            >
              <ViewInstructorPage />
            </RouteGuard>
          }
        />
        <Route
          path="/instructors/add-instructor"
          element={
            <RouteGuard
              feature="staff.invite"
              cap="staff.invite"
              neededPlan="starter"
              routePath="/instructors/add-instructor"
            >
              <AddInstructorPage />
            </RouteGuard>
          }
        />
        <Route
          path="/instructors/edit-instructor"
          element={
            <RouteGuard
              feature="staff.invite"
              cap="staff.invite"
              neededPlan="starter"
              routePath="/instructors/edit-instructor"
            >
              <EditInstructorPage />
            </RouteGuard>
          }
        />
        <Route
          path="/instructors/:id/performance"
          element={
            <RouteGuard
              feature="analytics.view"
              neededPlan="growth"
              routePath="/instructors/:id/performance"
            >
              <InstructorPerformancePage />
            </RouteGuard>
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

        {/* Growth module routes (lazy loaded) - MVP: Only Analytics */}
        <Route
          path="/analytics"
          element={
            <RouteGuard
              moduleKey="analytics:growth"
              feature="analytics.view"
              neededPlan="growth"
            />
          }
        />

        {/* TODO: Post-MVP - Add parent portal, advanced notices, etc. */}
        {/* 
      <Route path="/parent-portal" ... />
      <Route path="/notices-advanced" ... />
      <Route path="/payments-online" ... />
      */}

        {/* TODO: Post-MVP - Enterprise features */}
        {/*
      <Route path="/admissions" ... />
      <Route path="/fees-advanced" ... />
      <Route path="/audit-logs" ... />
      <Route path="/sso-saml" ... />
      <Route path="/branding" ... />
      <Route path="/syllabus-advanced" ... />
      <Route path="/integrations" ... />
      */}

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
