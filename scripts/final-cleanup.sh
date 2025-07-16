#!/bin/bash

echo "Starting final cleanup of development artifacts..."

# Remove node_modules directory
echo "Removing node_modules directory..."
rm -rf node_modules

# Remove package-lock.json
echo "Removing package-lock.json..."
rm -f package-lock.json

# Remove .next build cache
echo "Removing .next build cache..."
rm -rf .next

# Remove Prisma generated client
echo "Removing Prisma generated client..."
rm -rf node_modules/.prisma

# Remove Prisma migration history (use with caution, only if you want to reset migrations)
# echo "Removing Prisma migration history..."
# rm -rf prisma/migrations

# Remove .env.local (use with caution, only if you want to reset environment variables)
# echo "Removing .env.local file..."
# rm -f .env.local

echo "Cleanup complete. You may need to run 'npm install' and 'npx prisma db push' again."
