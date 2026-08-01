#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

/**
 * Default GitHub repository URL for the ZLuxury project (HTTPS format).
 * @type {string}
 */
const GITHUB_REMOTE_URL = 'https://github.com/zwindhuang-opc/zluxury.git';

/**
 * Fallback HTTPS URL for GitHub (used when SSH is not configured).
 * @type {string}
 */
const GITHUB_HTTPS_URL = 'https://github.com/zwindhuang-opc/zluxury.git';

/**
 * Default deployment/production branch name.
 * @type {string}
 */
const MAIN_BRANCH = 'main';

/**
 * Generates a timestamp string in "YYYY-MM-DD HH:mm:ss" format.
 * @returns {string} Formatted timestamp.
 */
function getTimestamp() {
  const now = new Date();
  const pad = (n) => String(n).padStart(2, '0');
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
}

/**
 * Reads the current version from VERSION.json.
 * @returns {string} The version string (e.g., "2.0.0").
 * @throws {Error} If VERSION.json cannot be read or parsed.
 */
function getCurrentVersion() {
  const versionPath = path.join(process.cwd(), 'VERSION.json');
  try {
    const data = JSON.parse(fs.readFileSync(versionPath, 'utf-8'));
    return data.version || '0.0.0';
  } catch {
    return '0.0.0';
  }
}

/**
 * Executes a shell command, returning trimmed stdout on success.
 * Throws an error with stderr details on failure.
 * @param {string} command - The shell command to run.
 * @param {object} [options] - Optional child_process.execSync options.
 * @returns {string} Trimmed stdout.
 * @throws {Error} On non-zero exit code.
 */
function runCommand(command, options = {}) {
  try {
    const result = execSync(command, { encoding: 'utf-8', stdio: 'pipe', ...options });
    return result.trim();
  } catch (err) {
    const message = (err.stderr || err.message || '').toString().trim();
    throw new Error(`Command failed: ${command}\n${message}`);
  }
}

/**
 * Checks whether the current directory is inside a git repository.
 * @returns {boolean} True if inside a git repo, false otherwise.
 */
function isGitRepo() {
  try {
    runCommand('git rev-parse --git-dir');
    return true;
  } catch {
    return false;
  }
}

/**
 * Checks whether the "origin" remote is already configured.
 * @returns {boolean} True if an origin remote exists.
 */
function hasOriginRemote() {
  try {
    runCommand('git remote get-url origin');
    return true;
  } catch {
    return false;
  }
}

/**
 * Configures the GitHub remote origin for the project.
 * Initializes a git repo if needed, then sets the origin to the
 * default GitHub SSH URL (with fallback to HTTPS if SSH fails).
 */
function setup() {
  console.log('\nZLuxury GitHub Setup');
  console.log('====================');

  try {
    // Initialize git if not already a repo
    if (!isGitRepo()) {
      console.log('Initializing git repository...');
      runCommand('git init');
      console.log('Git repository initialized.');
    } else {
      console.log('Git repository already exists.');
    }

    // Attempt SSH remote setup first
    if (hasOriginRemote()) {
      const currentRemote = runCommand('git remote get-url origin');
      console.log(`Current remote origin: ${currentRemote}`);
      console.log(`Updating to: ${GITHUB_REMOTE_URL}`);
      runCommand(`git remote set-url origin ${GITHUB_REMOTE_URL}`);
    } else {
      console.log(`Adding remote origin: ${GITHUB_REMOTE_URL}`);
      runCommand(`git remote add origin ${GITHUB_REMOTE_URL}`);
    }

    console.log('');
    console.log('GitHub remote configured successfully.');
    console.log('');
    console.log('If SSH fails during push, you can switch to HTTPS:');
    console.log(`  git remote set-url origin ${GITHUB_HTTPS_URL}`);
    console.log('');
    console.log('To test your SSH connection:');
    console.log('  ssh -T git@github.com');
    console.log('');
    console.log('To push for the first time:');
    console.log(`  git push -u origin ${MAIN_BRANCH}`);
  } catch (err) {
    console.error(`\nSetup failed: ${err.message}`);
    console.error('');
    console.error('Possible solutions:');
    console.error('  1. Ensure you have an SSH key configured for GitHub: ssh-keygen -t ed25519');
    console.error('  2. Add your SSH key to GitHub: https://github.com/settings/keys');
    console.error('  3. Or use HTTPS: git remote set-url origin ' + GITHUB_HTTPS_URL);
    process.exit(1);
  }
}

