-- This script initializes the database schema for the Synapse Platform.

-- Create the 'User' table
CREATE TABLE IF NOT EXISTS "User" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT NOT NULL,
    "emailVerified" TIMESTAMP(3),
    "image" TEXT,
    "passwordHash" TEXT, -- Store hashed passwords
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- Create the 'accounts' table for OAuth providers
CREATE TABLE IF NOT EXISTS "accounts" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "accounts_pkey" PRIMARY KEY ("id")
);

-- Create the 'sessions' table for user sessions
CREATE TABLE IF NOT EXISTS "sessions" (
    "id" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sessions_pkey" PRIMARY KEY ("id")
);

-- Create the 'user_preferences' table
CREATE TABLE IF NOT EXISTS "user_preferences" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "theme" TEXT NOT NULL DEFAULT 'system', -- 'light', 'dark', 'system'
    "learningPace" TEXT NOT NULL DEFAULT 'moderate', -- 'slow', 'moderate', 'fast'
    "preferredLanguage" TEXT NOT NULL DEFAULT 'en',
    "notificationsEnabled" BOOLEAN NOT NULL DEFAULT TRUE,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_preferences_pkey" PRIMARY KEY ("id")
);

-- Create the 'learning_sessions' table
CREATE TABLE IF NOT EXISTS "learning_sessions" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endTime" TIMESTAMP(3),
    "durationMinutes" INTEGER,
    "topic" TEXT,
    "score" INTEGER,
    "feedback" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "learning_sessions_pkey" PRIMARY KEY ("id")
);

-- Create the 'cognitive_state_logs' table
CREATE TABLE IF NOT EXISTS "cognitive_state_logs" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "focusLevel" DOUBLE PRECISION, -- e.g., 0.0 to 1.0
    "engagementLevel" DOUBLE PRECISION,
    "stressLevel" DOUBLE PRECISION,
    "mood" TEXT, -- e.g., 'neutral', 'positive', 'negative'
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cognitive_state_logs_pkey" PRIMARY KEY ("id")
);

-- Add unique constraints
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE UNIQUE INDEX "accounts_provider_providerAccountId_key" ON "accounts"("provider", "providerAccountId");
CREATE UNIQUE INDEX "sessions_sessionToken_key" ON "sessions"("sessionToken");
CREATE UNIQUE INDEX "user_preferences_userId_key" ON "user_preferences"("userId");

-- Add foreign key constraints
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "user_preferences" ADD CONSTRAINT "user_preferences_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "learning_sessions" ADD CONSTRAINT "learning_sessions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "cognitive_state_logs" ADD CONSTRAINT "cognitive_state_logs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
