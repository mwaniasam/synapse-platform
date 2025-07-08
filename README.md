# Synapse - Cognitive Learning Acceleration Platform

A comprehensive productivity and learning platform with Pomodoro timer, activity tracking, and analytics.

## Features

- 🍅 **Pomodoro Timer** - Focus sessions with customizable work/break intervals
- 📊 **Activity Tracking** - Real-time monitoring of user activity and focus
- 📈 **Analytics Dashboard** - Detailed insights into productivity patterns
- 🔐 **Authentication** - Secure user accounts with NextAuth.js
- 🎨 **Modern UI** - Beautiful, responsive design with Tailwind CSS
- 🌙 **Dark Mode** - System-aware theme switching

## Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: PostgreSQL
- **Authentication**: NextAuth.js
- **Styling**: Tailwind CSS, Radix UI
- **Charts**: Recharts

## Getting Started

### Prerequisites

- Node.js 18+ 
- PostgreSQL database
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies: `npm install`
3. Set up environment variables (see .env.example)
4. Set up the database: `npx prisma db push`
5. Start the development server: `npm run dev`

### Environment Variables

Create a `.env.local` file with:

\`\`\`
DATABASE_URL="postgresql://username:password@localhost:5432/synapse"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"
\`\`\`

## Usage

1. Sign up for an account
2. Start a Pomodoro session
3. Track your activity across websites
4. View analytics and insights
5. Customize settings to your preferences

## Deployment

Deploy to Vercel with one click or follow these steps:

1. Set up a PostgreSQL database (Neon, Supabase, etc.)
2. Configure environment variables
3. Deploy to your preferred platform
4. Run database migrations: `npx prisma db push`

## License

MIT License - see LICENSE file for details.
