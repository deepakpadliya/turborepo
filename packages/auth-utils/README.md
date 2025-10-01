# Auth Utils Package

Shared authentication utilities for the turborepo.

## Installation

```bash
# In your app's package.json
"@repo/auth-utils": "workspace:*"
```

## Usage

### Basic Setup

```typescript
import { AuthClient, authClient } from '@repo/auth-utils';

// Use default client
const user = await authClient.login({ email, password });

// Or create custom client
const customAuthClient = new AuthClient('https://your-auth-api.vercel.app');
```

### React Hook Usage

```typescript
import { useAuth } from '@repo/auth-utils';

function MyComponent() {
  const { client, isAuthenticated, token } = useAuth();
  
  const handleLogin = async () => {
    await client.login({ email, password });
  };
}
```

### Utilities

```typescript
import { 
  hasPermission, 
  isTokenExpired, 
  isValidEmail, 
  getPasswordStrength 
} from '@repo/auth-utils';

// Check permissions
if (hasPermission(user.permissions, 'admin:delete')) {
  // Allow delete action
}

// Validate data
if (!isValidEmail(email)) {
  // Show error
}

// Check password strength
const strength = getPasswordStrength(password); // 'weak' | 'medium' | 'strong'
```

## Environment Variables

Set in your frontend apps:

```bash
NEXT_PUBLIC_AUTH_API_URL=https://your-auth-service.vercel.app
```

## API Methods

- `login(credentials)` - Authenticate user
- `register(userData)` - Register new user  
- `getCurrentUser()` - Get current user profile
- `forgotPassword(email)` - Request password reset
- `resetPassword(token, newPassword)` - Reset password
- `logout()` - Clear authentication
- `authenticatedRequest(config)` - Make authenticated API calls