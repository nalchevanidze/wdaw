/** @type {import('next').NextConfig} */
module.exports = {
  output: 'export',
  reactStrictMode: true,
  transpilePackages: ['@wdaw/svg', '@wdaw/ui', '@wdaw/engine', '@wdaw/player']
};
