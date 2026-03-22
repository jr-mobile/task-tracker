const DATE_ONLY_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

const isValidDateOnly = (value) => {
  if (typeof value !== 'string' || !DATE_ONLY_PATTERN.test(value)) {
    return false;
  }

  const [year, month, day] = value.split('-').map(Number);
  const parsedDate = new Date(Date.UTC(year, month - 1, day));

  return (
    parsedDate.getUTCFullYear() === year &&
    parsedDate.getUTCMonth() === month - 1 &&
    parsedDate.getUTCDate() === day
  );
};

const validateTaskData = (req, res, next) => {
  const { title, description, status, priority } = req.body;
  const dueDate = req.body.dueDate ?? req.body.due_date;

  const errors = [];

  if (req.method === 'POST' && (!title || typeof title !== 'string' || title.trim().length === 0)) {
    errors.push('Title is required and must be a non-empty string');
  }

  if (title !== undefined && (typeof title !== 'string' || title.trim().length === 0)) {
    errors.push('Title must be a non-empty string');
  }

  if (description !== undefined && typeof description !== 'string') {
    errors.push('Description must be a string');
  }

  if (status && !['pending', 'in-progress', 'completed'].includes(status)) {
    errors.push('Status must be one of: pending, in-progress, completed');
  }

  if (priority && !['low', 'medium', 'high'].includes(priority)) {
    errors.push('Priority must be one of: low, medium, high');
  }

  if (dueDate !== undefined && dueDate !== null && dueDate !== '') {
    if (!isValidDateOnly(dueDate)) {
      errors.push('Due date must be a valid date in YYYY-MM-DD format');
    }
  }

  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  next();
};

const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = {
  validateTaskData,
  asyncHandler
};
