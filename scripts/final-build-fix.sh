#!/bin/bash

echo "Starting final build fix for Synapse platform..."

# 1. Clean npm cache and reinstall dependencies
echo "Step 1: Cleaning npm cache and reinstalling dependencies..."
npm cache clean --force
rm -rf node_modules
rm -f package-lock.json
npm install
if [ $? -ne 0 ]; then
  echo "Error: npm install failed. Please check your network connection or npm setup."
  exit 1
fi
echo "Dependencies reinstalled successfully."

# 2. Run Prisma commands
echo "Step 2: Running Prisma database push and generate..."
npx prisma db push --skip-generate
if [ $? -ne 0 ]; then
  echo "Error: Prisma db push failed. Ensure your DATABASE_URL is correct and database is accessible."
  exit 1
fi
npx prisma generate
if [ $? -ne 0 ]; then
  echo "Error: Prisma generate failed."
  exit 1
fi
echo "Prisma schema pushed and client generated."

# 3. Clear Next.js build cache
echo "Step 3: Clearing Next.js build cache..."
rm -rf .next
echo "Next.js build cache cleared."

# 4. Verify environment variables (manual check reminder)
echo "Step 4: IMPORTANT: Verify your .env.local file and deployment environment variables."
echo "Ensure DATABASE_URL, DIRECT_URL, NEXTAUTH_SECRET, and OPENAI_API_KEY are correctly set."

echo "Final build fix script finished. Please try running 'npm run build' or 'npm run dev' now."
