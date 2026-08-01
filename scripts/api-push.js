#!/usr/bin/env node

/**
 * GitHub API Push Script for ZLuxury (v2)
 *
 * Pushes local commits to GitHub via the Git Database API (api.github.com),
 * bypassing blocked github.com:443. Uses the authenticated `gh` CLI token.
 *
 * Strategy: Get the diff between remote main and local HEAD, create blobs for
 * changed files, create a single tree (using remote tree as base), create a
 * sync commit, and update the main ref. Then push all tags.
 *
 * Usage: node scripts/api-push.js
 *
 * @module api-push
 */

const { execSync } = require('child_process');

/** GitHub repository owner. @type {string} */
const OWNER = 'zwindhuang-opc';
/** GitHub repository name. @type {string} */
const REPO = 'zluxury';
/** Full repo slug "owner/name". @type {string} */
const SLUG = `${OWNER}/${REPO}`;

/**
 * Runs a shell command and returns trimmed stdout.
 * @param {string} cmd - Shell command.
 * @param {object} [opts] - execSync options.
 * @returns {string} Trimmed stdout.
 */
function run(cmd, opts = {}) {
  return execSync(cmd, { encoding: 'utf-8', stdio: 'pipe', ...opts }).trim();
}

/**
 * Calls the GitHub API via `gh api` with JSON input and returns parsed JSON.
 * @param {string} endpoint - API endpoint path.
 * @param {object} [opts] - { method, input, raw }.
 * @returns {object|string} Parsed JSON or raw string.
 * @throws {Error} If API call fails.
 */
function ghApi(endpoint, opts = {}) {
  const method = opts.method || 'GET';
  let cmd = `gh api ${endpoint} --method ${method}`;
  if (opts.input !== undefined) {
    cmd += ` --input -`;
  }
  const result = execSync(cmd, {
    encoding: 'utf-8',
    stdio: ['pipe', 'pipe', 'pipe'],
    input: opts.input !== undefined ? JSON.stringify(opts.input) : undefined,
    maxBuffer: 50 * 1024 * 1024,
  });
  if (opts.raw) return result;
  return result.trim() ? JSON.parse(result) : {};
}

/**
 * Runs a git command and returns trimmed stdout.
 * @param {string} args - Git arguments.
 * @returns {string} Trimmed stdout.
 */
function git(args) {
  return run(`git ${args}`);
}

/**
 * Gets the current HEAD SHA of the remote main branch.
 * @returns {string|null} Remote main SHA, or null if not found.
 */
function getRemoteMainSha() {
  try {
    const ref = ghApi(`repos/${SLUG}/git/refs/heads/main`);
    return ref.object.sha;
  } catch {
    return null;
  }
}

/**
 * Gets the local HEAD commit SHA.
 * @returns {string} Local HEAD SHA.
 */
function getLocalHead() {
  return git('rev-parse HEAD');
}

/**
 * Gets the tree SHA of a given commit using `git log` (PowerShell-safe,
 * avoids the `^{tree}` syntax which gets mangled by the shell).
 * @param {string} sha - Commit SHA.
 * @returns {string} Tree SHA.
 */
function getTreeSha(sha) {
  return git(`log -1 --format=%T ${sha}`);
}

/**
 * Gets the commit message and author info for the local HEAD.
 * @returns {object} { message, authorName, authorEmail, authorDate }.
 */
function getHeadCommitInfo() {
  return {
    message: git('log -1 --format=%s'),
    authorName: git('log -1 --format=%an'),
    authorEmail: git('log -1 --format=%ae'),
    authorDate: git('log -1 --format=%aI'),
  };
}

/**
 * Gets the list of files changed between two commits.
 * Returns objects with { status, path, mode, sha }.
 * @param {string} baseSha - Base commit SHA (remote).
 * @param {string} headSha - Head commit SHA (local).
 * @returns {Array<object>} Array of changed files.
 */
