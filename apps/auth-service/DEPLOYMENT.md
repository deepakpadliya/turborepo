# Auth Service - Vercel Deployment Guide

## ✅ Deployment Readiness Checklist

### Required Files
- [x] `vercel.json` - Vercel configuration
- [x] `api/index.js` - Serverless entry point
- [x] `src/serverless.ts` - NestJS serverless handler
- [x] `package.json` - Dependencies and scripts
- [x] `tsconfig.build.json` - TypeScript build config

### Environment Variables (Set in Vercel Dashboard)
```bash
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/authdb
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRES_IN=3600s
RESET_TOKEN_EXPIRES_MIN=60

SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-gmail@gmail.com
SMTP_PASS=your-app-password
EMAIL_FROM="Auth Service <noreply@yourdomain.com>"

SEED_ADMIN_EMAIL=admin@yourdomain.com
SEED_ADMIN_PASSWORD=SecureAdminPassword123!
FRONTEND_URL=https://your-frontend-app.vercel.app
```

### Deployment Steps
1. **Set up MongoDB Atlas** (cloud MongoDB)
2. **Configure environment variables** in Vercel dashboard
3. **Run build** locally: `npm run build`
4. **Deploy to Vercel**: `vercel --prod`

### API Endpoints
- `GET /` - Health check
- `POST /auth/login` - User login
- `POST /auth/me` - Get current user
- `POST /users/register` - User registration
- `GET /api/docs` - Swagger API documentation

### Notes
- The app will automatically build on Vercel
- Swagger docs available at `/api/docs`
- MongoDB connection required for functionality
- SMTP configuration needed for password reset emails