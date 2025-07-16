import { prisma } from "@/lib/db";
import { unstable_noStore as noStore } from "next/cache";
import bcrypt from "bcryptjs";

export async function fetchPracticeData(userId: string) {
  noStore();
  try {
    const practiceSessions = await prisma.learningSession.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 5, // Fetching 5 recent sessions for practice
    });
    return practiceSessions;
  } catch (error) {
    console.error("Failed to fetch practice data:", error);
    return [];
  }
}

// --- NEW FUNCTION: fetchProgressData ---
// This function was also missing. It's needed by your /progress page.
// This placeholder fetches recent analytics data to show user progress.
export async function fetchProgressData(userId: string) {
  noStore();
  try {
    const progressAnalytics = await prisma.analytics.findMany({
      where: { userId },
      orderBy: { date: 'desc' },
      take: 30, // Fetching the last 30 data points for a progress chart
    });
    return progressAnalytics;
  } catch (error) {
    console.error("Failed to fetch progress data:", error);
    return [];
  }
}


// --- Existing User Functions ---

export async function getUserByEmail(email: string) {
  noStore();
  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });
    return user;
  } catch (error) {
    console.error("Failed to fetch user:", error);
    return null;
  }
}

export async function getUserById(id: string) {
  noStore();
  try {
    const user = await prisma.user.findUnique({
      where: { id },
    });
    return user;
  } catch (error) {
    console.error("Failed to fetch user:", error);
    return null;
  }
}

export async function createUser(email: string, password: string, name: string) {
  try {
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
      },
    });
    return user;
  } catch (error) {
    console.error("Failed to create user:", error);
    return null;
  }
}

export async function verifyPassword(password: string, hashedPassword: string) {
  return bcrypt.compare(password, hashedPassword);
}


// --- Existing Data Fetching Functions ---

export async function getSessionsByUserId(userId: string) {
  noStore();
  try {
    const sessions = await prisma.learningSession.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 10,
    });
    return sessions;
  } catch (error) {
    console.error("Failed to fetch sessions:", error);
    return [];
  }
}

export async function getCognitiveStateByUserId(userId: string) {
  noStore();
  try {
    const cognitiveState = await prisma.cognitiveState.findFirst({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
    return cognitiveState;
  } catch (error) {
    console.error("Failed to fetch cognitive state:", error);
    return null;
  }
}

export async function getKnowledgeGraphByUserId(userId: string) {
  noStore();
  try {
    const knowledgeNodes = await prisma.knowledgeNode.findMany({
      where: { userId },
      orderBy: { frequency: 'desc' },
    });
    return knowledgeNodes;
  } catch (error) {
    console.error("Failed to fetch knowledge graph:", error);
    return [];
  }
}

export async function getAnalyticsByUserId(userId: string) {
  noStore();
  try {
    const analytics = await prisma.analytics.findMany({
      where: { userId },
      orderBy: { date: 'desc' },
      take: 30,
    });
    return analytics;
  } catch (error) {
    console.error("Failed to fetch analytics:", error);
    return [];
  }
}

export async function getUserPreferences(userId: string) {
  noStore();
  try {
    const preferences = await prisma.userPreferences.findUnique({
      where: { userId },
    });
    return preferences;
  } catch (error) {
    console.error("Failed to fetch user preferences:", error);
    return null;
  }
}

export async function updateUserPreferences(userId: string, preferences: any) {
  try {
    const updated = await prisma.userPreferences.upsert({
      where: { userId },
      update: preferences,
      create: { userId, ...preferences },
    });
    return updated;
  } catch (error) {
    console.error("Failed to update preferences:", error);
    return null;
  }
}