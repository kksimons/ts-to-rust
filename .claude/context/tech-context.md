---
created: 2025-08-25T03:50:05Z
last_updated: 2025-08-25T03:50:05Z
version: 1.0
author: Claude Code PM System
---

# Technical Context

## Project Type
**Claude Code Project Management System**
- Shell-based automation system for software project management
- Integrates with GitHub CLI and Git workflows
- Designed for Claude Code AI-assisted development

## Core Technologies

### Primary Language
- **Shell Scripting (Bash)** - All automation and command implementations

### Required Dependencies
- **GitHub CLI (gh)** - Version 2.65.0 installed
  - Extensions: 1 installed (gh-sub-issue)
  - Authentication: Active (github.com)
- **Git** - Repository management and version control
- **GitHub Account** - Authenticated and configured

### GitHub Integration
- **Repository:** https://github.com/automazeio/ccpm.git  
- **Authentication:** OAuth via GitHub CLI
- **Extensions:**
  - `gh-sub-issue` - For proper parent-child issue relationships

## Development Tools

### Command Line Tools
- `gh` - GitHub CLI for issue/PR management
- `git` - Version control operations
- Standard Unix tools (`find`, `grep`, `sed`, `awk`, etc.)

### File Formats
- **Markdown (.md)** - All documentation and specifications
- **JSON** - Configuration files (settings.local.json)
- **Shell Scripts (.sh)** - Command implementations

## System Architecture

### Local-First Design
- All operations work locally first
- Synchronization with GitHub is explicit
- Context preserved through file system

### Git Integration
- Uses Git worktrees for parallel development
- Branch-based isolation for concurrent work
- Commit-based progress tracking

### GitHub API Usage
- Issues as project database
- Comments for progress updates  
- Labels for organization and filtering
- Parent-child relationships via gh-sub-issue

## Configuration

### Local Settings
- **File:** `.claude/settings.local.json`
- **Purpose:** Local environment configuration
- **Scope:** User-specific preferences

### Global Instructions
- **File:** `.claude/CLAUDE.md` 
- **Purpose:** Always-on Claude Code instructions
- **Content:** System rules and command definitions

## Development Environment

### Project Root Detection
- Git repository presence: ✅
- Configuration files: CLAUDE.md, .gitignore present
- No traditional project files (package.json, requirements.txt, etc.)

### Directory Structure
- Follows .claude/ convention for Claude Code projects
- Modular command organization
- Context-aware file management

## Integration Points

### Claude Code
- Native command integration via `/pm:*` commands
- Context preservation through `.claude/context/`
- Agent specialization for different work types

### GitHub Workflows
- Issue-driven development
- PR-based code review
- Label-based organization

### Git Operations
- Branch management for epics
- Worktree creation for parallel work
- Commit-based audit trail

## Version Dependencies

### GitHub CLI
- **Minimum Version:** 2.0+
- **Current Version:** 2.65.0
- **Critical Features:** Issue management, authentication

### Git
- **Standard Version:** Any modern Git installation
- **Required Features:** Worktrees, branching, remotes

## No Traditional Dependencies
- No Node.js package.json
- No Python requirements.txt  
- No Rust Cargo.toml
- No Go go.mod
- Pure shell/GitHub CLI implementation