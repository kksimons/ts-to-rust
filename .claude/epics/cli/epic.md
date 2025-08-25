---
name: cli
status: backlog
created: 2025-08-25T04:13:36Z
progress: 0%
prd: .claude/prds/cli.md
github: https://github.com/kksimons/ts-to-rust/issues/1
---

# Epic: CLI - TypeScript-to-Rust API Generator ("Forge")

## Overview

Build a revolutionary CLI tool that generates production-ready Rust backends from TypeScript declarations. The tool uses a Prisma-inspired TypeScript DSL for defining models and API endpoints, then generates complete Axum + Diesel + PostgreSQL/MySQL/SQLite backends with built-in middleware, authentication, and best practices.

**Core Architecture**: TypeScript DSL → AST Parser → IR (JSON) → Rust Code Generator → Production Backend

## Architecture Decisions

### Technology Stack (Opinionated Single Stack)
- **CLI Tool**: Node.js + TypeScript (leveraging existing ecosystem)
- **TypeScript Parsing**: ts-morph library for reliable AST manipulation
- **Code Generation**: Tera templating engine for Rust code generation
- **Generated Backend**: Axum + Diesel + serde (battle-tested, high-performance)
- **Database Support**: PostgreSQL, MySQL, SQLite via Diesel
- **Authentication**: JWT with RS256/ES256 algorithms

### Key Design Patterns
- **Atomic Generation**: Complete wipe-and-rebuild approach to avoid merge conflicts
- **Fail-Fast Validation**: TypeScript validation before any Rust code generation
- **Template-Driven**: Use Tera templates for consistent, maintainable code generation
- **Monorepo Structure**: Frontend and backend coexist with clear separation

### Code Generation Strategy
- Parse TypeScript DSL into intermediate representation (JSON IR)
- Validate IR against Rust/Diesel constraints
- Generate complete project structure from templates
- Ensure all generated code compiles and follows Rust best practices

## Technical Approach

### CLI Tool Architecture
```
forge (Node.js CLI)
├── src/
│   ├── commands/           # CLI command implementations
│   ├── parsers/           # TypeScript DSL parsing
│   ├── generators/        # Rust code generation
│   ├── templates/         # Tera templates for Rust code
│   └── validators/        # Schema and code validation
```

### TypeScript DSL Design
- **Models**: Prisma-like syntax for database schema definition
- **Routes**: Express.js-inspired syntax for API endpoint definition
- **Validation**: Built-in TypeScript types for compile-time checking
- **Relations**: Simple hasMany/belongsTo relationship definitions

### Generated Rust Project Structure
```
server/
├── src/
│   ├── main.rs            # Axum server setup
│   ├── lib.rs             # Module exports
│   ├── models/            # Diesel models and queries
│   ├── routes/            # Axum route handlers
│   ├── middleware/        # Auth, CORS, rate limiting
│   ├── schema.rs          # Diesel schema
│   └── db.rs              # Connection pooling
├── migrations/            # Diesel migrations
└── Cargo.toml            # Dependencies
```

### Infrastructure
- **Development**: Local development with cargo watch for Rust compilation
- **Database**: Support for PostgreSQL (primary), MySQL, SQLite
- **Deployment**: Generate production-ready Docker containers and binaries
- **Monitoring**: Built-in structured logging and metrics

## Implementation Strategy

### Phase 1: Core CLI Infrastructure (Week 1-2)
- Set up Node.js CLI project with TypeScript
- Implement basic command structure (init, generate, dev)
- Create project scaffolding for monorepo structure
- Basic TypeScript DSL parser using ts-morph

### Phase 2: Code Generation Engine (Week 3-4)
- Design and implement IR (Intermediate Representation) schema
- Build Tera template system for Rust code generation
- Generate basic Axum server with Diesel models
- Implement atomic generation (wipe-and-rebuild)

### Phase 3: Advanced Features & Polish (Week 5-6)
- Add middleware generation (CORS, JWT, rate limiting)
- Implement database migration generation
- Add comprehensive error handling and validation
- Performance optimization and testing

### Risk Mitigation
- **Complexity Risk**: Keep DSL simple and close to existing patterns (Prisma)
- **Generation Risk**: Extensive testing with real-world scenarios
- **Adoption Risk**: Focus on developer experience and clear documentation
- **Performance Risk**: Benchmark against hand-written Rust backends

### Testing Approach
- **Unit Tests**: Test each component (parser, generator, validator) independently
- **Integration Tests**: End-to-end CLI workflows with generated backends
- **Performance Tests**: Generated backend performance benchmarks
- **Compatibility Tests**: Verify across different databases and environments

## Task Breakdown Preview