/**
 * Performs a full backup: stages all changes, commits with a timestamped
 * message including the current version, and pushes to the current branch.
 */
function backup() {
  console.log('\nZLuxury GitHub Backup');
  console.log('====================');

  if (!isGitRepo()) {
    console.error('Error: Not a git repository. Run "setup" first.');
    process.exit(1);
  }

  try {
    const currentBranch = runCommand('git rev-parse --abbrev-ref HEAD');
    const version = getCurrentVersion();
    const timestamp = getTimestamp();

    console.log(`Branch:  ${currentBranch}`);
    console.log(`Version: ${version}`);
    console.log(`Time:    ${timestamp}`);

    // Stage all changes (including deletions)
    console.log('\nStaging all changes...');
    runCommand('git add -A');

    // Check if there are changes to commit
    try {
      runCommand('git diff --cached --quiet');
      console.log('No changes to back up. Working tree is clean.');
    } catch {
      // There are staged changes — commit them
      const commitMessage = `ZLuxury v${version} backup - ${timestamp}`;
      console.log(`Committing: "${commitMessage}"`);
      runCommand(`git commit -m "${commitMessage}"`);
      console.log('Commit created.');
    }

    // Push to origin
    console.log(`Pushing to origin/${currentBranch}...`);
    runCommand(`git push origin ${currentBranch}`);
    console.log('');
    console.log('Backup completed successfully.');
  } catch (err) {
    console.error(`\nBackup failed: ${err.message}`);
    process.exit(1);
  }
}

/**
 * Pushes current changes to the remote origin on the current branch.
 * This is a lighter operation than "backup" — it only pushes
 * already-committed changes without creating a new commit.
 */
function push() {
  console.log('\nZLuxury GitHub Push');
  console.log('==================');

  if (!isGitRepo()) {
    console.error('Error: Not a git repository. Run "setup" first.');
    process.exit(1);
  }

  try {
    const currentBranch = runCommand('git rev-parse --abbrev-ref HEAD');
    console.log(`Current branch: ${currentBranch}`);

    // Check if there are commits ahead of origin
    try {
      const aheadCount = runCommand(`git rev-list --count origin/${currentBranch}..HEAD 2>/dev/null`);
      if (parseInt(aheadCount, 10) > 0) {
        console.log(`${aheadCount} commit(s) ahead of origin/${currentBranch}.`);
      } else {
        console.log('Already up to date with origin/' + currentBranch + '.');
      }
    } catch {
      console.log('No remote tracking branch found. Will set upstream.');
    }

    console.log(`Pushing to origin/${currentBranch}...`);
    runCommand(`git push origin ${currentBranch}`);
    console.log('Push completed successfully.');
  } catch (err) {
    console.error(`\nPush failed: ${err.message}`);
    process.exit(1);
  }
}

/**
 * Lists all version tags in the repository, showing their commit dates.
 * Also displays the current branch and latest tag if available.
 */
function list() {
  console.log('\nZLuxury Version List');
  console.log('====================');

  if (!isGitRepo()) {
    console.error('Error: Not a git repository. Run "setup" first.');
    process.exit(1);
  }

  try {
    const currentBranch = runCommand('git rev-parse --abbrev-ref HEAD');
    console.log(`Current branch: ${currentBranch}`);
    console.log('');

    // List tags sorted by creation date (most recent first)
    let tagsOutput;
    try {
      tagsOutput = runCommand('git tag -l --sort=-creatordate');
    } catch {
      tagsOutput = '';
    }

    const tags = tagsOutput ? tagsOutput.split('\n') : [];

    if (tags.length === 0) {
      console.log('No version tags found.');
      console.log('Create one with: node scripts/version-bump.js [major|minor|patch]');
    } else {
      console.log(`Found ${tags.length} version tag(s):\n`);
      console.log('  Tag'.padEnd(30) + 'Date'.padEnd(22) + 'Commit');
      console.log('  ' + '-'.repeat(60));

      for (const tag of tags) {
        try {
          const tagDate = runCommand(`git log -1 --format=%ai "${tag}"`);
          const tagCommit = runCommand(`git rev-list -1 --oneline "${tag}"`);
          console.log(`  ${tag.padEnd(30)}${tagDate.padEnd(22)}${tagCommit}`);
        } catch {
          console.log(`  ${tag.padEnd(30)}${'(error reading info)'.padEnd(22)}`);
        }
      }
    }

    // Show current version from VERSION.json
    const version = getCurrentVersion();
    console.log('');
    console.log(`Current version in VERSION.json: v${version}`);
  } catch (err) {
    console.error(`\nList failed: ${err.message}`);
    process.exit(1);
  }
}

