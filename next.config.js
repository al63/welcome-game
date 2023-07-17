/** @type {import('next').NextConfig} */

const shouldAnalyzeBundles = process.env.ANALYZE === "true";
let nextConfig = {};

if (shouldAnalyzeBundles) {
  const withNextBundleAnalyzer = require("@next/bundle-analyzer")();
  nextConfig = withNextBundleAnalyzer(nextConfig);
}

module.exports = nextConfig;
