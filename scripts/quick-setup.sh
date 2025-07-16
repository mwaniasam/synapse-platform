#!/bin/bash

echo "Starting quick setup for Synapse platform..."

# 1. Install dependencies
echo "Installing npm dependencies..."
npm install
if [ $? -ne 0 ]; then
  echo "npm install failed. Please check your network connection or npm setup."
  exit 1
fi
echo "npm dependencies installed."

# 2. Generate Prisma client and push schema to database
echo "Generating Prisma client and pushing schema to database..."
npx prisma db push --skip-generate
if [ $? -ne 0 ]; then
  echo "Prisma db push failed. Ensure your DATABASE_URL in .env.local is correct and your database is accessible."
  exit 1
fi
echo "Prisma schema pushed to database."

# 3. Generate Prisma client (again, to ensure it's up-to-date after push)
echo "Generating Prisma client..."
npx prisma generate
if [ $? -ne 0 ]; then
  echo "Prisma generate failed."
  exit 1
fi
echo "Prisma client generated."

# 4. Seed the database
echo "Seeding the database with initial data..."
npm run db:seed
if [ $? -ne 0 ]; then
  echo "Database seeding failed. Check prisma/seed.ts for errors."
  exit 1
fi
echo "Database seeded successfully."

echo "Quick setup complete! You can now run 'npm run dev' to start the application."
