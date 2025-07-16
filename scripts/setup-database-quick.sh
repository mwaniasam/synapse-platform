#!/bin/bash

echo "Starting quick database setup..."

# 1. Push Prisma schema to the database
echo "Pushing Prisma schema to database..."
npx prisma db push --skip-generate
if [ $? -ne 0 ]; then
  echo "Prisma db push failed. Ensure your DATABASE_URL in .env.local is correct and your database is accessible."
  exit 1
fi
echo "Prisma schema pushed."

# 2. Generate Prisma client
echo "Generating Prisma client..."
npx prisma generate
if [ $? -ne 0 ]; then
  echo "Prisma generate failed."
  exit 1
fi
echo "Prisma client generated."

# 3. Seed the database
echo "Seeding the database with initial data..."
npm run db:seed
if [ $? -ne 0 ]; then
  echo "Database seeding failed. Check prisma/seed.ts for errors."
  exit 1
fi
echo "Database seeded successfully."

echo "Quick database setup complete."
