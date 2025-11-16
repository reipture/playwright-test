#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

const username = process.env.GITHUB_USERNAME;
const password = process.env.GITHUB_PASSWORD;

if (!username || !password) {
  console.error('GITHUB_USERNAME and GITHUB_PASSWORD must be set before running the demo.');
  process.exit(1);
}

const credentialsPath = path.resolve(__dirname, '../auth/credentials.ts');
const generatedContent = `export const credentials = {\n  username: ${JSON.stringify(username)},\n  password: ${JSON.stringify(password)},\n};\n`;

const originalContent = fs.existsSync(credentialsPath)
  ? fs.readFileSync(credentialsPath, 'utf8')
  : null;

function restoreCredentialsFile() {
  if (originalContent !== null) {
    fs.writeFileSync(credentialsPath, originalContent, 'utf8');
  } else if (fs.existsSync(credentialsPath)) {
    fs.unlinkSync(credentialsPath);
  }
}

let cleanupCalled = false;
function cleanup() {
  if (cleanupCalled) {
    return;
  }
  cleanupCalled = true;
  try {
    restoreCredentialsFile();
  } catch (error) {
    console.error('Failed to clean up credentials file:', error);
  }
}

try {
  fs.writeFileSync(credentialsPath, generatedContent, 'utf8');
} catch (error) {
  console.error('Unable to write credentials file:', error);
  cleanup();
  process.exit(1);
}

const runTests = spawn('npx', ['playwright', 'test'], {
  stdio: 'inherit',
  cwd: path.resolve(__dirname, '..'),
});

runTests.on('exit', (code, signal) => {
  cleanup();
  if (signal) {
    process.kill(process.pid, signal);
    return;
  }
  process.exit(code);
});

runTests.on('error', (error) => {
  console.error('Failed to run Playwright tests:', error);
  cleanup();
  process.exit(1);
});

function handleSignal(signal) {
  if (runTests.exitCode === null) {
    runTests.kill(signal);
  }
}

process.on('SIGINT', handleSignal);
process.on('SIGTERM', handleSignal);
process.on('exit', cleanup);
