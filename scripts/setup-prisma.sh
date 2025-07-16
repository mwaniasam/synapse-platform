#!/bin/bash

echo "Starting Prisma setup..."

# 1. Install Prisma CLI and client
echo "Installing Prisma CLI and client..."
npm install prisma @prisma/client
if [ $? -ne 0 ]; then
  echo "Error: Failed to install Prisma packages."
  exit 1
fi
echo "Prisma packages installed."

# 2. Initialize Prisma (if schema.prisma doesn't exist)
if [ ! -f "prisma/schema.prisma" ]; then
  echo "Initializing Prisma schema..."
  npx prisma init --datasource-provider postgresql
  if [ $? -ne 0 ]; then
    echo "Error: Prisma initialization failed."
    exit 1
  fi
  echo "Prisma schema initialized. Please review prisma/schema.prisma."
else
  echo "prisma/schema.prisma already exists. Skipping initialization."
fi

# 3. Push schema to database
echo "Pushing Prisma schema to database..."
npx prisma db push --skip-generate
if [ $? -ne 0 ]; then
  echo "Error: Prisma db push failed. Ensure your DATABASE_URL in .env.local is correct and your database is accessible."
  exit 1
fi
echo "Prisma schema pushed to database."

# 4. Generate Prisma client
echo "Generating Prisma client..."
npx prisma generate
if [ $? -ne 0 ]; then
  echo "Error: Prisma generate failed."
  exit 1
fi
echo "Prisma client generated."

echo "Prisma setup complete. Remember to update your schema.prisma and seed.ts as needed."
