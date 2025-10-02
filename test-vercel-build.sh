#!/bin/bash

# Simulate Vercel build process
echo "🔄 Simulating Vercel build process..."

# Clean everything
echo "🧹 Cleaning all build artifacts..."
rm -rf node_modules packages/*/node_modules apps/*/node_modules
rm -rf packages/*/dist apps/*/dist

# Install with frozen lockfile (like Vercel)
echo "📦 Installing dependencies with frozen lockfile..."
pnpm install --frozen-lockfile

# Build only the UI package first (like Vercel does)
echo "🔨 Building UI package..."
cd packages/ui
pnpm build

# Check if build succeeded
if [ $? -eq 0 ]; then
    echo "✅ UI package build successful"
else
    echo "❌ UI package build failed"
    exit 1
fi

cd ../..

# Build everything
echo "🔨 Building entire turborepo..."
pnpm build

if [ $? -eq 0 ]; then
    echo "✅ Full build successful"
else
    echo "❌ Full build failed"
    exit 1
fi

echo "🎉 All builds completed successfully!"