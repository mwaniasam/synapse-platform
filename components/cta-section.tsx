"use client"

import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import Link from "next/link"

export function CtaSection() {
  const ctaVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  }

  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-br from-purple-600 to-indigo-700 text-white">
      <div className="container px-4 md:px-6 text-center">
        <motion.div
          variants={ctaVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
          className="space-y-6"
        >
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl leading-tight">
            Ready to Transform Your Learning?
          </h2>
          <p className="max-w-[800px] mx-auto text-lg md:text-xl text-purple-100">
            Join thousands of learners who are already experiencing the future of education. Sign up today and start
            your personalized learning journey.
          </p>
          <div className="flex flex-col gap-4 min-[400px]:flex-row justify-center">
            <Link href="/auth/signup">
              <Button className="w-full min-[400px]:w-auto bg-white text-purple-700 hover:bg-gray-100 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                Get Started for Free
              </Button>
            </Link>
            <Button
              variant="outline"
              className="w-full min-[400px]:w-auto border-white text-white hover:bg-white/20 hover:text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 bg-transparent"
            >
              Learn More
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
