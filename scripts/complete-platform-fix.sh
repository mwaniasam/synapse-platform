#!/bin/bash

echo "Starting complete platform fix for Synapse..."

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

# 3. Seed the database
echo "Step 3: Seeding the database..."
npm run db:seed
if [ $? -ne 0 ]; then
  echo "Error: Database seeding failed. Check prisma/seed.ts for errors."
  exit 1
fi
echo "Database seeded successfully."

# 4. Clear Next.js build cache
echo "Step 4: Clearing Next.js build cache..."
rm -rf .next
echo "Next.js build cache cleared."

# 5. Verify environment variables (manual check reminder)
echo "Step 5: IMPORTANT: Verify your .env.local file and deployment environment variables."
echo "Ensure DATABASE_URL, DIRECT_URL, NEXTAUTH_SECRET, and OPENAI_API_KEY are correctly set."

# 6. Run any specific database table fixes if needed (e.g., scripts/fix-database-tables.sh)
# echo "Step 6: Running specific database table fixes..."
# ./scripts/fix-database-tables.sh
# if [ $? -ne 0 ]; then
#   echo "Warning: Specific database table fixes encountered issues."
# fi

# 7. Run any specific auth setup fixes if needed (e.g., scripts/fix-auth-setup.sh)
# echo "Step 7: Running specific authentication setup fixes..."
# ./scripts/fix-auth-setup.sh
# if [ $? -ne 0 ]; then
#   echo "Warning: Specific authentication setup fixes encountered issues."
# fi

echo "Complete platform fix script finished. Your project should now be in a clean and functional state."
echo "Please try running 'npm run dev' now."
