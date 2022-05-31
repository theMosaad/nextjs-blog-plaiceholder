/** @type {import('next').NextConfig} */
const { withPlaiceholder } = require("@plaiceholder/next");

const nextConfig = withPlaiceholder({
  reactStrictMode: true,
  images: {
    domains: ["raw.githubusercontent.com"],
  },
});

module.exports = nextConfig;
