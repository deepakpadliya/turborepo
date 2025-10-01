/**
 * JWT token utilities
 */
export const decodeJwt = (token: string) => {
  try {
    const base64Url = token.split('.')[1];
    if (!base64Url) return null;
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
};

export const isTokenExpired = (token: string): boolean => {
  const decoded = decodeJwt(token);
  if (!decoded || !decoded.exp) return true;
  return Date.now() >= decoded.exp * 1000;
};

/**
 * Permission utilities
 */
export const hasPermission = (userPermissions: string[], requiredPermission: string): boolean => {
  if (userPermissions.includes('*')) return true; // Admin has all permissions
  return userPermissions.includes(requiredPermission);
};

export const hasAnyPermission = (userPermissions: string[], requiredPermissions: string[]): boolean => {
  if (userPermissions.includes('*')) return true;
  return requiredPermissions.some(permission => userPermissions.includes(permission));
};

export const hasAllPermissions = (userPermissions: string[], requiredPermissions: string[]): boolean => {
  if (userPermissions.includes('*')) return true;
  return requiredPermissions.every(permission => userPermissions.includes(permission));
};

/**
 * Role utilities
 */
export const hasRole = (userRoles: string[], requiredRole: string): boolean => {
  return userRoles.includes(requiredRole);
};

export const hasAnyRole = (userRoles: string[], requiredRoles: string[]): boolean => {
  return requiredRoles.some(role => userRoles.includes(role));
};

/**
 * Validation utilities
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const isValidPassword = (password: string): boolean => {
  // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
  return passwordRegex.test(password);
};

export const getPasswordStrength = (password: string): 'weak' | 'medium' | 'strong' => {
  if (password.length < 8) return 'weak';
  
  let score = 0;
  if (/[a-z]/.test(password)) score++; // lowercase
  if (/[A-Z]/.test(password)) score++; // uppercase
  if (/\d/.test(password)) score++; // numbers
  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score++; // special chars
  if (password.length >= 12) score++; // length
  
  if (score <= 2) return 'weak';
  if (score <= 4) return 'medium';
  return 'strong';
};