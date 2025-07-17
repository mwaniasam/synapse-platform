/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
    optimizeCss: true,
    scrollRestoration: true,
  },
  // Enable SWC minification for better performance
  swcMinify: true,

  // Configure images domain for external images (like user avatars from Google)
  images: {
    domains: [
      "lh3.googleusercontent.com", // Google profile images
      "avatars.githubusercontent.com", // GitHub avatars if needed
    ],
    unoptimized: true,
  },

  // Environment variables that should be available on the client side
  env: {
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
  },

  // Webpack configuration for D3.js and other libraries
  webpack: (config, { isServer }) => {
    // Handle D3.js modules
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      path: false,
      os: false,
    }

    // Optimize bundle size
    if (!isServer) {
      config.resolve.alias = {
        ...config.resolve.alias,
        "@mui/styled-engine": "@mui/styled-engine-sc",
      }
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
    ignoreDuringBuilds: true,
  },

  // TypeScript configuration
  typescript: {
    ignoreBuildErrors: true,
  },
}

module.exports = nextConfig
