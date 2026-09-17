# Synapse Platform - Adaptive Learning Application

An intelligent, adaptive learning platform that combines cognitive assessment, AI-powered content generation, and productivity tools to create personalized learning experiences.

![Next.js](https://img.shields.io/badge/Next.js-13.5.1-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.2.2-blue?style=flat-square&logo=typescript)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-blue?style=flat-square&logo=postgresql)
![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?style=flat-square&logo=prisma)
![Google AI](https://img.shields.io/badge/Google_AI-Gemini-4285F4?style=flat-square&logo=google)

## Overview

Synapse Platform is a comprehensive adaptive learning ecosystem that leverages cognitive science, artificial intelligence, and modern web technologies to deliver personalized educational experiences. The platform continuously adapts to individual learning patterns, cognitive states, and performance metrics to optimize learning outcomes.

### Application Previews

Below are screenshots demonstrating the Synapse Platform interfaces.

![Dashboard Preview](./assets/screenshot_1.png)

![Knowledge Map Preview](./assets/screenshot_2.png)

![Cognitive State Preview](./assets/screenshot_3.png)

## Key Features

### Cognitive Assessment and Monitoring
* Real-time Cognitive State Detection: Advanced algorithms analyze user performance in real-time.
* Multi-dimensional Cognitive Tests:
  * Stroop Test: Measures cognitive flexibility and attention control.
  * N-Back Test: Evaluates working memory and fluid intelligence.
  * Attention Network Test: Assesses alertness, orienting, and executive attention.
* Adaptive Learning Recommendations: Content difficulty adjusts based on cognitive state.
* Comprehensive Performance Analytics: Track focus levels, processing speed, memory performance, and decision-making.

### AI-Powered Content Generation
* Google Gemini Integration: Leverages advanced AI for dynamic content creation.
* Personalized Learning Materials: Content tailored to individual skill levels and subjects.
* Multi-format Content Support: Articles, exercises, interactive lessons, and assessments.
* Smart Tagging System: Automatic categorization and discovery of learning materials.
* Difficulty Adaptation: Content complexity adjusts based on user performance.

### Comprehensive Learning Management
* Resource Library: Extensive collection of learning materials across multiple subjects.
* Advanced Filtering and Search: Find content by subject, difficulty, format, and tags.
* Progress Tracking: Detailed analytics on learning progression and time investment.
* Bookmark System: Save and organize favorite learning resources.
* Achievement System: Goal setting and milestone tracking.

### Productivity and Focus Tools
* Intelligent Pomodoro Timer: Customizable work and break intervals with cognitive optimization.
* Focus Analytics: Track concentration patterns and productivity metrics.
* Session Management: Monitor work sessions with detailed performance insights.
* Adaptive Break Recommendations: AI-suggested break durations based on cognitive load.

### Knowledge Mapping and Visualization
* Interactive Knowledge Graph: Visual representation of learning connections and dependencies.
* Concept Mastery Tracking: Monitor understanding levels across different topics.
* Learning Path Optimization: AI-suggested learning sequences for optimal knowledge acquisition.
* Subject Interconnections: Discover relationships between different learning areas.

### User Management and Personalization
* Secure Authentication: NextAuth.js with multiple provider support.
* User Profiles and Settings: Customizable learning preferences and goals.
* Role-based Access: User and admin roles with appropriate permissions.
* Adaptive Interface: Personalized dashboard based on learning patterns.

### Advanced Analytics and Insights
* Learning Analytics Dashboard: Comprehensive overview of learning progress and patterns.
* Cognitive Performance Metrics: Detailed analysis of mental performance over time.
* Predictive Learning Insights: AI-powered recommendations for optimal learning strategies.
* Export and Reporting: Detailed reports on learning progress and achievements.

## Getting Started

### Prerequisites

Ensure you have the following installed on your system:

* Node.js (version 18.0 or higher)
* npm or yarn
* PostgreSQL (version 12 or higher)
* Git
* Google AI Studio Account (optional but recommended for AI content generation)

### Step 1: Clone the Repository

```bash
git clone https://github.com/your-username/synapse-platform.git
cd synapse-platform
```

### Step 2: Install Dependencies

```bash
npm install
# or
yarn install
```

### Step 3: Environment Configuration

Create a `.env.local` file in the root directory:

```bash
cp .env.example .env.local
```

Edit `.env.local` and configure the following variables:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/synapse_db"
NEXTAUTH_SECRET="your-super-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"
GEMINI_API_KEY="your-google-ai-api-key"
NODE_ENV="development"
```

### Step 4: Database Setup

#### Option A: Local PostgreSQL Setup

1. Install PostgreSQL.
2. Create a new database:
   ```sql
   psql -U postgres
   CREATE DATABASE synapse_db;
   CREATE USER synapse_user WITH PASSWORD 'your_password';
   GRANT ALL PRIVILEGES ON DATABASE synapse_db TO synapse_user;
   ```

#### Option B: Cloud Database Setup (Recommended for Production)

Configure a cloud PostgreSQL provider (Neon, Supabase, Railway, etc.) and update your `DATABASE_URL` in `.env.local`.

### Step 5: Database Migration and Setup

```bash
npx prisma generate
npx prisma db push
npx prisma db seed
npx prisma studio
```

### Step 6: Run the Development Server

```bash
npm run dev
# or
yarn dev
```

Your application should now be running at http://localhost:3000

## Project Architecture

```
synapse-platform/
├── app/
│   ├── api/
│   ├── auth/
│   ├── dashboard/
│   ├── cognitive/
│   └── settings/
├── components/
│   ├── ui/
│   ├── dashboard/
│   ├── cognitive/
│   └── layout/
├── hooks/
├── lib/
├── prisma/
└── types/
```

### Core Technologies

* Frontend: Next.js 13.5.1 with App Router, React 18, TypeScript
* Backend: Next.js API Routes, Prisma ORM
* Database: PostgreSQL with Prisma
* Authentication: NextAuth.js with JWT sessions
* AI Integration: Google Gemini 1.5 Flash
* UI Framework: Tailwind CSS, shadcn/ui components
* Animations: Framer Motion, Lottie React
* State Management: React Context, Custom Hooks
* Form Handling: React Hook Form, Zod validation
* Charts and Analytics: Recharts

## Deployment

### Production Deployment with Vercel

1. Push your code to a Git repository.
2. Visit the Vercel Dashboard.
3. Import your repository.
4. Configure environment variables in the Vercel dashboard.
5. Deploy.

For the database setup, run:
```bash
npx prisma db push
```

## Development Workflow

### Setting Up Development Environment

1. Create a feature branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

### Code Quality and Linting

```bash
npm run lint
npm run lint -- --fix
npx tsc --noEmit
```

### Testing Workflow

```bash
npm test
npm run test:watch
```

## API Documentation

### Authentication Endpoints
```typescript
POST   /api/auth/register
POST   /api/auth/signin
POST   /api/auth/signout
GET    /api/auth/session
```

### User Management
```typescript
GET    /api/user/profile
PUT    /api/user/profile
DELETE /api/user/delete
GET    /api/user/settings
PUT    /api/user/settings
```

### Cognitive Assessment
```typescript
POST   /api/cognitive/assess
GET    /api/cognitive/history
GET    /api/cognitive/analytics
POST   /api/cognitive/stroop
POST   /api/cognitive/nback
POST   /api/cognitive/attention
```

## Security

### Security Best Practices

* Environment Security: Use secure secrets for authentication and database connections.
* Input Validation: Zod schema validation on API routes.
* Authentication Security: JWT-based NextAuth configuration.
* Data Protection: Anonymization procedures for analytical data.

## Contributing

We welcome contributions from the community. Please follow our development setup guide and submit a detailed pull request for your changes. Ensure all code follows our style guidelines and passes local testing before submission.

## License

This project is licensed under the MIT License. See the LICENSE file for details.