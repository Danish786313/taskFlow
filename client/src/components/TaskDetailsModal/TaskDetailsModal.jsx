import React from 'react';
import { formatDate, isOverdue } from '../../utils/dateUtils';
import { TASK_STATUSES } from '../../data/dummyTasks';
import {
  IconClose,
  IconCalendar,
  IconEdit,
  IconTrash,
  IconCheck
} from '../Icons/Icons';
import './TaskDetailsModal.css';

export const TaskDetailsModal = ({
  isOpen,
  task,
  onClose,
  onEdit,
  onDelete,
  onChangeStatus
}) => {
  if (!isOpen || !task) return null;

  const overdue = isOverdue(task.dueDate) && task.status !== 'completed';

  return (
    <div className="details-modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="details-modal-box" onClick={(e) => e.stopPropagation()}>
        {/* Top Header */}
        <div className="details-modal-header">
          <div className="details-header-meta">
            <span className="details-task-id">{task.id}</span>
            <span className={`priority-badge priority-${task.priority}`}>
              {task.priority} Priority
            </span>
            <span className={`badge badge-${task.status}`}>
              {task.status.replace('_', ' ')}
            </span>
          </div>

          <div className="details-header-actions">
            <button
              type="button"
              className="btn-icon"
              onClick={() => {
                onClose();
                onEdit(task);
              }}
              title="Edit Task"
              aria-label="Edit Task"
            >
              <IconEdit size={16} />
            </button>
            <button
              type="button"
              className="btn-icon"
              onClick={() => {
                onClose();
                onDelete(task);
              }}
              title="Delete Task"
              aria-label="Delete Task"
            >
              <IconTrash size={16} />
            </button>
            <button
              type="button"
              className="btn-icon"
              onClick={onClose}
              title="Close"
              aria-label="Close"
            >
              <IconClose size={18} />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="details-modal-content">
          <h2 className="details-title">{task.title}</h2>

          <div className="details-section">
            <h4 className="details-section-label">Description</h4>
            <p className="details-desc-text">
              {task.description || 'No description provided.'}
            </p>
          </div>

          {/* Meta details grid */}
          <div className="details-meta-grid">
            <div className="details-meta-card">
              <span className="meta-card-label">Assignee</span>
              <div className="meta-assignee-wrap">
                <div className="meta-assignee-avatar">
                  {task.assigneeInitials || 'NA'}
                </div>
                <span className="meta-assignee-name">
                  {task.assignedTo || 'Unassigned'}
                </span>
              </div>
            </div>

            <div className="details-meta-card">
              <span className="meta-card-label">Due Date</span>
              <div className={`meta-due-wrap ${overdue ? 'overdue' : ''}`}>
                <IconCalendar size={15} />
                <span>{formatDate(task.dueDate)}</span>
                {overdue && <span className="meta-overdue-tag">Overdue</span>}
              </div>
            </div>

            <div className="details-meta-card">
              <span className="meta-card-label">Created</span>
              <span className="meta-text-val">{formatDate(task.createdAt)}</span>
            </div>

            <div className="details-meta-card">
              <span className="meta-card-label">Tags</span>
              <div className="meta-tags-list">
                {task.tags && task.tags.length > 0 ? (
                  task.tags.map((tag, i) => (
                    <span key={i} className="task-tag">
                      #{tag}
                    </span>
                  ))
                ) : (
                  <span className="meta-text-val">None</span>
                )}
              </div>
            </div>
          </div>

          {/* Quick Status Stage Selector */}
          <div className="details-section">
            <h4 className="details-section-label">Workflow Status</h4>
            <div className="details-status-stages">
              {TASK_STATUSES.map((status) => {
                const isActive = task.status === status.id;
                return (
                  <button
                    key={status.id}
                    type="button"
                    className={`status-stage-btn ${isActive ? 'active' : ''}`}
                    onClick={() => onChangeStatus(task.id, status.id)}
                  >
                    {isActive && <IconCheck size={14} />}
                    <span>{status.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="details-modal-footer">
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            Close
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => {
              onClose();
              onEdit(task);
            }}
          >
            <IconEdit size={16} />
            <span>Edit Task</span>
          </button>
        </div>
      </div>
    </div>
  );
};
