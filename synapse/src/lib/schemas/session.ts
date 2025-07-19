import { z } from 'zod';

// Define the schema first
const createSessionSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional().nullable(),
  subject: z.string().optional().nullable(),
  goals: z.preprocess(
    (val) => {
      if (Array.isArray(val)) {
        return val.filter((item): item is string => typeof item === 'string');
      }
      return [];
    },
    z.array(z.string())
  ).default([]),
  totalDuration: z.number().optional().nullable(),
  activeDuration: z.number().optional().nullable(),
  interactions: z.number().optional().nullable(),
  adaptationsUsed: z.number().optional().nullable(),
});

// Derive the type from the schema
export type CreateSessionData = z.infer<typeof createSessionSchema>;

// Session update schema
const updateSessionSchema = z.object({
  endTime: z.string().datetime().optional(),
  duration: z.number().optional(),
  focusScore: z.number().min(0).max(1).optional(),
  conceptsLearned: z.number().optional(),
  adaptationsUsed: z.number().optional(),
});

// TypeScript types derived from schemas
type CreateSessionInput = z.input<typeof createSessionSchema>;
type CreateSessionOutput = z.output<typeof createSessionSchema>;
type UpdateSessionInput = z.input<typeof updateSessionSchema>;

// Export types and schemas
export {
  createSessionSchema,
  updateSessionSchema,
  type CreateSessionInput,
  type CreateSessionOutput,
  type UpdateSessionInput,
};
