import React, { useState, useMemo, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { useTasks } from '../../context/TaskContext';
import { useAuth } from '../../context/AuthContext';
import { TaskCard } from '../../components/TaskCard/TaskCard';
import { Pagination } from '../../components/Pagination/Pagination';
import { IconMyTasks, IconPlus } from '../../components/Icons/Icons';
import './Tasks.css';

export const MyTasks = () => {
  const { tasks, fetchMyTasks } = useTasks();
  const { user } = useAuth();
  const {
    onOpenCreateModal,
    onOpenEditModal,
    onOpenViewModal,
    onOpenDeleteConfirm,
    onChangeStatus
  } = useOutletContext();

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6;
  const [apiTasks, setApiTasks] = useState(null);

  useEffect(() => {
    let isMounted = true;
    fetchMyTasks({ page: currentPage, limit: pageSize }).then((res) => {
      if (isMounted && res && res.tasks) {
        setApiTasks(res.tasks);
      }
    });
    return () => {
      isMounted = false;
    };
  }, [currentPage, pageSize, fetchMyTasks]);

  // Filter tasks assigned to current user
  const myTasks = useMemo(() => {
    if (apiTasks && apiTasks.length > 0) return apiTasks;
    if (!user?.name) return [];
    return tasks.filter(
      (t) => t.assignedTo && t.assignedTo.toLowerCase() === user.name.toLowerCase()
    );
  }, [apiTasks, tasks, user]);

  const totalPages = Math.ceil(myTasks.length / pageSize) || 1;
  const paginatedTasks = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return myTasks.slice(start, start + pageSize);
  }, [myTasks, currentPage, pageSize]);

  return (
    <div className="tasks-page">
      <div className="tasks-header">
        <div className="tasks-header-left">
          <div className="tasks-title">
            <span>My Tasks</span>
            <span className="tasks-count-pill">{myTasks.length}</span>
          </div>
          <p className="tasks-subtitle">
            Tasks assigned directly to {user?.name || 'you'}.
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

      {myTasks.length === 0 ? (
        <div className="tasks-empty-card">
          <div className="empty-icon-wrap">
            <IconMyTasks size={28} />
          </div>
          <h3 className="empty-title">No tasks assigned to you</h3>
          <p className="empty-sub">
            You do not currently have any active assignments. You can create a new task or assign existing ones to yourself.
          </p>
          <button
            type="button"
            className="btn btn-primary btn-sm"
            onClick={onOpenCreateModal}
          >
            <IconPlus size={16} />
            <span>Create Task</span>
          </button>
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
              totalItems={myTasks.length}
              pageSize={pageSize}
              onPageChange={setCurrentPage}
            />
          </div>
        </div>
      )}
    </div>
  );
};
