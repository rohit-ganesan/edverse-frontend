import { BrowserRouter } from 'react-router-dom';
import AppRoutesComponent from './AppRoutes';

export function AppRoutes(): JSX.Element {
  return (
    <BrowserRouter>
      <AppRoutesComponent />
    </BrowserRouter>
  );
}
