/** @type {import('next').NextConfig} */

const isProd = process.env.NODE_ENV === 'production';

module.exports = {
  output: 'export',
  reactStrictMode: true,
  assetPrefix: isProd ? 'https://nalchevanidze.github.io/wdaw' : undefined,
  transpilePackages: ['@wdaw/svg', '@wdaw/ui', '@wdaw/engine', '@wdaw/player']
};
