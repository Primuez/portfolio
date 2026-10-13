#!/usr/bin/env node
const { execSync } = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');

console.log('⚡ [Astro-Cloudflare] Executing Astro production build...');
execSync('npx astro build', { stdio: 'inherit' });

// Ensure .open-next exists with worker and assets so legacy checks pass
const openNextDir = path.resolve('.open-next');
const openNextAssets = path.join(openNextDir, 'assets');
fs.mkdirSync(openNextAssets, { recursive: true });

// Copy dist into .open-next/assets
if (fs.existsSync(path.resolve('dist'))) {
  fs.cpSync(path.resolve('dist'), openNextAssets, { recursive: true });
}

// Copy worker shim
const workerShim = path.resolve('scripts/worker-shim.js');
if (fs.existsSync(workerShim)) {
  fs.copyFileSync(workerShim, path.join(openNextDir, 'worker.js'));
}

console.log('⚡ [Astro-Cloudflare] Build and asset preparation complete!');
process.exit(0);
