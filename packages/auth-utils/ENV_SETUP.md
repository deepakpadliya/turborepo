# Auth Utils - Environment Setup Guide

## 🔧 Environment Variable Setup

### For Next.js Apps
```bash
# .env.local
NEXT_PUBLIC_AUTH_API_URL=https://your-auth-service.vercel.app
```

### For Vite Apps
```bash
# .env.local
VITE_AUTH_API_URL=https://your-auth-service.vercel.app
```

### For other environments
```bash
# .env
AUTH_API_URL=https://your-auth-service.vercel.app
```

## 💡 Usage Examples

### Manual URL (Recommended for production)
```typescript
import { AuthClient } from '@repo/auth-utils';

// Explicitly set the URL
const authClient = new AuthClient('https://your-auth-service.vercel.app');
```

### Environment Variable
```typescript
import { AuthClient } from '@repo/auth-utils';

// Auto-detect from environment
const authClient = new AuthClient(); // Falls back to localhost:4000
```

### Conditional URL
```typescript
import { AuthClient } from '@repo/auth-utils';

const apiUrl = process.env.NODE_ENV === 'production' 
  ? 'https://your-auth-service.vercel.app'
  : 'http://localhost:4000';

const authClient = new AuthClient(apiUrl);
```

## 🚀 Best Practice for Production

Always pass the URL explicitly in production deployments:

```typescript
const authClient = new AuthClient(
  process.env.NODE_ENV === 'production' 
    ? 'https://your-auth-service.vercel.app'
    : 'http://localhost:4000'
);
```