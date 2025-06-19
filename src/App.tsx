// No React import needed with new JSX transform
import { Theme } from '@radix-ui/themes';
import { AuthProvider } from 'features/auth/AuthContext';
import { ThemeProvider, useTheme } from 'contexts/ThemeContext';
import { AppRoutes } from 'router/Routes';
import { ToastProvider, ToastViewport } from 'components/ui/Toast';

function ThemedApp(): JSX.Element {
  const { theme } = useTheme();

  return (
    <Theme
      accentColor="blue"
      grayColor="slate"
      radius="medium"
      appearance={theme}
    >
      <ToastProvider swipeDirection="right">
        <AuthProvider>
          <AppRoutes />
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
