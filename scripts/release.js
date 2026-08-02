#!/usr/bin/env node

/**
 * ZLuxury Release & Auto-Deploy Script
 * ====================================
 *
 * One-command release: bumps version, commits all changes, pushes to main,
 * and pushes the git tag. The push to `main` automatically triggers the
 * GitHub Actions workflow (.github/workflows/deploy.yml) which builds the
 * static export and deploys it to GitHub Pages.
 *
 * Usage:
 *   pnpm run release              # patch bump (default)  2.1.0 -> 2.1.1
 *   pnpm run release:patch        # explicit patch
 *   pnpm run release:minor        # minor bump            2.1.0 -> 2.2.0
 *   pnpm run release:major        # major bump            2.1.0 -> 3.0.0
 *
 * After running, monitor the deploy at:
 *   https://github.com/zwindhuang-opc/zluxury/actions
 *
 * Live site (a few minutes after the action completes):
 *   https://zwindhuang-opc.github.io/zluxury/
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const DEFAULT_REMOTE_URL = 'https://github.com/zwindhuang-opc/zluxury.git';
const PAGES_URL = 'https://zwindhuang-opc.github.io/zluxury/';
const ACTIONS_URL = 'https://github.com/zwindhuang-opc/zluxury/actions';

/**
 * Executes a shell command and returns trimmed stdout.
 * Throws a contextual Error if the command exits non-zero.
 * @param {string} command - Shell command to execute.
 * @returns {string} Trimmed stdout.
 */
function run(command) {
  try {
    return execSync(command, { encoding: 'utf-8', stdio: 'pipe' }).trim();
  } catch (err) {
    const stderr = err.stderr ? err.stderr.toString().trim() : '';
    const stdout = err.stdout ? err.stdout.toString().trim() : '';
    throw new Error(`${command}\n${stderr || stdout || err.message}`);
  }
}

/**
 * Runs a command inheriting stdio so the user sees live output.
 * @param {string} command - Shell command to execute.
 */
function runInherit(command) {
  execSync(command, { stdio: 'inherit' });
}

/** @returns {string} Current ISO timestamp for commit messages. */
function timestamp() {
  const now = new Date();
  const pad = (n) => String(n).padStart(2, '0');
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
}

/**
 * Bumps a semver string by the given type.
 * @param {string} v - "major.minor.patch"
 * @param {"major"|"minor"|"patch"} type
 * @returns {string} New version.
 */
function bump(v, type) {
  const [maj, min, pat] = v.split('.').map((n) => parseInt(n, 10));
  if ([maj, min, pat].some(Number.isNaN)) {
    throw new Error(`Invalid version: "${v}"`);
  }
  if (type === 'major') return `${maj + 1}.0.0`;
  if (type === 'minor') return `${maj}.${min + 1}.0`;
  return `${maj}.${min}.${pat + 1}`;
}

/** Reads and parses a JSON file. */
function readJSON(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
}

/** Writes an object to a JSON file with 2-space indentation. */
function writeJSON(filePath, data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n', 'utf-8');
}

/**
 * Main release flow.
 * 1. Validate clean-enough state (warn if not on main — will push current branch then merge).
 * 2. Bump version in package.json + VERSION.json.
 * 3. Stage everything, commit with version + timestamp.
 * 4. Ensure on main (merge current branch if needed), push main + tag.
 * 5. Print monitoring links.
 * @param {"major"|"minor"|"patch"} type
 */
