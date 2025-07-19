import { z } from "zod"

const envSchema = z.object({
  // Database
  DATABASE_URL: z.string().url().optional(),
  
  // Authentication
  NEXTAUTH_URL: z.string().url().optional(),
  NEXTAUTH_SECRET: z.string().min(1).optional(),
  GOOGLE_CLIENT_ID: z.string().min(1).optional(),
  GOOGLE_CLIENT_SECRET: z.string().min(1).optional(),
  
  // AI Services
  GEMINI_API_KEY: z.string().optional(),
  GROK_API_KEY: z.string().optional().default(''),
  GROK_MODEL: z.string().default("grok-1"),
  
  // App Configuration
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
})

// Parse environment variables with fallbacks for development
export const env = envSchema.parse({
  // Database
  DATABASE_URL: process.env.DATABASE_URL || "postgresql://localhost:5432/synapse",
  
  // Authentication
  NEXTAUTH_URL: process.env.NEXTAUTH_URL || "http://localhost:3000",
  NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET || "development-secret-key",
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID || "development-client-id",
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET || "development-client-secret",
  
  // AI Services
  GEMINI_API_KEY: process.env.GEMINI_API_KEY || "development-gemini-key",
  GROK_API_KEY: process.env.GROK_API_KEY || "",
  GROK_MODEL: process.env.GROK_MODEL || "grok-1",
  
  // App Configuration
  NODE_ENV: (process.env.NODE_ENV as "development" | "production" | "test") || "development",
})
