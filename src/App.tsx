// No React import needed with new JSX transform
import { Theme } from '@radix-ui/themes';
import { AuthProvider } from 'features/auth/AuthContext';
import { AccessProvider } from 'context/AccessContext';
import { ThemeProvider, useTheme } from 'contexts/ThemeContext';
import { AppRoutes } from 'router/Routes';
import { ToastProvider, ToastViewport } from 'components/ui/Toast';

function ThemedApp(): JSX.Element {
  const themeContext = useTheme();

  // Defensive check for theme context
  if (!themeContext) {
    console.error('ThemedApp: Theme context is not available');
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-xl font-semibold text-gray-900 mb-2">
            Loading Application...
          </h1>
          <p className="text-gray-600">
            Please wait while we initialize the theme system.
          </p>
        </div>
      </div>
    );
  }

  const { theme } = themeContext;

  return (
    <Theme
      accentColor="blue"
      grayColor="slate"
      radius="medium"
      appearance={theme || 'light'}
    >
      <ToastProvider swipeDirection="right">
        <AuthProvider>
          <AccessProvider>
            <AppRoutes />
          </AccessProvider>
        </AuthProvider>
        <ToastViewport />
      </ToastProvider>
    </Theme>
  );
}

function App(): JSX.Element {
  return (
    <ThemeProvider>
      <ThemedApp />
    </ThemeProvider>
  );
}

export default App;
