#!/bin/bash

# More accurate Vercel build simulation
echo "🔄 Simulating EXACT Vercel build conditions..."

# Set environment variables like Vercel
export NODE_ENV=production
export CI=true
export VERCEL=1

# Clean everything completely
echo "🧹 Complete cleanup..."
rm -rf node_modules
rm -rf packages/*/node_modules  
rm -rf apps/*/node_modules
rm -rf packages/*/dist
rm -rf apps/*/dist
rm -rf packages/*/.next
rm -rf apps/*/.next
rm -rf .turbo

# Use exact Vercel install command
echo "📦 Installing with exact Vercel command..."
pnpm install --frozen-lockfile --prefer-frozen-lockfile

# Test just the UI package with strict settings
echo "🔨 Testing UI package with strict TypeScript..."
cd packages/ui

# Test each build command individually
echo "  Testing ESM build..."
npx tsc -p tsconfig.esm.json --strict --noErrorTruncation

echo "  Testing CJS build..."  
npx tsc -p tsconfig.cjs.json --strict --noErrorTruncation

echo "  Testing Types build..."
npx tsc -p tsconfig.types.json --strict --noErrorTruncation

# Try the actual build
echo "  Running full UI build..."
pnpm build

if [ $? -eq 0 ]; then
    echo "✅ UI package build successful"
else
    echo "❌ UI package build failed - this matches Vercel error!"
    exit 1
fi

cd ../..

echo "🎉 Vercel simulation completed!"