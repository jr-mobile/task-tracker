const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const { validateTaskData, asyncHandler } = require('../middleware/validation');

// GET /api/tasks - Get all tasks
router.get('/', asyncHandler(taskController.getAllTasks));

// GET /api/tasks/:id - Get task by ID
router.get('/:id', asyncHandler(taskController.getTaskById));

// POST /api/tasks - Create new task
router.post('/', validateTaskData, asyncHandler(taskController.createTask));

// PUT /api/tasks/:id - Update task
router.put('/:id', validateTaskData, asyncHandler(taskController.updateTask));

// DELETE /api/tasks/:id - Delete task
router.delete('/:id', asyncHandler(taskController.deleteTask));

module.exports = router;