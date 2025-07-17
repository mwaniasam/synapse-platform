/** @type {import('next').NextConfig} */
const nextConfig = {
  // Remove deprecated experimental options
  experimental: {
    // Remove appDir as it's now stable in Next.js 14
    // Remove optimizeCss as it's causing the critters error
  },

  // Enable SWC minification for better performance
  swcMinify: true,

  // Configure images domain for external images (like user avatars from Google)
  images: {
    domains: [
      "lh3.googleusercontent.com", // Google profile images
      "avatars.githubusercontent.com", // GitHub avatars if needed
    ],
    unoptimized: false,
  },

  // Environment variables that should be available on the client side
  env: {
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
  },

  // Webpack configuration for Material-UI and D3.js
  webpack: (config, { isServer }) => {
    // Handle D3.js modules
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      path: false,
      os: false,
    }

    return config
  },

  // Headers for security and CORS
  async headers() {
    return [
      {
        source: "/api/:path*",
        headers: [
          {
            key: "Access-Control-Allow-Origin",
            value:
              process.env.NODE_ENV === "production"
                ? process.env.NEXTAUTH_URL || "https://your-domain.vercel.app"
                : "http://localhost:3000",
          },
          {
            key: "Access-Control-Allow-Methods",
            value: "GET, POST, PUT, DELETE, OPTIONS",
          },
          {
            key: "Access-Control-Allow-Headers",
            value: "Content-Type, Authorization",
          },
        ],
      },
    ]
  },

  // Redirects for better UX
  async redirects() {
    return [
      {
        source: "/login",
        destination: "/auth/signin",
        permanent: true,
      },
      {
        source: "/signup",
        destination: "/auth/signin",
        permanent: true,
      },
    ]
  },

  // Compress responses
  compress: true,

  // Enable React strict mode
  reactStrictMode: true,

  // Optimize fonts
  optimizeFonts: true,

  // ESLint configuration
  eslint: {
    ignoreDuringBuilds: false,
  },

  // TypeScript configuration
  typescript: {
    ignoreBuildErrors: false,
  },

  // Disable CSS optimization that's causing issues
  optimizeCss: false,
}

module.exports = nextConfig
