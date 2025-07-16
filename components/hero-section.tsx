"use client"

import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"

export function HeroSection() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  }

  return (
    <section className="relative w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-gradient-to-br from-purple-50 to-indigo-50 overflow-hidden">
      <div className="container px-4 md:px-6 grid gap-6 lg:grid-cols-[1fr_500px] lg:gap-12 xl:grid-cols-[1fr_600px] items-center">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col justify-center space-y-4 text-center lg:text-left"
        >
          <motion.h1
            variants={itemVariants}
            className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl text-gray-900 leading-tight"
          >
            Unlock Your Full Learning Potential with AI
          </motion.h1>
          <motion.p variants={itemVariants} className="max-w-[600px] text-gray-700 md:text-xl mx-auto lg:mx-0">
            Synapse is an AI-powered adaptive learning platform that personalizes your educational journey, helping you
            learn smarter, not just harder.
          </motion.p>
          <motion.div
            variants={itemVariants}
            className="flex flex-col gap-2 min-[400px]:flex-row justify-center lg:justify-start"
          >
            <Link href="/auth/signup">
              <Button className="w-full min-[400px]:w-auto bg-purple-600 hover:bg-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                Start Learning Free
              </Button>
            </Link>
            <Button
              variant="outline"
              className="w-full min-[400px]:w-auto border-purple-600 text-purple-600 hover:bg-purple-50 hover:text-purple-700 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 bg-transparent"
            >
              Watch Demo
            </Button>
          </motion.div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
          className="relative h-[300px] w-full lg:h-[400px] xl:h-[500px] flex items-center justify-center"
        >
          <Image
            src="/images/brain-hero.png"
            width={600}
            height={600}
            alt="AI-powered brain illustration"
            className="object-contain w-full h-full animate-float"
            priority
          />
        </motion.div>
      </div>
    </section>
  )
}
