import "server-only";
import { prisma } from "@/lib/db";
import { unstable_noStore as noStore } from "next/cache";
import bcrypt from "bcryptjs";

// Create a new user
export async function createUser(data: { email: string; password: string; name?: string }) {
  try {
    const hashedPassword = await bcrypt.hash(data.password, 10);
    const user = await prisma.user.create({
      data: {
        email: data.email,
        passwordHash: hashedPassword,
        name: data.name,
      },
    });
    return user;
  } catch (error) {
    console.error("Failed to create user:", error);
    throw new Error("Failed to create user.");
  }
}

export async function getUserById(id: number) {
  noStore();
  try {
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    return user;
  } catch (error) {
    console.error("Failed to fetch user:", error);
    throw new Error("Failed to fetch user.");
  }
}

export async function getUserByEmail(email: string) {
  noStore();
  try {
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        passwordHash: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    return user;
  } catch (error) {
    console.error("Failed to fetch user by email:", error);
    throw new Error("Failed to fetch user by email.");
  }
}

// Placeholder for fetching dashboard data
export async function fetchDashboardData(userId: number) {
  noStore();
  try {
    // Simulate fetching data
    await new Promise((resolve) => setTimeout(resolve, 500));

    const data = {
      overallProgress: 75,
      masteryScore: 88,
      completedModules: 12,
      totalModules: 15,
      focusLevel: 85,
      energyLevel: 70,
      comprehension: 90,
      engagement: 75,
      recentSessions: [
        {
          id: "1",
          date: "2024-07-10",
          duration: "45 min",
          topic: "AI Fundamentals",
          performance: "Excellent" as const,
        },
        {
          id: "2",
          date: "2024-07-08",
          duration: "60 min",
          topic: "Machine Learning Basics",
          performance: "Good" as const,
        },
        {
          id: "3",
          date: "2024-07-05",
          duration: "30 min",
          topic: "Neural Networks",
          performance: "Average" as const,
        },
      ],
      cognitiveTrends: [
        { name: "Week 1", focus: 70, energy: 60, comprehension: 75, engagement: 65 },
        { name: "Week 2", focus: 75, energy: 65, comprehension: 80, engagement: 70 },
        { name: "Week 3", focus: 80, energy: 70, comprehension: 85, engagement: 75 },
        { name: "Week 4", focus: 85, energy: 75, comprehension: 90, engagement: 80 },
      ],
      aiInsights: [
        "Your focus levels are consistently high during morning sessions.",
        "Consider reviewing 'Data Preprocessing' as comprehension dipped in recent quizzes.",
        "Increased engagement observed when interactive exercises are present.",
      ],
      aiRecommendations: [
        {
          id: "rec1",
          title: "Advanced Deep Learning Course",
          type: "course",
          description: "Dive deeper into neural network architectures.",
        },
        {
          id: "rec2",
          title: "Reinforcement Learning Basics",
          type: "topic",
          description: "Explore how agents learn through trial and error.",
        },
        {
          id: "rec3",
          title: "Interactive Python Notebooks",
          type: "resource",
          description: "Hands-on coding exercises for practical application.",
        },
      ],
    };
    return data;
  } catch (error) {
    console.error("Failed to fetch dashboard data:", error);
    throw new Error("Failed to fetch dashboard data.");
  }
}

