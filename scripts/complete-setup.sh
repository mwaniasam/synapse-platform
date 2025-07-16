#!/bin/bash

echo "Starting Synapse platform setup..."

# Check if npm is installed
if ! command -v npm &> /dev/null
then
    echo "npm is not installed. Please install Node.js and npm first."
    exit 1
fi

echo "Installing npm dependencies..."
npm install

if [ $? -ne 0 ]; then
  echo "npm install failed. Please check your network connection or npm setup."
  exit 1
fi

echo "Running Prisma database push..."
npx prisma db push

if [ $? -ne 0 ]; then
  echo "Prisma db push failed. Please ensure your DATABASE_URL is correctly set in .env.local"
  exit 1
fi

echo "Seeding database with initial data..."
npx tsx prisma/seed.ts

if [ $? -ne 0 ]; then
  echo "Database seeding failed. Check your seed script or data."
  exit 1
fi

echo "Synapse platform setup complete! You can now run 'npm run dev' to start the application."
