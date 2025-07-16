#!/bin/bash

echo "Attempting to fix common build and dependency errors..."

# Clean npm cache
echo "Cleaning npm cache..."
npm cache clean --force

# Remove node_modules and package-lock.json
echo "Removing node_modules and package-lock.json..."
rm -rf node_modules
rm -f package-lock.json

# Reinstall dependencies
echo "Reinstalling npm dependencies..."
npm install

if [ $? -ne 0 ]; then
  echo "npm install failed. Please check your network connection or npm setup."
  exit 1
fi

# Run Prisma generate to ensure client is up-to-date
echo "Running Prisma generate..."
npx prisma generate

if [ $? -ne 0 ]; then
  echo "Prisma generate failed. Check your Prisma schema."
  exit 1
fi

echo "Common error fixes applied. Please try running 'npm run dev' again."
