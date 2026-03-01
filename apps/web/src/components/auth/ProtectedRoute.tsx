import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router';
import { StateMessage } from '@repo/ui';
import { useAuthContext } from './useAuthContext';

const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuthContext();
  const location = useLocation();

  if (isLoading) {
    return <StateMessage>Checking session...</StateMessage>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth" state={{ from: location.pathname }} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
