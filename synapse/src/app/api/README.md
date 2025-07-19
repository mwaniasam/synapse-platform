# Educational API Integrations

This directory contains API routes for integrating with various educational services.

## Available Integrations

### 1. Khan Academy
- **Route**: `/api/education/khan-academy`
- **Methods**:
  - `GET /api/education/khan-academy?query=search+term` - Search for content
  - `GET /api/education/khan-academy?topicId=topic_id` - Get topic details
  - `POST /api/education/khan-academy` - Advanced queries

### 2. Hugging Face AI
- **Route**: `/api/ai/huggingface`
- **Methods**:
  - `POST /api/ai/huggingface` - All AI operations
  - `GET /api/ai/huggingface/models` - List available models

## Client-Side Usage

Use the provided client utilities to interact with these APIs from your React components:

```typescript
import { khanAcademyClient, huggingFaceClient } from '@/lib/api/client';

// Search Khan Academy
const searchResults = await khanAcademyClient.search('algebra');

// Generate text with AI
const { generatedText } = await huggingFaceClient.generateText('Explain quantum computing');

// Get topic details
const topic = await khanAcademyClient.getTopic('math/algebra');

// Answer a question with context
const { answer } = await huggingFaceClient.answerQuestion(
  'What is the capital of France?',
  'France is a country in Europe. Paris is its capital.'
);
```

## Environment Variables

Create a `.env.local` file in your project root with the following variables:

```env
# Hugging Face API (required for AI features)
HUGGINGFACE_API_KEY=your_api_key_here

# Optional: Override default model
HUGGINGFACE_DEFAULT_MODEL=gpt2
```

## Error Handling

All API clients include error handling. Use the `handleApiError` utility to display user-friendly error messages:

```typescript
import { handleApiError } from '@/lib/api/client';

try {
  const result = await khanAcademyClient.search('math');
} catch (error) {
  const errorMessage = handleApiError(error, 'Failed to search Khan Academy');
  // Show errorMessage to user
}
```

## Testing

Run the test script to verify all API integrations:

```bash
# Install dependencies if needed
npm install tsx

# Run tests
npx tsx scripts/test-educational-apis.ts
```

## Rate Limiting

Be mindful of API rate limits, especially for the Hugging Face API. Consider implementing client-side caching for frequently requested data.
