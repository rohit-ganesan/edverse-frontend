import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from 'components/ProtectedRoute';
import { LoginPage } from 'pages/LoginPage';
import { SignUpPage } from 'pages/SignUpPage';
import { DashboardPage } from 'pages/DashboardPage';
import { CoursesPage } from 'pages/Courses';
import { AcademicsPage } from 'pages/AcademicsPage';
import { ClassesPage } from 'pages/Classes';
import { SyllabusPage } from 'pages/Syllabus';
import { NoticePage } from 'pages/Notice';
import { AdmissionPage } from 'pages/Admission';
import { AttendancePage } from 'pages/Attendance';
import { FeePage } from 'pages/Fee';
import { ResultPage } from 'pages/Result';
import { InstructorsPage } from 'pages/Instructors';
import { StudentsPage } from 'pages/Students';
import { AddInstructorPage } from 'pages/Instructors/AddInstructorPage';
import { AddStudentPage } from 'pages/Students/AddStudentPage';
import { ViewInstructorPage } from 'pages/Instructors/ViewInstructorPage';
import { ViewStudentPage } from 'pages/Students/ViewStudentPage';
import { EditInstructorPage } from 'pages/Instructors/EditInstructorPage';
import { EditStudentPage } from 'pages/Students/EditStudentPage';
import { ProfilePage } from 'pages/ProfilePage';
import { DebugPage } from 'pages/DebugPage';
import { TestPage } from 'pages/TestPage';
import { WhatsNewPage } from 'pages/WhatsNewPage';
import { OrganizationPage } from 'pages/OrganizationPage';
import { AdminsPage } from 'pages/AdminsPage';
import { SupportPage } from 'pages/SupportPage';
import { SettingsPage } from 'pages/SettingsPage';

export function AppRoutes(): JSX.Element {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/debug" element={<DebugPage />} />

        {/* Protected routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/academics"
          element={
            <ProtectedRoute>
              <AcademicsPage />
            </ProtectedRoute>
          }
        />

        {/* Courses routes with tabs */}
        <Route
          path="/courses/:tab"
          element={
            <ProtectedRoute>
              <CoursesPage />
            </ProtectedRoute>
          }
        />

        {/* Classes routes with tabs */}
        <Route
          path="/classes/:tab"
          element={
            <ProtectedRoute>
              <ClassesPage />
            </ProtectedRoute>
          }
        />

        {/* Syllabus routes with tabs */}
        <Route
          path="/syllabus/:tab"
          element={
            <ProtectedRoute>
              <SyllabusPage />
            </ProtectedRoute>
          }
        />

        {/* Notice routes with tabs */}
        <Route
          path="/notice/:tab"
          element={
            <ProtectedRoute>
              <NoticePage />
            </ProtectedRoute>
          }
        />

        {/* Admission routes with tabs */}
        <Route
          path="/admission/:tab"
          element={
            <ProtectedRoute>
              <AdmissionPage />
            </ProtectedRoute>
          }
        />

        {/* Attendance routes with tabs */}
        <Route
          path="/attendance/:tab"
          element={
            <ProtectedRoute>
              <AttendancePage />
            </ProtectedRoute>
          }
        />

        {/* Fee routes with tabs */}
        <Route
          path="/fee/:tab"
          element={
            <ProtectedRoute>
              <FeePage />
            </ProtectedRoute>
          }
        />

        {/* Result routes with tabs */}
        <Route
          path="/result/:tab"
          element={
            <ProtectedRoute>
              <ResultPage />
            </ProtectedRoute>
          }
        />

        {/* Instructors routes with tabs */}
        <Route
          path="/instructors/:tab"
          element={
            <ProtectedRoute>
              <InstructorsPage />
            </ProtectedRoute>
          }
        />

        {/* Students routes with tabs */}
        <Route
          path="/students/:tab"
          element={
            <ProtectedRoute>
              <StudentsPage />
            </ProtectedRoute>
          }
        />

        {/* WhatsNew routes with tabs */}
        <Route
          path="/whats-new/:tab"
          element={
            <ProtectedRoute>
              <WhatsNewPage />
            </ProtectedRoute>
          }
        />

        {/* Organization routes with tabs */}
        <Route
          path="/organization/:tab"
          element={
            <ProtectedRoute>
              <OrganizationPage />
            </ProtectedRoute>
          }
        />

        {/* Admins routes with tabs */}
        <Route
          path="/admins/:tab"
          element={
            <ProtectedRoute>
              <AdminsPage />
            </ProtectedRoute>
          }
        />

        {/* Support routes with tabs */}
        <Route
          path="/support/:tab"
          element={
            <ProtectedRoute>
              <SupportPage />
            </ProtectedRoute>
          }
        />

        {/* Settings routes with tabs */}
        <Route
          path="/settings/:tab"
          element={
            <ProtectedRoute>
              <SettingsPage />
            </ProtectedRoute>
          }
        />

        {/* Individual instructor management routes */}
        <Route
          path="/add-instructor"
          element={
            <ProtectedRoute>
              <AddInstructorPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/view-instructor"
          element={
            <ProtectedRoute>
              <ViewInstructorPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/edit-instructor"
          element={
            <ProtectedRoute>
              <EditInstructorPage />
            </ProtectedRoute>
          }
        />

        {/* Individual student management routes */}
        <Route
          path="/add-student"
          element={
            <ProtectedRoute>
              <AddStudentPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/view-student"
          element={
            <ProtectedRoute>
              <ViewStudentPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/edit-student"
          element={
            <ProtectedRoute>
              <EditStudentPage />
            </ProtectedRoute>
          }
        />

        {/* Other routes */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/test"
          element={
            <ProtectedRoute>
              <TestPage />
            </ProtectedRoute>
          }
        />

        {/* Default redirect */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        {/* Catch all route */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
