import { model } from 'forge-cli/dsl';

model('User', {
  id: 'uuid().primary()',
  email: 'string().email().unique()',
  name: 'string().min(2).max(100)',
  createdAt: 'datetime().defaultNow()',
  updatedAt: 'datetime().defaultNow().onUpdate()',
});

model('Post', {
  id: 'uuid().primary()',
  title: 'string().max(200)',
  content: 'text()',
  published: 'boolean().default(false)',
  userId: 'uuid().references("User", "id")',
  createdAt: 'datetime().defaultNow()',
  updatedAt: 'datetime().defaultNow().onUpdate()',
  
  // Relationships
  author: 'belongsTo("User")',
});