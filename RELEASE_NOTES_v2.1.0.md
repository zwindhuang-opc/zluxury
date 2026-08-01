## ZLuxury v2.1.0 Release Notes

### New Features
- **GitHub API Push Script** (`scripts/api-push.js`): Pushes commits and tags via the Git Database API (api.github.com), bypassing blocked github.com:443 port. Enables backups even when direct git push is blocked by network firewalls.
- **Version Bump Script** (`scripts/version-bump.js`): Semantic versioning with major/minor/patch bumps, auto-updates package.json + VERSION.json, creates annotated git tags.
- **Git Push Script** (`scripts/git-push.js`): Branch management (setup/push/feature/deploy) with timestamped commits.
- **GitHub Operations Script** (`scripts/github.js`): Higher-level GitHub operations (setup/backup/push/list/deploy).

### Improvements
- Fixed remote URLs in all scripts to point to `zwindhuang-opc/zluxury` (correct account)
- Comprehensive PROJECT_PLAN.md (6,391 words) with 6-sprint Agile/Scrum breakdown
- PMP management, risk register, stakeholder matrix
- Unicorn Agent (Hermes + OpenClaw) design documentation
- Removed all hardcoded values (placeholder pricing, port numbers, business config)
- Added JSDoc comments to all new functions and variables
- Versioned screenshots directory structure (`screenshots/v2.0.0/`)

### Version Control
- Semantic versioning: V.1.0.0, V.1.1.0, v2.0.0, v2.0.1, v2.0.2, v2.1.0
- Branch management: `main` (production) + `develop` (integration)
- All tags pushed to GitHub
- Automated backup scripts prepared

### Verification
- vcfhuang@qq.com account checked: does NOT have zluxury (only has annecat_ai)
- No migration needed from vcfhuang to zwindhuang account
- All previous versions (V.1.0.0 through v2.1.0) backed up to zwindhuang-opc/zluxury
