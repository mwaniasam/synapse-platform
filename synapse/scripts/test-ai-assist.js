// Test script for AI Assist API
const fetch = require('node-fetch');

// Test configuration
const API_URL = 'http://localhost:3001/api/ai-assist';

// Test data
const testPayloads = [
  {
    type: 'question',
    data: {
      question: 'What is machine learning?',
      context: 'Machine learning is a branch of artificial intelligence.',
      userKnowledge: ['basic programming', 'statistics']
    }
  },
  {
    type: 'recommendation',
    data: {
      cognitiveState: 'beginner',
      learningHistory: ['introduction to python', 'basic statistics'],
      currentTopic: 'machine learning',
      knowledgeGaps: ['neural networks', 'deep learning']
    }
  },
  {
    type: 'summary',
    data: {
      content: 'Machine learning is a method of data analysis that automates analytical model building. It is a branch of artificial intelligence based on the idea that systems can learn from data, identify patterns and make decisions with minimal human intervention.',
      cognitiveState: 'intermediate',
      complexity: 'brief'
    }
  }
];

// Run tests
async function runTests() {
  console.log('Starting AI Assist API tests...\n');
  
  for (const [index, payload] of testPayloads.entries()) {
    console.log(`--- Test ${index + 1}: ${payload.type} ---`);
    
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });
      
      const data = await response.json();
      
      console.log('Status:', response.status);
      console.log('Response:', JSON.stringify(data, null, 2));
      
      if (!response.ok) {
        console.error(`❌ Test failed: ${response.statusText}`);
      } else {
        console.log('✅ Test passed');
      }
    } catch (error) {
      console.error('❌ Test failed with error:', error.message);
    }
    
    console.log('\n');
  }
  
  console.log('Test sequence completed.');
}

// Run the tests
runTests().catch(console.error);
