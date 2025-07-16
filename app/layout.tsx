import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navigation } from "@/components/navigation";
// Import your single, consolidated Providers component
import { Providers } from "@/components/providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Synapse Learning Pro - AI-Powered Adaptive Learning",
  description:
    "Transform your learning experience with AI-powered cognitive state detection and adaptive content delivery.",
  keywords: [
    "AI learning",
    "adaptive education",
    "cognitive detection",
    "personalized learning",
  ],
};

// The layout is no longer an async function
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        {/* Use the single Providers component to wrap your entire application */}
        <Providers>
          <div className="min-h-screen bg-background">
            <Navigation />
            <main>{children}</main>
          </div>
        </Providers>
      </body>
    </html>
  );
}
