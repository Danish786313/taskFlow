import React, { useState, useRef, useEffect } from 'react';
import { formatDate, isOverdue } from '../../utils/dateUtils';
import {
  IconCalendar,
  IconMore,
  IconEdit,
  IconTrash,
  IconEye,
  IconChevronRight,
  IconChevronLeft
} from '../Icons/Icons';
import './TaskCard.css';

export const TaskCard = ({
  task,
  onView,
  onEdit,
  onDelete,
  onChangeStatus
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const overdue = isOverdue(task.dueDate) && task.status !== 'completed';

  const statusOrder = ['todo', 'in_progress', 'review', 'completed'];
  const currentIndex = statusOrder.indexOf(task.status);
  const prevStatus = currentIndex > 0 ? statusOrder[currentIndex - 1] : null;
  const nextStatus = currentIndex < statusOrder.length - 1 ? statusOrder[currentIndex + 1] : null;

  return (
    <div className="task-card" onClick={() => onView(task)}>
      {/* Top row: ID, Priority, Context Menu */}
      <div className="task-card-header" onClick={(e) => e.stopPropagation()}>
        <span className="task-card-id">{task.id}</span>

        <div className="task-card-header-right">
          <span className={`priority-badge priority-${task.priority}`}>
            {task.priority}
          </span>

          <div className="task-card-menu-wrap" ref={menuRef}>
            <button
              type="button"
              className="task-card-more-btn"
              onClick={() => setShowMenu(!showMenu)}
              aria-label="Task options"
            >
              <IconMore size={16} />
            </button>

            {showMenu && (
              <div className="task-card-menu">
                <button
                  type="button"
                  className="task-menu-item"
                  onClick={() => {
                    setShowMenu(false);
                    onView(task);
                  }}
                >
                  <IconEye size={14} />
                  <span>View Details</span>
                </button>
                <button
                  type="button"
                  className="task-menu-item"
                  onClick={() => {
                    setShowMenu(false);
                    onEdit(task);
                  }}
                >
                  <IconEdit size={14} />
                  <span>Edit Task</span>
                </button>
                <div className="task-menu-divider" />
                <button
                  type="button"
                  className="task-menu-item menu-danger"
                  onClick={() => {
                    setShowMenu(false);
                    onDelete(task);
                  }}
                >
                  <IconTrash size={14} />
                  <span>Delete Task</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Title & Description */}
      <h4 className="task-card-title">{task.title}</h4>
      {task.description && (
        <p className="task-card-desc">{task.description}</p>
      )}

      {/* Tags */}
      {task.tags && task.tags.length > 0 && (
        <div className="task-card-tags">
          {task.tags.map((tag, idx) => (
            <span key={idx} className="task-tag">
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* Bottom row: Due Date, Assignee, Status quick shift */}
      <div className="task-card-footer" onClick={(e) => e.stopPropagation()}>
        <div className={`task-card-due ${overdue ? 'overdue' : ''}`}>
          <IconCalendar size={13} />
          <span>{formatDate(task.dueDate)}</span>
        </div>

        <div className="task-card-footer-right">
          {/* Quick status shifters */}
          <div className="task-status-shifters">
            {prevStatus && (
              <button
                type="button"
                className="btn-shifter"
                onClick={() => onChangeStatus(task.id, prevStatus)}
                title={`Move back to ${prevStatus.replace('_', ' ')}`}
                aria-label="Move to previous status"
              >
                <IconChevronLeft size={13} />
              </button>
            )}
            {nextStatus && (
              <button
                type="button"
                className="btn-shifter"
                onClick={() => onChangeStatus(task.id, nextStatus)}
                title={`Advance to ${nextStatus.replace('_', ' ')}`}
                aria-label="Move to next status"
              >
                <IconChevronRight size={13} />
              </button>
            )}
          </div>

          {/* Assignee Avatar */}
          <div
            className="task-assignee-avatar"
            title={`Assigned to ${task.assignedTo || 'Unassigned'}`}
          >
            {task.assigneeInitials || 'NA'}
          </div>
        </div>
      </div>
    </div>
  );
};
