/** @type {import('next').NextConfig} */
import { PHASE_DEVELOPMENT_SERVER } from 'next/constants'

const isDev = phase === PHASE_DEVELOPMENT_SERVER

module.exports = {
  output: 'export',
  reactStrictMode: true,
  assetPrefix: isDev ? undefined : 'https://nalchevanidze.github.io/wdaw/',
  transpilePackages: ['@wdaw/svg', '@wdaw/ui', '@wdaw/engine', '@wdaw/player']
};
