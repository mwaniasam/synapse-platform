# Educational API Services

This directory contains services for interacting with various educational APIs, including Khan Academy and Hugging Face AI.

## Available Services

### 1. Khan Academy API
- **Service File**: `services/khan-academy.service.ts`
- **API Routes**: `/api/education/khan-academy`
- **Authentication**: Not required (public API)
- **Rate Limits**: Be mindful of rate limits when making frequent requests

#### Example Usage

```typescript
import { KhanAcademyService } from './services/khan-academy.service';

const khan = new KhanAcademyService();

// Search for content
const results = await khan.search('algebra', 10);

// Get topic details
const topic = await khan.getTopic('math/algebra');

// Get videos for a topic
const videos = await khan.getTopicVideos('math/algebra');

// Get exercises for a topic
const exercises = await khan.getTopicExercises('math/algebra');
```

### 2. Hugging Face AI API
- **Service File**: `services/huggingface.service.ts`
- **API Routes**: `/api/ai/huggingface`
- **Authentication**: Requires API key (sign up at https://huggingface.co/settings/tokens)
- **Rate Limits**: Free tier has rate limits

#### Example Usage

```typescript
import { HuggingFaceService } from './services/huggingface.service';

const hf = new HuggingFaceService('your-api-key');

// Generate text
const text = await hf.generateText('Explain quantum computing in simple terms');

// Answer a question
const answer = await hf.answerQuestion(
  'What is the capital of France?',
  'France is a country in Europe. Paris is its capital.'
);

// Summarize text
const summary = await hf.summarizeText('Long article text here...');
```

## Environment Variables

Create a `.env.local` file in your project root with the following variables:

```env
# Hugging Face API (get from https://huggingface.co/settings/tokens)
HUGGINGFACE_API_KEY=your_api_key_here
HUGGINGFACE_DEFAULT_MODEL=gpt2

# Optional: Merriam-Webster Dictionary API (for dictionary/thesaurus features)
MERRIAM_WEBSTER_DICTIONARY_KEY=your_dictionary_key
MERRIAM_WEBSTER_THESAURUS_KEY=your_thesaurus_key
```

## API Routes

### Khan Academy API

- `GET /api/education/khan-academy?query=search+term` - Search for content
- `GET /api/education/khan-academy?topicId=math/algebra` - Get topic details
- `POST /api/education/khan-academy` - Advanced queries (see route.ts for details)

### Hugging Face AI API

- `POST /api/ai/huggingface` - Main endpoint for all AI operations
  - Action: `generateText`, `answerQuestion`, `summarizeText`, etc.
  - See route.ts for full documentation

## Error Handling

All services include error handling and validation. Check the `error` property in the response for details.

## Rate Limiting

Be mindful of rate limits, especially for the Hugging Face API. Consider implementing caching for frequently requested data.
