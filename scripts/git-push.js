/**
 * Git Push Script for ZLuxury Platform
 * Handles GitHub backup with proper branch management
 * 
 * Features:
 * - Automatic branch management (main, develop, feature branches)
 * - GitHub integration for vcfhuang@qq.com
 * - Backup automation
 * - Version tag pushing
 */

const { execSync } = require('child_process');
const path = require('path');

// Configuration
const GITHUB_USER = 'vcfhuang@qq.com';
const REPO_NAME = 'zluxury';
const DEFAULT_BRANCH = 'main';
const DEVELOP_BRANCH = 'develop';

/**
 * Execute git command and return output
 */
function execGit(command, silent = false) {
  try {
    const options = { encoding: 'utf8' };
    if (silent) {
      options.stdio = 'pipe';
    }
    return execSync(command, options).trim();
  } catch (error) {
    if (!silent) {
      console.error(`Git command failed: ${command}`);
      console.error(error.message);
    }
    throw error;
  }
}

/**
 * Check if git remote exists
 */
function hasRemote(remoteName = 'origin') {
  try {
    const remotes = execGit('git remote -v', true);
    return remotes.includes(remoteName);
  } catch (error) {
    return false;
  }
}

/**
 * Add remote repository
 */
function addRemote(remoteName, remoteUrl) {
  try {
    execGit(`git remote add ${remoteName} ${remoteUrl}`);
    console.log(`✓ Added remote ${remoteName}: ${remoteUrl}`);
  } catch (error) {
    console.error(`Failed to add remote: ${error.message}`);
    throw error;
  }
}

/**
 * Get current branch name
 */
function getCurrentBranch() {
  try {
    return execGit('git rev-parse --abbrev-ref HEAD', true);
  } catch (error) {
    console.error('Failed to get current branch');
    throw error;
  }
}

/**
 * Get all branches
 */
function getBranches() {
  try {
    const branches = execGit('git branch -a', true);
    return branches.split('\n').map(branch => branch.trim().replace('* ', '').replace('remotes/', ''));
  } catch (error) {
    return [];
  }
}

/**
 * Create and switch to branch
 */
function createBranch(branchName) {
  try {
    execGit(`git checkout -b ${branchName}`);
    console.log(`✓ Created and switched to branch: ${branchName}`);
  } catch (error) {
    console.error(`Failed to create branch ${branchName}: ${error.message}`);
    throw error;
  }
}

/**
 * Switch to existing branch
 */
function switchBranch(branchName) {
  try {
    execGit(`git checkout ${branchName}`);
    console.log(`✓ Switched to branch: ${branchName}`);
  } catch (error) {
    console.error(`Failed to switch to branch ${branchName}: ${error.message}`);
    throw error;
  }
}

/**
 * Push changes to remote
 */
function pushToRemote(branchName, remoteName = 'origin', force = false) {
  try {
    const forceFlag = force ? '--force' : '--set-upstream';
    execGit(`git push ${forceFlag} ${remoteName} ${branchName}`);
    console.log(`✓ Pushed ${branchName} to ${remoteName}`);
  } catch (error) {
    console.error(`Failed to push to remote: ${error.message}`);
    throw error;
  }
}

/**
 * Push all tags to remote
 */
function pushTags(remoteName = 'origin') {
  try {
    execGit(`git push ${remoteName} --tags`);
    console.log(`✓ Pushed all tags to ${remoteName}`);
  } catch (error) {
    console.error(`Failed to push tags: ${error.message}`);
    throw error;
  }
}

/**
 * Create backup
 */
function createBackup() {
  try {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupName = `backup-${timestamp}`;
    
    // Create archive
    execGit(`git archive --format=zip --output=${backupName}.zip HEAD`);
    console.log(`✓ Created backup: ${backupName}.zip`);
    
    return backupName;
  } catch (error) {
    console.error(`Failed to create backup: ${error.message}`);
    throw error;
  }
}

/**
 * Main push function
 */
