#!/bin/bash

echo "Attempting to fix common database table issues..."

# This script is a placeholder for potential database table fixes.
# It assumes you are using Prisma and have your DATABASE_URL configured.

# 1. Run Prisma Migrate Deploy (if you have migrations)
# This command applies all pending migrations to the database.
# If you are not using Prisma Migrate, you can skip this.
# echo "Running Prisma Migrate Deploy..."
# npx prisma migrate deploy
# if [ $? -ne 0 ]; then
#   echo "Error: Prisma Migrate Deploy failed. Check your migration files and database connection."
#   exit 1
# fi
# echo "Prisma migrations applied."

# 2. Run Prisma DB Push (for schema synchronization without migrations)
# This command pushes the current schema.prisma to the database, creating/altering tables.
echo "Running Prisma DB Push to synchronize schema..."
npx prisma db push --skip-generate
if [ $? -ne 0 ]; then
  echo "Error: Prisma DB Push failed. Ensure your DATABASE_URL is correct and database is accessible."
  exit 1
fi
echo "Prisma schema synchronized with database."

# 3. Generate Prisma client (always good after schema changes)
echo "Generating Prisma client..."
npx prisma generate
if [ $? -ne 0 ]; then
  echo "Error: Prisma generate failed."
  exit 1
fi
echo "Prisma client generated."

# 4. Seed the database (if you need to re-populate data)
echo "Seeding the database with initial data..."
npm run db:seed
if [ $? -ne 0 ]; then
  echo "Error: Database seeding failed. Check prisma/seed.ts for errors."
  exit 1
fi
echo "Database seeded successfully."

echo "Database table fix script complete. Please verify your database state."
