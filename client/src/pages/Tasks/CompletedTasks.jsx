import React, { useState, useMemo } from 'react';
import { useOutletContext } from 'react-router-dom';
import { useTasks } from '../../context/TaskContext';
import { TaskCard } from '../../components/TaskCard/TaskCard';
import { Pagination } from '../../components/Pagination/Pagination';
import { IconCompleted, IconPlus } from '../../components/Icons/Icons';
import './Tasks.css';

export const CompletedTasks = () => {
  const { tasks } = useTasks();
  const {
    onOpenCreateModal,
    onOpenEditModal,
    onOpenViewModal,
    onOpenDeleteConfirm,
    onChangeStatus
  } = useOutletContext();

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6;

  // Filter completed tasks
  const completedTasks = useMemo(() => {
    return tasks.filter((t) => t.status === 'completed');
  }, [tasks]);

  const totalPages = Math.ceil(completedTasks.length / pageSize) || 1;
  const paginatedTasks = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return completedTasks.slice(start, start + pageSize);
  }, [completedTasks, currentPage, pageSize]);

  return (
    <div className="tasks-page">
      <div className="tasks-header">
        <div className="tasks-header-left">
          <div className="tasks-title">
            <span>Completed Tasks</span>
            <span className="tasks-count-pill" style={{ backgroundColor: '#ecfdf5', color: '#059669' }}>
              {completedTasks.length}
            </span>
          </div>
          <p className="tasks-subtitle">
            Archive of completed deliverables and shipped milestones.
          </p>
        </div>

        <button
          type="button"
          className="btn btn-primary"
          onClick={onOpenCreateModal}
        >
          <IconPlus size={18} />
          <span>New Task</span>
        </button>
      </div>

      {completedTasks.length === 0 ? (
        <div className="tasks-empty-card">
          <div className="empty-icon-wrap">
            <IconCompleted size={28} />
          </div>
          <h3 className="empty-title">No completed tasks yet</h3>
          <p className="empty-sub">
            Tasks moved to the &ldquo;Completed&rdquo; column on the Kanban board will appear here.
          </p>
        </div>
      ) : (
        <div>
          <div className="tasks-grid-view">
            {paginatedTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onView={onOpenViewModal}
                onEdit={onOpenEditModal}
                onDelete={onOpenDeleteConfirm}
                onChangeStatus={onChangeStatus}
              />
            ))}
          </div>

          <div style={{ marginTop: '1.5rem' }}>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={completedTasks.length}
              pageSize={pageSize}
              onPageChange={setCurrentPage}
            />
          </div>
        </div>
      )}
    </div>
  );
};
