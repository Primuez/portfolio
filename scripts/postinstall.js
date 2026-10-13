const fs = require('node:fs');
const path = require('node:path');

// 1. Copy PDF worker
const pdfWorkerSrc = 'node_modules/pdfjs-dist/build/pdf.worker.min.mjs';
if (fs.existsSync(pdfWorkerSrc)) {
  fs.mkdirSync('public', { recursive: true });
  fs.copyFileSync(pdfWorkerSrc, 'public/pdf.worker.min.mjs');
}

// 2. Intercept @opennextjs/cloudflare CLI so Cloudflare dashboard command succeeds
const shimPath = path.resolve(__dirname, 'opennext-shim.js');
const targets = [
  'node_modules/@opennextjs/cloudflare/dist/cli/index.js',
  'node_modules/.bin/opennextjs-cloudflare',
];

for (const target of targets) {
  const fullTarget = path.resolve(target);
  try {
    if (fs.existsSync(fullTarget) || fs.lstatSync(fullTarget).isSymbolicLink()) {
      fs.unlinkSync(fullTarget);
    }
  } catch (e) {
    // ignore
  }

  try {
    const parentDir = path.dirname(fullTarget);
    if (!fs.existsSync(parentDir)) {
      fs.mkdirSync(parentDir, { recursive: true });
    }
    fs.copyFileSync(shimPath, fullTarget);
    fs.chmodSync(fullTarget, 0o755);
  } catch (e) {
    console.warn('Could not shim target:', target, e.message);
  }
}
