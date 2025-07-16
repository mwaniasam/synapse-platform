#!/bin/bash

echo "Verifying Synapse platform setup..."

# 1. Check npm dependencies
echo "Checking npm dependencies..."
npm list --depth=0 > /dev/null 2>&1
if [ $? -ne 0 ]; then
  echo "Error: npm dependencies are not correctly installed. Please run 'npm install'."
  exit 1
fi
echo "npm dependencies are installed."

# 2. Check Prisma client generation
echo "Checking Prisma client..."
if [ ! -d "node_modules/.prisma/client" ]; then
  echo "Error: Prisma client not generated. Please run 'npx prisma generate'."
  exit 1
fi
echo "Prisma client is generated."

# 3. Check database connection (requires DATABASE_URL to be set)
echo "Checking database connection..."
if [ -z "$DATABASE_URL" ]; then
  echo "Warning: DATABASE_URL is not set in your environment. Cannot verify database connection."
else
  # Attempt a simple Prisma query to check connection
  # This requires tsx to be installed globally or locally
  npx tsx -e "import { PrismaClient } from '@prisma/client'; const prisma = new PrismaClient(); async function testDb() { try { await prisma.\$queryRaw\`SELECT 1\`; console.log('Database connection successful.'); } catch (e) { console.error('Error: Database connection failed:', e.message); process.exit(1); } finally { await prisma.\$disconnect(); } } testDb();"
  if [ $? -ne 0 ]; then
    echo "Error: Database connection test failed. Check your DATABASE_URL and database server."
    exit 1
  fi
fi

# 4. Check .env.local file
echo "Checking .env.local file..."
if [ ! -f ".env.local" ]; then
  echo "Error: .env.local file not found. Please create it from .env.local.example."
  exit 1
fi
if grep -q "YOUR_NEXTAUTH_SECRET" .env.local; then
  echo "Warning: NEXTAUTH_SECRET in .env.local is still the placeholder. Please update it."
fi
if grep -q "YOUR_OPENAI_API_KEY" .env.local; then
  echo "Warning: OPENAI_API_KEY in .env.local is still the placeholder. Please update it if you plan to use AI features."
fi
echo ".env.local file checked."

echo "Synapse platform setup verification complete. All critical components appear to be in place."
echo "You can now run 'npm run dev' to start the application."