// Placeholder for fetching learning data
export async function fetchLearningData(userId: number) {
  noStore();
  try {
    // Simulate fetching data
    await new Promise((resolve) => setTimeout(resolve, 500));

    const data = {
      learningPath: [
        {
          id: "step1",
          title: "Introduction to AI",
          description: "Understand the basics of Artificial Intelligence.",
          status: "completed" as const,
        },
        {
          id: "step2",
          title: "Machine Learning Fundamentals",
          description: "Learn core ML algorithms and concepts.",
          status: "in-progress" as const,
        },
        {
          id: "step3",
          title: "Deep Learning Architectures",
          description: "Explore neural networks and their applications.",
          status: "upcoming" as const,
        },
        {
          id: "step4",
          title: "Natural Language Processing",
          description: "Dive into how AI understands human language.",
          status: "upcoming" as const,
        },
      ],
      coreConcepts: [
        { id: "c1", title: "Supervised Learning", status: "mastered" as const },
        { id: "c2", title: "Unsupervised Learning", status: "review" as const },
        { id: "c3", title: "Reinforcement Learning", status: "new" as const },
        { id: "c4", title: "Neural Networks", status: "mastered" as const },
        { id: "c5", title: "Data Preprocessing", status: "review" as const },
        { id: "c6", title: "Model Evaluation", status: "mastered" as const },
      ],
      interactiveGraph: {
        nodesCount: 50,
        edgesCount: 120,
      },
      adaptiveContent: [
        {
          id: "ac1",
          title: "ML Basics: Linear Regression",
          type: "text" as const,
          content:
            "Linear regression is a fundamental algorithm in machine learning that models the relationship between a dependent variable and one or more independent variables by fitting a linear equation to observed data. It is widely used for predictive analysis.",
        },
        {
          id: "ac2",
          title: "Video: Gradient Descent Explained",
          type: "video" as const,
          content: "https://www.youtube.com/watch?v=L-g7p3Wb_2U",
        },
        {
          id: "ac3",
          title: "Quiz: Supervised Learning",
          type: "quiz" as const,
          content:
            "What is the primary goal of supervised learning? A) Clustering data B) Predicting outcomes based on labeled data C) Discovering hidden patterns D) Reducing dimensionality",
        },
      ],
    };
    return data;
  } catch (error) {
    console.error("Failed to fetch learning data:", error);
    throw new Error("Failed to fetch learning data.");
  }
}

// Placeholder for fetching practice data
export async function fetchPracticeData(userId: number) {
  noStore();
  try {
    // Simulate fetching data
    await new Promise((resolve) => setTimeout(resolve, 500));

    const data = {
      sessionControls: {
        onStart: () => console.log("Session started"),
        onPause: () => console.log("Session paused"),
        onReset: () => console.log("Session reset"),
        onEndSession: () => console.log("Session ended"),
      },
      cognitiveStateMonitor: {
        focusLevel: 75,
        energyLevel: 60,
        comprehension: 80,
        engagement: 70,
      },
      cognitiveStateFeedback: {
        feedback: "You're doing great! Keep up the focus. Consider taking a short break if your energy dips.",
        trend: "improving" as const,
      },
    };
    return data;
  } catch (error) {
    console.error("Failed to fetch practice data:", error);
    throw new Error("Failed to fetch practice data.");
  }
}

// Placeholder for fetching progress data
export async function fetchProgressData(userId: number) {
  noStore();
  try {
    // Simulate fetching data
    await new Promise((resolve) => setTimeout(resolve, 500));

    const data = {
      progressOverview: {
        overallProgress: 75,
        masteryScore: 88,
        completedModules: 12,
        totalModules: 15,
      },
      learningAnalytics: {
        timeSpent: [
          { topic: "AI Fundamentals", hours: 25 },
          { topic: "Machine Learning", hours: 40 },
          { topic: "Deep Learning", hours: 30 },
          { topic: "NLP", hours: 15 },
        ],
        quizScores: [
          { topic: "AI Fundamentals", score: 92 },
          { topic: "Machine Learning", score: 85 },
          { topic: "Deep Learning", score: 78 },
          { topic: "NLP", score: 90 },
        ],
      },
      skillsRadarChart: {
        skills: [
          { skill: "Problem Solving", level: 85 },
          { skill: "Critical Thinking", level: 70 },
          { skill: "Data Analysis", level: 90 },
          { skill: "Algorithm Design", level: 75 },
          { skill: "Communication", level: 80 },
        ],
      },
    };
    return data;
  } catch (error) {
    console.error("Failed to fetch progress data:", error);
    throw new Error("Failed to fetch progress data.");
  }
}

// Placeholder for fetching settings data
export async function fetchSettingsData(userId: number) {
  noStore();
  try {
    // Simulate fetching data
    await new Promise((resolve) => setTimeout(resolve, 500));

    const data = {
      initialName: "John Doe",
      initialEmail: "john.doe@example.com",
      initialLearningStyle: "visual",
    };
    return data;
  } catch (error) {
    console.error("Failed to fetch settings data:", error);
    throw new Error("Failed to fetch settings data.");
  }
}