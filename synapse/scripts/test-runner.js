// Simple test runner for API services
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

// List of test scripts to run
const testScripts = [
  'test-google-scholar.ts',
  // Add other test scripts here as they are created
];

// Environment variables
const envPath = path.resolve(__dirname, '..', 'temp.env');
const envVars = { ...process.env };

// Load environment variables from temp.env
if (fs.existsSync(envPath)) {
  const envFile = fs.readFileSync(envPath, 'utf-8');
  envFile.split('\n').forEach(line => {
    const match = line.match(/^([^=]+)=(.*)$/);
    if (match) {
      envVars[match[1]] = match[2];
    }
  });
} else {
  console.error(`Warning: ${envPath} not found`);
}

// Run tests sequentially
async function runTests() {
  console.log('Starting API Integration Tests\n');
  
  for (const script of testScripts) {
    const scriptPath = path.join(__dirname, script);
    if (!fs.existsSync(scriptPath)) {
      console.log(`❌ Test script not found: ${script}`);
      continue;
    }
    
    console.log(`\n=== Running ${script} ===`);
    
    try {
      await new Promise((resolve, reject) => {
        const testProcess = spawn('node', ['--import', 'tsx', script], {
          cwd: __dirname,
          env: envVars,
          stdio: 'inherit'
        });
        
        testProcess.on('close', (code) => {
          if (code === 0) {
            console.log(`✅ ${script} completed successfully`);
            resolve(true);
          } else {
            console.error(`❌ ${script} failed with code ${code}`);
            resolve(false);
          }
        });
        
        testProcess.on('error', (error) => {
          console.error(`❌ Error running ${script}:`, error);
          resolve(false);
        });
      });
    } catch (error) {
      console.error(`❌ Unexpected error running ${script}:`, error);
    }
  }
  
  console.log('\n=== All tests completed ===');
}

// Run the tests
runTests().catch(console.error);
