import { useMemo, useState } from 'react';
import type { FormEvent } from 'react';
import { Navigate, useLocation } from 'react-router';
import { Alert, Button, Input } from '@repo/ui';
import { getPasswordStrength, isValidEmail } from '@repo/auth-utils';
import { useAuthContext } from './useAuthContext';
import './AuthPage.scss';

type AuthMode = 'signin' | 'signup';

const AuthPage = () => {
  const location = useLocation();
  const { isAuthenticated, login, signup } = useAuthContext();

  const [mode, setMode] = useState<AuthMode>('signin');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const passwordStrength = useMemo(() => getPasswordStrength(password), [password]);
  const fromPath = ((location.state as { from?: string } | null)?.from) ?? '/forms';

  if (isAuthenticated) {
    return <Navigate to={fromPath} replace />;
  }

  const resetErrors = () => {
    if (error) setError(null);
  };

  const validate = (): boolean => {
    if (!isValidEmail(email)) {
      setError('Please enter a valid email address.');
      return false;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return false;
    }

    if (mode === 'signup') {
      if (!name.trim()) {
        setError('Name is required for sign up.');
        return false;
      }

      if (password !== confirmPassword) {
        setError('Password and confirm password do not match.');
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    resetErrors();

    if (!validate()) return;

    setSubmitting(true);
    try {
      if (mode === 'signin') {
        await login(email.trim(), password);
      } else {
        await signup(name.trim(), email.trim(), password);
      }
    } catch (authError) {
      setError(authError instanceof Error ? authError.message : 'Authentication failed.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>{mode === 'signin' ? 'Sign In' : 'Create Account'}</h1>
        <p>{mode === 'signin' ? 'Sign in to continue to FormBuilder.' : 'Create an account to start building forms.'}</p>

        <div className="auth-mode-switch" role="tablist" aria-label="Authentication mode">
          <button
            type="button"
            className={mode === 'signin' ? 'active' : ''}
            onClick={() => {
              setMode('signin');
              setConfirmPassword('');
              setError(null);
            }}
          >
            Sign In
          </button>
          <button
            type="button"
            className={mode === 'signup' ? 'active' : ''}
            onClick={() => {
              setMode('signup');
              setError(null);
            }}
          >
            Sign Up
          </button>
        </div>

        {error ? <Alert variant="error">{error}</Alert> : null}

        <form onSubmit={handleSubmit} className="auth-form">
          {mode === 'signup' ? (
            <Input
              label="Name"
              value={name}
              onChange={(event) => {
                resetErrors();
                setName(event.target.value);
              }}
              placeholder="Your full name"
              autoComplete="name"
            />
          ) : null}

          <Input
            label="Email"
            type="email"
            value={email}
            onChange={(event) => {
              resetErrors();
              setEmail(event.target.value);
            }}
            placeholder="you@example.com"
            autoComplete="email"
          />

          <Input
            label="Password"
            type="password"
            value={password}
            onChange={(event) => {
              resetErrors();
              setPassword(event.target.value);
            }}
            placeholder="••••••••"
            autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
          />

          {mode === 'signup' ? (
            <>
              <Input
                label="Confirm Password"
                type="password"
                value={confirmPassword}
                onChange={(event) => {
                  resetErrors();
                  setConfirmPassword(event.target.value);
                }}
                placeholder="••••••••"
                autoComplete="new-password"
              />
              <div className={`password-strength ${passwordStrength}`}>Password strength: {passwordStrength}</div>
            </>
          ) : null}

          <Button type="submit" disabled={submitting}>
            {submitting ? 'Please wait...' : mode === 'signin' ? 'Sign In' : 'Create Account'}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default AuthPage;
