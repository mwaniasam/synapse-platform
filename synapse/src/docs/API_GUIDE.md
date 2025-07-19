# Synapse Platform API Guide

Welcome to the Synapse Platform API Guide! This document provides detailed information about all the available API services and how to use them in your projects.

## Table of Contents

1. [Getting Started](#getting-started)
2. [API Services](#api-services)
   - [Google Scholar API](#google-scholar-api)
   - [Photomath API](#photomath-api)
   - [JSpell Checker API](#jspell-checker-api)
   - [Math Equations API](#math-equations-api)
   - [Words Dictionary API](#words-dictionary-api)
   - [Book Store API](#book-store-api)
   - [Photo Math Resolver API](#photo-math-resolver-api)
   - [LearnLM 1.5 Pro API](#learnlm-15-pro-api)
   - [Python Quiz Questions API](#python-quiz-questions-api)
   - [Deepseek API](#deepseek-api)
3. [Error Handling](#error-handling)
4. [Rate Limiting](#rate-limiting)
5. [Authentication](#authentication)
6. [Best Practices](#best-practices)

## Getting Started

### Prerequisites

- Node.js 16.x or later
- npm or yarn
- API keys for the respective services

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/synapse-platform.git

# Install dependencies
cd synapse-platform/synapse
npm install
```

### Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
# API Keys
GOOGLE_SCHOLAR_API_KEY=your_google_scholar_api_key
PHOTOMATH_API_KEY=your_photomath_api_key
JSPELL_API_KEY=your_jspell_api_key
MATH_EQUATIONS_API_KEY=your_math_equations_api_key
DICTIONARY_API_KEY=your_dictionary_api_key
BOOKSTORE_API_KEY=your_bookstore_api_key
PHOTO_MATH_API_KEY=your_photo_math_api_key
LEARN_LM_API_KEY=your_learnlm_api_key
PYTHON_QUIZ_API_KEY=your_python_quiz_api_key
DEEPSEEK_API_KEY=your_deepseek_api_key

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
```

## API Services

### Google Scholar API

Search for academic papers, authors, and citations.

```typescript
import { GoogleScholarService } from '@/lib/api/services/google-scholar.service';

const scholar = new GoogleScholarService(process.env.GOOGLE_SCHOLAR_API_KEY!);

// Search for papers
const result = await scholar.search({
  query: 'machine learning',
  limit: 5,
  sortBy: 'relevance',
  yearMin: 2020,
  includeCitations: true
});
```

### Photomath API

Solve math problems from images or text input.

```typescript
import { PhotomathService } from '@/lib/api/services/photomath.service';

const photomath = new PhotomathService(process.env.PHOTOMATH_API_KEY!);

// Solve a math problem
const solution = await photomath.solve('2x + 5 = 15');

// Solve from image
const imageSolution = await photomath.solveFromImage('https://example.com/math_problem.jpg');
```

### JSpell Checker API

Check spelling and grammar in text.

```typescript
import { JSpellService } from '@/lib/api/services/jspell.service';

const jspell = new JSpellService(process.env.JSPELL_API_KEY!);

// Check spelling
const spellCheck = await jspell.checkSpelling('Ths is a testt.');

// Get grammar suggestions
const grammarCheck = await jspell.checkGrammar('She go to school.');
```

### Math Equations API

Solve and manipulate mathematical equations.

```typescript
import { MathEquationsService } from '@/lib/api/services/math-equations.service';

const math = new MathEquationsService(process.env.MATH_EQUATIONS_API_KEY!);

// Solve an equation
const solution = await math.solveEquation('2x + 5 = 15');

// Simplify an expression
const simplified = await math.simplifyExpression('2x + 3x + 5');
```

### Words Dictionary API

Look up word definitions, synonyms, and more.

```typescript
import { DictionaryService } from '@/lib/api/services/dictionary.service';

const dictionary = new DictionaryService(process.env.DICTIONARY_API_KEY!);

// Get word definition
const definition = await dictionary.getDefinition('serendipity');

// Get synonyms and antonyms
const synonyms = await dictionary.getSynonymsAntonyms('happy');
```

### Book Store API

Search for educational books and resources.

```typescript
import { BookStoreService } from '@/lib/api/services/bookstore.service';

const bookstore = new BookStoreService(process.env.BOOKSTORE_API_KEY!);

// Search for books
const results = await bookstore.searchBooks({
  query: 'machine learning',
  maxResults: 10,
  orderBy: 'relevance',
  filter: 'free-ebooks'
});
```

### Photo Math Resolver API

Solve math problems from images with step-by-step solutions.

```typescript
import { PhotoMathService } from '@/lib/api/services/photo-math.service';

const photoMath = new PhotoMathService(process.env.PHOTO_MATH_API_KEY!);

// Solve from image URL
const solution = await photoMath.solveFromImageUrl('https://example.com/math_problem.jpg');

// Get detailed steps
const steps = await photoMath.getSolutionSteps('x^2 - 4 = 0');
```

### LearnLM 1.5 Pro API

Access advanced learning models and recommendations.

```typescript
import { LearnLMService } from '@/lib/api/services/learnlm.service';

const learnLM = new LearnLMService(process.env.LEARN_LM_API_KEY!);

// Get learning recommendations
const recommendations = await learnLM.getRecommendations('user123', {
  subjects: ['mathematics', 'computer-science'],
  preferredContentTypes: ['video', 'interactive']
});

// Generate a learning path
const learningPath = await learnLM.generateLearningPath({
  subject: 'machine-learning',
  topic: 'neural-networks',
  level: 'intermediate',
  learningObjectives: ['Understand backpropagation', 'Implement a simple neural network']
});
```

### Python Quiz Questions API

Generate and evaluate Python programming quizzes.

```typescript
import { PythonQuizService } from '@/lib/api/services/python-quiz.service';

const quiz = new PythonQuizService(process.env.PYTHON_QUIZ_API_KEY!);

// Generate a quiz
const generatedQuiz = await quiz.generateQuiz({
  difficulty: 'intermediate',
  category: 'data-structures',
  limit: 10
});

// Submit quiz answers
const results = await quiz.submitQuiz({
  quizId: 'quiz-123',
  responses: [
    { questionId: 'q1', answer: 'A', timeSpent: 30 },
    { questionId: 'q2', answer: 'B', timeSpent: 45 }
  ]
});
```

### Deepseek API

Comprehensive AI-powered coding assistance.

```typescript
import { DeepseekService } from '@/lib/api/services/deepseek.service';

const deepseek = new DeepseekService(process.env.DEEPSEEK_API_KEY!);

// Execute code
const execution = await deepseek.executeCode(
  'print("Hello, World!"\nfor i in range(5):\n    print(i)',
  'python'
);

// Analyze code quality
const analysis = await deepseek.analyzeCode(
  'function add(a, b) { return a + b; }',
  'javascript'
);

// Generate code from description
const generatedCode = await deepseek.generateCode(
  'A function that sorts an array of objects by a specific property',
  {
    language: 'typescript',
    includeTests: true,
    includeDocumentation: true
  }
);
```

## Error Handling

All API services return a consistent response format:

```typescript
{
  success: boolean;
  data?: T;
  error?: string;
}
```

Example error handling:

```typescript
try {
  const result = await someApiCall();
  if (!result.success) {
    console.error(`API Error: ${result.error}`);
    // Handle error
    return;
  }
  // Use result.data
} catch (error) {
  console.error('Unexpected error:', error);
  // Handle unexpected errors
}
```

## Rate Limiting

All APIs are subject to rate limiting. The current limits are:

- Free tier: 100 requests per hour per API key
- Pro tier: 10,000 requests per day per API key
- Enterprise: Custom limits available

## Authentication

All API requests require an API key passed in the `X-API-Key` header:

```http
GET /api/endpoint
X-API-Key: your_api_key_here
```

## Best Practices

1. **Cache Responses**: Cache API responses when possible to reduce API calls and improve performance.
2. **Error Handling**: Always check the `success` flag and handle errors appropriately.
3. **Rate Limiting**: Implement exponential backoff when hitting rate limits.
4. **Environment Variables**: Never commit API keys to version control. Use environment variables.
5. **Type Safety**: Use TypeScript for better type safety and developer experience.

## Support

For support, please contact [support@synapse-platform.com](mailto:support@synapse-platform.com) or visit our [documentation](https://docs.synapse-platform.com).
