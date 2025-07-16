#!/bin/bash

echo "Attempting to fix common authentication setup issues..."

# 1. Ensure NextAuth.js secret is set
echo "Checking NEXTAUTH_SECRET in .env.local..."
if [ ! -f ".env.local" ]; then
  echo "Error: .env.local file not found. Please create it from .env.local.example."
  exit 1
fi

if grep -q "YOUR_NEXTAUTH_SECRET" .env.local; then
  echo "Warning: NEXTAUTH_SECRET in .env.local is still the placeholder. Please update it with a strong, random string."
  echo "You can generate one using: openssl rand -base64 32"
fi
echo "NEXTAUTH_SECRET check complete."

# 2. Verify Prisma schema for User and Account models
echo "Verifying Prisma schema for authentication models..."
if [ ! -f "prisma/schema.prisma" ]; then
  echo "Error: prisma/schema.prisma not found. Please ensure your Prisma setup is complete."
  exit 1
fi

if ! grep -q "model User" prisma/schema.prisma || \
   ! grep -q "model Account" prisma/schema.prisma || \
   ! grep -q "model Session" prisma/schema.prisma || \
   ! grep -q "model VerificationToken" prisma/schema.prisma; then
  echo "Error: Prisma schema is missing required NextAuth.js models (User, Account, Session, VerificationToken)."
  echo "Please ensure your prisma/schema.prisma includes these models as per NextAuth.js documentation."
  exit 1
fi
echo "Prisma schema contains required auth models."

# 3. Push Prisma schema and generate client
echo "Pushing Prisma schema to database and generating client..."
npx prisma db push --skip-generate
if [ $? -ne 0 ]; then
  echo "Error: Prisma db push failed. Check your DATABASE_URL and database server."
  exit 1
fi
npx prisma generate
if [ $? -ne 0 ]; then
  echo "Error: Prisma generate failed."
  exit 1
fi
echo "Prisma schema pushed and client generated."

# 4. Seed database (if needed for test users)
echo "Seeding database with initial data (if seed script exists)..."
if [ -f "prisma/seed.ts" ]; then
  npm run db:seed
  if [ $? -ne 0 ]; then
    echo "Warning: Database seeding failed. Check prisma/seed.ts for errors."
  fi
else
  echo "No prisma/seed.ts found. Skipping database seeding."
fi
echo "Database seeding check complete."

# 5. Check NextAuth.js API route
echo "Checking NextAuth.js API route: app/api/auth/[...nextauth]/route.ts..."
if [ ! -f "app/api/auth/[...nextauth]/route.ts" ]; then
  echo "Error: NextAuth.js API route not found. Please create app/api/auth/[...nextauth]/route.ts."
  exit 1
fi
echo "NextAuth.js API route found."

echo "Authentication setup fix script complete. Please verify your auth flow."
