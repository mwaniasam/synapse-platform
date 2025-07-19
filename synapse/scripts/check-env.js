// Script to check environment variable loading
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the current directory in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from .env.local first, then .env
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });
dotenv.config({ path: path.resolve(__dirname, '../.env') });

console.log('Environment Variables:');
console.log('---------------------');
console.log(`NODE_ENV: ${process.env.NODE_ENV}`);
console.log(`NEXTAUTH_URL: ${process.env.NEXTAUTH_URL}`);
console.log(`DATABASE_URL: ${process.env.DATABASE_URL ? '*** (set but hidden) ***' : 'Not set'}`);
console.log(`GEMINI_API_KEY: ${process.env.GEMINI_API_KEY ? '*** (set) ***' : 'Not set'}`);
console.log('---------------------\n');

// Test database connection if DATABASE_URL is set
if (process.env.DATABASE_URL) {
  try {
    const { PrismaClient } = await import('@prisma/client');
    const prisma = new PrismaClient();
    
    console.log('Testing database connection...');
    await prisma.$connect();
    console.log('✅ Database connection successful!');
    
    // Check if we can query the database
    const userCount = await prisma.user.count();
    console.log(`📊 Found ${userCount} users in the database`);
    
    await prisma.$disconnect();
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
  }
} else {
  console.log('❌ DATABASE_URL not set. Please check your .env.local file.');
}
