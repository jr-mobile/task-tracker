const Task = require('../models/Task');

const normalizeDueDate = (value) => {
  if (value === undefined) {
    return undefined;
  }

  if (value === null || value === '') {
    return null;
  }

  return value;
};

const getDueDateInput = (body) => {
  if (Object.prototype.hasOwnProperty.call(body, 'dueDate')) {
    return body.dueDate;
  }

  if (Object.prototype.hasOwnProperty.call(body, 'due_date')) {
    return body.due_date;
  }

  return undefined;
};

const getTaskPayload = (body) => ({
  title: body.title,
  description: body.description,
  status: body.status,
  priority: body.priority,
  dueDate: normalizeDueDate(getDueDateInput(body)),
});

class TaskController {
  async getAllTasks(req, res) {
    try {
      const tasks = await Task.findAll();
      res.json(tasks.map(task => task.toJSON()));
    } catch (error) {
      console.error('Error fetching tasks:', error);
      res.status(500).json({ error: 'Failed to fetch tasks' });
    }
  }

  async getTaskById(req, res) {
    try {
      const { id } = req.params;
      const task = await Task.findById(id);

      if (!task) {
        return res.status(404).json({ error: 'Task not found' });
      }

      res.json(task.toJSON());
    } catch (error) {
      console.error('Error fetching task:', error);
      res.status(500).json({ error: 'Failed to fetch task' });
    }
  }

  async createTask(req, res) {
    try {
      const { title, description, status, priority, dueDate } = getTaskPayload(req.body);

      if (!title || title.trim() === '') {
        return res.status(400).json({ error: 'Title is required' });
      }

      const taskData = {
        title: title.trim(),
        description: description ? description.trim() : '',
        status: status || 'pending',
        priority: priority || 'medium',
        dueDate,
      };

      const task = await Task.create(taskData);
      res.status(201).json(task.toJSON());
    } catch (error) {
      console.error('Error creating task:', error);
      res.status(500).json({ error: 'Failed to create task' });
    }
  }

  async updateTask(req, res) {
    try {
      const { id } = req.params;
      const task = await Task.findById(id);

      if (!task) {
        return res.status(404).json({ error: 'Task not found' });
      }

      const { title, description, status, priority, dueDate } = getTaskPayload(req.body);

      const updateData = {};
      if (title !== undefined) updateData.title = title.trim();
      if (description !== undefined) updateData.description = description.trim();
      if (status !== undefined) updateData.status = status;
      if (priority !== undefined) updateData.priority = priority;
      if (dueDate !== undefined) updateData.dueDate = dueDate;

      const updatedTask = await task.update(updateData);
      res.json(updatedTask.toJSON());
    } catch (error) {
      console.error('Error updating task:', error);
      res.status(500).json({ error: 'Failed to update task' });
    }
  }

  async deleteTask(req, res) {
    try {
      const { id } = req.params;
      const task = await Task.findById(id);

      if (!task) {
        return res.status(404).json({ error: 'Task not found' });
      }

      await task.delete();
      res.status(204).send();
    } catch (error) {
      console.error('Error deleting task:', error);
      res.status(500).json({ error: 'Failed to delete task' });
    }
  }
}

module.exports = new TaskController();
