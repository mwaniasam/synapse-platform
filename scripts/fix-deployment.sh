#!/bin/bash

echo "Attempting to fix common deployment issues..."

# 1. Ensure all dependencies are installed and up-to-date
echo "Step 1: Reinstalling dependencies to ensure consistency..."
npm install --force # Use --force to resolve potential peer dependency issues
if [ $? -ne 0 ]; then
  echo "Error: npm install failed. This might indicate a deeper dependency issue."
  exit 1
fi
echo "Dependencies reinstalled."

# 2. Run Prisma generate for production build
echo "Step 2: Running Prisma generate for production..."
npx prisma generate
if [ $? -ne 0 ]; then
  echo "Error: Prisma generate failed. Check your Prisma schema."
  exit 1
fi
echo "Prisma client generated."

# 3. Clear Next.js build cache
echo "Step 3: Clearing Next.js build cache..."
rm -rf .next
echo "Next.js build cache cleared."

# 4. Check environment variables (manual step reminder)
echo "Step 4: IMPORTANT: Verify your environment variables on Vercel (or your deployment platform)."
echo "Ensure DATABASE_URL, DIRECT_URL, NEXTAUTH_SECRET, and OPENAI_API_KEY are correctly set."
echo "For Vercel, these should be configured in Project Settings -> Environment Variables."

# 5. Suggest a fresh build
echo "Step 5: Suggesting a fresh build..."
echo "Please try running 'npm run build' locally or redeploying on Vercel."

echo "Deployment fix script complete. Review the output and try redeploying."
