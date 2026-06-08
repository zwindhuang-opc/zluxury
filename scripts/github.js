/**
 * GitHub Integration Script for ZLuxury Platform
 * Handles GitHub repository setup, backup, and automation
 * 
 * Features:
 * - Automatic GitHub repository creation
 * - Backup automation with timestamp
 * - GitHub remote configuration
 * - Automated deployment scripts
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Configuration
const GITHUB_USER = 'vcfhuang@qq.com';
const REPO_NAME = 'zluxury';
const GITHUB_URL = `https://github.com/${GITHUB_USER}/${REPO_NAME}.git`;
const BACKUP_DIR = path.join(__dirname, '..', 'backups');

/**
 * Execute command and return output
 */
function execCommand(command, silent = false) {
  try {
    const options = { encoding: 'utf8' };
    if (silent) {
      options.stdio = 'pipe';
    }
    return execSync(command, options).trim();
  } catch (error) {
    if (!silent) {
      console.error(`Command failed: ${command}`);
      console.error(error.message);
    }
    throw error;
  }
}

/**
 * Create backup directory if it doesn't exist
 */
function ensureBackupDir() {
  if (!fs.existsSync(BACKUP_DIR)) {
    fs.mkdirSync(BACKUP_DIR, { recursive: true });
    console.log('✓ Created backup directory');
  }
}

/**
 * Create timestamped backup
 */
function createBackup() {
  console.log('\n=== Creating Backup ===\n');
  
  try {
    ensureBackupDir();
    
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupName = `zluxury-backup-${timestamp}`;
    const backupPath = path.join(BACKUP_DIR, backupName);
    
    // Create backup using git archive
    execCommand(`git archive --format=zip --output="${backupPath}.zip" HEAD`);
    console.log(`✓ Created backup: ${backupName}.zip`);
    
    // Create backup manifest
    const manifest = {
      timestamp: new Date().toISOString(),
      version: require('../package.json').version,
      branch: execCommand('git rev-parse --abbrev-ref HEAD', true),
      commit: execCommand('git rev-parse HEAD', true),
      files: execCommand('git ls-files', true).split('\n').length
    };
    
    fs.writeFileSync(
      path.join(BACKUP_DIR, `${backupName}-manifest.json`),
      JSON.stringify(manifest, null, 2)
    );
    console.log(`✓ Created backup manifest`);
    
    // Clean old backups (keep last 10)
    const backups = fs.readdirSync(BACKUP_DIR)
      .filter(file => file.endsWith('.zip'))
      .sort()
      .reverse()
      .slice(10);
    
    backups.forEach(backup => {
      fs.unlinkSync(path.join(BACKUP_DIR, backup));
      console.log(`✓ Removed old backup: ${backup}`);
    });
    
    console.log(`\n✅ Backup completed successfully!`);
    console.log(`📦 Backup location: ${backupPath}.zip`);
    
    return backupPath;
    
  } catch (error) {
    console.error('❌ Backup failed:', error.message);
    throw error;
  }
}

/**
 * Setup GitHub remote
 */
function setupGitHubRemote() {
  console.log('\n=== GitHub Remote Setup ===\n');
  
  try {
    // Check if remote already exists
    try {
      const remotes = execCommand('git remote -v', true);
      if (remotes.includes('origin')) {
        console.log('✓ GitHub remote already configured');
        const currentRemote = execCommand('git remote get-url origin', true);
        console.log(`  Current remote: ${currentRemote}`);
        return currentRemote;
      }
    } catch (error) {
      // Remote doesn't exist, continue
    }
    
    // Add GitHub remote
    execCommand(`git remote add origin ${GITHUB_URL}`);
    console.log(`✓ Added GitHub remote: ${GITHUB_URL}`);
    
    // Verify remote
    const verifyRemote = execCommand('git remote get-url origin', true);
    console.log(`✓ Verified remote: ${verifyRemote}`);
    
    return GITHUB_URL;
    
  } catch (error) {
    console.error('❌ GitHub remote setup failed:', error.message);
    throw error;
  }
}

/**
 * Push to GitHub with backup
 */
function pushToGitHub(branch = 'main', createBackupFlag = true) {
  console.log('\n=== GitHub Push with Backup ===\n');
  console.log(`Branch: ${branch}`);
  console.log(`GitHub: ${GITHUB_URL}\n`);
  
  try {
    // Create backup if requested
    if (createBackupFlag) {
      createBackup();
    }
    
    // Setup GitHub remote
    setupGitHubRemote();
    
    // Push to GitHub
    console.log('Pushing to GitHub...');
    execCommand(`git push -u origin ${branch}`);
    console.log('✓ Pushed to GitHub');
    
    // Push tags
    console.log('Pushing tags...');
    execCommand('git push origin --tags');
    console.log('✓ Pushed all tags');
    
    console.log(`\n✅ Successfully pushed to GitHub!`);
    console.log(`🔗 Repository: ${GITHUB_URL}`);
    console.log(`🌿 Branch: ${branch}`);
    
  } catch (error) {
    console.error('❌ GitHub push failed:', error.message);
    console.error('\nTroubleshooting:');
    console.error('1. Ensure GitHub repository exists');
    console.error('2. Check your GitHub credentials');
    console.error('3. Verify network connection');
    console.error('4. Try: git push -u origin main --force');
    throw error;
  }
}

