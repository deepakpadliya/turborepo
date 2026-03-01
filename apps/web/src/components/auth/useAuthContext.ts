import { useContext } from 'react';
import { AuthContext } from './authContext.shared';
import type { AuthContextValue } from './authContext.shared';

export const useAuthContext = (): AuthContextValue => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used inside AuthProvider');
  }
  return context;
};
