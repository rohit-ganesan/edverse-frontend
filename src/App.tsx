// No React import needed with new JSX transform
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import { Theme } from '@radix-ui/themes';
import { AuthProvider } from 'features/auth/AuthContext';
import { ProtectedRoute } from 'components/ProtectedRoute';
import { LoginPage } from 'pages/LoginPage';
import { SignUpPage } from 'pages/SignUpPage';
import { DashboardPage } from 'pages/DashboardPage';
import { DebugPage } from 'pages/DebugPage';

function App(): JSX.Element {
  return (
    <Theme accentColor="blue" grayColor="slate" radius="medium">
      <AuthProvider>
        <Router>
          <div className="App">
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignUpPage />} />
              <Route path="/debug" element={<DebugPage />} />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <DashboardPage />
                  </ProtectedRoute>
                }
              />
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </div>
        </Router>
      </AuthProvider>
    </Theme>
  );
}

export default App;
