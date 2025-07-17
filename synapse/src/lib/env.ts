import { z } from "zod"

const envSchema = z.object({
  DATABASE_URL: z.string().url().optional(),
  NEXTAUTH_URL: z.string().url().optional(),
  NEXTAUTH_SECRET: z.string().min(1).optional(),
  GOOGLE_CLIENT_ID: z.string().min(1).optional(),
  GOOGLE_CLIENT_SECRET: z.string().min(1).optional(),
  GEMINI_API_KEY: z.string().min(1).optional(),
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
})

// Parse environment variables with fallbacks for development
export const env = envSchema.parse({
  DATABASE_URL: process.env.DATABASE_URL || "postgresql://localhost:5432/synapse",
  NEXTAUTH_URL: process.env.NEXTAUTH_URL || "http://localhost:3000",
  NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET || "development-secret-key",
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID || "development-client-id",
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET || "development-client-secret",
  GEMINI_API_KEY: process.env.GEMINI_API_KEY || "development-gemini-key",
  NODE_ENV: (process.env.NODE_ENV as "development" | "production" | "test") || "development",
})
