#!/bin/bash

echo "Starting build error fix script..."

# 1. Clean npm cache and reinstall dependencies
echo "Step 1: Cleaning npm cache and reinstalling dependencies..."
npm cache clean --force
rm -rf node_modules package-lock.json
npm install

if [ $? -ne 0 ]; then
  echo "npm install failed. Attempting with --legacy-peer-deps..."
  npm install --legacy-peer-deps
  if [ $? -ne 0 ]; then
    echo "Error: npm install failed even with --legacy-peer-deps. Please check your network connection and npm logs."
    exit 1
  fi
fi
echo "Dependencies reinstalled successfully."

# 2. Clean Next.js build cache
echo "Step 2: Clearing Next.js build cache..."
rm -rf .next
echo "Next.js build cache cleared."

# 3. Run Prisma generate
echo "Step 3: Running Prisma generate..."
npx prisma generate
if [ $? -ne 0 ]; then
  echo "Error: Prisma generate failed. Check your Prisma schema."
  exit 1
fi
echo "Prisma client generated."

# 4. Run Prisma DB push to ensure schema is synchronized
echo "Step 4: Running Prisma DB push to synchronize schema..."
npx prisma db push

if [ $? -ne 0 ]; then
  echo "Error: Prisma DB push failed. Please ensure your DATABASE_URL is correctly set in your .env.local file and your database is accessible."
  exit 1
fi
echo "Prisma DB push completed successfully."

# 5. Attempt to build the Next.js project
echo "Step 5: Attempting to build the Next.js application..."
npm run build

if [ $? -ne 0 ]; then
  echo "Error: Next.js build failed. Please review the build errors in the output above for specific issues."
  echo "Common build issues include: syntax errors, missing imports, incorrect file paths, or environment variable problems."
  exit 1
fi
echo "Next.js application built successfully."

echo "Build error fix script finished. Your project should now be able to build."
echo "You can now try running 'npm run dev' to start the development server."
