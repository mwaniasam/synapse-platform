-- This script initializes the database schema for the Synapse Platform.
-- It is designed to be "safe" by only creating tables if they do not already exist,
-- preventing errors when run on an existing database.

-- Create the 'users' table
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
CREATE TABLE IF NOT EXISTS "Account" (
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

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- Create the 'sessions' table for user sessions
CREATE TABLE IF NOT EXISTS "Session" (
    "id" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
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

-- Create the 'VerificationToken' table
CREATE TABLE IF NOT EXISTS "VerificationToken" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL
);

-- Add unique constraints (only if they don't exist, though SQL usually handles this)
-- These will typically error if the index already exists, so often handled by ORM or initial setup
DO $$ BEGIN
    CREATE UNIQUE INDEX IF NOT EXISTS "User_email_key" ON "User"("email");
EXCEPTION
    WHEN duplicate_table THEN NULL;
END $$;

DO $$ BEGIN
    CREATE UNIQUE INDEX IF NOT EXISTS "Account_provider_providerAccountId_key" ON "Account"("provider", "providerAccountId");
EXCEPTION
    WHEN duplicate_table THEN NULL;
END $$;

DO $$ BEGIN
    CREATE UNIQUE INDEX IF NOT EXISTS "Session_sessionToken_key" ON "Session"("sessionToken");
EXCEPTION
    WHEN duplicate_table THEN NULL;
END $$;

DO $$ BEGIN
    CREATE UNIQUE INDEX IF NOT EXISTS "VerificationToken_token_key" ON "VerificationToken"("token");
EXCEPTION
    WHEN duplicate_table THEN NULL;
END $$;

DO $$ BEGIN
    CREATE UNIQUE INDEX IF NOT EXISTS "VerificationToken_identifier_token_key" ON "VerificationToken"("identifier", "token");
EXCEPTION
    WHEN duplicate_table THEN NULL;
END $$;

-- Add foreign key constraints (only if they don't exist, or handle gracefully)
-- PostgreSQL will error if a constraint with the same name already exists.
-- A more robust solution for existing constraints might involve checking pg_constraint table.
-- For simplicity, this assumes initial creation or a fresh database.
ALTER TABLE "Account" DROP CONSTRAINT IF EXISTS "Account_userId_fkey";
ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "Session" DROP CONSTRAINT IF EXISTS "Session_userId_fkey";
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "user_preferences" ADD CONSTRAINT "user_preferences_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "learning_sessions" ADD CONSTRAINT "learning_sessions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "cognitive_state_logs" ADD CONSTRAINT "cognitive_state_logs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
