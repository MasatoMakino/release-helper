# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a CLI tool for automating release processes in Node.js projects. The tool creates release branches, updates version numbers, creates pull requests, and manages GitHub releases.

## Development Commands

### Core commands
- `npm test` - Run tests using Vitest
- `npm run build` - Compile TypeScript to JavaScript (outputs to `dist/`)
- `npm run prepack` - Build and test (runs before packaging)

### Release helper commands (for testing the CLI)
- `npx release-helper init` - Initialize GitHub labels and release note template
- `npx release-helper preversion` - Checkout default branch, pull changes, run tests
- `npx release-helper postversion` - Create GitHub pull request
- `npx release-helper release` - Push tags and create GitHub draft release
- `npx release-helper clean-merged` - Clean up merged local branches

### Code quality
- Code formatting and linting is handled by Biome (`@biomejs/biome`)
- Pre-commit hooks via Lefthook automatically run `biome check --write`
- Pre-push hooks run `biome check` (no auto-fix)

## Architecture

### Core modules
- **CLI entry point**: `src/CLI.ts` → `src/runCommand.ts` (Commander.js setup)
- **Command implementations**: 
  - `src/preversion.ts` - Pre-version checks and preparation
  - `src/postversion.ts` - Post-version PR creation
  - `src/release.ts` - Release creation and tag pushing
- **Utilities**: `src/util/` - Common functions for git operations, error handling
- **Initialization**: `src/init/` - GitHub setup (labels, templates, checks)

### Command workflow
1. **preversion**: Checkout default branch → pull → run tests
2. **postversion**: Create release branch → push → create PR with auto-merge
3. **release**: Check PR merged → push tags → create GitHub draft release → cleanup

### Dependencies
- **execa**: For executing git and gh (GitHub CLI) commands
- **commander**: CLI framework for command parsing

## Code Conventions

### TypeScript/ESM requirements
- **CRITICAL**: Import paths in src/ must include `.js` extension (not `.ts`)
- Use relative paths for src/ files, NOT alias paths in production code
- Alias paths (`@/`) only work in tests via vitest.config.ts

```typescript
// Correct
import { isExecaErrorWithErrorCode } from "../util/index.js";
import { execa } from "execa";

// Incorrect  
import { isExecaErrorWithErrorCode } from "@/util/index.js"; // Only for tests
import { isExecaErrorWithErrorCode } from "../util/index"; // Missing .js
```

### Testing with Vitest
- Tests in `__test__/` directory with `.spec.ts` extension
- Use `vi.mock()` for external modules (e.g., execa)
- Use `vi.spyOn()` for src/ functions
- Import test targets as namespace with `*Module` suffix:
  ```typescript
  import * as ReleaseModule from "@/release/index.js"; // Alias OK in tests
  ```
- Always call `vi.restoreAllMocks()` in `afterEach()`

### Code style
- Biome handles formatting (tab indentation, double quotes)
- ESM module type in package.json
- Strict TypeScript configuration

## External Dependencies

### Required tools
- **Node.js**: Runtime
- **Git**: Version control operations
- **GitHub CLI (`gh`)**: Creating PRs and releases

### GitHub integration
- Creates labels: "release" and "dependencies" 
- Sets up release note template in `.github/release.yml`
- Checks for npm test completion in GitHub Actions