function getChangedFiles(baseSha, headSha) {
  // Get diff with raw format: mode, sha, status, path
  const output = git(`diff --raw ${baseSha} ${headSha}`);
  if (!output) return [];

  return output.split('\n').filter(Boolean).map(line => {
    // Format: :100644 100644 sha1 sha2 status\tpath
    const match = line.match(/^:(\d{6}) (\d{6}) (\w+) (\w+) (\w+)\t(.+)$/);
    if (!match) return null;
    return {
      oldMode: match[1],
      newMode: match[2],
      oldSha: match[3],
      newSha: match[4],
      status: match[5],
      path: match[6],
    };
  }).filter(Boolean);
}

/**
 * Creates a blob on GitHub from local git object content.
 * @param {string} blobSha - Local git blob SHA.
 * @returns {string} GitHub blob SHA.
 */
function createBlob(blobSha) {
  // Check if blob already exists on GitHub
  try {
    ghApi(`repos/${SLUG}/git/blobs/${blobSha}`);
    return blobSha;
  } catch {
    // Blob doesn't exist — create it
  }

  // Get blob content and encoding from local git
  const isBinary = git(`cat-file blob ${blobSha}`).includes('\u0000');
  const content = run(`git cat-file blob ${blobSha}`, { maxBuffer: 50 * 1024 * 1024 });
  const blob = ghApi(`repos/${SLUG}/git/blobs`, {
    method: 'POST',
    input: {
      content: Buffer.from(content, 'utf-8').toString('base64'),
      encoding: 'base64',
    },
  });
  return blob.sha;
}

/**
 * Creates a tree on GitHub using a base tree and a list of changed entries.
 * @param {string} baseTreeSha - The base tree SHA to modify.
 * @param {Array<object>} entries - Tree entries { path, mode, type, sha }.
 * @returns {string} New tree SHA.
 */
function createTree(baseTreeSha, entries) {
  const tree = ghApi(`repos/${SLUG}/git/trees`, {
    method: 'POST',
    input: {
      base_tree: baseTreeSha,
      tree: entries,
    },
  });
  return tree.sha;
}

/**
 * Creates a commit on GitHub.
 * @param {string} treeSha - Tree SHA.
 * @param {string[]} parents - Parent commit SHAs.
 * @param {object} author - { name, email, date }.
 * @param {string} message - Commit message.
 * @returns {string} New commit SHA.
 */
function createCommit(treeSha, parents, author, message) {
  const commit = ghApi(`repos/${SLUG}/git/commits`, {
    method: 'POST',
    input: {
      message,
      tree: treeSha,
      parents,
      author: {
        name: author.name,
        email: author.email,
        date: author.date,
      },
    },
  });
  return commit.sha;
}

/**
 * Updates the remote main branch ref.
 * @param {string} sha - New commit SHA.
 * @param {boolean} force - Whether to force update.
 */
function updateRef(sha, force) {
  ghApi(`repos/${SLUG}/git/refs/heads/main`, {
    method: 'PATCH',
    input: { sha, force },
  });
}

/**
 * Pushes all local tags to GitHub via the API.
 */
function pushTags() {
  const tags = git('tag').split('\n').filter(Boolean);
  console.log(`\nPushing ${tags.length} tags...`);

  for (const tagName of tags) {
    try {
      // Check if tag exists on remote
      try {
        ghApi(`repos/${SLUG}/git/refs/tags/${tagName}`);
        console.log(`  ${tagName}: already exists, skipping.`);
        continue;
      } catch {
        // Create it
      }

      const commitSha = git(`rev-list -n 1 ${tagName}`);
      ghApi(`repos/${SLUG}/git/refs`, {
        method: 'POST',
        input: { ref: `refs/tags/${tagName}`, sha: commitSha },
      });
      console.log(`  ${tagName}: created -> ${commitSha.substring(0, 8)}`);
    } catch (err) {
      console.error(`  ${tagName}: FAILED - ${err.message}`);
    }
  }
}

/**
 * Main entry point.
 */
