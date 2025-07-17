# Install Node.js (if not already installed)
# Download from https://nodejs.org/ (LTS version recommended)

# Verify installation
node --version
npm --version

# Create Next.js project
npx create-next-app@latest synapse --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"

# Navigate to project directory
cd synapse

# Install core dependencies
npm install @mui/material @emotion/react @emotion/styled @mui/icons-material
npm install @prisma/client prisma
npm install @neondatabase/serverless
npm install @google/generative-ai
npm install next-auth
npm install @auth/prisma-adapter
npm install zod
npm install recharts
npm install framer-motion

# Install development dependencies
npm install -D jest @testing-library/react @testing-library/jest-dom
npm install -D supertest @types/supertest
npm install -D prisma
