#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

/**
 * Reads and parses a JSON file, returning its contents as an object.
 * @param {string} filePath - Absolute or relative path to the JSON file.
 * @returns {object} Parsed JSON content.
 * @throws {Error} If the file cannot be read or parsed.
 */
function readJSON(filePath) {
  try {
    const raw = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    throw new Error(`Failed to read or parse ${filePath}: ${err.message}`);
  }
}

/**
 * Writes an object to a JSON file with pretty-printing (2-space indent).
 * @param {string} filePath - Absolute or relative path to the output file.
 * @param {object} data - Object to serialize and write.
 * @throws {Error} If the file cannot be written.
 */
function writeJSON(filePath, data) {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n', 'utf-8');
  } catch (err) {
    throw new Error(`Failed to write ${filePath}: ${err.message}`);
  }
}

/**
 * Bumps a semantic version string by the given type.
 * @param {string} currentVersion - Current version in "major.minor.patch" format.
 * @param {"major"|"minor"|"patch"} type - The version component to bump.
 * @returns {string} New version string in "major.minor.patch" format.
 * @throws {Error} If the version format is invalid or the type is unrecognized.
 */
function bumpVersion(currentVersion, type) {
  const parts = currentVersion.split('.');
  if (parts.length !== 3) {
    throw new Error(`Invalid version format: "${currentVersion}". Expected "major.minor.patch".`);
  }

  const major = parseInt(parts[0], 10);
  const minor = parseInt(parts[1], 10);
  const patch = parseInt(parts[2], 10);

  if (isNaN(major) || isNaN(minor) || isNaN(patch)) {
    throw new Error(`Invalid version components in "${currentVersion}". All parts must be integers.`);
  }

  let newMajor = major;
  let newMinor = minor;
  let newPatch = patch;

  switch (type) {
    case 'major':
      newMajor += 1;
      newMinor = 0;
      newPatch = 0;
      break;
    case 'minor':
      newMinor += 1;
      newPatch = 0;
      break;
    case 'patch':
      newPatch += 1;
      break;
    default:
      throw new Error(`Unknown bump type: "${type}". Use "major", "minor", or "patch".`);
  }

  return `${newMajor}.${newMinor}.${newPatch}`;
}

/**
 * Updates the version field inside package.json.
 * @param {string} projectRoot - Absolute path to the project root.
 * @param {string} newVersion - The new version string to write.
 * @throws {Error} If the file cannot be updated.
 */
function updatePackageJSON(projectRoot, newVersion) {
  const pkgPath = path.join(projectRoot, 'package.json');
  const pkg = readJSON(pkgPath);
  const oldVersion = pkg.version;
  pkg.version = newVersion;
  writeJSON(pkgPath, pkg);
  console.log(`  package.json: ${oldVersion} -> ${newVersion}`);
}

/**
 * Updates the version field inside VERSION.json and refreshes the updatedAt timestamp.
 * @param {string} projectRoot - Absolute path to the project root.
 * @param {string} newVersion - The new version string to write.
 * @throws {Error} If the file cannot be updated.
 */
function updateVersionJSON(projectRoot, newVersion) {
  const versionPath = path.join(projectRoot, 'VERSION.json');
  const versionData = readJSON(versionPath);
  versionData.version = newVersion;
  versionData.updatedAt = new Date().toISOString().split('T')[0];
  writeJSON(versionPath, versionData);
  console.log(`  VERSION.json: updated to ${newVersion}`);
}

/**
 * Creates an annotated git tag for the given version.
 * @param {string} newVersion - The version string used as the tag name (prefixed with "v").
 * @throws {Error} If git commands fail or git is not available.
 */
function createGitTag(newVersion) {
  try {
    const tagName = `v${newVersion}`;
    execSync(`git tag -a ${tagName} -m "Release ${tagName}"`, { stdio: 'inherit' });
    console.log(`  Git tag created: ${tagName}`);
  } catch (err) {
    console.warn(`  Warning: Failed to create git tag: ${err.message}`);
    console.warn('  You may need to commit changes first or run: git tag -a v' + newVersion);
  }
}

/**
 * Main entry point for the version-bump script.
 * Parses command-line arguments, reads current version, bumps it,
 * updates both package.json and VERSION.json, and creates a git tag.
 */
function main() {
  const projectRoot = process.cwd();
  const args = process.argv.slice(2);
  const bumpType = args[0] || 'patch';

  const validTypes = ['major', 'minor', 'patch'];
  if (!validTypes.includes(bumpType)) {
    console.error('Usage: node scripts/version-bump.js [major|minor|patch]');
    console.error(`  Current bump type argument: "${bumpType}"`);
    process.exit(1);
  }

  console.log(`\nZLuxury Version Bump`);
  console.log('====================');

  // Read current version from package.json
  let currentVersion;
  try {
    const pkg = readJSON(path.join(projectRoot, 'package.json'));
    currentVersion = pkg.version;
  } catch (err) {
    console.error(`Error reading package.json: ${err.message}`);
    process.exit(1);
  }

  console.log(`Current version: ${currentVersion}`);
  console.log(`Bump type:       ${bumpType}`);

  const newVersion = bumpVersion(currentVersion, bumpType);
  console.log(`New version:     ${newVersion}\n`);

  // Update both files
  try {
    updatePackageJSON(projectRoot, newVersion);
    updateVersionJSON(projectRoot, newVersion);
  } catch (err) {
    console.error(`Error updating version files: ${err.message}`);
    process.exit(1);
  }

  // Create git tag
  createGitTag(newVersion);

  console.log(`\nVersion successfully bumped to ${newVersion}`);
  console.log(`Remember to push the tag with: git push origin v${newVersion}\n`);
}

main();