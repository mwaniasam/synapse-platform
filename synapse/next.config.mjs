// @ts-nocheck
/** @type {import('next').NextConfig} */
import path from 'path';
import { fileURLToPath } from 'url';
import { withSentryConfig } from '@sentry/nextjs';

// Set Node.js TLS settings for development
if (process.env.NODE_ENV !== 'production') {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Your existing Sentry configuration
const sentryWebpackPluginOptions = {
  // Additional config options for the Sentry Webpack plugin
  silent: true, // Suppresses all logs
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,
  authToken: process.env.SENTRY_AUTH_TOKEN,
  // For all available options, see:
  // https://github.com/getsentry/sentry-webpack-plugin#options
};

// Disable Sentry in development or when explicitly disabled
const disableSentry = process.env.NEXT_PUBLIC_SENTRY_ENABLED === 'false' || 
                     process.env.NODE_ENV !== 'production';

// Security headers configuration
const securityHeaders = [
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on'
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload'
  },
  {
    key: 'X-XSS-Protection',
    value: '1; mode=block'
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff'
  },
  {
    key: 'X-Frame-Options',
    value: 'SAMEORIGIN'
  },
  {
    key: 'Referrer-Policy',
    value: 'origin-when-cross-origin'
  },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()'
  },
  // CORS headers
  {
    key: 'Access-Control-Allow-Origin',
    value: process.env.ALLOWED_ORIGINS || '*'
  },
  {
    key: 'Access-Control-Allow-Methods',
    value: 'GET, POST, PUT, DELETE, OPTIONS'
  },
  {
    key: 'Access-Control-Allow-Headers',
    value: 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  },
  {
    key: 'Access-Control-Allow-Credentials',
    value: 'true'
  }
];

const nextConfig = {
  // Enable source maps in production for Sentry
  productionBrowserSourceMaps: true,
  
  // Enable React strict mode
  reactStrictMode: true,
  
  // Enable server components
  experimental: {
    serverComponentsExternalPackages: ['@prisma/client'],
    // Server Actions are enabled by default in Next.js 14
    // esmExternals is set to true by default
    optimizeCss: true,
    optimizePackageImports: ['@mui/material', '@emotion/react', '@emotion/styled'],
  },
  
  // Enable SWC minification for better performance
  swcMinify: true,

  // Configure images domain for external images
  images: {
    domains: [
      "lh3.googleusercontent.com",
      "avatars.githubusercontent.com",
    ],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    unoptimized: process.env.NODE_ENV === 'development',
  },

  // Environment variables that should be available on the client side
  env: {
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    NEXT_PUBLIC_SENTRY_DSN: process.env.NEXT_PUBLIC_SENTRY_DSN,
  },

  // Headers configuration
  async headers() {
    return [
      {
        // Apply these headers to all routes
        source: '/(.*)',
        headers: securityHeaders,
      },
    ];
  },

  // Webpack configuration
  webpack: (config, { isServer, dev }) => {
    // Add source maps in development
    if (!dev) {
      config.devtool = 'source-map';
    }

    // Handle Node.js modules
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      path: false,
      os: false,
      dns: false,
      net: false,
      tls: false,
      child_process: false,
    };

    // Exclude problematic modules from client-side builds
    if (!isServer) {
      // Replace server-only modules with empty mocks on the client
      const emptyModule = path.join(__dirname, 'src/lib/empty-module.js');
      
      config.resolve.alias = {
        ...config.resolve.alias,
        // Server-side only modules
        'grok-api-ts$': emptyModule,
        'patchright-core$': emptyModule,
        'chromium-bidi$': emptyModule,
        'cacheable-lookup$': emptyModule,
        'got-cjs$': emptyModule,
        'got-scraping$': emptyModule,
      };
      
      // Add a loader to ignore these modules completely
      config.module.rules.push({
        test: /\/(grok-api-ts|patchright-core|chromium-bidi)\/.*\.(js|ts|jsx|tsx)$/,
        use: 'null-loader',
      });
    }

    // Fix for module resolution issues
    config.resolve.alias = {
      ...config.resolve.alias,
      'react/jsx-runtime.js': 'react/jsx-runtime',
    };

    // Fix for path aliases
    if (!isServer) {
      config.resolve.alias['@/lib'] = path.resolve(__dirname, 'src/lib');
    }

    // Fix for development mode HMR
    if (dev && !isServer) {
      config.watchOptions = {
        ...config.watchOptions,
        ignored: ['**/node_modules/**', '**/.next/**'],
      };
    }

    return config;
  },

  // Compress responses
  compress: true,
};

const updatedConfig = {
  ...nextConfig,
  webpack: (config, { isServer }) => {
    // Add rule to handle font files
    config.module.rules.push({
      test: /\.(ttf|eot|woff|woff2|otf)$/,
      type: 'asset/resource',
      generator: {
        filename: 'static/fonts/[name][ext]',
      },
    });

    // Add rule to handle other binary assets
    config.module.rules.push({
      test: /\.(bin|data|wasm)$/,
      type: 'asset/resource',
      generator: {
        filename: 'static/media/[name][ext]',
      },
    });

    // Exclude problematic modules from server-side bundling
    if (isServer) {
      config.externals = config.externals || [];
      config.externals.push(({ context, request }, callback) => {
        // Exclude patchright-core from server-side bundling
        if (request && request.includes('patchright-core')) {
          return callback(null, `commonjs ${request}`);
        }
        return callback();
      });
    }

    // Apply existing webpack config if it exists
    if (typeof nextConfig.webpack === 'function') {
      return nextConfig.webpack(config, { isServer });
    }

    return config;
  },
};

// Apply Sentry configuration
const configWithSentry = withSentryConfig(
  updatedConfig,
  {
    ...sentryWebpackPluginOptions,
    silent: true,
    // @ts-ignore
    disableServerWebpackPlugin: disableSentry,
    disableClientWebpackPlugin: disableSentry,
  }
);

export default configWithSentry;
