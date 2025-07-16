import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

async function main() {
  console.log("Start seeding...")

  // Create a test user
  const hashedPassword = await bcrypt.hash("password123", 10)
  const testUser = await prisma.user.upsert({
    where: { email: "test@example.com" },
    update: {
      name: "Test User",
      passwordHash: hashedPassword,
      learningStyle: "visual",
    },
    create: {
      email: "test@example.com",
      name: "Test User",
      passwordHash: hashedPassword,
      learningStyle: "visual",
      image: "/avatars/sophia.jpg", // Example image
    },
  })
  console.log(`Created/updated test user with ID: ${testUser.id}`)

  // Create some dummy focus sessions for the test user
  await prisma.focusSession.createMany({
    data: [
      {
        userId: testUser.id,
        duration: 45,
        topic: "AI Fundamentals",
        performance: "Excellent",
      },
      {
        userId: testUser.id,
        duration: 60,
        topic: "Machine Learning Basics",
        performance: "Good",
      },
      {
        userId: testUser.id,
        duration: 30,
        topic: "Neural Networks",
        performance: "Average",
      },
      {
        userId: testUser.id,
        duration: 50,
        topic: "Data Structures",
        performance: "Excellent",
      },
      {
        userId: testUser.id,
        duration: 35,
        topic: "Algorithms",
        performance: "Good",
      },
    ],
    skipDuplicates: true, // Skip if a session with the same unique fields already exists
  })
  console.log("Seeded dummy focus sessions.")

  console.log("Seeding finished.")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
