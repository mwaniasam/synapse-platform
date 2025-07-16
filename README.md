# 🧠 Synapse Learning Pro

A modern, AI-powered adaptive learning platform that uses cognitive state detection to personalize your learning experience in real-time.

## ✨ Features

- **🤖 AI-Powered Content Generation**: GPT-4 creates personalized learning content based on your level and interests
- **🧠 Cognitive State Detection**: Real-time monitoring of focus, attention, and learning patterns
- **🎯 Adaptive Learning**: Content automatically adjusts difficulty and presentation based on your cognitive state
- **📊 Learning Analytics**: Detailed insights into your learning patterns and progress
- **🔐 Secure Authentication**: NextAuth with Google OAuth and credentials support
- **📱 Responsive Design**: Works perfectly on desktop, tablet, and mobile devices
- **🌙 Dark Mode**: Beautiful dark/light theme support

## 🚀 Quick Start

### Prerequisites

- Node.js 18 or higher
- A Neon database (free tier available)
- OpenAI API key
- Google OAuth credentials (optional)

### Installation

1. **Clone the repository**
   \`\`\`bash
   git clone <your-repo-url>
   cd synapse-learning-pro
   \`\`\`

2. **Install dependencies**
   \`\`\`bash
   npm install
   \`\`\`

3. **Set up environment variables**
   \`\`\`bash
   cp .env.example .env.local
   \`\`\`
   
   Fill in your environment variables:
   - `DATABASE_URL`: Your Neon database connection string
   - `NEXTAUTH_SECRET`: Generate with `openssl rand -base64 32`
   - `OPENAI_API_KEY`: Get from [OpenAI Platform](https://platform.openai.com/api-keys)
   - `GOOGLE_CLIENT_ID` & `GOOGLE_CLIENT_SECRET`: Get from [Google Cloud Console](https://console.cloud.google.com)

4. **Set up the database**
   \`\`\`bash
   npm run db:push
   \`\`\`

5. **Start the development server**
   \`\`\`bash
   npm run dev
   \`\`\`

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🛠️ Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run db:push` - Push database schema changes
- `npm run db:generate` - Generate Prisma client
- `npm run db:studio` - Open Prisma Studio

## 🏗️ Tech Stack

- **Framework**: Next.js 15 with App Router
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js
- **AI**: OpenAI GPT-4 with Vercel AI SDK
- **Styling**: Tailwind CSS + shadcn/ui
- **Animations**: Framer Motion
- **Deployment**: Vercel (recommended)

## 📁 Project Structure

\`\`\`
synapse-learning-pro/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── auth/              # Authentication pages
│   ├── dashboard/         # Dashboard page
│   └── learn/             # Learning interface
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   └── ...               # Custom components
├── lib/                  # Utility libraries
│   ├── auth.ts           # NextAuth configuration
│   ├── prisma.ts         # Database client
│   └── ai-engine.ts      # AI content generation
├── prisma/               # Database schema
└── public/               # Static assets
\`\`\`

## 🔧 Configuration

### Database Setup (Neon)

1. Create a free account at [Neon](https://neon.tech)
2. Create a new database
3. Copy the connection string to your `.env.local`
4. Run `npm run db:push` to create tables

### OpenAI Setup

1. Get an API key from [OpenAI Platform](https://platform.openai.com/api-keys)
2. Add it to your `.env.local` as `OPENAI_API_KEY`

### Google OAuth (Optional)

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select existing
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URI: `http://localhost:3000/api/auth/callback/google`
6. Add client ID and secret to `.env.local`

## 🚀 Deployment

### Deploy to Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

### Environment Variables for Production

Make sure to set these in your production environment:
- `DATABASE_URL`
- `NEXTAUTH_URL` (your production URL)
- `NEXTAUTH_SECRET`
- `OPENAI_API_KEY`
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues:

1. Check the [Issues](https://github.com/your-username/synapse-learning-pro/issues) page
2. Create a new issue with detailed information
3. Join our [Discord community](https://discord.gg/your-invite) for help

## 🙏 Acknowledgments

- [Vercel](https://vercel.com) for the amazing platform and AI SDK
- [OpenAI](https://openai.com) for GPT-4 API
- [shadcn/ui](https://ui.shadcn.com) for beautiful components
- [Neon](https://neon.tech) for serverless PostgreSQL

---

Made with ❤️ by the Synapse Learning Pro
\`\`\`
