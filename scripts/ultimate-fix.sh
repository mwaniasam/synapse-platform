#!/bin/bash

echo "Starting ultimate fix for Synapse platform (full reset and reinstall)..."

# 1. Clean all caches and node_modules
echo "Step 1: Cleaning npm cache, removing node_modules and package-lock.json..."
npm cache clean --force
rm -rf node_modules
rm -f package-lock.json
echo "Cleaned."

# 2. Clear Next.js build cache
echo "Step 2: Clearing Next.js build cache..."
rm -rf .next
echo "Next.js build cache cleared."

# 3. Reinstall all dependencies from scratch
echo "Step 3: Reinstalling all npm dependencies..."
npm install
if [ $? -ne 0 ]; then
  echo "Error: npm install failed. Please check your network connection or npm setup."
  exit 1
fi
echo "Dependencies reinstalled successfully."

# 4. Run Prisma commands
echo "Step 4: Running Prisma database push and generate..."
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

# 5. Seed the database
echo "Step 5: Seeding the database..."
npm run db:seed
if [ $? -ne 0 ]; then
  echo "Error: Database seeding failed. Check prisma/seed.ts for errors."
  exit 1
fi
echo "Database seeded successfully."

# 6. Verify environment variables (manual check reminder)
echo "Step 6: IMPORTANT: Verify your .env.local file and deployment environment variables."
echo "Ensure DATABASE_URL, DIRECT_URL, NEXTAUTH_SECRET, and OPENAI_API_KEY are correctly set."

echo "Ultimate fix script finished. Your project should now be in a clean and functional state."
echo "Please try running 'npm run dev' now."
