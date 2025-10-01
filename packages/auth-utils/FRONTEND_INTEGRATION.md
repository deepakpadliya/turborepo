# Frontend Integration Examples

## Next.js App Example

### 1. Install the auth utils package

```bash
# In your Next.js app directory
pnpm add @repo/auth-utils
```

### 2. Create environment variables

```bash
# .env.local
NEXT_PUBLIC_AUTH_API_URL=https://your-auth-service.vercel.app
```

### 3. Create auth context

```tsx
// contexts/AuthContext.tsx
'use client';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { AuthClient, User } from '@repo/auth-utils';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name?: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const authClient = new AuthClient();

  useEffect(() => {
    // Check if user is logged in on mount
    if (authClient.isAuthenticated()) {
      authClient.getCurrentUser()
        .then(setUser)
        .catch(() => authClient.clearToken())
        .finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, []);

  const login = async (email: string, password: string) => {
    const response = await authClient.login({ email, password });
    setUser(response.user);
  };

  const register = async (email: string, password: string, name?: string) => {
    await authClient.register({ email, password, name });
  };

  const logout = () => {
    authClient.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{
      user,
      login,
      register,
      logout,
      isLoading,
      isAuthenticated: !!user,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
```

### 4. Login component example

```tsx
// components/LoginForm.tsx
'use client';
import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

export function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        required
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        required
      />
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <button type="submit">Login</button>
    </form>
  );
}
```

### 5. Protected route component

```tsx
// components/ProtectedRoute.tsx
'use client';
import { useAuth } from '../contexts/AuthContext';
import { hasPermission } from '@repo/auth-utils';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredPermission?: string;
  fallback?: React.ReactNode;
}

export function ProtectedRoute({ 
  children, 
  requiredPermission, 
  fallback = <div>Access denied</div> 
}: ProtectedRouteProps) {
  const { user, isLoading } = useAuth();

  if (isLoading) return <div>Loading...</div>;
  if (!user) return <div>Please login</div>;
  
  if (requiredPermission && !hasPermission(user.permissions, requiredPermission)) {
    return fallback;
  }

  return <>{children}</>;
}
```

## React + Vite App Example

Same pattern but adjust imports and setup according to Vite configuration.

## Usage in layout/app

```tsx
// app/layout.tsx (Next.js) or main.tsx (Vite)
import { AuthProvider } from './contexts/AuthContext';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
```