// Test script for AI Assist API
import fetch from 'node-fetch';

// Configuration
const API_URL = 'http://localhost:3000/api/ai-assist';

// Test data
const testPayload = {
  type: 'question',
  data: {
    question: 'What is the best way to learn about neural networks?',
    cognitiveState: 'focused',
    userKnowledge: ['machine learning basics', 'python'],
    learningGoals: ['deep learning', 'neural networks']
  }
};

async function testAIAssist() {
  try {
    console.log('Testing AI Assist API...');
    console.log('Sending payload:', JSON.stringify(testPayload, null, 2));
    
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testPayload)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Error: ${response.status} ${response.statusText}`);
      console.error('Response:', errorText);
      return;
    }

    try {
      const data = await response.json();
      console.log('✅ Success! Response:');
      console.log(JSON.stringify(data, null, 2));
    } catch (jsonError) {
      console.error('Failed to parse JSON response:', jsonError);
      const textResponse = await response.text();
      console.log('Raw response:', textResponse);
    }
    
  } catch (error) {
    console.error('Test failed with error:', error);
    if (error.cause) {
      console.error('Error cause:', error.cause);
    }
  }
}

// Run the test
testAIAssist().catch(console.error);
