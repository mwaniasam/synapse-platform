import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get current directory in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('Environment Debugging Tool');
console.log('=========================');

// 1. Check if .env files exist
const envLocalPath = path.resolve(__dirname, '../.env.local');
const envPath = path.resolve(__dirname, '../.env');

console.log('\n1. Checking for .env files:');
console.log(`- .env.local exists: ${fs.existsSync(envLocalPath) ? '✅ Yes' : '❌ No'}`);
console.log(`- .env exists: ${fs.existsSync(envPath) ? '✅ Yes' : '❌ No'}`);

// 2. Check if dotenv is installed
try {
  require.resolve('dotenv');
  console.log('\n2. dotenv is installed: ✅ Yes');
} catch (e) {
  console.log('\n2. dotenv is installed: ❌ No');
}

// 3. Try to load environment variables
try {
  const dotenv = await import('dotenv');
  
  // Load environment variables
  const envLocal = dotenv.config({ path: envLocalPath });
  const env = dotenv.config({ path: envPath });
  
  console.log('\n3. Environment variables loaded:');
  console.log('- .env.local loaded successfully:', !envLocal.error ? '✅ Yes' : '❌ No');
  if (envLocal.error) console.log('  Error:', envLocal.error.message);
  
  console.log('- .env loaded successfully:', !env.error ? '✅ Yes' : '❌ No');
  if (env.error && !env.error.message.includes('ENOENT')) {
    console.log('  Error:', env.error.message);
  }
  
  // 4. Show environment variables (without sensitive values)
  console.log('\n4. Current Environment Variables:');
  const envVars = {
    NODE_ENV: process.env.NODE_ENV,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    DATABASE_URL: process.env.DATABASE_URL ? '*** (set) ***' : undefined,
    GEMINI_API_KEY: process.env.GEMINI_API_KEY ? '*** (set) ***' : undefined,
  };
  
  console.table(envVars);
  
} catch (error) {
  console.log('\n❌ Error loading environment variables:');
  console.error(error);
}

// 5. Check if running in development mode
console.log('\n5. Node Environment:');
console.log(`- NODE_ENV: ${process.env.NODE_ENV || 'Not set (defaults to development in Next.js)'}`);
console.log(`- Process arguments: ${process.argv.join(' ')}`);

console.log('\nDebugging completed. Review the output above for any issues.');