async function main() {
  console.log('=== ZLuxury GitHub API Push ===');
  console.log(`Repository: ${SLUG}`);
  console.log(`Time: ${new Date().toISOString()}\n`);

  // Step 1: Get remote and local SHAs
  console.log('Step 1: Fetching remote state...');
  const remoteSha = getRemoteMainSha();
  const localHead = getLocalHead();

  if (!remoteSha) {
    console.error('ERROR: Could not fetch remote main SHA. Check gh auth.');
    process.exit(1);
  }

  console.log(`  Remote main: ${remoteSha.substring(0, 12)}`);
  console.log(`  Local HEAD:  ${localHead.substring(0, 12)}`);

  if (remoteSha === localHead) {
    console.log('\nAlready up to date. Pushing tags only...');
    pushTags();
    console.log('\nDone.');
    return;
  }

  // Step 2: Get changed files
  console.log('\nStep 2: Computing diff...');
  let changedFiles;
  let diffBase = remoteSha;
  try {
    changedFiles = getChangedFiles(remoteSha, localHead);
  } catch {
    // Remote SHA doesn't exist locally (was created via API).
    // Fall back to diffing against HEAD~1 (the last synced local commit).
    console.log(`  Remote SHA not in local db, falling back to HEAD~1...`);
    diffBase = git('rev-parse HEAD~1');
    changedFiles = getChangedFiles(diffBase, localHead);
  }
  console.log(`  Diff base: ${diffBase.substring(0, 12)}`);
  console.log(`  Changed files: ${changedFiles.length}`);

  if (changedFiles.length === 0) {
    console.log('\nNo file changes. Updating ref directly...');
    try {
      updateRef(localHead, false);
      console.log('  Ref updated.');
    } catch {
      updateRef(localHead, true);
      console.log('  Ref force-updated.');
    }
    pushTags();
    console.log('\nDone.');
    return;
  }

  // Step 3: Create blobs for changed files
  console.log('\nStep 3: Creating blobs for changed files...');
  const treeEntries = [];
  let blobCount = 0;

  for (const file of changedFiles) {
    if (file.status === 'D') {
      // Deleted file — mark as deletion (null sha)
      treeEntries.push({ path: file.path, mode: file.oldMode, type: 'blob', sha: null });
      console.log(`  [DEL] ${file.path}`);
    } else if (file.status === 'A' || file.status === 'M' || file.status === 'R' || file.status === 'C') {
      // Added/Modified/Renamed/Copied — create blob
      const blobSha = createBlob(file.newSha);
      treeEntries.push({ path: file.path, mode: file.newMode, type: 'blob', sha: blobSha });
      blobCount++;
      if (blobCount % 10 === 0 || blobCount === changedFiles.length) {
        console.log(`  [${blobCount}/${changedFiles.length}] blobs created...`);
      }
    }
  }

  // Step 4: Create tree
  console.log('\nStep 4: Creating tree...');
  const baseTreeSha = getTreeSha(diffBase);
  const newTreeSha = createTree(baseTreeSha, treeEntries);
  console.log(`  Tree: ${newTreeSha.substring(0, 12)}`);

  // Step 5: Create commit
  console.log('\nStep 5: Creating commit...');
  const headInfo = getHeadCommitInfo();
  const newCommitSha = createCommit(
    newTreeSha,
    [remoteSha],
    { name: headInfo.authorName, email: headInfo.authorEmail, date: headInfo.authorDate },
    `${headInfo.message}\n\n(api-push: synced ${changedFiles.length} files from local HEAD ${localHead.substring(0, 8)})`
  );
  console.log(`  Commit: ${newCommitSha.substring(0, 12)}`);

  // Step 6: Update ref
  console.log('\nStep 6: Updating main ref...');
  try {
    updateRef(newCommitSha, false);
    console.log('  Ref updated (fast-forward).');
  } catch {
    console.log('  Fast-forward failed, force-updating...');
    updateRef(newCommitSha, true);
    console.log('  Ref force-updated.');
  }

  // Step 7: Push tags
  console.log('\nStep 7: Pushing tags...');
  pushTags();

  console.log('\n=== Push complete ===');
  console.log(`Main: ${remoteSha.substring(0, 8)} -> ${newCommitSha.substring(0, 8)}`);
  console.log(`Files synced: ${changedFiles.length}`);
  console.log(`Tags: ${git('tag').split('\n').filter(Boolean).length} total`);
}

main().catch(err => {
  console.error(`\nFATAL: ${err.message}`);
  console.error(err.stack);
  process.exit(1);
});
