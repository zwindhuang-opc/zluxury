/**
 * ZLuxury Backup Script
 * 
 * This script handles backup operations for the ZLuxury project.
 * Features:
 * - Create timestamped backup archives
 * - Backup source code and configuration
 * - Store backups in dedicated folder
 * 
 * Usage:
 * - npm run backup
 * 
 * Version: 1.0.0
 * Last Updated: 2024-06-07
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// ============================================================================
// CONFIGURATION
// ============================================================================

const BACKUP_DIR = path.join(process.cwd(), 'backups');
const SOURCE_DIRS = ['src', 'scripts', 'public'];
const CONFIG_FILES = [
  'package.json',
  'next.config.js',
  'tailwind.config.js',
  'tsconfig.json',
  'postcss.config.js'
];

// ============================================================================
// FUNCTIONS
// ============================================================================

/**
 * Create backup directory if not exists
 */
function ensureBackupDir() {
  if (!fs.existsSync(BACKUP_DIR)) {
    fs.mkdirSync(BACKUP_DIR, { recursive: true });
    console.log('Created backup directory');
  }
}

/**
 * Get current version from package.json
 * @returns Version string
 */
function getVersion() {
  const pkgPath = path.join(process.cwd(), 'package.json');
  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));
  return pkg.version;
}

/**
 * Generate backup filename
 * @returns Backup filename
 */
function generateBackupName() {
  const version = getVersion();
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').split('T')[0];
  return `zluxury-v${version}-${timestamp}`;
}

/**
 * Create backup archive
 */
function createBackup() {
  ensureBackupDir();
  
  const backupName = generateBackupName();
  const backupPath = path.join(BACKUP_DIR, backupName);
  
  console.log(`Creating backup: ${backupName}`);
  
  // Create backup directory
  fs.mkdirSync(backupPath, { recursive: true });
  
  // Copy source directories
  for (const dir of SOURCE_DIRS) {
    const sourcePath = path.join(process.cwd(), dir);
    if (fs.existsSync(sourcePath)) {
      const destPath = path.join(backupPath, dir);
      fs.mkdirSync(destPath, { recursive: true });
      
      // Copy files recursively
      copyDirectory(sourcePath, destPath);
      console.log(`Copied: ${dir}`);
    }
  }
  
  // Copy configuration files
  for (const file of CONFIG_FILES) {
    const sourcePath = path.join(process.cwd(), file);
    if (fs.existsSync(sourcePath)) {
      fs.copyFileSync(sourcePath, path.join(backupPath, file));
      console.log(`Copied: ${file}`);
    }
  }
  
  // Create backup info file
  const info = {
    version: getVersion(),
    timestamp: new Date().toISOString(),
    files: SOURCE_DIRS,
    configs: CONFIG_FILES
  };
  fs.writeFileSync(
    path.join(backupPath, 'backup-info.json'),
    JSON.stringify(info, null, 2)
  );
  
  console.log(`Backup created successfully at: ${backupPath}`);
  
  return backupPath;
}

/**
 * Copy directory recursively
 * @param source - Source directory
 * @param destination - Destination directory
 */
function copyDirectory(source, destination) {
  const entries = fs.readdirSync(source, { withFileTypes: true });
  
  for (const entry of entries) {
    const sourcePath = path.join(source, entry.name);
    const destPath = path.join(destination, entry.name);
    
    if (entry.isDirectory()) {
      fs.mkdirSync(destPath, { recursive: true });
      copyDirectory(sourcePath, destPath);
    } else {
      fs.copyFileSync(sourcePath, destPath);
    }
  }
}

/**
 * List all backups
 */
function listBackups() {
  ensureBackupDir();
  
  const backups = fs.readdirSync(BACKUP_DIR);
  
  console.log('\nAvailable backups:');
  console.log('==================');
  
  for (const backup of backups) {
    const infoPath = path.join(BACKUP_DIR, backup, 'backup-info.json');
    if (fs.existsSync(infoPath)) {
      const info = JSON.parse(fs.readFileSync(infoPath, 'utf-8'));
      console.log(`- ${backup} (v${info.version}, ${info.timestamp})`);
    } else {
      console.log(`- ${backup}`);
    }
  }
}

/**
 * Main function
 */
function main() {
  const action = process.argv[2] || 'create';
  
  switch (action) {
    case 'create':
      createBackup();
      break;
      
    case 'list':
      listBackups();
      break;
      
    default:
      console.log('Available actions: create, list');
  }
}

// ============================================================================
// EXECUTE
// ============================================================================

main();