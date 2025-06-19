// No React import needed with new JSX transform
import { Theme } from '@radix-ui/themes';
import { AuthProvider } from 'features/auth/AuthContext';
import { AppRoutes } from 'router/Routes';
import { ToastProvider, ToastViewport } from 'components/ui/Toast';

function App(): JSX.Element {
  return (
    <Theme accentColor="blue" grayColor="slate" radius="medium">
      <ToastProvider swipeDirection="right">
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
        <ToastViewport />
      </ToastProvider>
    </Theme>
  );
}

export default App;
