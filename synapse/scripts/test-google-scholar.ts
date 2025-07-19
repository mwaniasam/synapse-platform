import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleScholarService } from '../src/lib/api/services/google-scholar.service.js';

// Get the current directory name in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from temp.env in the project root
const envPath = path.resolve(__dirname, '..', 'temp.env');
console.log(`Loading environment variables from: ${envPath}`);

const envConfig = dotenv.config({ path: envPath });
if (envConfig.error) {
  console.error('Error loading .env file:', envConfig.error);
  process.exit(1);
}

// Initialize the Google Scholar service
const apiKey = process.env.GOOGLE_SCHOLAR_API_KEY;
if (!apiKey) {
  console.error('GOOGLE_SCHOLAR_API_KEY is not set in the environment variables');
  process.exit(1);
}

const googleScholar = new GoogleScholarService(apiKey);

// Test the search method
async function testGoogleScholar() {
  console.log('Testing Google Scholar API...');
  
  try {
    console.log('Searching for "machine learning" articles...');
    const result = await googleScholar.search({
      query: 'machine learning',
      num: 1
    });
    
    if (result.success) {
      console.log('✅ Google Scholar test passed');
      console.log('First article:', JSON.stringify(result.data?.articles[0], null, 2));
    } else {
      console.error('❌ Google Scholar test failed:', result.error);
    }
  } catch (error) {
    console.error('❌ Google Scholar test threw an error:', error);
  }
}

// Run the test
testGoogleScholar().catch(console.error);
