#!/bin/bash

echo "🔧 Fixing Material-UI and Next.js dependencies..."

# Remove node_modules and package-lock.json to start fresh
rm -rf node_modules package-lock.json

# Install the correct Material-UI styled engine
npm install @mui/styled-engine@^5.15.1
npm install @mui/styled-engine-sc@^6.0.0-alpha.6
npm install styled-components@^6.1.6

# Install missing dependencies
npm install @types/styled-components@^5.1.34 --save-dev

# Reinstall all dependencies
npm install

# Generate Prisma client
npx prisma generate

echo "✅ Dependencies fixed! You can now run 'npm run dev'"
