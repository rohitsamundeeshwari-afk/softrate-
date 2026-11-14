const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('--- 1. Building React Frontend with Vite ---');
execSync('npm --prefix frontend install && npm --prefix frontend run build', { stdio: 'inherit' });

console.log('--- 2. Creating Vercel Server Entrypoints in dist/ ---');
const entryContent = "const app = require('../backend/server');\nmodule.exports = app;\n";

const distDir = path.join(__dirname, 'dist');
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}

fs.writeFileSync(path.join(distDir, 'index.js'), entryContent);
fs.writeFileSync(path.join(distDir, 'server.js'), entryContent);
fs.writeFileSync(path.join(distDir, 'app.js'), entryContent);

console.log('✔ Entrypoints generated: dist/index.js, dist/server.js, dist/app.js');
console.log('--- Build Finished Successfully ---');
