import path from 'path';
import type { NextConfig } from 'next';

const monorepoRoot = path.resolve(process.cwd(), '../..');

const nextConfig: NextConfig = {
  transpilePackages: ['@cortex/shared'],
  // Monorepo: Vercel precisa rastrear dependências na raiz do repo
  outputFileTracingRoot: monorepoRoot,
  turbopack: {
    root: monorepoRoot,
  },
};

export default nextConfig;
