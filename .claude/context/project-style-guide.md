---
created: 2025-08-25T03:50:05Z
last_updated: 2025-08-25T03:50:05Z
version: 1.0
author: Claude Code PM System
---

# Project Style Guide

## Code Standards and Conventions

### Shell Script Conventions

#### Naming Standards
- **Files**: Kebab-case with `.sh` extension (e.g., `epic-list.sh`, `prd-status.sh`)
- **Functions**: Snake_case (e.g., `validate_github_auth`, `create_epic_file`)
- **Variables**: Snake_case with descriptive names (e.g., `epic_name`, `github_issue_id`)
- **Constants**: UPPER_CASE with underscores (e.g., `CLAUDE_DIR`, `DEFAULT_BRANCH`)

#### File Structure Pattern
```bash
#!/usr/bin/env bash
# Brief description of script purpose
# Usage: script-name.sh [arguments]

set -euo pipefail  # Exit on error, undefined vars, pipe failures

# Constants and configuration
readonly SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
readonly CLAUDE_DIR=".claude"

# Helper functions (alphabetically ordered)
function helper_function() {
    # Implementation
}

# Main function
function main() {
    # Script logic
}

# Execute main with all arguments
main "$@"
```

#### Error Handling Standards
- Always use `set -euo pipefail` for robust error handling
- Provide clear error messages with actionable next steps
- Use consistent exit codes: 0 (success), 1 (general error), 2 (invalid usage)
- Include error context and script name in error messages

#### Output Standards
- **Success messages**: Use ✅ emoji prefix
- **Error messages**: Use ❌ emoji prefix  
- **Warning messages**: Use ⚠️ emoji prefix
- **Info messages**: Use 📋 emoji prefix
- **Progress indicators**: Use consistent formatting for long operations

### Documentation Conventions

#### Markdown Standards
- Use ATX-style headers (`#`, `##`, `###`)
- Include frontmatter with metadata for all context files
- Consistent emoji usage for visual hierarchy and scanning
- Code blocks properly language-tagged for syntax highlighting

#### Frontmatter Format
```yaml
---
created: YYYY-MM-DDTHH:MM:SSZ
last_updated: YYYY-MM-DDTHH:MM:SSZ  
version: X.Y
author: Claude Code PM System
---
```

#### File Naming Conventions
- **Context files**: Descriptive kebab-case (e.g., `project-structure.md`)
- **PRD files**: Feature name kebab-case (e.g., `user-authentication.md`)
- **Epic files**: Always `epic.md` within epic directory
- **Task files**: Sequential numbers initially (`001.md`), then GitHub issue IDs (`1234.md`)

### Command Design Patterns

#### Command Naming
- Prefix: `/pm:` for all project management commands
- Format: `category-action` (e.g., `epic-list`, `issue-start`, `prd-new`)
- Consistent verb choices:
  - `new` for creation
  - `list` for listing/enumeration  
  - `show` for detailed display
  - `edit` for modification
  - `start`/`close` for state transitions

#### Command Implementation Structure
1. **Argument validation** - Check required parameters and provide usage help
2. **Preflight checks** - Validate system state and dependencies
3. **Core logic** - Primary command functionality
4. **Success confirmation** - Clear indication of successful completion
5. **Error handling** - Graceful failure with recovery suggestions

#### Output Consistency
- Start with action description (e.g., "🚀 Creating new PRD...")
- Show progress for long operations
- Summarize results at completion
- Provide next steps or related commands

## File Organization Standards

### Directory Structure Principles
- **Separation of concerns**: Different file types in dedicated directories
- **Logical grouping**: Related functionality grouped together
- **Intuitive navigation**: Directory names clearly indicate contents
- **Scalability**: Structure supports growth without reorganization

### File Lifecycle Management
- **Creation**: Always use templates with proper frontmatter
- **Updates**: Maintain version history through frontmatter updates
- **Archival**: Move completed work to archive directories
- **Cleanup**: Regular removal of temporary and obsolete files

### Configuration Management
- **Global settings**: `.claude/settings.local.json` for user preferences
- **Project settings**: `CLAUDE.md` for project-specific instructions
- **Environment variables**: Used for runtime configuration
- **Default values**: Always provide sensible defaults

## Content Standards

### Writing Style
- **Concise and clear**: Avoid unnecessary verbosity
- **Action-oriented**: Use active voice and imperative mood
- **Consistent terminology**: Maintain glossary of terms and stick to it
- **Professional tone**: Business-appropriate but not overly formal

### Technical Documentation
- **Complete examples**: Show full command sequences with expected output
- **Error scenarios**: Document common failure cases and solutions
- **Prerequisites**: Clearly state requirements and dependencies
- **Success criteria**: Define what successful completion looks like

### Code Comments
- **Purpose over implementation**: Explain why, not what
- **Maintenance notes**: Include information for future developers
- **TODOs**: Use standardized format for future improvements
- **Assumptions**: Document any assumptions made by the code

## Quality Assurance Standards

### Validation Requirements
- **Input validation**: All user inputs validated with clear error messages
- **State checking**: System state verified before operations
- **Dependency verification**: Required tools and permissions checked
- **Output verification**: Results validated before reporting success

### Testing Approach
- **Command testing**: Each command tested with valid and invalid inputs
- **Integration testing**: End-to-end workflow testing
- **Error path testing**: Verify graceful handling of error conditions
- **Documentation testing**: Ensure examples work as documented

### Performance Guidelines
- **Minimal external calls**: Reduce GitHub API calls where possible
- **Efficient file operations**: Use appropriate tools for file manipulation
- **Progress indication**: Show progress for operations taking >2 seconds
- **Resource cleanup**: Clean up temporary files and processes

## Collaboration Standards

### Git Workflow
- **Commit messages**: Use conventional commit format with clear descriptions
- **Branch naming**: Feature branches use `feature/description` format
- **Pull requests**: Include description, testing notes, and breaking changes
- **Code review**: All changes reviewed before merging

### Issue Management
- **Clear descriptions**: Issues include context, steps to reproduce, and expected behavior
- **Proper labeling**: Use consistent labels for categorization
- **Progress updates**: Regular updates on work progress
- **Closure criteria**: Clear definition of when issue is resolved

### Documentation Maintenance
- **Accuracy**: Keep documentation current with code changes
- **Completeness**: Document all public interfaces and workflows
- **Examples**: Include working examples for complex operations
- **Versioning**: Track documentation versions with frontmatter

## Extension and Customization

### Plugin Architecture
- **Modular design**: New commands implemented as separate scripts
- **Standard interface**: Consistent parameter and output patterns
- **Configuration support**: Allow customization through settings
- **Backward compatibility**: Maintain compatibility when adding features

### Template System
- **Reusable templates**: Standard templates for common file types
- **Customization hooks**: Allow user-specific template modifications
- **Variable substitution**: Support for dynamic content generation
- **Validation**: Template validation to ensure consistency

### Integration Standards
- **API compatibility**: Maintain stable interfaces for external integrations
- **Data formats**: Use standard formats (JSON, Markdown) for interoperability
- **Extension points**: Provide hooks for third-party enhancements
- **Migration support**: Support for upgrading between versions