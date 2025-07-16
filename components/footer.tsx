"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react"

export function Footer() {
  const footerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  }

  const socialIconVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
  }

  return (
    <motion.footer
      variants={footerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      className="w-full py-8 md:py-12 bg-gray-900 text-gray-300"
    >
      <div className="container px-4 md:px-6 grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
        <div className="space-y-4">
          <Link
            href="/"
            className="flex items-center justify-center md:justify-start gap-2 text-xl font-bold text-white"
          >
            <motion.svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-7 w-7 text-purple-400"
              initial={{ rotate: 0 }}
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
            >
              <path d="M12 2L2 7l10 5 10-5-10-5z" />
              <path d="M2 17l10 5 10-5" />
              <path d="M2 12l10 5 10-5" />
            </motion.svg>
            Synapse
          </Link>
          <p className="text-sm text-gray-400">
            Empowering your learning journey with intelligent, adaptive technology.
          </p>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/learn" className="hover:text-purple-400 transition-colors">
                Learn
              </Link>
            </li>
            <li>
              <Link href="/practice" className="hover:text-purple-400 transition-colors">
                Practice
              </Link>
            </li>
            <li>
              <Link href="/progress" className="hover:text-purple-400 transition-colors">
                Progress
              </Link>
            </li>
            <li>
              <Link href="/settings" className="hover:text-purple-400 transition-colors">
                Settings
              </Link>
            </li>
          </ul>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white">Connect With Us</h3>
          <div className="flex justify-center md:justify-start gap-4">
            <motion.a
              href="#"
              target="_blank"
              rel="noopener noreferrer"
              variants={socialIconVariants}
              whileHover={{ scale: 1.2, color: "#8B5CF6" }}
              className="text-gray-400 hover:text-purple-400 transition-colors"
            >
              <Facebook className="h-6 w-6" />
              <span className="sr-only">Facebook</span>
            </motion.a>
            <motion.a
              href="#"
              target="_blank"
              rel="noopener noreferrer"
              variants={socialIconVariants}
              whileHover={{ scale: 1.2, color: "#8B5CF6" }}
              className="text-gray-400 hover:text-purple-400 transition-colors"
            >
              <Twitter className="h-6 w-6" />
              <span className="sr-only">Twitter</span>
            </motion.a>
            <motion.a
              href="#"
              target="_blank"
              rel="noopener noreferrer"
              variants={socialIconVariants}
              whileHover={{ scale: 1.2, color: "#8B5CF6" }}
              className="text-gray-400 hover:text-purple-400 transition-colors"
            >
              <Instagram className="h-6 w-6" />
              <span className="sr-only">Instagram</span>
            </motion.a>
            <motion.a
              href="#"
              target="_blank"
              rel="noopener noreferrer"
              variants={socialIconVariants}
              whileHover={{ scale: 1.2, color: "#8B5CF6" }}
              className="text-gray-400 hover:text-purple-400 transition-colors"
            >
              <Linkedin className="h-6 w-6" />
              <span className="sr-only">LinkedIn</span>
            </motion.a>
          </div>
          <p className="text-sm text-gray-400 pt-4">&copy; {new Date().getFullYear()} Synapse. All rights reserved.</p>
        </div>
      </div>
    </motion.footer>
  )
}
