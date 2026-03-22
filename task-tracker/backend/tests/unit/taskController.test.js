process.env.DATABASE_URL = '/tmp/task-tracker-backend-test.db';
process.env.NODE_ENV = 'test';

const request = require('supertest');
const { app } = require('../../server');
const db = require('../../services/database');

describe('Task API', () => {
  beforeAll(async () => {
    await db.connect();
  });

  afterAll(async () => {
    await db.close();
  });

  beforeEach(async () => {
    await db.run('DELETE FROM tasks');
  });

  describe('GET /api/tasks', () => {
    it('should return empty array when no tasks exist', async () => {
      const response = await request(app)
        .get('/api/tasks')
        .expect(200);

      expect(response.body).toEqual([]);
    });

    it('should return all tasks with camelCase fields', async () => {
      await db.run(
        'INSERT INTO tasks (id, title, description, status, priority, due_date) VALUES (?, ?, ?, ?, ?, ?)',
        ['test-id', 'Test Task', 'Test Description', 'pending', 'medium', '2026-04-15']
      );

      const response = await request(app)
        .get('/api/tasks')
        .expect(200);

      expect(response.body).toHaveLength(1);
      expect(response.body[0]).toMatchObject({
        id: 'test-id',
        title: 'Test Task',
        description: 'Test Description',
        status: 'pending',
        priority: 'medium',
        dueDate: '2026-04-15',
      });
      expect(response.body[0].createdAt).toBeDefined();
      expect(response.body[0].updatedAt).toBeDefined();
    });
  });

  describe('POST /api/tasks', () => {
    it('should create a new task with a due date', async () => {
      const taskData = {
        title: 'New Task',
        description: 'Task description',
        status: 'pending',
        priority: 'high',
        dueDate: '2026-04-01',
      };

      const response = await request(app)
        .post('/api/tasks')
        .send(taskData)
        .expect(201);

      expect(response.body).toMatchObject({
        title: 'New Task',
        description: 'Task description',
        status: 'pending',
        priority: 'high',
        dueDate: '2026-04-01',
      });
      expect(response.body.id).toBeDefined();
    });

    it('should return 400 for an impossible due date', async () => {
      const response = await request(app)
        .post('/api/tasks')
        .send({ title: 'Bad date', dueDate: '2026-02-30' })
        .expect(400);

      expect(response.body.errors).toContain('Due date must be a valid date in YYYY-MM-DD format');
    });
  });

  describe('GET /api/tasks/:id', () => {
    it('should return task by id', async () => {
      await db.run(
        'INSERT INTO tasks (id, title) VALUES (?, ?)',
        ['test-id', 'Test Task']
      );

      const response = await request(app)
        .get('/api/tasks/test-id')
        .expect(200);

      expect(response.body).toMatchObject({
        id: 'test-id',
        title: 'Test Task',
      });
    });

    it('should return 404 for non-existent task', async () => {
      await request(app)
        .get('/api/tasks/non-existent')
        .expect(404);
    });
  });

  describe('PUT /api/tasks/:id', () => {
    it('should update a task and clear its due date', async () => {
      await db.run(
        'INSERT INTO tasks (id, title, status, due_date) VALUES (?, ?, ?, ?)',
        ['test-id', 'Test Task', 'pending', '2026-04-09']
      );

      const updateData = {
        title: 'Updated Task',
        status: 'completed',
        dueDate: null,
      };

      const response = await request(app)
        .put('/api/tasks/test-id')
        .send(updateData)
        .expect(200);

      expect(response.body).toMatchObject({
        id: 'test-id',
        title: 'Updated Task',
        status: 'completed',
        dueDate: null,
      });
    });

    it('should reject a blank title update', async () => {
      await db.run(
        'INSERT INTO tasks (id, title) VALUES (?, ?)',
        ['test-id', 'Test Task']
      );

      const response = await request(app)
        .put('/api/tasks/test-id')
        .send({ title: '   ' })
        .expect(400);

      expect(response.body.errors).toContain('Title must be a non-empty string');
    });
  });

  describe('DELETE /api/tasks/:id', () => {
    it('should delete a task', async () => {
      await db.run(
        'INSERT INTO tasks (id, title) VALUES (?, ?)',
        ['test-id', 'Test Task']
      );

      await request(app)
        .delete('/api/tasks/test-id')
        .expect(204);

      await request(app)
        .get('/api/tasks/test-id')
        .expect(404);
    });
  });
});
