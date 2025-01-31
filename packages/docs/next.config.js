/** @type {import('next').NextConfig} */
module.exports = {
  output: 'export',
  reactStrictMode: true,
  assetPrefix: 'https://nalchevanidze.github.io/wdaw',
  transpilePackages: ['@wdaw/svg', '@wdaw/ui', '@wdaw/engine', '@wdaw/player']
};
