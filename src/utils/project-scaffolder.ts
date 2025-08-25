import fs from 'fs-extra';
import path from 'path';
import { logger } from './logger';

export interface ProjectConfig {
  projectName: string;
  database: 'postgres' | 'mysql' | 'sqlite';
  frontend: 'react' | 'none';
  git: boolean;
  dryRun: boolean;
}

export async function createProject(config: ProjectConfig): Promise<void> {
  const projectPath = path.join(process.cwd(), config.projectName);
  
  if (!config.dryRun) {
    // Check if directory exists
    if (await fs.pathExists(projectPath)) {
      throw new Error(`Directory '${config.projectName}' already exists`);
    }
    
    // Create project directory
    await fs.ensureDir(projectPath);
  }
  
  logger.step('Creating project structure...');
  
  const structure = [
    'api',           // TypeScript API definitions
    'server',        // Generated Rust backend (will be created by generate command)
    ...(config.frontend === 'react' ? ['frontend'] : []),
    '.env.example',
    'forge.config.ts',
    'README.md',
    '.gitignore'
  ];
  
  for (const item of structure) {
    const itemPath = path.join(projectPath, item);
    
    if (config.dryRun) {
      logger.debug(`Would create: ${item}`);
      continue;
    }
    
    if (item.includes('.')) {
      // It's a file
      await createProjectFile(itemPath, item, config);
    } else {
      // It's a directory
      await fs.ensureDir(itemPath);
      
      // Create initial files in specific directories
      if (item === 'api') {
        await createApiFiles(itemPath, config);
      } else if (item === 'frontend' && config.frontend === 'react') {
        await createFrontendFiles(itemPath, config);
      }
    }
  }
  
  if (config.git && !config.dryRun) {
    logger.step('Initializing git repository...');
    // TODO: Initialize git repo (spawn git init)
  }
}

async function createProjectFile(filePath: string, fileName: string, config: ProjectConfig): Promise<void> {
  let content = '';
  
  switch (fileName) {
    case '.env.example':
      content = createEnvExample(config);
      break;
    case 'forge.config.ts':
      content = createForgeConfig(config);
      break;
    case 'README.md':
      content = createReadme(config);
      break;
    case '.gitignore':
      content = createGitignore();
      break;
  }
  
  await fs.writeFile(filePath, content);
}

async function createApiFiles(apiPath: string, _config: ProjectConfig): Promise<void> {
  // Create schema.ts with example models
  const schemaContent = `// Database models
// Define your models here using the Forge DSL

import { model } from 'forge-cli/dsl';

// Example User model
model('User', {
  id: 'uuid().primary()',
  email: 'string().email().unique()',
  name: 'string().min(2).max(100)',
  createdAt: 'datetime().defaultNow()',
  updatedAt: 'datetime().defaultNow().onUpdate()',
});

// Example Post model with relationship
model('Post', {
  id: 'uuid().primary()',
  title: 'string().max(200)',
  content: 'text()',
  published: 'boolean().default(false)',
  authorId: 'uuid().references("User", "id")',
  createdAt: 'datetime().defaultNow()',
  updatedAt: 'datetime().defaultNow().onUpdate()',
  
  // Relationships
  author: 'belongsTo("User")',
});
`;
  
  await fs.writeFile(path.join(apiPath, 'schema.ts'), schemaContent);
  
  // Create routes.ts with example routes
  const routesContent = `// API routes
// Define your API endpoints here using the Forge DSL

import { route } from 'forge-cli/dsl';

// Example CRUD routes for User
route('GET /api/users', {
  response: 'UserList',
  handler: async ({ db, query }) => {
    return db.user.findMany({
      where: query.search ? { name: { contains: query.search } } : {},
      orderBy: { createdAt: 'desc' },
    });
  },
});

route('GET /api/users/:id', {
  params: { id: 'uuid' },
  response: 'User',
  handler: async ({ db, params }) => {
    return db.user.findUnique({
      where: { id: params.id },
    });
  },
});

route('POST /api/users', {
  body: 'UserCreate',
  response: 'User',
  handler: async ({ db, body }) => {
    return db.user.create({
      data: body,
    });
  },
});

// Example routes for Post
route('GET /api/posts', {
  response: 'PostList',
  handler: async ({ db, query }) => {
    return db.post.findMany({
      include: { author: true },
      where: { published: true },
      orderBy: { createdAt: 'desc' },
    });
  },
});
`;
  
  await fs.writeFile(path.join(apiPath, 'routes.ts'), routesContent);
}

