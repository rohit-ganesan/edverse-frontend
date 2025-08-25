import { BrowserRouter } from 'react-router-dom';
import { ProtectedRoute } from 'components/ProtectedRoute';
import AppRoutesComponent from './AppRoutes';

export function AppRoutes(): JSX.Element {
  return (
    <BrowserRouter>
      <ProtectedRoute>
        <AppRoutesComponent />
      </ProtectedRoute>
    </BrowserRouter>
  );
}
