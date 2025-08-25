# Forge CLI

TypeScript-to-Rust API generator CLI that creates production-ready backends from TypeScript declarations.

## Overview

Forge CLI bridges the gap between frontend developer experience and backend performance by allowing developers to define their APIs using familiar TypeScript syntax, then generating high-performance Rust backends with Axum + Diesel + PostgreSQL/MySQL/SQLite.

## Features

- **TypeScript DSL**: Write API definitions in familiar TypeScript syntax
- **Rust Backend**: Generate production-ready Rust servers with Axum framework
- **Database Support**: PostgreSQL, MySQL, and SQLite via Diesel ORM
- **Type Safety**: End-to-end type safety from TypeScript to Rust
- **Development Tools**: Hot reload, migrations, and development server
- **Production Ready**: Optimized builds with proper error handling and logging

## Quick Start

### Installation

```bash
npm install -g forge-cli
```

### Create a New Project

```bash
forge init my-app
cd my-app
```

### Define Your API

Edit `api/schema.ts`:
```typescript
import { model } from 'forge-cli/dsl';

model('User', {
  id: 'uuid().primary()',
  email: 'string().email().unique()',
  name: 'string().min(2).max(100)',
  createdAt: 'datetime().defaultNow()',
});
```

Edit `api/routes.ts`:
```typescript
import { route } from 'forge-cli/dsl';

route('GET /api/users', {
  response: 'UserList',
  handler: async ({ db }) => {
    return db.user.findMany();
  },
});
```

### Generate Backend

```bash
forge generate
```

### Run Development Server

```bash
forge dev
```

Your API will be running at `http://localhost:3000`!

## Commands

### `forge init [project-name]`

Initialize a new TypeScript-to-Rust project.

Options:
- `-d, --database <type>` - Database type (postgres, mysql, sqlite)
- `-f, --frontend <type>` - Frontend framework (react, none)
- `--no-git` - Skip git repository initialization
- `--dry-run` - Show what would be created without making changes

### `forge generate`

Generate Rust backend from TypeScript definitions.

Options:
- `-w, --watch` - Watch for changes and regenerate
- `-c, --config <path>` - Path to configuration file
- `--clean` - Clean output directory before generation

### `forge dev`

Start the Rust server in development mode.

Options:
- `-p, --port <port>` - Port to run the server on (default: 3000)
- `--host <host>` - Host to bind the server to (default: localhost)
- `--reload` - Enable hot reload with cargo watch

### `forge build`

Build the Rust backend for production.

Options:
- `--release` - Build in release mode with optimizations
- `--target <target>` - Target platform for build
- `-o, --output <path>` - Output directory for built artifacts

### `forge migrate`

Run database migrations.

Options:
- `-u, --up` - Run pending migrations (default)
- `-d, --down [steps]` - Rollback migrations
- `--reset` - Reset database (drop and recreate)
- `--seed` - Run seed data after migrations

## Configuration

Create a `forge.config.ts` file in your project root:

```typescript
import { defineConfig } from 'forge-cli';

export default defineConfig({
  database: {
    type: 'postgres',
    url: process.env.DATABASE_URL,
  },
  generate: {
    outputDir: './server',
    clean: true,
  },
  dev: {
    port: 3000,
    host: 'localhost',
    reload: true,
  },
});
```

## Development

### Prerequisites

- Node.js 18+
- Rust 1.70+ (for generated backends)
- Database (PostgreSQL, MySQL, or SQLite)

### Building from Source

```bash
git clone https://github.com/kksimons/ts-to-rust.git
cd ts-to-rust
npm install
npm run build
npm link
```

### Running Tests

```bash
npm test
npm run test:watch
```

### Linting and Formatting

```bash
npm run lint
npm run format
```

## Project Structure

```
your-project/
├── api/                 # TypeScript API definitions
│   ├── schema.ts       # Database models
│   └── routes.ts       # API endpoints
├── server/             # Generated Rust backend
├── frontend/           # Frontend (if enabled)
├── forge.config.ts     # Forge configuration
└── .env               # Environment variables
```

## License

MIT License. See [LICENSE](LICENSE) for details.

## Contributing

Contributions are welcome! Please read our [contributing guidelines](CONTRIBUTING.md) first.

## Support

- GitHub Issues: https://github.com/kksimons/ts-to-rust/issues
- Documentation: https://github.com/kksimons/ts-to-rust/wiki