/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
}

module.exports = nextConfig

// next.config.js
module.exports = {
  // ... rest of the configuration.
  experimental: {
    outputStandalone: true,
  },
}