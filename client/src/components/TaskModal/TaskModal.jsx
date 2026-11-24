import React, { useState, useEffect } from 'react';
import { TASK_STATUSES, TASK_PRIORITIES, TEAM_MEMBERS } from '../../data/dummyTasks';
import { useTasks } from '../../context/TaskContext';
import { validateRequired } from '../../utils/validators';
import { IconClose } from '../Icons/Icons';
import './TaskModal.css';

export const TaskModal = ({
  isOpen,
  mode = 'create', // 'create' | 'edit'
  initialData = null,
  teamMembers: propTeamMembers,
  onSave,
  onClose
}) => {
  const { teamMembers: contextTeamMembers } = useTasks();
  const availableMembers = propTeamMembers || contextTeamMembers || TEAM_MEMBERS;
  const defaultAssignee = availableMembers && availableMembers.length > 0 ? availableMembers[0].name : 'Unassigned';

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'todo',
    priority: 'medium',
    dueDate: '',
    assignedTo: defaultAssignee,
    tags: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialData && mode === 'edit') {
      setFormData({
        title: initialData.title || '',
        description: initialData.description || '',
        status: initialData.status || 'todo',
        priority: initialData.priority || 'medium',
        dueDate: initialData.dueDate || '',
        assignedTo: initialData.assignedTo || defaultAssignee,
        tags: Array.isArray(initialData.tags) ? initialData.tags.join(', ') : initialData.tags || ''
      });
    } else {
      setFormData({
        title: '',
        description: '',
        status: 'todo',
        priority: 'medium',
        dueDate: new Date().toISOString().split('T')[0],
        assignedTo: defaultAssignee,
        tags: ''
      });
    }
    setErrors({});
  }, [initialData, mode, isOpen, defaultAssignee]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validation
    const titleError = validateRequired(formData.title, 'Task title');
    const dueDateError = validateRequired(formData.dueDate, 'Due date');

    if (titleError || dueDateError) {
      setErrors({
        title: titleError,
        dueDate: dueDateError
      });
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      onSave(formData);
      setIsSubmitting(false);
      onClose();
    }, 300);
  };

  return (
    <div className="task-modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="task-modal-box" onClick={(e) => e.stopPropagation()}>
        <div className="task-modal-header">
          <div>
            <h3 className="task-modal-title">
              {mode === 'create' ? 'Create New Task' : 'Edit Task'}
            </h3>
            <p className="task-modal-subtitle">
              {mode === 'create'
                ? 'Fill in the information to add a task to your workspace'
                : `Editing task ${initialData?.id || ''}`}
            </p>
          </div>
          <button
            type="button"
            className="task-modal-close"
            onClick={onClose}
            aria-label="Close dialog"
          >
            <IconClose size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="task-modal-form">
          {/* Title field */}
          <div className="form-group">
            <label htmlFor="task-title" className="form-label required">
              Task Title
            </label>
            <input
              id="task-title"
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g. Design user profile interface"
              className={`form-input ${errors.title ? 'is-invalid' : ''}`}
            />
            {errors.title && <span className="form-error">{errors.title}</span>}
          </div>

          {/* Description field */}
          <div className="form-group">
            <label htmlFor="task-description" className="form-label">
              Description
            </label>
            <textarea
              id="task-description"
              name="description"
              rows={3}
              value={formData.description}
              onChange={handleChange}
              placeholder="Provide a detailed explanation of the requirements and deliverables..."
              className="form-textarea"
            />
          </div>

          {/* Grid row: Status & Priority */}
          <div className="form-row-2">
            <div className="form-group">
              <label htmlFor="task-status" className="form-label required">
                Status
              </label>
              <select
                id="task-status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="form-select"
              >
                {TASK_STATUSES.map((status) => (
                  <option key={status.id} value={status.id}>
                    {status.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="task-priority" className="form-label required">
                Priority
              </label>
              <select
                id="task-priority"
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                className="form-select"
              >
                {TASK_PRIORITIES.map((priority) => (
                  <option key={priority.id} value={priority.id}>
                    {priority.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Grid row: Due Date & Assignee */}
          <div className="form-row-2">
            <div className="form-group">
              <label htmlFor="task-dueDate" className="form-label required">
                Due Date
              </label>
              <input
                id="task-dueDate"
                type="date"
                name="dueDate"
                value={formData.dueDate}
                onChange={handleChange}
                className={`form-input ${errors.dueDate ? 'is-invalid' : ''}`}
              />
              {errors.dueDate && <span className="form-error">{errors.dueDate}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="task-assignee" className="form-label">
                Assignee
              </label>
              <select
                id="task-assignee"
                name="assignedTo"
                value={formData.assignedTo}
                onChange={handleChange}
                className="form-select"
              >
                <option value="Unassigned">Unassigned</option>
                {availableMembers.map((member) => (
                  <option key={member.id || member.name} value={member.name}>
                    {member.name} {member.role ? `(${member.role})` : ''}
                  </option>
                ))}
                {formData.assignedTo &&
                  formData.assignedTo !== 'Unassigned' &&
                  !availableMembers.some((m) => m.name === formData.assignedTo) && (
                    <option value={formData.assignedTo}>{formData.assignedTo}</option>
                  )}
              </select>
            </div>
          </div>

          {/* Tags */}
          <div className="form-group">
            <label htmlFor="task-tags" className="form-label">
              Tags (comma separated)
            </label>
            <input
              id="task-tags"
              type="text"
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              placeholder="Frontend, Security, Design"
              className="form-input"
            />
          </div>

          {/* Actions */}
          <div className="task-modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting
                ? 'Saving...'
                : mode === 'create'
                ? 'Create Task'
                : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
