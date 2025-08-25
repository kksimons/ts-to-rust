---
created: 2025-08-25T03:50:05Z
last_updated: 2025-08-25T03:50:05Z
version: 1.0
author: Claude Code PM System
---

# Project Structure

## Root Directory Layout

```
.
├── .claude/                    # Core PM system directory
├── .git/                      # Git repository metadata
├── .gitignore                 # Git ignore rules
├── AGENTS.md                  # Agent documentation
├── CLAUDE.md                  # Claude Code configuration
├── COMMANDS.md               # Available commands reference  
├── LICENSE                   # MIT license
├── README.md                 # Main project documentation
└── screenshot.webp           # Project screenshot
```

## .claude/ Directory Structure

```
.claude/
├── CLAUDE.md                 # System instructions and rules
├── agents/                   # Specialized agent definitions
├── commands/                 # Command implementations
│   ├── context/             # Context management commands
│   ├── pm/                  # Project management commands
│   └── testing/             # Test-related commands
├── context/                 # Project context files (this directory)
├── epics/                   # Local epic workspace (gitignored)
├── prds/                    # Product Requirements Documents  
├── rules/                   # System rules and guidelines
├── scripts/                 # Executable shell scripts
│   ├── pm/                  # PM command implementations
│   └── test-and-log.sh      # Test execution script
└── settings.local.json      # Local configuration
```

## Key Directories

### /scripts/pm/
Contains all PM command implementations:
- `epic-show.sh` - Display epic details
- `validate.sh` - System validation
- `epic-status.sh` - Epic status checking
- `search.sh` - Content search
- `epic-list.sh` - List all epics
- `init.sh` - System initialization
- `help.sh` - Help display
- `standup.sh` - Daily standup reports
- `status.sh` - Overall status
- `next.sh` - Next task prioritization
- `prd-status.sh` - PRD status checking
- `blocked.sh` - Blocked task identification
- `prd-list.sh` - PRD listing
- `in-progress.sh` - Current work status

### /agents/
Houses specialized agents for different work types:
- Database agents for schema work
- API agents for endpoint development  
- UI agents for interface work
- Test agents for quality assurance

### /commands/
Command definitions for Claude Code integration:
- Context commands for project state management
- PM commands for project management workflow
- Testing commands for quality assurance

## File Naming Conventions

### Epic Files
- Epic main file: `epic.md`
- Task files: Initially `001.md`, `002.md`, etc.
- After GitHub sync: `{issue-id}.md` (e.g., `1234.md`)

### PRD Files
- Format: `{feature-name}.md`
- Location: `.claude/prds/`

### Context Files
- All files use `.md` extension
- Descriptive names (e.g., `project-structure.md`)
- Include frontmatter with metadata

## Architecture Patterns

### Modular Design
- Each PM command is a separate script
- Commands operate independently but share common utilities
- Context is preserved through file-based state

### GitHub Integration
- Local-first development with periodic sync
- Issues as source of truth for work state
- Git worktrees for parallel development

### Agent Specialization
- Different agents for different work streams
- Agents read from shared context directory
- Independent execution with coordination through Git