/**
 * Triggers a deployment by merging the current branch into main
 * and pushing. Handles same-branch deployment (when already on main)
 * and cross-branch merge deployment.
 */
function deploy() {
  console.log('\nZLuxury GitHub Deploy');
  console.log('====================');

  if (!isGitRepo()) {
    console.error('Error: Not a git repository. Run "setup" first.');
    process.exit(1);
  }

  try {
    const currentBranch = runCommand('git rev-parse --abbrev-ref HEAD');
    const version = getCurrentVersion();
    const timestamp = getTimestamp();

    console.log(`Deploying version: v${version}`);
    console.log(`From branch:       ${currentBranch}`);
    console.log(`To branch:         ${MAIN_BRANCH}`);

    // Stage and commit on the current branch first
    console.log('\nStaging changes...');
    runCommand('git add -A');

    try {
      runCommand('git diff --cached --quiet');
      console.log('No new changes to commit.');
    } catch {
      const commitMessage = `Pre-deploy snapshot v${version} - ${timestamp}`;
      runCommand(`git commit -m "${commitMessage}"`);
      console.log('Pre-deploy commit created.');
    }

    if (currentBranch === MAIN_BRANCH) {
      // Already on main — just push
      console.log(`\nAlready on ${MAIN_BRANCH}. Pushing...`);
      runCommand(`git push origin ${MAIN_BRANCH}`);
      console.log('');
      console.log(`Deployment of v${version} to ${MAIN_BRANCH} triggered.`);
      console.log('Your CI/CD pipeline should pick up the deployment automatically.');
    } else {
      // Merge into main
      console.log(`\nSwitching to ${MAIN_BRANCH}...`);
      runCommand(`git checkout ${MAIN_BRANCH}`);

      console.log(`Merging "${currentBranch}" into ${MAIN_BRANCH}...`);
      runCommand(`git merge ${currentBranch} --no-edit`);

      // Check for conflicts
      try {
        runCommand('git diff --name-only --diff-filter=U');
        console.error('\nMerge conflicts detected!');
        console.error('Resolve conflicts manually, then run:');
        console.error('  git add .');
        console.error('  git commit -m "Resolve merge conflicts for v' + version + '"');
        console.error('  git push origin ' + MAIN_BRANCH);
        // Switch back to original branch
        runCommand(`git checkout ${currentBranch}`);
        process.exit(1);
      } catch {
        // No conflicts
      }

      const deployMessage = `Deploy v${version} to production - ${timestamp}`;
      console.log(`Committing deployment: "${deployMessage}"`);
      runCommand(`git commit -m "${deployMessage}"`);

      console.log(`Pushing ${MAIN_BRANCH} to origin...`);
      runCommand(`git push origin ${MAIN_BRANCH}`);

      // Switch back to original branch
      console.log(`Switching back to "${currentBranch}"...`);
      runCommand(`git checkout ${currentBranch}`);

      console.log('');
      console.log(`Deployment of v${version} completed successfully.`);
      console.log(`Branch "${currentBranch}" was merged into "${MAIN_BRANCH}".`);
      console.log('Your CI/CD pipeline should now trigger a deployment.');
    }
  } catch (err) {
    console.error(`\nDeployment failed: ${err.message}`);
    process.exit(1);
  }
}

/**
 * Main entry point for the github.js script.
 * Parses command-line arguments and dispatches to the appropriate action.
 * Usage: node scripts/github.js [setup|backup|push|list|deploy]
 */
function main() {
  const args = process.argv.slice(2);
  const action = args[0] || 'backup';

  const validActions = ['setup', 'backup', 'push', 'list', 'deploy'];

  if (!validActions.includes(action)) {
    console.error('Usage: node scripts/github.js [setup|backup|push|list|deploy]');
    console.error('');
    console.error('  setup   - Configure GitHub remote and credentials');
    console.error('  backup  - Full backup with timestamped commit');
    console.error('  push    - Push current changes to remote');
    console.error('  list    - List all versions/tags');
    console.error('  deploy  - Trigger deployment push to main');
    process.exit(1);
  }

  switch (action) {
    case 'setup':
      setup();
      break;
    case 'backup':
      backup();
      break;
    case 'push':
      push();
      break;
    case 'list':
      list();
      break;
    case 'deploy':
      deploy();
      break;
  }
}

main();