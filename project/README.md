# Synapse Platform - Adaptive Learning Application

A modern, intelligent learning platform with cognitive detection capabilities, personalized content delivery, and productivity features.

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (version 18 or higher)
- **npm** or **yarn**
- **PostgreSQL** database (local or cloud)
- **Git**

### Step 1: Clone the Repository

```bash
git clone <your-repository-url>
cd synapse-platform
```

### Step 2: Install Dependencies

```bash
npm install
```

### Step 3: Environment Setup

Create a `.env.local` file in the root directory:

```bash
cp .env.example .env.local
```

Edit `.env.local` and add your configuration:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/synapse_db"

# NextAuth
NEXTAUTH_SECRET="your-super-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"
```

### Step 4: Database Setup

1. **Create your PostgreSQL database:**
   ```sql
   CREATE DATABASE synapse_db;
   ```

2. **Generate Prisma client:**
   ```bash
   npx prisma generate
   ```

3. **Push the schema to your database:**
   ```bash
   npx prisma db push
   ```

4. **Optional: View your database with Prisma Studio:**
   ```bash
   npx prisma studio
   ```

### Step 5: Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🏗️ Project Structure

```
synapse-platform/
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes
│   ├── auth/              # Authentication pages
│   ├── dashboard/         # Dashboard page
│   └── app/               # Protected app pages
├── components/            # Reusable React components
│   ├── ui/               # shadcn/ui components
│   ├── dashboard/        # Dashboard-specific components
│   ├── pomodoro/         # Pomodoro timer components
│   ├── resources/        # Learning resources components
│   └── knowledge-map/    # Knowledge mapping components
├── lib/                  # Utility functions and configurations
├── prisma/               # Database schema and migrations
└── types/                # TypeScript type definitions
```

## 🔧 Configuration

### Database Configuration

The application uses PostgreSQL with Prisma ORM. Update your `DATABASE_URL` in `.env.local`:

**Local PostgreSQL:**
```env
DATABASE_URL="postgresql://username:password@localhost:5432/synapse_db"
```

**Cloud Database (e.g., Supabase, PlanetScale):**
```env
DATABASE_URL="your-cloud-database-url"
```

### Authentication Configuration

The app uses NextAuth.js for authentication. Generate a secure secret:

```bash
openssl rand -base64 32
```

Add it to your `.env.local`:
```env
NEXTAUTH_SECRET="your-generated-secret"
```

## 🎯 Key Features

### 1. Authentication System
- Secure email/password authentication
- User roles and permissions
- JWT-based sessions

### 2. Adaptive Learning Dashboard
- Real-time progress tracking
- Personalized learning insights
- Goal setting and achievement tracking

### 3. Pomodoro Timer
- Customizable work/break intervals
- Focus tracking and analytics
- AI-powered productivity insights

### 4. Learning Resources
- Comprehensive resource library
- Advanced filtering and search
- Bookmark and progress tracking

### 5. Knowledge Mapping
- Visual representation of learning connections
- Interactive knowledge graph
- Mastery level tracking

## 🚀 Deployment

### Vercel (Recommended)

1. **Connect your repository to Vercel**
2. **Add environment variables in Vercel dashboard**
3. **Deploy automatically on push**

### Manual Deployment

1. **Build the application:**
   ```bash
   npm run build
   ```

2. **Start the production server:**
   ```bash
   npm start
   ```

## 🛠️ Development Workflow

### Adding New Features

1. **Create feature branch:**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**

3. **Update database schema if needed:**
   ```bash
   npx prisma db push
   ```

4. **Test your changes:**
   ```bash
   npm run dev
   ```

5. **Commit and push:**
   ```bash
   git add .
   git commit -m "Add: your feature description"
   git push origin feature/your-feature-name
   ```

### Database Changes

When modifying the database schema:

1. **Update `prisma/schema.prisma`**
2. **Generate new client:**
   ```bash
   npx prisma generate
   ```
3. **Push changes:**
   ```bash
   npx prisma db push
   ```

## 📚 API Endpoints

### Authentication
- `POST /api/auth/signin` - User sign in
- `POST /api/auth/signup` - User registration
- `POST /api/auth/signout` - User sign out

### User Data
- `GET /api/user/profile` - Get user profile
- `PUT /api/user/settings` - Update user settings
- `GET /api/user/progress` - Get learning progress

### Learning Resources
- `GET /api/resources` - Get learning resources
- `POST /api/resources/bookmark` - Bookmark resource
- `PUT /api/resources/progress` - Update learning progress

## 🎨 Customization

### Theming

The application uses Tailwind CSS with a custom design system. Modify colors in `tailwind.config.ts`:

```typescript
colors: {
  primary: {
    DEFAULT: 'hsl(var(--primary))',
    foreground: 'hsl(var(--primary-foreground))',
  },
  // Add your custom colors
}
```

### Components

All UI components are built with shadcn/ui and can be customized in the `components/ui/` directory.

## 🐛 Troubleshooting

### Common Issues

1. **Database Connection Error:**
   - Verify your `DATABASE_URL` is correct
   - Ensure PostgreSQL is running
   - Check database credentials

2. **Prisma Client Error:**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

3. **NextAuth Configuration Error:**
   - Verify `NEXTAUTH_SECRET` is set
   - Check `NEXTAUTH_URL` matches your domain

### Getting Help

- Check the [Issues](https://github.com/your-repo/issues) page
- Review the [Documentation](https://nextjs.org/docs)
- Join our [Discord Community](https://discord.gg/your-invite)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

---

**Happy Learning! 🎓**