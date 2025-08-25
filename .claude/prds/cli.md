---
name: cli
description: TypeScript-to-Rust API generator CLI that creates production-ready backends from TypeScript declarations
status: backlog
created: 2025-08-25T03:56:01Z
---

# PRD: CLI - TypeScript-to-Rust API Generator

## Executive Summary

**Forge** is a revolutionary CLI tool that bridges frontend developer experience with backend performance by generating production-ready Rust APIs from TypeScript declarations. Developers write familiar Prisma-like TypeScript code to define models and endpoints, and Forge generates a complete, human-readable Rust backend with Axum + Diesel + PostgreSQL/MySQL/SQLite support.

This tool eliminates the traditional backend development bottleneck while delivering native Rust performance, type safety, and scalability - giving developers the best of both worlds: TypeScript DX and Rust power.

## Problem Statement

### Current Pain Points
1. **Frontend-Backend Velocity Gap**: Frontend developers are highly productive with TypeScript/React, but building performant backends requires learning Rust, Go, or dealing with slower interpreted languages
2. **Context Switching Overhead**: Moving between TypeScript frontend and different backend languages breaks developer flow and increases cognitive load  
3. **Type Safety Gaps**: Manual synchronization between frontend TypeScript types and backend schemas leads to runtime errors
4. **Performance vs Productivity Tradeoff**: Fast languages (Rust, C++) have steep learning curves, while productive languages (Python, Node.js) sacrifice performance
5. **Infrastructure Complexity**: Setting up production-ready backends with proper middleware, validation, auth, and database integration is time-consuming

### Market Opportunity
Full-stack developers spend 60-70% of their time on backend boilerplate rather than business logic. Existing solutions either sacrifice performance (Node.js/Python) or require significant learning curves (pure Rust/Go). This tool captures the productivity of TypeScript with the performance of Rust.

## User Stories

### Primary Persona: Full-Stack TypeScript Developer
**Profile**: Frontend-focused developer comfortable with React, TypeScript, and modern tooling. Wants to build complete applications but frustrated with backend complexity.

#### User Journey 1: New Project Setup
```
As a developer starting a new full-stack project,
I want to initialize a complete monorepo with generated Rust backend,
So that I can focus on building features instead of infrastructure setup.

Acceptance Criteria:
- Single command creates complete monorepo structure
- Generated Rust backend compiles and runs immediately
- Database migrations are ready to execute
- Frontend can immediately make API calls to backend
```

#### User Journey 2: Adding New API Endpoints
```
As a developer building features,
I want to define API endpoints in TypeScript syntax I'm familiar with,
So that I don't need to learn Rust to create performant backends.

Acceptance Criteria:
- TypeScript DSL feels familiar (Prisma-like syntax)
- Single command regenerates complete backend
- Generated Rust code is human-readable and modifiable
- All validation, middleware, and error handling included
```

#### User Journey 3: Production Deployment  
```
As a developer ready to deploy,
I want a production-ready Rust binary with all best practices,
So that my application scales and performs well under load.

Acceptance Criteria:
- Generated backend includes CORS, JWT auth, rate limiting
- Proper error handling and logging built-in
- Database connection pooling configured
- Production-optimized Rust build artifacts
```

## Requirements

### Functional Requirements

#### Core CLI Commands
- `forge init` - Initialize monorepo with TypeScript frontend + generated Rust backend
- `forge generate` - Parse TypeScript API definitions and regenerate Rust backend
- `forge dev` - Run Rust server in development mode with hot reload
- `forge migrate` - Execute database migrations
- `forge build` - Build production-optimized Rust binary

#### TypeScript DSL (Prisma-inspired)
```typescript
// api/schema.ts - Database models
model("User", {
  id: uuid().primary(),
  email: string().email().unique(),
  name: string().min(2).max(50),
  createdAt: datetime().defaultNow(),
  posts: hasMany("Post")
});

model("Post", {
  id: uuid().primary(), 
  title: string().max(200),
  content: text(),
  authorId: uuid().references("User", "id"),
  author: belongsTo("User")
});

// api/users.ts - API endpoints
route("GET /api/users", {
  response: UserListSchema,
  handler: async ({ db, query }) => {
    return db.user.findMany({
      include: { posts: true },
      where: query.search ? { name: contains(query.search) } : {}
    });
  }
});

route("POST /api/users", {
  body: UserCreateSchema,
  response: UserSchema,
  handler: async ({ db, body }) => {
    return db.user.create(body);
  }
});
```

#### Generated Rust Backend Structure
```
server/
├── src/
│   ├── main.rs                 # Server entry point
│   ├── lib.rs                  # Module declarations
│   ├── models/
│   │   ├── mod.rs
│   │   ├── user.rs            # User model + DB queries
│   │   └── post.rs            # Post model + DB queries
│   ├── routes/
│   │   ├── mod.rs
│   │   ├── users.rs           # User endpoints
│   │   └── posts.rs           # Post endpoints
│   ├── middleware/
│   │   ├── mod.rs
│   │   ├── auth.rs            # JWT authentication
│   │   ├── cors.rs            # CORS configuration
│   │   └── rate_limit.rs      # Rate limiting
│   ├── schema.rs              # Diesel schema
│   └── db.rs                  # Database connection
├── migrations/                 # Diesel migrations
├── Cargo.toml                 # Rust dependencies
└── diesel.toml               # Diesel configuration
```

#### Database Support
- **PostgreSQL** - Primary database with full JSON support
- **MySQL** - Alternative relational database option  
- **SQLite** - Development and testing database option
- **Diesel ORM** - Single, mature Rust ORM for consistency

