#!/bin/bash

echo "Starting complete removal of Prisma from the project..."

# 1. Remove Prisma related files and directories
echo "Removing Prisma schema and seed files..."
rm -f prisma/schema.prisma
rm -f prisma/seed.ts
rm -rf prisma/migrations # Remove migration history if it exists

echo "Removing Prisma client and related modules from node_modules..."
rm -rf node_modules/.prisma
npm uninstall @prisma/client prisma @auth/prisma-adapter tsx

echo "Removing Prisma related scripts from package.json (manual step recommended for safety)."
echo "Please manually edit your package.json to remove 'db:push', 'db:seed', 'db:studio' scripts."
echo "Also remove 'prisma' from devDependencies."

echo "Removing lib/prisma.ts..."
rm -f lib/prisma.ts

echo "Removing any direct Prisma imports from lib/db.ts if it exists and is only for Prisma."
if [ -f "lib/db.ts" ]; then
  echo "Consider reviewing and potentially removing lib/db.ts if it's solely for Prisma."
fi

echo "Prisma removal process complete. You will need to manually adjust any code that relied on Prisma."
echo "Remember to run 'npm install' after manually editing package.json."
