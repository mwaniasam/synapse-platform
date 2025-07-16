/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // Remove the deprecated serverComponentsExternalPackages
  },
  serverExternalPackages: ['@prisma/client', 'bcryptjs'],
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    domains: ['lh3.googleusercontent.com'],
    unoptimized: true,
  },
}

export default nextConfig
