#!/usr/bin/env node

const { execSync } = require('child_process');

/**
 * Default GitHub remote URL for the ZLuxury project.
 * Used during the "setup" command to configure the origin remote.
 * @type {string}
 */
const DEFAULT_REMOTE_URL = 'git@github.com:zwindhuang/zluxury.git';

/**
 * Default branch name for deployment/production.
 * @type {string}
 */
const DEFAULT_DEPLOY_BRANCH = 'main';

/**
 * Generates a timestamp string suitable for use in commit messages.
 * Format: "YYYY-MM-DD HH:mm:ss"
 * @returns {string} Formatted timestamp.
 */
function getTimestamp() {
  const now = new Date();
  const pad = (n) => String(n).padStart(2, '0');
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
}

/**
 * Executes a shell command and returns its stdout as a trimmed string.
 * Throws an error with contextual information if the command fails.
 * @param {string} command - The shell command to execute.
 * @param {object} [options] - Optional configuration for child_process.execSync.
 * @returns {string} Trimmed stdout of the command.
 * @throws {Error} If the command exits with a non-zero code.
 */
function runCommand(command, options = {}) {
  try {
    const result = execSync(command, { encoding: 'utf-8', stdio: 'pipe', ...options });
    return result.trim();
  } catch (err) {
    const message = err.stderr ? err.stderr.toString().trim() : err.message;
    throw new Error(`Command failed: ${command}\n${message}`);
  }
}

/**
 * Initializes a git repository and configures the GitHub remote origin.
 * If a remote already exists, it will be updated to use the default URL.
 */
function setupGit() {
  console.log('\nZLuxury Git Setup');
  console.log('=================');

  try {
    // Check if .git directory exists
    try {
      runCommand('git rev-parse --git-dir');
      console.log('Git repository already initialized.');
    } catch {
      console.log('Initializing git repository...');
      runCommand('git init');
      console.log('Git repository initialized.');
    }

    // Check if remote exists
    let remoteExists = false;
    try {
      runCommand('git remote get-url origin');
      remoteExists = true;
    } catch {
      // remote does not exist
    }

    if (remoteExists) {
      console.log(`Updating remote origin to ${DEFAULT_REMOTE_URL}...`);
      runCommand(`git remote set-url origin ${DEFAULT_REMOTE_URL}`);
    } else {
      console.log(`Setting remote origin to ${DEFAULT_REMOTE_URL}...`);
      runCommand(`git remote add origin ${DEFAULT_REMOTE_URL}`);
    }

    console.log('\nRemote configured successfully.');
    console.log('Remote URL: ' + DEFAULT_REMOTE_URL);
    console.log('\nTo push for the first time, run:');
    console.log('  git push -u origin main');
  } catch (err) {
    console.error(`\nSetup failed: ${err.message}`);
    process.exit(1);
  }
}

/**
 * Stages all changes, commits them with a timestamped message, and pushes
 * to the currently checked-out branch.
 */
function pushChanges() {
  console.log('\nZLuxury Git Push');
  console.log('================');

  try {
    // Get current branch
    const currentBranch = runCommand('git rev-parse --abbrev-ref HEAD');
    console.log(`Current branch: ${currentBranch}`);

    // Stage all changes
    console.log('Staging all changes...');
    runCommand('git add .');

    // Check if there are staged changes to commit
    try {
      runCommand('git diff --cached --quiet');
      console.log('No changes to commit. Working tree is clean.');
    } catch {
      // There are staged changes
      const timestamp = getTimestamp();
      const commitMessage = `ZLuxury backup - ${timestamp}`;
      console.log(`Committing: "${commitMessage}"`);
      runCommand(`git commit -m "${commitMessage}"`);
      console.log('Commit created.');
    }

    // Push to current branch
    console.log(`Pushing to origin/${currentBranch}...`);
    runCommand(`git push origin ${currentBranch}`);
    console.log('Push successful.');
  } catch (err) {
    console.error(`\nPush failed: ${err.message}`);
    process.exit(1);
  }
}

/**
 * Creates a new feature branch with a given name, commits all current
 * changes with a descriptive message, and pushes the new branch to origin.
 * @param {string} branchName - The name for the new feature branch.
 *                              If not provided, prompts the user (falls back to "feature").
 */
