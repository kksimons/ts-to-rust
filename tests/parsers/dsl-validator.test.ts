import { describe, it, expect, beforeEach } from '@jest/globals';
import { DSLValidator } from '../../src/parsers/dsl-validator';
import { ParsedProject, ModelDefinition, RouteDefinition } from '../../src/parsers/typescript-parser';

describe('DSLValidator', () => {
  let validator: DSLValidator;

  beforeEach(() => {
    validator = new DSLValidator();
  });

  describe('Model Validation', () => {
    it('should validate valid models', () => {
      const models: ModelDefinition[] = [
        {
          name: 'User',
          fields: [
            {
              name: 'id',
              type: 'uuid',
              constraints: ['primary()'],
              optional: false
            },
            {
              name: 'email',
              type: 'string',
              constraints: ['email', 'unique'],
              optional: false
            }
          ],
          relationships: []
        }
      ];

      const parsed: ParsedProject = { models, routes: [], errors: [] };
      const result = validator.validate(parsed);

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should detect duplicate model names', () => {
      const models: ModelDefinition[] = [
        {
          name: 'User',
          fields: [{ name: 'id', type: 'uuid', constraints: ['primary()'], optional: false }],
          relationships: []
        },
        {
          name: 'User', // Duplicate
          fields: [{ name: 'id', type: 'uuid', constraints: ['primary()'], optional: false }],
          relationships: []
        }
      ];

      const parsed: ParsedProject = { models, routes: [], errors: [] };
      const result = validator.validate(parsed);

      expect(result.isValid).toBe(false);
      expect(result.errors.some(e => e.message.includes('Duplicate model name'))).toBe(true);
    });

    it('should detect invalid model names', () => {
      const models: ModelDefinition[] = [
        {
          name: '123User', // Invalid: starts with number
          fields: [{ name: 'id', type: 'uuid', constraints: ['primary()'], optional: false }],
          relationships: []
        },
        {
          name: 'User-Model', // Invalid: contains hyphen
          fields: [{ name: 'id', type: 'uuid', constraints: ['primary()'], optional: false }],
          relationships: []
        }
      ];

      const parsed: ParsedProject = { models, routes: [], errors: [] };
      const result = validator.validate(parsed);

      expect(result.isValid).toBe(false);
      expect(result.errors.some(e => e.message.includes('Invalid model name'))).toBe(true);
    });

    it('should detect duplicate field names', () => {
      const models: ModelDefinition[] = [
        {
          name: 'User',
          fields: [
            { name: 'id', type: 'uuid', constraints: ['primary()'], optional: false },
            { name: 'id', type: 'string', constraints: [], optional: false } // Duplicate
          ],
          relationships: []
        }
      ];

      const parsed: ParsedProject = { models, routes: [], errors: [] };
      const result = validator.validate(parsed);

      expect(result.isValid).toBe(false);
      expect(result.errors.some(e => e.message.includes('Duplicate field name'))).toBe(true);
    });

    it('should warn about missing primary keys', () => {
      const models: ModelDefinition[] = [
        {
          name: 'User',
          fields: [
            { name: 'email', type: 'string', constraints: ['email'], optional: false }
          ],
          relationships: []
        }
      ];

      const parsed: ParsedProject = { models, routes: [], errors: [] };
      const result = validator.validate(parsed);

      expect(result.warnings.some(w => w.message.includes('no primary key'))).toBe(true);
    });

    it('should validate field types', () => {
      const models: ModelDefinition[] = [
        {
          name: 'User',
          fields: [
            { name: 'id', type: 'invalidtype', constraints: [], optional: false }
          ],
          relationships: []
        }
      ];

      const parsed: ParsedProject = { models, routes: [], errors: [] };
      const result = validator.validate(parsed);

      expect(result.isValid).toBe(false);
      expect(result.errors.some(e => e.message.includes('Invalid field type'))).toBe(true);
    });

    it('should validate field constraints', () => {
      const models: ModelDefinition[] = [
        {
          name: 'User',
          fields: [
            {
              name: 'id',
              type: 'uuid',
              constraints: ['primary()'],
              optional: true // Invalid: primary key cannot be optional
            },
            {
              name: 'age',
              type: 'number',
              constraints: ['email'], // Invalid: email constraint on number field
              optional: false
            },
            {
              name: 'created',
              type: 'string',
              constraints: ['defaultNow'], // Invalid: defaultNow on non-datetime field
              optional: false
            }
          ],
          relationships: []
        }
      ];

      const parsed: ParsedProject = { models, routes: [], errors: [] };
      const result = validator.validate(parsed);

      expect(result.isValid).toBe(false);
      expect(result.errors.some(e => e.message.includes('Primary key field') && e.message.includes('cannot be optional'))).toBe(true);
      expect(result.errors.some(e => e.message.includes('Email constraint') && e.message.includes('string fields'))).toBe(true);
      expect(result.errors.some(e => e.message.includes('defaultNow') && e.message.includes('datetime fields'))).toBe(true);
    });
  });

  describe('Route Validation', () => {
    it('should validate valid routes', () => {
      const routes: RouteDefinition[] = [
        {
          method: 'GET',
          path: '/api/users',
          parameters: [],
          response: 'UserList',
          handler: 'async ({ db }) => db.user.findMany()'
        }
      ];

      const parsed: ParsedProject = { models: [], routes, errors: [] };
      const result = validator.validate(parsed);

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should detect duplicate routes', () => {
      const routes: RouteDefinition[] = [
        {
          method: 'GET',
          path: '/api/users',
          parameters: [],
          response: 'UserList',
          handler: 'handler1'
        },
        {
          method: 'GET', // Duplicate
          path: '/api/users', // Duplicate
          parameters: [],
          response: 'UserList',
          handler: 'handler2'
        }
      ];

      const parsed: ParsedProject = { models: [], routes, errors: [] };
      const result = validator.validate(parsed);

      expect(result.isValid).toBe(false);
      expect(result.errors.some(e => e.message.includes('Duplicate route'))).toBe(true);
    });

    it('should validate HTTP methods', () => {
      const routes: RouteDefinition[] = [
        {
          method: 'INVALID',
          path: '/api/users',
          parameters: [],
          response: 'UserList',
          handler: 'handler'
        }
      ];

      const parsed: ParsedProject = { models: [], routes, errors: [] };
      const result = validator.validate(parsed);

      expect(result.isValid).toBe(false);
      expect(result.errors.some(e => e.message.includes('Invalid HTTP method'))).toBe(true);
    });

    it('should validate path format', () => {
      const routes: RouteDefinition[] = [
        {
          method: 'GET',
          path: 'api/users', // Invalid: doesn't start with /
          parameters: [],
          response: 'UserList',
          handler: 'handler'
        }
      ];

      const parsed: ParsedProject = { models: [], routes, errors: [] };
      const result = validator.validate(parsed);

      expect(result.isValid).toBe(false);
      expect(result.errors.some(e => e.message.includes('Route path must start with'))).toBe(true);
    });

    it('should validate route parameters', () => {
      const routes: RouteDefinition[] = [
        {
          method: 'GET',
          path: '/api/users/:id/:postId',
          parameters: [
            { name: 'id', type: 'string' },
            // Missing postId parameter
          ],
          response: 'User',
          handler: 'handler'
        }
      ];

      const parsed: ParsedProject = { models: [], routes, errors: [] };
      const result = validator.validate(parsed);

      expect(result.warnings.some(w => w.message.includes('not defined in parameters'))).toBe(true);
    });

    it('should validate response and body types against models', () => {
      const models: ModelDefinition[] = [
        {
          name: 'User',
          fields: [{ name: 'id', type: 'uuid', constraints: ['primary()'], optional: false }],
          relationships: []
        }
      ];

      const routes: RouteDefinition[] = [
        {
          method: 'GET',
          path: '/api/users',
          parameters: [],
          response: 'NonExistentModel', // Invalid
          handler: 'handler'
        },
        {
          method: 'POST',
          path: '/api/posts',
          parameters: [],
          body: 'InvalidBodyType', // Invalid
          response: 'User',
          handler: 'handler'
        }
      ];

      const parsed: ParsedProject = { models, routes, errors: [] };
      const result = validator.validate(parsed);

      expect(result.warnings.some(w => w.message.includes('does not reference a known model'))).toBe(true);
    });

    it('should detect missing handlers', () => {
      const routes: RouteDefinition[] = [
        {
          method: 'GET',
          path: '/api/users',
          parameters: [],
          response: 'UserList',
          handler: '' // Empty handler
        }
      ];

      const parsed: ParsedProject = { models: [], routes, errors: [] };
      const result = validator.validate(parsed);

      expect(result.isValid).toBe(false);
      expect(result.errors.some(e => e.message.includes('has no handler'))).toBe(true);
    });
  });

  describe('Relationship Validation', () => {
    it('should validate relationships reference existing models', () => {
      const models: ModelDefinition[] = [
        {
          name: 'User',
          fields: [{ name: 'id', type: 'uuid', constraints: ['primary()'], optional: false }],
          relationships: []
        },
        {
          name: 'Post',
          fields: [
            { name: 'id', type: 'uuid', constraints: ['primary()'], optional: false },
            { name: 'authorId', type: 'uuid', constraints: [], optional: false }
          ],
          relationships: [
            {
              name: 'author',
              type: 'belongsTo',
              target: 'NonExistentModel' // Invalid
            }
          ]
        }
      ];

      const parsed: ParsedProject = { models, routes: [], errors: [] };
      const result = validator.validate(parsed);

      expect(result.isValid).toBe(false);
      expect(result.errors.some(e => e.message.includes('references non-existent model'))).toBe(true);
    });

    it('should validate relationship types', () => {
      const models: ModelDefinition[] = [
        {
          name: 'User',
          fields: [{ name: 'id', type: 'uuid', constraints: ['primary()'], optional: false }],
          relationships: []
        },
        {
          name: 'Post',
          fields: [
            { name: 'id', type: 'uuid', constraints: ['primary()'], optional: false },
            { name: 'authorId', type: 'uuid', constraints: [], optional: false }
          ],
          relationships: [
            {
              name: 'author',
              type: 'invalidType' as any, // Invalid relationship type
              target: 'User'
            }
          ]
        }
      ];

      const parsed: ParsedProject = { models, routes: [], errors: [] };
      const result = validator.validate(parsed);

      expect(result.isValid).toBe(false);
      expect(result.errors.some(e => e.message.includes('Invalid relationship type'))).toBe(true);
    });

    it('should warn about missing foreign key fields for belongsTo relationships', () => {
      const models: ModelDefinition[] = [
        {
          name: 'User',
          fields: [{ name: 'id', type: 'uuid', constraints: ['primary()'], optional: false }],
          relationships: []
        },
        {
          name: 'Post',
          fields: [
            { name: 'id', type: 'uuid', constraints: ['primary()'], optional: false }
            // Missing authorId field
          ],
          relationships: [
            {
              name: 'author',
              type: 'belongsTo',
              target: 'User'
            }
          ]
        }
      ];

      const parsed: ParsedProject = { models, routes: [], errors: [] };
      const result = validator.validate(parsed);

      expect(result.warnings.some(w => w.message.includes('expects foreign key field'))).toBe(true);
    });
  });

  describe('Integration', () => {
    it('should provide comprehensive validation results', () => {
      const models: ModelDefinition[] = [
        {
          name: 'User',
          fields: [
            { name: 'id', type: 'uuid', constraints: ['primary()'], optional: false },
            { name: 'email', type: 'string', constraints: ['email', 'unique'], optional: false },
            { name: 'bio', type: 'text', constraints: ['optional'], optional: true }
          ],
          relationships: []
        },
        {
          name: 'Post',
          fields: [
            { name: 'id', type: 'uuid', constraints: ['primary()'], optional: false },
            { name: 'title', type: 'string', constraints: [], optional: false },
            { name: 'userId', type: 'uuid', constraints: [], optional: false }
          ],
          relationships: [
            {
              name: 'author',
              type: 'belongsTo',
              target: 'User'
            }
          ]
        }
      ];

      const routes: RouteDefinition[] = [
        {
          method: 'GET',
          path: '/api/users',
          parameters: [],
          response: 'UserList',
          handler: 'async ({ db }) => db.user.findMany()'
        },
        {
          method: 'GET',
          path: '/api/users/:id',
          parameters: [{ name: 'id', type: 'string' }],
          response: 'User',
          handler: 'async ({ db, params }) => db.user.findUnique({ where: { id: params.id } })'
        }
      ];

      const parsed: ParsedProject = { models, routes, errors: [] };
      const result = validator.validate(parsed);

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
      expect(result.warnings).toHaveLength(0);
    });
  });
});