function pushToGitHub(branchName = null, createBackupFlag = false) {
  console.log(`\n=== ZLuxury GitHub Backup ===`);
  console.log(`GitHub User: ${GITHUB_USER}`);
  console.log(`Repository: ${REPO_NAME}\n`);

  try {
    // Check if there are changes to commit
    const status = execGit('git status --porcelain', true);
    
    if (!status.trim()) {
      console.log('No changes to push');
      return;
    }

    // Stage all changes
    execGit('git add .');
    console.log('✓ Staged all changes');

    // Create commit
    const timestamp = new Date().toISOString();
    const commitMessage = `Auto-commit - ${timestamp}`;
    execGit(`git commit -m "${commitMessage}"`);
    console.log('✓ Created commit');

    // Create backup if requested
    if (createBackupFlag) {
      createBackup();
    }

    // Determine branch to push
    const currentBranch = branchName || getCurrentBranch();
    console.log(`Current branch: ${currentBranch}`);

    // Check if remote exists
    if (!hasRemote('origin')) {
      console.log('No remote repository configured');
      console.log('To add GitHub remote, run:');
      console.log(`  git remote add origin https://github.com/${GITHUB_USER}/${REPO_NAME}.git`);
      console.log('Or use SSH:');
      console.log(`  git remote add origin git@github.com:${GITHUB_USER}/${REPO_NAME}.git`);
      return;
    }

    // Push to remote
    pushToRemote(currentBranch, 'origin');
    
    // Push tags
    pushTags('origin');

    console.log(`\n✅ Successfully pushed to GitHub!`);
    console.log(`📦 Repository: ${GITHUB_USER}/${REPO_NAME}`);
    console.log(`🌿 Branch: ${currentBranch}`);
    console.log(`🔗 URL: https://github.com/${GITHUB_USER}/${REPO_NAME}`);

  } catch (error) {
    console.error('❌ GitHub push failed:', error.message);
    process.exit(1);
  }
}

/**
 * Setup initial repository structure
 */
function setupRepository() {
  console.log(`\n=== ZLuxury Repository Setup ===\n`);

  try {
    // Check if git is initialized
    try {
      execGit('git rev-parse --git-dir', true);
      console.log('✓ Git repository already initialized');
    } catch (error) {
      execGit('git init');
      console.log('✓ Initialized git repository');
    }

    // Create main branch if it doesn't exist
    const branches = getBranches();
    if (!branches.includes(DEFAULT_BRANCH)) {
      execGit(`git checkout -b ${DEFAULT_BRANCH}`);
      console.log(`✓ Created ${DEFAULT_BRANCH} branch`);
    }

    // Create develop branch if it doesn't exist
    if (!branches.includes(DEVELOP_BRANCH)) {
      createBranch(DEVELOP_BRANCH);
      console.log(`✓ Created ${DEVELOP_BRANCH} branch`);
    }

    // Switch back to main
    switchBranch(DEFAULT_BRANCH);

    console.log(`\n✅ Repository setup completed!`);
    console.log(`\nBranch structure:`);
    console.log(`  ${DEFAULT_BRANCH} - Production releases`);
    console.log(`  ${DEVELOP_BRANCH} - Development integration`);
    console.log(`\nNext steps:`);
    console.log(`  1. Add GitHub remote:`);
    console.log(`     git remote add origin https://github.com/${GITHUB_USER}/${REPO_NAME}.git`);
    console.log(`  2. Push to GitHub:`);
    console.log(`     npm run git:push`);

  } catch (error) {
    console.error('❌ Repository setup failed:', error.message);
    process.exit(1);
  }
}

/**
 * Create feature branch
 */
function createFeatureBranch(featureName) {
  console.log(`\n=== Creating Feature Branch ===\n`);

  try {
    // Switch to develop branch
    switchBranch(DEVELOP_BRANCH);
    
    // Pull latest changes
    try {
      execGit('git pull origin develop');
      console.log('✓ Pulled latest changes from develop');
    } catch (error) {
      console.log('No remote changes to pull');
    }

    // Create feature branch
    const featureBranch = `feature/${featureName}`;
    createBranch(featureBranch);

    console.log(`\n✅ Feature branch created: ${featureBranch}`);
    console.log(`\nWorkflow:`);
    console.log(`  1. Make your changes`);
    console.log(`  2. Commit changes: git commit -am "Your message"`);
    console.log(`  3. Push to GitHub: npm run git:push`);
    console.log(`  4. Create pull request to develop branch`);

  } catch (error) {
    console.error('❌ Feature branch creation failed:', error.message);
    process.exit(1);
  }
}

// Command line interface
const args = process.argv.slice(2);
const command = args[0] || 'push';

switch (command) {
  case 'setup':
    setupRepository();
    break;
  case 'push':
    const branch = args[1] || null;
    const backup = args.includes('--backup');
    pushToGitHub(branch, backup);
    break;
  case 'feature':
    const featureName = args[1];
    if (!featureName) {
      console.error('Please provide a feature name');
      console.error('Usage: npm run git:push feature "feature-name"');
      process.exit(1);
    }
    createFeatureBranch(featureName);
    break;
  default:
    console.log('Available commands:');
    console.log('  npm run git:push setup    - Setup repository structure');
    console.log('  npm run git:push push     - Push to GitHub (default)');
    console.log('  npm run git:push push [branch] --backup - Push with backup');
    console.log('  npm run git:push feature [name] - Create feature branch');
    process.exit(0);
}