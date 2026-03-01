import { useCallback, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { AuthClient, isTokenExpired } from '@repo/auth-utils';
import { AuthContext } from './authContext.shared';
import type { AuthContextValue, AuthUser } from './authContext.shared';

const authApiBaseUrl =
  (import.meta.env.VITE_AUTH_API_URL as string | undefined) ||
  (import.meta.env.VITE_AUTH_SERVICE_URL as string | undefined) ||
  'http://localhost:3000';

const authClient = new AuthClient(authApiBaseUrl);

const normalizeUser = (rawUser: unknown): AuthUser => {
  const data = (rawUser ?? {}) as Record<string, unknown>;

  return {
    id: String(data.userId ?? data.id ?? ''),
    email: String(data.email ?? ''),
    name: typeof data.name === 'string' ? data.name : undefined,
    roles: Array.isArray(data.roles) ? data.roles.map((role) => String(role)) : [],
  };
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchCurrentUser = useCallback(async () => {
    const token = authClient.getToken();
    if (!token || isTokenExpired(token)) {
      authClient.clearToken();
      setUser(null);
      setIsLoading(false);
      return;
    }

    try {
      const currentUser = await authClient.getCurrentUser();
      setUser(normalizeUser(currentUser));
    } catch {
      authClient.clearToken();
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCurrentUser();
  }, [fetchCurrentUser]);

  const login = useCallback(async (email: string, password: string) => {
    await authClient.login({ email, password });
    const currentUser = await authClient.getCurrentUser();
    setUser(normalizeUser(currentUser));
  }, []);

  const signup = useCallback(async (name: string, email: string, password: string) => {
    await authClient.register({ name, email, password });
    await login(email, password);
  }, [login]);

  const logout = useCallback(() => {
    authClient.logout();
    setUser(null);
  }, []);

  const contextValue = useMemo<AuthContextValue>(() => ({
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    signup,
    logout,
  }), [isLoading, login, logout, signup, user]);

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
};
