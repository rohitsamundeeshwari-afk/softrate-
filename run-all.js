const { spawn } = require('child_process');
const path = require('path');

console.log('\x1b[36m%s\x1b[0m', '==============================================');
console.log('\x1b[36m%s\x1b[0m', ' Starting MERN Full Stack Tech Blog Platform ');
console.log('\x1b[36m%s\x1b[0m', '==============================================\n');

const isWindows = process.platform === 'win32';
const npmCmd = isWindows ? 'npm.cmd' : 'npm';

// Start Backend
const backend = spawn(npmCmd, ['run', 'dev'], {
  cwd: path.join(__dirname, 'backend'),
  stdio: 'pipe',
  shell: true,
});

backend.stdout.on('data', (data) => {
  process.stdout.write(`\x1b[32m[BACKEND]\x1b[0m ${data}`);
});

backend.stderr.on('data', (data) => {
  process.stderr.write(`\x1b[31m[BACKEND ERROR]\x1b[0m ${data}`);
});

// Start Frontend
const frontend = spawn(npmCmd, ['run', 'dev'], {
  cwd: path.join(__dirname, 'frontend'),
  stdio: 'pipe',
  shell: true,
});

frontend.stdout.on('data', (data) => {
  process.stdout.write(`\x1b[34m[FRONTEND]\x1b[0m ${data}`);
});

frontend.stderr.on('data', (data) => {
  process.stderr.write(`\x1b[33m[FRONTEND LOG]\x1b[0m ${data}`);
});

process.on('SIGINT', () => {
  backend.kill();
  frontend.kill();
  process.exit();
});