function createFeatureBranch(branchName) {
  console.log('\nZLuxury Feature Branch');
  console.log('=======================');

  if (!branchName) {
    console.error('Usage: node scripts/git-push.js feature <branch-name>');
    console.error('Example: node scripts/git-push.js feature add-auction-module');
    process.exit(1);
  }

  try {
    const currentBranch = runCommand('git rev-parse --abbrev-ref HEAD');
    console.log(`Current branch: ${currentBranch}`);

    // Stage and commit current changes first
    console.log('Staging current changes...');
    runCommand('git add .');

    try {
      runCommand('git diff --cached --quiet');
      console.log('No changes to commit before branching.');
    } catch {
      const timestamp = getTimestamp();
      runCommand(`git commit -m "WIP before feature branch - ${timestamp}"`);
      console.log('Current changes committed.');
    }

    // Create and switch to the new branch
    console.log(`Creating feature branch: ${branchName}...`);
    runCommand(`git checkout -b ${branchName}`);
    console.log(`Switched to branch: ${branchName}`);

    // Push the new branch
    console.log(`Pushing new branch to origin...`);
    runCommand(`git push -u origin ${branchName}`);
    console.log(`Feature branch "${branchName}" created and pushed successfully.`);
  } catch (err) {
    console.error(`\nFeature branch creation failed: ${err.message}`);
    process.exit(1);
  }
}

/**
 * Pushes the current branch to the deployment branch (main) for production
 * deployment. This merges the current branch into main and pushes.
 */
function deploy() {
  console.log('\nZLuxury Deploy');
  console.log('===============');

  try {
    const currentBranch = runCommand('git rev-parse --abbrev-ref HEAD');
    console.log(`Current branch: ${currentBranch}`);

    if (currentBranch === DEFAULT_DEPLOY_BRANCH) {
      // Already on main — just commit and push
      console.log('Already on main branch.');
      console.log('Staging and pushing...');
      runCommand('git add .');

      try {
        runCommand('git diff --cached --quiet');
        console.log('No changes to deploy.');
      } catch {
        const timestamp = getTimestamp();
        runCommand(`git commit -m "Deploy to production - ${timestamp}"`);
        console.log('Deploy commit created.');
      }

      runCommand(`git push origin ${DEFAULT_DEPLOY_BRANCH}`);
      console.log('Deployment pushed to origin/main.');
    } else {
      // Switch to main, merge current branch, push
      console.log(`Switching to ${DEFAULT_DEPLOY_BRANCH}...`);
      runCommand(`git checkout ${DEFAULT_DEPLOY_BRANCH}`);

      console.log(`Merging "${currentBranch}" into ${DEFAULT_DEPLOY_BRANCH}...`);
      runCommand(`git merge ${currentBranch} --no-edit`);

      // Handle merge conflicts
      try {
        runCommand('git diff --name-only --diff-filter=U');
        console.error('Merge conflicts detected. Please resolve them manually, then run:');
        console.error('  git add . && git commit -m "Resolve merge conflicts"');
        process.exit(1);
      } catch {
        // No conflicts — safe to push
      }

      const timestamp = getTimestamp();
      console.log(`Committing merge...`);
      runCommand(`git commit -m "Merge ${currentBranch} into ${DEFAULT_DEPLOY_BRANCH} for deployment - ${timestamp}"`);

      console.log(`Pushing ${DEFAULT_DEPLOY_BRANCH}...`);
      runCommand(`git push origin ${DEFAULT_DEPLOY_BRANCH}`);

      // Switch back to the original feature branch
      console.log(`Switching back to "${currentBranch}"...`);
      runCommand(`git checkout ${currentBranch}`);

      console.log(`\nDeployment complete! Branch "${currentBranch}" has been merged into "${DEFAULT_DEPLOY_BRANCH}".`);
    }
  } catch (err) {
    console.error(`\nDeployment failed: ${err.message}`);
    process.exit(1);
  }
}

/**
 * Main entry point for the git-push script.
 * Parses command-line arguments and dispatches to the appropriate action handler.
 * Usage: node scripts/git-push.js [setup|push|feature <name>|deploy]
 */
function main() {
  const args = process.argv.slice(2);
  const action = args[0] || 'push';

  const validActions = ['setup', 'push', 'feature', 'deploy'];

  if (!validActions.includes(action)) {
    console.error('Usage: node scripts/git-push.js [setup|push|feature|deploy]');
    console.error('');
    console.error('  setup    - Initialize git repo and set GitHub remote');
    console.error('  push     - Stage, commit with timestamp, and push current branch');
    console.error('  feature  - Create a new feature branch (add branch name as second arg)');
    console.error('  deploy   - Push to main branch for deployment');
    process.exit(1);
  }

  switch (action) {
    case 'setup':
      setupGit();
      break;
    case 'push':
      pushChanges();
      break;
    case 'feature':
      createFeatureBranch(args[1]);
      break;
    case 'deploy':
      deploy();
      break;
  }
}

main();