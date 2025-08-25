import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import { TypeScriptParser } from '../../src/parsers/typescript-parser';
import { DSLValidator } from '../../src/parsers/dsl-validator';
import fs from 'fs-extra';
import path from 'path';
import os from 'os';

describe('TypeScriptParser', () => {
  let parser: TypeScriptParser;
  let validator: DSLValidator;
  let tempDir: string;

  beforeEach(async () => {
    parser = new TypeScriptParser();
    validator = new DSLValidator();
    tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'forge-test-'));
    
    // Create api directory
    await fs.ensureDir(path.join(tempDir, 'api'));
  });

  afterEach(async () => {
    await fs.remove(tempDir);
  });

  describe('Model Parsing', () => {
    it('should parse a simple model definition', async () => {
      const schemaContent = `
import { model } from 'forge-cli/dsl';

model('User', {
  id: 'uuid().primary()',
  email: 'string().email().unique()',
  name: 'string().min(2).max(100)',
  createdAt: 'datetime().defaultNow()',
});
      `;

      await fs.writeFile(path.join(tempDir, 'api/schema.ts'), schemaContent);

      const result = await parser.parseProject(tempDir);

      expect(result.models).toHaveLength(1);
      
      const model = result.models[0]!;
      expect(model).toBeDefined();
      expect(model.name).toBe('User');
      expect(model.fields).toHaveLength(4);
      
      // Check id field
      const idField = model.fields.find(f => f.name === 'id');
      expect(idField).toBeDefined();
      expect(idField?.type).toBe('uuid');
      expect(idField?.constraints).toContain('primary');
      expect(idField?.optional).toBe(false);

      // Check email field
      const emailField = model.fields.find(f => f.name === 'email');
      expect(emailField).toBeDefined();
      expect(emailField?.type).toBe('string');
      expect(emailField?.constraints).toEqual(['email', 'unique']);

      // Check name field
      const nameField = model.fields.find(f => f.name === 'name');
      expect(nameField).toBeDefined();
      expect(nameField?.type).toBe('string');
      expect(nameField?.constraints).toContain('min(2)');
      expect(nameField?.constraints).toContain('max(100)');

      // Check createdAt field
      const createdAtField = model.fields.find(f => f.name === 'createdAt');
      expect(createdAtField).toBeDefined();
      expect(createdAtField?.type).toBe('datetime');
      expect(createdAtField?.constraints).toContain('defaultNow');
    });

    it('should parse models with relationships', async () => {
      const schemaContent = `
import { model } from 'forge-cli/dsl';

model('User', {
  id: 'uuid().primary()',
  email: 'string().email().unique()',
});

model('Post', {
  id: 'uuid().primary()',
  title: 'string().max(200)',
  content: 'text()',
  authorId: 'uuid().references("User", "id")',
  
  author: 'belongsTo("User")',
});
      `;

      await fs.writeFile(path.join(tempDir, 'api/schema.ts'), schemaContent);

      const result = await parser.parseProject(tempDir);

      expect(result.models).toHaveLength(2);
      
      const postModel = result.models.find(m => m.name === 'Post');
      expect(postModel).toBeDefined();
      expect(postModel?.relationships).toHaveLength(1);
      
      const authorRelationship = postModel?.relationships[0];
      expect(authorRelationship?.name).toBe('author');
      expect(authorRelationship?.type).toBe('belongsTo');
      expect(authorRelationship?.target).toBe('User');
    });

    it('should handle optional fields', async () => {
      const schemaContent = `
import { model } from 'forge-cli/dsl';

model('User', {
  id: 'uuid().primary()',
  email: 'string().email().unique()',
  bio: 'text().optional()',
});
      `;

      await fs.writeFile(path.join(tempDir, 'api/schema.ts'), schemaContent);

      const result = await parser.parseProject(tempDir);

      const model = result.models[0]!;
      expect(model).toBeDefined();
      const bioField = model.fields.find(f => f.name === 'bio');
      expect(bioField).toBeDefined();
      expect(bioField?.optional).toBe(true);
      expect(bioField?.constraints).toContain('optional');
    });

    it('should handle multiple models in one file', async () => {
      const schemaContent = `
import { model } from 'forge-cli/dsl';

model('User', {
  id: 'uuid().primary()',
  email: 'string().email().unique()',
});

model('Post', {
  id: 'uuid().primary()',
  title: 'string()',
});

model('Comment', {
  id: 'uuid().primary()',
  content: 'text()',
});
      `;

      await fs.writeFile(path.join(tempDir, 'api/schema.ts'), schemaContent);

      const result = await parser.parseProject(tempDir);

      expect(result.models).toHaveLength(3);
      expect(result.models.map(m => m.name).sort()).toEqual(['Comment', 'Post', 'User']);
    });
  });

  describe('Route Parsing', () => {
    it('should parse simple routes', async () => {
      const routesContent = `
import { route } from 'forge-cli/dsl';

route('GET /api/users', {
  response: 'UserList',
  handler: async ({ db }) => {
    return db.user.findMany();
  },
});

route('POST /api/users', {
  body: 'UserCreate',
  response: 'User',
  handler: async ({ db, body }) => {
    return db.user.create({ data: body });
  },
});
      `;

      await fs.writeFile(path.join(tempDir, 'api/routes.ts'), routesContent);

      const result = await parser.parseProject(tempDir);

      expect(result.routes).toHaveLength(2);
      
      const getRoute = result.routes.find(r => r.method === 'GET');
      expect(getRoute).toBeDefined();
      expect(getRoute?.path).toBe('/api/users');
      expect(getRoute?.response).toBe('UserList');
      expect(getRoute?.body).toBeUndefined();

      const postRoute = result.routes.find(r => r.method === 'POST');
      expect(postRoute).toBeDefined();
      expect(postRoute?.path).toBe('/api/users');
      expect(postRoute?.body).toBe('UserCreate');
      expect(postRoute?.response).toBe('User');
    });

    it('should parse routes with parameters', async () => {
      const routesContent = `
import { route } from 'forge-cli/dsl';

route('GET /api/users/:id', {
  params: { id: 'uuid' },
  response: 'User',
  handler: async ({ db, params }) => {
    return db.user.findUnique({ where: { id: params.id } });
  },
});

route('PUT /api/users/:id/posts/:postId', {
  params: { id: 'uuid', postId: 'uuid' },
  body: 'PostUpdate',
  response: 'Post',
  handler: async ({ db, params, body }) => {
    return db.post.update({ 
      where: { id: params.postId, authorId: params.id },
      data: body
    });
  },
});
      `;

      await fs.writeFile(path.join(tempDir, 'api/routes.ts'), routesContent);

      const result = await parser.parseProject(tempDir);

      expect(result.routes).toHaveLength(2);
      
      const getUserRoute = result.routes.find(r => r.path === '/api/users/:id');
      expect(getUserRoute).toBeDefined();
      expect(getUserRoute?.parameters).toHaveLength(1);
      expect(getUserRoute?.parameters[0]?.name).toBe('id');

      const updatePostRoute = result.routes.find(r => r.path === '/api/users/:id/posts/:postId');
      expect(updatePostRoute).toBeDefined();
      expect(updatePostRoute?.parameters).toHaveLength(2);
      expect(updatePostRoute?.parameters.map(p => p.name).sort()).toEqual(['id', 'postId']);
    });

    it('should handle different HTTP methods', async () => {
      const routesContent = `
import { route } from 'forge-cli/dsl';

route('GET /api/users', { response: 'UserList', handler: async () => {} });
route('POST /api/users', { response: 'User', handler: async () => {} });
route('PUT /api/users/:id', { response: 'User', handler: async () => {} });
route('PATCH /api/users/:id', { response: 'User', handler: async () => {} });
route('DELETE /api/users/:id', { response: 'void', handler: async () => {} });
      `;

      await fs.writeFile(path.join(tempDir, 'api/routes.ts'), routesContent);

      const result = await parser.parseProject(tempDir);

      expect(result.routes).toHaveLength(5);
      
      const methods = result.routes.map(r => r.method).sort();
      expect(methods).toEqual(['DELETE', 'GET', 'PATCH', 'POST', 'PUT']);
    });
  });

  describe('Error Handling', () => {
    it('should handle malformed TypeScript', async () => {
      const invalidContent = `
import { model } from 'forge-cli/dsl';

model('User' {  // Missing comma
  id: 'uuid().primary()',
  email: 'string().email().unique()',
});
      `;

      await fs.writeFile(path.join(tempDir, 'api/schema.ts'), invalidContent);

      const result = await parser.parseProject(tempDir);

      expect(result.errors.length).toBeGreaterThan(0);
      expect(result.models).toHaveLength(0);
    });

    it('should handle missing arguments', async () => {
      const invalidContent = `
import { model } from 'forge-cli/dsl';

model('User');  // Missing second argument
      `;

      await fs.writeFile(path.join(tempDir, 'api/schema.ts'), invalidContent);

      const result = await parser.parseProject(tempDir);

      expect(result.errors.length).toBeGreaterThan(0);
      expect(result.models).toHaveLength(0);
    });

    it('should handle non-existent directory', async () => {
      const nonExistentPath = path.join(tempDir, 'non-existent');

      const result = await parser.parseProject(nonExistentPath);

      expect(result.models).toHaveLength(0);
      expect(result.routes).toHaveLength(0);
      // Should not throw error, just return empty results
    });
  });

  describe('Validation', () => {
    it('should validate parsed project successfully', async () => {
      const schemaContent = `
import { model } from 'forge-cli/dsl';

model('User', {
  id: 'uuid().primary()',
  email: 'string().email().unique()',
  name: 'string().min(2).max(100)',
});
      `;

      const routesContent = `
import { route } from 'forge-cli/dsl';

route('GET /api/users', {
  response: 'UserList',
  handler: async ({ db }) => {
    return db.user.findMany();
  },
});
      `;

      await fs.writeFile(path.join(tempDir, 'api/schema.ts'), schemaContent);
      await fs.writeFile(path.join(tempDir, 'api/routes.ts'), routesContent);

      const result = await parser.parseProject(tempDir);
      const isValid = parser.validateParsedProject(result);

      expect(isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should detect validation errors', async () => {
      const schemaContent = `
import { model } from 'forge-cli/dsl';

model('User', {
  id: 'uuid().primary()',
});

model('Post', {
  id: 'uuid().primary()',
  authorId: 'uuid().references("NonExistentModel", "id")',
  
  author: 'belongsTo("NonExistentModel")',
});
      `;

      await fs.writeFile(path.join(tempDir, 'api/schema.ts'), schemaContent);

      const result = await parser.parseProject(tempDir);
      const isValid = parser.validateParsedProject(result);

      expect(isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });
  });

  describe('Integration with DSLValidator', () => {
    it('should work with DSLValidator for comprehensive validation', async () => {
      const schemaContent = `
import { model } from 'forge-cli/dsl';

model('User', {
  id: 'uuid().primary()',
  email: 'string().email().unique()',
  name: 'string().min(2).max(100)',
  createdAt: 'datetime().defaultNow()',
});

model('Post', {
  id: 'uuid().primary()',
  title: 'string().max(200)',
  content: 'text()',
  authorId: 'uuid().references("User", "id")',
  createdAt: 'datetime().defaultNow()',
  
  author: 'belongsTo("User")',
});
      `;

      const routesContent = `
import { route } from 'forge-cli/dsl';

route('GET /api/users', {
  response: 'UserList',
  handler: async ({ db }) => {
    return db.user.findMany();
  },
});

route('GET /api/users/:id', {
  response: 'User',
  handler: async ({ db, params }) => {
    return db.user.findUnique({ where: { id: params.id } });
  },
});

route('POST /api/posts', {
  body: 'PostCreate',
  response: 'Post',
  handler: async ({ db, body }) => {
    return db.post.create({ data: body });
  },
});
      `;

      await fs.writeFile(path.join(tempDir, 'api/schema.ts'), schemaContent);
      await fs.writeFile(path.join(tempDir, 'api/routes.ts'), routesContent);

      const parseResult = await parser.parseProject(tempDir);
      const validationResult = validator.validate(parseResult);

      expect(parseResult.models).toHaveLength(2);
      expect(parseResult.routes).toHaveLength(3);
      expect(validationResult.isValid).toBe(true);
      expect(validationResult.errors).toHaveLength(0);
    });
  });
});