#### Middleware & Best Practices
- **CORS** - Configurable cross-origin resource sharing
- **JWT Authentication** - Token-based authentication with refresh tokens
- **Rate Limiting** - Configurable per-endpoint rate limiting
- **Request Validation** - Automatic validation from TypeScript schemas
- **Error Handling** - Consistent error responses with proper HTTP status codes
- **Logging** - Structured logging with configurable levels
- **Database Connection Pooling** - Optimized database connections

### Non-Functional Requirements

#### Performance
- Generated Rust backend must handle 10,000+ concurrent connections
- Response times under 10ms for simple CRUD operations
- Memory usage under 50MB for typical applications
- Binary size under 20MB for production builds

#### Developer Experience
- Complete setup in under 5 minutes for new projects
- TypeScript validation catches 95% of configuration errors
- Generated code is readable and follows Rust best practices
- Clear error messages with actionable recovery steps

#### Reliability
- All generated code must compile without warnings
- TypeScript parsing handles malformed input gracefully
- Database migrations are reversible and safe
- Atomic regeneration (complete success or rollback)

#### Security
- JWT tokens use secure algorithms (RS256/ES256)
- SQL injection protection through Diesel parameterized queries
- Input validation on all endpoints
- HTTPS-ready configuration out of box

## Success Criteria

### MVP Success (30 days)
- Complete monorepo initialization with working backend
- Basic CRUD operations generated from TypeScript models
- Database connectivity with PostgreSQL/MySQL/SQLite
- Frontend can successfully make API calls to generated backend

### Beta Success (90 days)  
- 100+ developers using tool for real projects
- Authentication and middleware generation working
- Production deployments running successfully
- 90%+ user satisfaction with generated code quality

### V1.0 Success (6 months)
- 1000+ active users building production applications
- Complete feature parity with hand-written Rust backends
- Community contributions and ecosystem growth
- Measurable 5x+ improvement in full-stack development velocity

### Key Metrics
- **Time to First API**: Under 5 minutes from `forge init` to working API
- **Code Generation Accuracy**: 99%+ generated code compiles successfully  
- **Performance Baseline**: Generated APIs match or exceed hand-written Rust performance
- **Developer Retention**: 80%+ of users continue using after first week

## Constraints & Assumptions

### Technical Constraints
- **Single Stack Choice**: Axum + Diesel + serde for consistency and maintainability
- **TypeScript Dependency**: Requires Node.js environment for CLI tooling
- **Database Schema Limitations**: Must map cleanly to Diesel's capabilities
- **Compilation Time**: Rust compilation prevents real-time hot reloading

### Resource Constraints
- **CLI Tool Size**: Keep binary under 50MB for fast downloads
- **Memory Usage**: Code generation must work on developer laptops (8GB RAM)
- **Build Time**: Complete regeneration should complete under 30 seconds

### Ecosystem Assumptions
- Users are comfortable with modern TypeScript tooling
- Target users have basic understanding of REST APIs and databases
- Development environment has Rust toolchain installed
- Users accept opinionated choices for consistency

## Out of Scope

### V1.0 Exclusions
- **GraphQL Support** - Focus on REST APIs initially
- **Real-time Features** - WebSockets, Server-Sent Events
- **Multi-Database Transactions** - Single database per application
- **Custom Middleware** - Predefined middleware stack only
- **Database Sharding** - Single database instance
- **Microservices** - Monolithic backend architecture
- **Hot Reloading** - Manual regeneration required

### Future Considerations (Post V1.0)
- Alternative Rust frameworks (Actix, Warp)
- Alternative ORMs (SQLx, SeaORM)
- GraphQL endpoint generation
- WebSocket support for real-time features
- Custom middleware plugin system
- Multi-database applications

## Dependencies

### External Dependencies
- **Node.js & npm** - Required for CLI distribution and TypeScript parsing
- **Rust Toolchain** - Required for compiling generated backend
- **Database Systems** - PostgreSQL, MySQL, or SQLite
- **ts-morph** - TypeScript AST parsing and manipulation

### Internal Dependencies
- **TypeScript Parser** - Custom parser for DSL syntax
- **Code Generator** - Rust code generation engine
- **Template System** - Tera templates for consistent code output
- **Validation Engine** - Schema validation and error reporting

### Integration Dependencies
- **Diesel CLI** - Database migration management
- **Cargo** - Rust package management and building
- **Git** - Version control for generated code

## Technical Architecture

### CLI Tool Components
1. **Command Parser** - Parse and validate CLI commands
2. **TypeScript Analyzer** - Parse and validate TypeScript DSL
3. **Schema Generator** - Convert TypeScript models to Diesel schema
4. **Route Generator** - Generate Axum route handlers from TypeScript endpoints
5. **Project Scaffolder** - Create and maintain monorepo structure
6. **Build Orchestrator** - Coordinate Rust compilation and testing

### Code Generation Pipeline
```
TypeScript DSL → AST Parser → IR (JSON) → Rust Code Generator → Formatted Output
```

### Error Handling Strategy
- **Fail Fast** - Stop generation on first critical error
- **Complete Rollback** - Atomic success or complete cleanup
- **Clear Messages** - Point users to exact TypeScript lines causing issues
- **Recovery Suggestions** - Provide actionable fixes for common errors

This PRD establishes the foundation for building a revolutionary tool that will transform full-stack development by combining TypeScript productivity with Rust performance.