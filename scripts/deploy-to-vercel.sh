#!/bin/bash

# Deployment script for Synapse Learning Pro to Vercel
# Run this script in the project root: /mnt/c/Users/LENOVO/Desktop/synapse-platform
# Usage: chmod +x scripts/deploy-to-vercel.sh && ./scripts/deploy-to-vercel.sh

set -e

echo "🚀 Deploying Synapse Learning Pro to Vercel..."

# Ensure Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
  echo "Installing Vercel CLI..."
  npm install -g vercel
fi

# Copy .env.local to .env if it exists
if [ -f ".env.local" ]; then
  cp .env.local .env
else
  echo "⚠️ .env.local not found. Please create it from .env.example and fill in your values."
  exit 1
fi

# Build and deploy
vercel --prod

echo "🎉 Deployment complete! Your app is live on Vercel."