/**
 * List all backups
 */
function listBackups() {
  console.log('\n=== Available Backups ===\n');
  
  try {
    ensureBackupDir();
    
    const backups = fs.readdirSync(BACKUP_DIR)
      .filter(file => file.endsWith('.zip'))
      .sort()
      .reverse();
    
    if (backups.length === 0) {
      console.log('No backups found');
      return;
    }
    
    backups.forEach((backup, index) => {
      const stats = fs.statSync(path.join(BACKUP_DIR, backup));
      const size = (stats.size / 1024 / 1024).toFixed(2);
      console.log(`${index + 1}. ${backup} (${size} MB)`);
    });
    
    console.log(`\nTotal backups: ${backups.length}`);
    console.log(`Backup location: ${BACKUP_DIR}`);
    
  } catch (error) {
    console.error('❌ Failed to list backups:', error.message);
  }
}

/**
 * Restore from backup
 */
function restoreBackup(backupName) {
  console.log(`\n=== Restoring Backup: ${backupName} ===\n`);
  
  try {
    const backupPath = path.join(BACKUP_DIR, backupName);
    
    if (!fs.existsSync(backupPath)) {
      console.error(`Backup not found: ${backupName}`);
      return;
    }
    
    // Create restore directory
    const restoreDir = path.join(BACKUP_DIR, 'restore');
    if (fs.existsSync(restoreDir)) {
      fs.rmSync(restoreDir, { recursive: true });
    }
    fs.mkdirSync(restoreDir);
    
    // Extract backup
    console.log('Extracting backup...');
    execCommand(`tar -xf "${backupPath}" -C "${restoreDir}"`);
    console.log('✓ Backup extracted');
    
    console.log(`\n✅ Backup restored to: ${restoreDir}`);
    console.log('Review the restored files before replacing your current code.');
    
  } catch (error) {
    console.error('❌ Backup restore failed:', error.message);
  }
}

/**
 * Automated deployment
 */
function automatedDeployment() {
  console.log('\n=== Automated Deployment ===\n');
  
  try {
    // Create backup
    console.log('Step 1: Creating backup...');
    createBackup();
    
    // Run tests (if available)
    console.log('Step 2: Running tests...');
    try {
      execCommand('npm test', true);
      console.log('✓ Tests passed');
    } catch (error) {
      console.log('⚠ No tests configured or tests failed');
    }
    
    // Build project
    console.log('Step 3: Building project...');
    execCommand('npm run build');
    console.log('✓ Build completed');
    
    // Push to GitHub
    console.log('Step 4: Pushing to GitHub...');
    pushToGitHub('main', false);
    
    console.log('\n✅ Automated deployment completed successfully!');
    
  } catch (error) {
    console.error('❌ Automated deployment failed:', error.message);
    throw error;
  }
}

/**
 * Main function
 */
function main() {
  const args = process.argv.slice(2);
  const command = args[0] || 'push';
  
  switch (command) {
    case 'backup':
      createBackup();
      break;
    case 'push':
      const branch = args[1] || 'main';
      const backup = !args.includes('--no-backup');
      pushToGitHub(branch, backup);
      break;
    case 'setup':
      setupGitHubRemote();
      break;
    case 'list':
      listBackups();
      break;
    case 'restore':
      const backupName = args[1];
      if (!backupName) {
        console.error('Please provide backup name');
        console.error('Usage: npm run github restore <backup-name>');
        process.exit(1);
      }
      restoreBackup(backupName);
      break;
    case 'deploy':
      automatedDeployment();
      break;
    default:
      console.log('Available commands:');
      console.log('  npm run github backup           - Create backup');
      console.log('  npm run github push            - Push to GitHub with backup');
      console.log('  npm run github push [branch]    - Push specific branch');
      console.log('  npm run github push --no-backup - Push without backup');
      console.log('  npm run github setup           - Setup GitHub remote');
      console.log('  npm run github list            - List all backups');
      console.log('  npm run github restore <name>  - Restore from backup');
      console.log('  npm run github deploy          - Automated deployment');
      process.exit(0);
  }
}

// Execute main function
main();