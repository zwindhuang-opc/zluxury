/**
 * Version Management Script for ZLuxury Platform
 * Handles semantic versioning: MAJOR.MINOR.PATCH (e.g., 1.0.0)
 * 
 * Version Format: V.MAJOR.MINOR.PATCH
 * - MAJOR: Breaking changes or major feature releases
 * - MINOR: New features, backward compatible
 * - PATCH: Bug fixes, backward compatible
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Configuration
const PACKAGE_JSON_PATH = path.join(__dirname, '..', 'package.json');
const VERSION_FILE_PATH = path.join(__dirname, '..', 'VERSION.md');
const CHANGELOG_PATH = path.join(__dirname, '..', 'CHANGELOG.md');

/**
 * Read current version from package.json
 */
function getCurrentVersion() {
  const packageJson = JSON.parse(fs.readFileSync(PACKAGE_JSON_PATH, 'utf8'));
  return packageJson.version;
}

/**
 * Parse version string into components
 */
function parseVersion(version) {
  const parts = version.split('.').map(Number);
  return {
    major: parts[0] || 0,
    minor: parts[1] || 0,
    patch: parts[2] || 0,
    toString: function() {
      return `${this.major}.${this.minor}.${this.patch}`;
    }
  };
}

/**
 * Increment version based on type
 */
function incrementVersion(currentVersion, type) {
  const version = parseVersion(currentVersion);
  
  switch(type) {
    case 'major':
      version.major++;
      version.minor = 0;
      version.patch = 0;
      break;
    case 'minor':
      version.minor++;
      version.patch = 0;
      break;
    case 'patch':
      version.patch++;
      break;
    default:
      throw new Error(`Invalid version type: ${type}. Use 'major', 'minor', or 'patch'`);
  }
  
  return version.toString();
}

/**
 * Update version in package.json
 */
function updatePackageJson(newVersion) {
  const packageJson = JSON.parse(fs.readFileSync(PACKAGE_JSON_PATH, 'utf8'));
  packageJson.version = newVersion;
  fs.writeFileSync(PACKAGE_JSON_PATH, JSON.stringify(packageJson, null, 2));
  console.log(`✓ Updated package.json to version ${newVersion}`);
}

/**
 * Create VERSION.md file
 */
function createVersionFile(version, type, message) {
  const timestamp = new Date().toISOString();
  const content = `# ZLuxury Platform Version ${version}

**Release Date**: ${timestamp}
**Version Type**: ${type.toUpperCase()}
**Release Notes**: ${message}

## Version Information
- **Version**: V.${version}
- **Type**: ${type}
- **Date**: ${timestamp}

## Changes
${message}

## Installation
\`\`\`bash
npm install
npm run dev
\`\`\`

## Documentation
See [CHANGELOG.md](./CHANGELOG.md) for detailed change history.
`;

  fs.writeFileSync(VERSION_FILE_PATH, content);
  console.log(`✓ Created VERSION.md for version ${version}`);
}

/**
 * Update CHANGELOG.md
 */
function updateChangelog(version, type, message) {
  const timestamp = new Date().toISOString().split('T')[0];
  const entry = `## [${version}] - ${timestamp}

### ${type.toUpperCase()}
${message}

`;

  let changelogContent = '';
  if (fs.existsSync(CHANGELOG_PATH)) {
    changelogContent = fs.readFileSync(CHANGELOG_PATH, 'utf8');
  } else {
    changelogContent = `# ZLuxury Platform Changelog

All notable changes to the ZLuxury platform will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

`;
  }

  fs.writeFileSync(CHANGELOG_PATH, entry + changelogContent);
  console.log(`✓ Updated CHANGELOG.md for version ${version}`);
}

/**
 * Create git tag and commit
 */
function createGitCommit(version, type, message) {
  try {
    // Check if there are changes to commit
    const status = execSync('git status --porcelain', { encoding: 'utf8' });
    
    if (status.trim()) {
      // Stage all changes
      execSync('git add .', { encoding: 'utf8' });
      
      // Create commit
      const commitMessage = `Release V.${version} - ${type.toUpperCase()}: ${message}`;
      execSync(`git commit -m "${commitMessage}"`, { encoding: 'utf8' });
      console.log(`✓ Created git commit for version ${version}`);
      
      // Create tag
      const tagName = `V.${version}`;
      execSync(`git tag -a ${tagName} -m "Release ${tagName}"`, { encoding: 'utf8' });
      console.log(`✓ Created git tag ${tagName}`);
    } else {
      console.log('No changes to commit');
    }
  } catch (error) {
    console.error('Git operations failed:', error.message);
  }
}

/**
 * Main version bump function
 */
function bumpVersion(type, message) {
  console.log(`\n=== ZLuxury Version Management ===`);
  console.log(`Version Type: ${type.toUpperCase()}`);
  console.log(`Message: ${message}\n`);

  try {
    // Get current version
    const currentVersion = getCurrentVersion();
    console.log(`Current Version: V.${currentVersion}`);

    // Calculate new version
    const newVersion = incrementVersion(currentVersion, type);
    console.log(`New Version: V.${newVersion}`);

    // Update files
    updatePackageJson(newVersion);
    createVersionFile(newVersion, type, message);
    updateChangelog(newVersion, type, message);

    // Create git commit and tag
    createGitCommit(newVersion, type, message);

    console.log(`\n✅ Version bump completed successfully!`);
    console.log(`📦 New Version: V.${newVersion}`);
    console.log(`🏷️  Git Tag: V.${newVersion}`);
    console.log(`\nNext steps:`);
    console.log(`  1. Review changes: git status`);
    console.log(`  2. Push to remote: npm run git:push`);
    console.log(`  3. Create release on GitHub`);

  } catch (error) {
    console.error('❌ Version bump failed:', error.message);
    process.exit(1);
  }
}

// Command line interface
const args = process.argv.slice(2);
const type = args[0] || 'patch';
const message = args[1] || 'Version update';

// Validate version type
const validTypes = ['major', 'minor', 'patch'];
if (!validTypes.includes(type)) {
  console.error(`Invalid version type: ${type}`);
  console.error(`Usage: npm run version:bump [major|minor|patch] "message"`);
  console.error(`Example: npm run version:bump minor "Added new AI agent integration"`);
  process.exit(1);
}

// Execute version bump
bumpVersion(type, message);