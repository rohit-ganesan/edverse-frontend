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
        <Route
          path="/courses"
          element={
            <ProtectedRoute>
              <CoursesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/classes"
          element={
            <ProtectedRoute>
              <ClassesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/syllabus"
          element={
            <ProtectedRoute>
              <SyllabusPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/notice"
          element={
            <ProtectedRoute>
              <NoticePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admission"
          element={
            <ProtectedRoute>
              <AdmissionPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/attendance"
          element={
            <ProtectedRoute>
              <AttendancePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/fee"
          element={
            <ProtectedRoute>
              <FeePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/result"
          element={
            <ProtectedRoute>
              <ResultPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/instructors"
          element={
            <ProtectedRoute>
              <InstructorsPage />
            </ProtectedRoute>
          }
        />
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
        <Route
          path="/students"
          element={
            <ProtectedRoute>
              <StudentsPage />
            </ProtectedRoute>
          }
        />
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
        <Route
          path="/whats-new"
          element={
            <ProtectedRoute>
              <WhatsNewPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/organization"
          element={
            <ProtectedRoute>
              <OrganizationPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admins"
          element={
            <ProtectedRoute>
              <AdminsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/support"
          element={
            <ProtectedRoute>
              <SupportPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <SettingsPage />
            </ProtectedRoute>
          }
        />

        {/* Redirect root to dashboard */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        {/* Catch all route - redirect to dashboard */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
