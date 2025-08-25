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

route('POST /api/posts', {
  body: 'PostCreate',
  response: 'Post',
  handler: async ({ db, body }) => {
    return db.post.create({
      data: body,
    });
  },
});