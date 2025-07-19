#!/bin/bash

echo "🔧 Installing authentication dependencies..."

# Install bcryptjs for password hashing
npm install bcryptjs
npm install @types/bcryptjs --save-dev

# Generate Prisma client with updated schema
npx prisma generate

echo "✅ Authentication dependencies installed!"
echo ""
echo "📝 Next steps:"
echo "1. Update your database schema: npx prisma db push"
echo "2. Start the development server: npm run dev"
echo "3. Visit http://localhost:3000 to test the new authentication"
