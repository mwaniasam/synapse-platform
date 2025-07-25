#!/bin/bash

echo "🚀 Starting Vercel deployment..."

# Install Vercel CLI if not installed
if ! command -v vercel &> /dev/null; then
    echo "Installing Vercel CLI..."
    npm install -g vercel
fi

# Build the project
echo "📦 Building project..."
npm run build

# Deploy to Vercel
echo "🌐 Deploying to Vercel..."
vercel --prod

echo "✅ Deployment complete!"
echo "🔗 Check your deployment at: https://your-project.vercel.app"