High-level task categories that will be created:
- [ ] **CLI Foundation**: Set up Node.js CLI with command structure and project scaffolding
- [ ] **TypeScript DSL Parser**: Implement TypeScript AST parsing and IR generation
- [ ] **Rust Code Generator**: Build template system and core Rust code generation
- [ ] **Database Integration**: Add Diesel schema generation and migration support
- [ ] **Middleware Generation**: Generate authentication, CORS, and rate limiting
- [ ] **Project Scaffolding**: Create monorepo structure and development workflow
- [ ] **Validation & Error Handling**: Comprehensive validation and user-friendly errors
- [ ] **Testing & Quality**: Unit tests, integration tests, and performance benchmarks
- [ ] **Documentation & Examples**: CLI documentation and real-world examples
- [ ] **Distribution & Packaging**: NPM package, installation scripts, and CI/CD

## Dependencies

### External Dependencies
- **Node.js ecosystem**: ts-morph, commander.js, chalk for CLI tooling
- **Rust toolchain**: Required on user machines for compilation
- **Database systems**: PostgreSQL/MySQL/SQLite for testing and development
- **Git**: For project initialization and version control

### Critical Path Dependencies
1. TypeScript DSL design must be finalized before parser implementation
2. IR schema design blocks both parser and generator development
3. Rust template design determines generated code quality and maintainability
4. Database schema mapping limits supported TypeScript DSL features

### External Integrations
- **Diesel CLI**: For migration management and schema generation
- **Cargo ecosystem**: Axum, serde, tokio, and other Rust dependencies
- **NPM registry**: For CLI tool distribution and updates

## Success Criteria (Technical)

### MVP Success Criteria
- Generate working Rust backend from basic TypeScript models (User, Post)
- Support all three databases (PostgreSQL, MySQL, SQLite)
- Generated backend compiles without warnings
- Basic CRUD operations work end-to-end
- CLI tool installs and runs on macOS, Linux, Windows

### Performance Benchmarks
- CLI generation time: <30 seconds for typical project
- Generated backend: >10,000 concurrent connections
- Response time: <10ms for simple CRUD operations
- Memory usage: <50MB for typical workload
- Binary size: <20MB production build

### Quality Gates
- 100% generated code compiles successfully
- 95%+ test coverage for CLI tool codebase
- Zero security vulnerabilities in generated code
- Generated backends pass standard Rust lint checks (clippy)

### Developer Experience Metrics
- Time to first working API: <5 minutes
- TypeScript validation catches 95%+ configuration errors
- Clear, actionable error messages for all failure cases
- Documentation covers 100% of supported DSL features

## Estimated Effort

### Overall Timeline: 6 weeks (150 hours)
- **Week 1-2**: CLI Infrastructure & Project Scaffolding (50 hours)
- **Week 3-4**: Core Generation Engine & Templates (60 hours)
- **Week 5-6**: Polish, Testing & Documentation (40 hours)

### Resource Requirements
- **1 Senior Full-Stack Developer**: TypeScript + Rust expertise required
- **Development Environment**: Node.js, Rust toolchain, multiple databases
- **Testing Infrastructure**: CI/CD pipeline for multiple OS/database combinations

### Critical Path Items
1. **TypeScript DSL Design** (Week 1) - Blocks all subsequent development
2. **IR Schema Definition** (Week 1-2) - Core data structure for code generation
3. **Rust Template System** (Week 3) - Determines quality of generated code
4. **Database Integration** (Week 3-4) - Most complex technical challenge
5. **End-to-End Testing** (Week 5) - Validation of complete system

### Success Dependencies
- Early user feedback on TypeScript DSL design
- Successful Rust code generation from complex real-world schemas
- Performance validation against hand-written Rust backends
- Smooth installation and setup experience across all platforms

## Tasks Created
- [ ] #10 - Database Integration & Schema Generation (parallel: false)
- [ ] #11 - Rust Backend Code Generation (parallel: false)
- [ ] #12 - Middleware & Security Generation (parallel: false)
- [ ] #13 - Validation & Error Handling (parallel: false)
- [ ] #14 - Testing & Quality Assurance (parallel: false)
- [ ] #15 - Documentation & Distribution (parallel: true)
- [ ] #6 - CLI Foundation & Project Setup (parallel: true)
- [ ] #7 - TypeScript DSL Parser (parallel: true)
- [ ] #8 - Rust Code Templates System (parallel: true)
- [ ] #9 - Project Scaffolding Generator (parallel: false)

**Total tasks**: 10
**Parallel tasks**: 4
**Sequential tasks**: 6
**Estimated total effort**: 180-220 hours (6-7 weeks)