function release(type) {
  const projectRoot = process.cwd();
  console.log('\n  ZLuxury Release & Auto-Deploy');
  console.log('  ==============================\n');

  // --- 1. Pre-flight checks ---
  let currentBranch;
  try {
    currentBranch = run('git rev-parse --abbrev-ref HEAD');
  } catch {
    console.error('  ✗ Not a git repository. Run: pnpm run git:setup');
    process.exit(1);
  }
  console.log(`  Current branch : ${currentBranch}`);

  // Ensure remote is configured
  try {
    run('git remote get-url origin');
  } catch {
    console.log('  Configuring remote origin...');
    run(`git remote add origin ${DEFAULT_REMOTE_URL}`);
  }

  // Pull latest to avoid non-fast-forward push failures
  console.log('  Fetching latest from origin...');
  try {
    run('git fetch origin main --quiet');
  } catch (err) {
    console.warn(`  ! Could not fetch origin/main (${err.message.split('\n')[0]}). Continuing...`);
  }

  // --- 2. Bump version ---
  const pkgPath = path.join(projectRoot, 'package.json');
  const versionPath = path.join(projectRoot, 'VERSION.json');
  const pkg = readJSON(pkgPath);
  const oldVersion = pkg.version;
  const newVersion = bump(oldVersion, type);

  console.log(`  Version        : ${oldVersion} -> ${newVersion}  (${type})\n`);

  pkg.version = newVersion;
  writeJSON(pkgPath, pkg);

  if (fs.existsSync(versionPath)) {
    const versionData = readJSON(versionPath);
    versionData.version = newVersion;
    versionData.updatedAt = new Date().toISOString().split('T')[0];
    writeJSON(versionPath, versionData);
  }

  // --- 3. Stage + commit ---
  console.log('  Staging changes...');
  run('git add -A');

  let hasChanges = true;
  try {
    run('git diff --cached --quiet');
    hasChanges = false;
  } catch {
    hasChanges = true;
  }

  const commitMsg = `release: v${newVersion} - ${timestamp()}`;

  if (!hasChanges) {
    console.log('  No code changes detected — only version files were updated.');
  }

  // Commit (version files are always staged so there is always something to commit)
  console.log(`  Committing: "${commitMsg}"`);
  runInherit(`git commit -m "${commitMsg}"`);

  // Create annotated tag
  const tagName = `v${newVersion}`;
  try {
    run(`git tag -a ${tagName} -m "Release ${tagName}"`);
    console.log(`  Tag created: ${tagName}`);
  } catch {
    // Tag may already exist; delete + recreate to stay idempotent on local
    run(`git tag -d ${tagName} 2>nul`);
    run(`git tag -a ${tagName} -m "Release ${tagName}"`);
    console.log(`  Tag refreshed: ${tagName}`);
  }

  // --- 4. Push to main (triggers GitHub Pages deploy) ---
  if (currentBranch !== 'main') {
    console.log(`\n  Switching to main and merging "${currentBranch}"...`);
    try {
      run('git checkout main');
    } catch {
      // main may not exist locally yet — create it tracking origin
      run('git checkout -b main origin/main');
    }
    run(`git merge ${currentBranch} --no-edit`);
  }

  console.log('  Pushing to origin/main... (this triggers the GitHub Pages deploy)');
  // Pull --rebase first to avoid non-fast-forward rejection when remote has
  // commits not yet local (e.g. edits made directly on GitHub).
  try {
    run('git fetch origin main --quiet');
    run('git pull --rebase origin main --quiet');
  } catch {
    // If rebase fails, fall through to push attempt; surface error below if it still fails.
  }
  try {
    runInherit('git push origin main');
  } catch {
    // Try with -u in case upstream isn't set
    runInherit('git push -u origin main');
  }

  console.log('  Pushing tag...');
  try {
    runInherit(`git push origin ${tagName}`);
  } catch {
    // Force-push tag if it already exists remotely (idempotent re-release)
    runInherit(`git push origin ${tagName} --force`);
  }

  // Return to original branch if we switched
  if (currentBranch !== 'main') {
    try {
      run(`git checkout ${currentBranch}`);
      console.log(`  Switched back to "${currentBranch}".`);
    } catch {
      /* ignore */
    }
  }

  // --- 5. Report ---
  console.log('\n  =========================================');
  console.log('  ✅ Release pushed — auto-deploy triggered');
  console.log('  =========================================\n');
  console.log(`  Version     : v${newVersion}`);
  console.log(`  Monitor     : ${ACTIONS_URL}`);
  console.log(`  Live site   : ${PAGES_URL}  (live ~2-3 min after action completes)\n`);
}

// --- CLI entry ---
const arg = (process.argv[2] || 'patch').toLowerCase();
const valid = ['patch', 'minor', 'major'];
if (!valid.includes(arg)) {
  console.error(`Usage: pnpm run release[:patch|:minor|:major]`);
  console.error(`  Unknown argument: "${arg}"`);
  process.exit(1);
}

try {
  release(arg);
} catch (err) {
  console.error(`\n  ✗ Release failed:\n  ${err.message}\n`);
  process.exit(1);
}
