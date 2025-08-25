---
created: 2025-08-25T03:50:05Z
last_updated: 2025-08-25T03:50:05Z
version: 1.0
author: Claude Code PM System
---

# System Patterns

## Architectural Patterns

### Command Pattern
- Each PM operation is implemented as a separate shell script
- Commands are self-contained with clear input/output contracts  
- Standardized command structure: `/pm:command-name`
- Error handling and validation in each command

### File-Based State Management
- Project state persisted through filesystem
- Context files maintain project knowledge
- Epic and task files track work progress
- No external databases or state stores

### Local-First with Remote Sync
- All operations work locally first for speed
- Explicit synchronization commands with GitHub
- Offline capability maintained throughout
- Remote state reconciliation on sync

## Data Flow Patterns

### PRD → Epic → Tasks → Issues Flow
```
PRD Creation (/pm:prd-new)
    ↓
Epic Planning (/pm:prd-parse) 
    ↓
Task Breakdown (/pm:epic-decompose)
    ↓
GitHub Sync (/pm:epic-sync)
    ↓
Parallel Execution (/pm:issue-start)
```

### Bidirectional GitHub Sync
- **Local → GitHub:** Push epics, tasks, updates
- **GitHub → Local:** Pull issue comments, status changes
- **Reconciliation:** Handle conflicts and state drift

## Development Patterns

### Agent Specialization Pattern
- Different agents for different work streams:
  - Database agents for schema work
  - API agents for endpoint development
  - UI agents for interface components
  - Test agents for quality assurance
- Each agent reads from shared context
- Independent execution with Git-based coordination

### Parallel Execution Pattern
- Single issue splits into multiple concurrent work streams
- Git worktrees provide isolated environments
- Agents coordinate through commit messages and file locks
- Final merge consolidates all parallel work

### Context Preservation Pattern
- `.claude/context/` maintains project understanding
- Each epic maintains its own context bubble
- Agents inherit context from parent directories
- Regular context updates maintain accuracy

## Git Integration Patterns

### Worktree Management
- Epic-specific worktrees for isolation
- Pattern: `../epic-{name}/` for parallel work
- Clean separation of concurrent development
- Easy switching between active epics

### Branch Strategy
- Main branch for stable releases
- Epic branches for feature development  
- Task branches within epic worktrees
- Merge-based integration to main

### Commit Message Conventions
- Structured commit messages for automation
- Progress indicators in commit messages
- Issue references for traceability
- Agent identification in commits

## Error Handling Patterns

### Graceful Degradation
- Commands work with partial information
- Fallbacks for missing dependencies
- Clear error messages with next steps
- Recovery suggestions for common failures

### Validation and Preflight Checks
- System state validation before operations
- Dependency checking at command start
- User confirmation for destructive operations
- Clear progress indication during long operations

## File Organization Patterns

### Hierarchical Context
- Project-level context in `.claude/context/`
- Epic-level context in `.claude/epics/{epic}/`  
- Task-level context in individual task files
- Inheritance and override semantics

### Naming Conventions
- Kebab-case for command names (`epic-list`)
- Sequential numbering for tasks (`001.md`, `002.md`)
- GitHub issue IDs for synced tasks (`1234.md`)
- Descriptive names for context files

### File Lifecycle Management
- Creation through template systems
- Updates through structured editing
- Archival of completed work
- Cleanup of temporary files

## Integration Patterns

### GitHub Issues as Database
- Issues store work items and progress
- Comments provide audit trail
- Labels enable filtering and organization
- Parent-child relationships track hierarchy

### Claude Code Native Integration
- Commands accessible via `/pm:*` syntax
- Context automatically loaded for agents
- Progress updates flow back to main conversation
- Specialized agents launched as needed

### Shell Script Modularity
- Common functions in shared utilities
- Environment variable based configuration
- Exit codes for programmatic integration
- Logging and debugging support

## Quality Patterns

### Spec-Driven Development
- Every line of code traces to specification
- PRDs define requirements completely
- Epics detail implementation approach
- Tasks provide acceptance criteria

### Progress Transparency  
- Real-time progress updates to GitHub
- Local progress files for offline work
- Status commands for quick checks
- Audit trail through commit history

### Validation and Testing
- System integrity checking (`/pm:validate`)
- Command-level error handling
- Integration testing through workflows
- Documentation validation