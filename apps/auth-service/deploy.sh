#!/bin/bash

# Vercel Deployment Script for auth-service
echo "🚀 Deploying auth-service to Vercel..."

# Navigate to auth-service directory
cd /Users/padliyad/learning/turborepo/apps/auth-service

# Build the project first
echo "📦 Building project..."
npm run build

# Deploy to Vercel
echo "🌐 Deploying to Vercel..."
vercel --prod

echo "✅ Deployment complete!"
echo "📋 Next steps:"
echo "1. Set up environment variables in Vercel dashboard"
echo "2. Set up MongoDB Atlas database"
echo "3. Test your API endpoints"