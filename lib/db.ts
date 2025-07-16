import { PrismaClient } from "@prisma/client"

// This is a singleton pattern to prevent multiple instances of PrismaClient
// in development, which can lead to issues like "too many connections".
declare global {
  // eslint-disable-next-line no-var
  var prismaInstance: PrismaClient | undefined
}

export const prisma =
  global.prismaInstance ||
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  })

if (process.env.NODE_ENV !== "production") {
  global.prismaInstance = prisma
}
