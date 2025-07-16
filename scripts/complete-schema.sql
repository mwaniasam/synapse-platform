-- This script provides the complete and final database schema for the Synapse Platform.
-- It includes tables for users, accounts, sessions, user preferences, learning sessions,
-- and cognitive state logs.

-- Drop tables if they exist to ensure a clean slate for re-creation
-- This is useful for development, but be cautious in production environments.
DROP TABLE IF EXISTS "cognitive_state_logs" CASCADE;
DROP TABLE IF EXISTS "learning_sessions" CASCADE;
DROP TABLE IF EXISTS "user_preferences" CASCADE;
DROP TABLE IF EXISTS "sessions" CASCADE;
DROP TABLE IF EXISTS "accounts" CASCADE;
DROP TABLE IF EXISTS "users" CASCADE;
DROP TABLE IF EXISTS "VerificationToken" CASCADE;

-- Create the 'users' table
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT NOT NULL,
    "emailVerified" TIMESTAMP(3),
    "image" TEXT,
    "passwordHash" TEXT, -- Stores the hashed password for credential-based login
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- Create the 'accounts' table for OAuth providers (e.g., Google, GitHub)
CREATE TABLE "accounts" (
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

-- Create the 'sessions' table for user sessions (used by NextAuth.js)
CREATE TABLE "sessions" (
    "id" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sessions_pkey" PRIMARY KEY ("id")
);

-- Create the 'user_preferences' table to store user-specific settings
CREATE TABLE "user_preferences" (
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

-- Create the 'learning_sessions' table to log user learning activities
CREATE TABLE "learning_sessions" (
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

-- Create the 'cognitive_state_logs' table to track user's cognitive state over time
CREATE TABLE "cognitive_state_logs" (
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

-- Create the 'VerificationToken' table
CREATE TABLE "VerificationToken" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VerificationToken_pkey" PRIMARY KEY ("identifier", "token")
);

-- Add unique constraints for critical fields
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");
CREATE UNIQUE INDEX "accounts_provider_providerAccountId_key" ON "accounts"("provider", "providerAccountId");
CREATE UNIQUE INDEX "sessions_sessionToken_key" ON "sessions"("sessionToken");
CREATE UNIQUE INDEX "user_preferences_userId_key" ON "user_preferences"("userId");
CREATE UNIQUE INDEX "VerificationToken_token_key" ON "VerificationToken"("token");
CREATE UNIQUE INDEX "VerificationToken_identifier_token_key" ON "VerificationToken"("identifier", "token");

-- Add foreign key constraints to establish relationships between tables
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "user_preferences" ADD CONSTRAINT "user_preferences_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "learning_sessions" ADD CONSTRAINT "learning_sessions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "cognitive_state_logs" ADD CONSTRAINT "cognitive_state_logs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "VerificationToken" ADD CONSTRAINT "VerificationToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
