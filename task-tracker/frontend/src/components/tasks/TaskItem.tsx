import React, { useState } from 'react';
import { Task, UpdateTaskData } from '../../types';
import { format } from 'date-fns';
import './TaskItem.css';

interface TaskItemProps {
  task: Task;
  onDelete: (id: string) => void;
  updateTask: (id: string, taskData: UpdateTaskData) => Promise<unknown>;
}

export const TaskItem: React.FC<TaskItemProps> = ({ task, onDelete, updateTask }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<UpdateTaskData>({
    title: task.title,
    description: task.description,
    status: task.status,
    priority: task.priority,
    dueDate: task.dueDate || '',
  });
  const [isUpdating, setIsUpdating] = useState(false);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditData({
      title: task.title,
      description: task.description,
      status: task.status,
      priority: task.priority,
      dueDate: task.dueDate || '',
    });
  };

  const handleSave = async () => {
    if (!editData.title?.trim()) return;

    setIsUpdating(true);
    try {
      await updateTask(task.id, {
        ...editData,
        dueDate: editData.dueDate || null,
      });
      setIsEditing(false);
    } catch {
      // Error is handled by the hook
    } finally {
      setIsUpdating(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEditData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'status-completed';
      case 'in-progress': return 'status-in-progress';
      case 'pending': return 'status-pending';
      default: return '';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'priority-high';
      case 'medium': return 'priority-medium';
      case 'low': return 'priority-low';
      default: return '';
    }
  };

  return (
    <div className={`task-item ${getStatusColor(task.status)}`}>
      {isEditing ? (
        <div className="task-edit">
          <div className="form-group">
            <input
              type="text"
              name="title"
              value={editData.title}
              onChange={handleChange}
              placeholder="Task title"
            />
          </div>

          <div className="form-group">
            <textarea
              name="description"
              value={editData.description}
              onChange={handleChange}
              placeholder="Task description"
              rows={2}
            />
          </div>

          <div className="form-row">
            <select name="status" value={editData.status} onChange={handleChange}>
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>

            <select name="priority" value={editData.priority} onChange={handleChange}>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          <div className="form-group">
            <input
              type="date"
              name="dueDate"
              value={editData.dueDate || ''}
              onChange={handleChange}
            />
          </div>

          <div className="task-actions">
            <button
              onClick={handleSave}
              disabled={isUpdating || !editData.title?.trim()}
              className="save-button"
            >
              {isUpdating ? 'Saving...' : 'Save'}
            </button>
            <button onClick={handleCancel} className="cancel-button">
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="task-view">
          <div className="task-header">
            <h3 className="task-title">{task.title}</h3>
            <div className="task-badges">
              <span className={`badge ${getStatusColor(task.status)}`}>
                {task.status.replace('-', ' ')}
              </span>
              <span className={`badge ${getPriorityColor(task.priority)}`}>
                {task.priority}
              </span>
            </div>
          </div>

          {task.description && (
            <p className="task-description">{task.description}</p>
          )}

          <div className="task-meta">
            {task.dueDate && (
              <div className="task-due-date">
                Due: {format(new Date(`${task.dueDate}T00:00:00`), 'MMM dd, yyyy')}
              </div>
            )}
            <div className="task-created">
              Created: {format(new Date(task.createdAt), 'MMM dd, yyyy')}
            </div>
          </div>

          <div className="task-actions">
            <button onClick={handleEdit} className="edit-button">
              Edit
            </button>
            <button onClick={() => onDelete(task.id)} className="delete-button">
              Delete
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
