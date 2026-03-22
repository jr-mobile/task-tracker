const db = require('../services/database');
const { v4: uuidv4 } = require('uuid');

class Task {
  constructor(data) {
    this.id = data.id || uuidv4();
    this.title = data.title;
    this.description = data.description || '';
    this.status = data.status || 'pending';
    this.priority = data.priority || 'medium';
    this.dueDate = data.dueDate ?? data.due_date ?? null;
    this.createdAt = data.createdAt || data.created_at || new Date().toISOString();
    this.updatedAt = data.updatedAt || data.updated_at || new Date().toISOString();
  }

  static async findAll() {
    const sql = 'SELECT * FROM tasks ORDER BY created_at DESC';
    const rows = await db.all(sql);
    return rows.map(row => new Task(row));
  }

  static async findById(id) {
    const sql = 'SELECT * FROM tasks WHERE id = ?';
    const row = await db.get(sql, [id]);
    return row ? new Task(row) : null;
  }

  static async create(data) {
    const task = new Task(data);
    const sql = `
      INSERT INTO tasks (id, title, description, status, priority, due_date, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    await db.run(sql, [
      task.id,
      task.title,
      task.description,
      task.status,
      task.priority,
      task.dueDate,
      task.createdAt,
      task.updatedAt
    ]);
    return task;
  }

  async update(data) {
    const updates = [];
    const params = [];

    if (data.title !== undefined) {
      updates.push('title = ?');
      params.push(data.title);
      this.title = data.title;
    }
    if (data.description !== undefined) {
      updates.push('description = ?');
      params.push(data.description);
      this.description = data.description;
    }
    if (data.status !== undefined) {
      updates.push('status = ?');
      params.push(data.status);
      this.status = data.status;
    }
    if (data.priority !== undefined) {
      updates.push('priority = ?');
      params.push(data.priority);
      this.priority = data.priority;
    }
    if (data.dueDate !== undefined) {
      updates.push('due_date = ?');
      params.push(data.dueDate);
      this.dueDate = data.dueDate;
    }

    const updatedAt = new Date().toISOString();
    updates.push('updated_at = ?');
    params.push(updatedAt);
    this.updatedAt = updatedAt;

    params.push(this.id);

    const sql = `UPDATE tasks SET ${updates.join(', ')} WHERE id = ?`;
    await db.run(sql, params);
    return this;
  }

  async delete() {
    const sql = 'DELETE FROM tasks WHERE id = ?';
    await db.run(sql, [this.id]);
    return true;
  }

  toJSON() {
    return {
      id: this.id,
      title: this.title,
      description: this.description,
      status: this.status,
      priority: this.priority,
      dueDate: this.dueDate,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
}

module.exports = Task;
