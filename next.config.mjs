// next.config.mjs
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Add path alias configuration for .mjs
  webpack: (config, { isServer }) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': new URL('.', import.meta.url).pathname,
    }
    return config
  },
}

export default nextConfig