async function createFrontendFiles(frontendPath: string, config: ProjectConfig): Promise<void> {
  // Create a basic package.json for frontend
  const packageJson = {
    name: `${config.projectName}-frontend`,
    private: true,
    scripts: {
      dev: 'vite',
      build: 'tsc && vite build',
      preview: 'vite preview',
    },
    dependencies: {
      'react': '^18.2.0',
      'react-dom': '^18.2.0',
    },
    devDependencies: {
      '@types/react': '^18.2.0',
      '@types/react-dom': '^18.2.0',
      '@vitejs/plugin-react': '^4.0.0',
      'typescript': '^5.0.0',
      'vite': '^4.4.0',
    },
  };
  
  await fs.writeFile(
    path.join(frontendPath, 'package.json'),
    JSON.stringify(packageJson, null, 2)
  );
}

function createEnvExample(config: ProjectConfig): string {
  return `# Database Configuration
DATABASE_URL="${getDatabaseUrl(config.database)}"

# Server Configuration
PORT=3000
HOST=localhost

# Development
RUST_LOG=debug
`;
}

function createForgeConfig(config: ProjectConfig): string {
  return `import { defineConfig } from 'forge-cli';

export default defineConfig({
  // Database configuration
  database: {
    type: '${config.database}',
    url: process.env.DATABASE_URL,
  },
  
  // Generation options
  generate: {
    outputDir: './server',
    clean: true,
  },
  
  // Development server
  dev: {
    port: 3000,
    host: 'localhost',
    reload: true,
  },
  
  // Build options
  build: {
    release: true,
    target: undefined, // Use default target
  },
});
`;
}

function createReadme(config: ProjectConfig): string {
  return `# ${config.projectName}

A full-stack application built with Forge CLI - TypeScript definitions generating a high-performance Rust backend.

## Architecture

- **API Definitions**: TypeScript DSL in \`/api\`
- **Backend**: Generated Rust server using Axum + Diesel
${config.frontend === 'react' ? '- **Frontend**: React application in `/frontend`' : ''}
- **Database**: ${config.database.charAt(0).toUpperCase() + config.database.slice(1)}

## Quick Start

1. **Install dependencies**:
   \`\`\`bash
   npm install forge-cli -g
   \`\`\`

2. **Setup database**:
   \`\`\`bash
   cp .env.example .env
   # Edit .env with your database connection
   \`\`\`

3. **Generate backend**:
   \`\`\`bash
   forge generate
   \`\`\`

4. **Run migrations**:
   \`\`\`bash
   forge migrate
   \`\`\`

5. **Start development server**:
   \`\`\`bash
   forge dev
   \`\`\`

## Commands

- \`forge generate\` - Generate Rust backend from TypeScript definitions
- \`forge dev\` - Start development server with hot reload
- \`forge build\` - Build production-ready binary
- \`forge migrate\` - Run database migrations

## Project Structure

\`\`\`
${config.projectName}/
├── api/                 # TypeScript API definitions
│   ├── schema.ts       # Database models
│   └── routes.ts       # API endpoints
├── server/             # Generated Rust backend
${config.frontend === 'react' ? '├── frontend/           # React frontend' : ''}
├── forge.config.ts     # Forge configuration
└── .env               # Environment variables
\`\`\`

## Learn More

- [Forge CLI Documentation](https://github.com/kksimons/ts-to-rust)
- [Rust Axum Framework](https://github.com/tokio-rs/axum)
- [Diesel ORM](https://diesel.rs/)
`;
}

function createGitignore(): string {
  return `# Dependencies
node_modules/
/server/target/

# Production builds
dist/
/server/Cargo.lock

# Environment files
.env
.env.local
.env.production

# IDE
.vscode/
.idea/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db

# Logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Runtime data
pids
*.pid
*.seed
*.pid.lock

# Coverage directory used by tools like istanbul
coverage/

# Temporary folders
tmp/
temp/
`;
}

function getDatabaseUrl(database: string): string {
  switch (database) {
    case 'postgres':
      return 'postgresql://user:password@localhost:5432/database_name';
    case 'mysql':
      return 'mysql://user:password@localhost:3306/database_name';
    case 'sqlite':
      return 'sqlite://./database.db';
    default:
      return 'postgresql://user:password@localhost:5432/database_name';
  }
}