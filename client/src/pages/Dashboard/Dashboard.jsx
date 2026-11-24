import React, { useState, useMemo } from 'react';
import { useOutletContext } from 'react-router-dom';
import { useTasks } from '../../context/TaskContext';
import { useAuth } from '../../context/AuthContext';
import { StatCard } from '../../components/StatCard/StatCard';
import { TaskCard } from '../../components/TaskCard/TaskCard';
import { TASK_STATUSES, TASK_PRIORITIES } from '../../data/dummyTasks';
import {
  IconTasks,
  IconClock,
  IconCheck,
  IconPlus,
  IconSearch
} from '../../components/Icons/Icons';
import './Dashboard.css';

export const Dashboard = () => {
  const { tasks, stats, searchQuery, teamMembers } = useTasks();
  const { user } = useAuth();
  const {
    onOpenCreateModal,
    onOpenEditModal,
    onOpenViewModal,
    onOpenDeleteConfirm,
    onChangeStatus
  } = useOutletContext();

  const [selectedPriority, setSelectedPriority] = useState('all');
  const [selectedAssignee, setSelectedAssignee] = useState('all');
  const [boardSearch, setBoardSearch] = useState('');

  // Combined search, priority, and assignee filter for Kanban board
  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      // Global navbar search or board search
      const query = (boardSearch || searchQuery || '').toLowerCase().trim();
      const matchesSearch =
        !query ||
        task.title.toLowerCase().includes(query) ||
        (task.description && task.description.toLowerCase().includes(query)) ||
        (task.assignedTo && task.assignedTo.toLowerCase().includes(query)) ||
        (task.tags && task.tags.some((t) => t.toLowerCase().includes(query)));

      // Priority filter
      const matchesPriority =
        selectedPriority === 'all' || task.priority === selectedPriority;

      // Assignee filter
      const matchesAssignee =
        selectedAssignee === 'all' ||
        (task.assignedTo && task.assignedTo.toLowerCase() === selectedAssignee.toLowerCase());

      return matchesSearch && matchesPriority && matchesAssignee;
    });
  }, [tasks, boardSearch, searchQuery, selectedPriority, selectedAssignee]);

  return (
    <div className="dashboard-page">
      {/* Top Welcome Header */}
      <div className="dashboard-header">
        <div className="dashboard-header-left">
          <h1 className="dashboard-title">
            Welcome back, {user?.name ? user.name.split(' ')[0] : 'Engineer'} 👋
          </h1>
          <p className="dashboard-subtitle">
            Here is what&apos;s happening across your team&apos;s sprint today.
          </p>
        </div>

        <div className="dashboard-header-right">
          <button
            type="button"
            className="btn btn-primary"
            onClick={onOpenCreateModal}
          >
            <IconPlus size={18} />
            <span>New Task</span>
          </button>
        </div>
      </div>

      {/* Statistics Cards Row */}
      <div className="dashboard-stats-grid">
        <StatCard
          title="Total Tasks"
          value={stats.total}
          icon={<IconTasks size={20} />}
          iconBg="var(--primary-light)"
          iconColor="var(--primary)"
          badgeText={`${stats.completionRate}% Done`}
          badgeType="info"
          subtitle="All active sprint deliverables"
        />

        <StatCard
          title="Pending (To Do)"
          value={stats.todo}
          icon={<IconClock size={20} />}
          iconBg="var(--status-todo-bg)"
          iconColor="var(--status-todo)"
          badgeText="Pending"
          badgeType="neutral"
          subtitle="Awaiting development kickoff"
        />

        <StatCard
          title="In Progress"
          value={stats.inProgress}
          icon={<IconClock size={20} />}
          iconBg="var(--status-inprogress-bg)"
          iconColor="var(--status-inprogress)"
          badgeText="Active"
          badgeType="info"
          subtitle="Currently under development"
        />

        <StatCard
          title="Completed"
          value={stats.completed}
          icon={<IconCheck size={20} />}
          iconBg="var(--status-completed-bg)"
          iconColor="var(--status-completed)"
          badgeText="Delivered"
          badgeType="success"
          subtitle="Verified and shipped"
        />
      </div>

      {/* Board Controls / Filter Bar */}
      <div className="board-toolbar">
        <div className="toolbar-left">
          <div className="board-search-input-wrap">
            <IconSearch size={16} className="board-search-icon" />
            <input
              type="text"
              placeholder="Filter board tasks..."
              value={boardSearch}
              onChange={(e) => setBoardSearch(e.target.value)}
              className="board-search-input"
            />
          </div>

          {/* Priority filter pills */}
          <div className="priority-filters">
            <span className="priority-filter-label">Priority:</span>
            <button
              type="button"
              className={`priority-filter-pill ${selectedPriority === 'all' ? 'active' : ''}`}
              onClick={() => setSelectedPriority('all')}
            >
              All
            </button>
            {TASK_PRIORITIES.map((pri) => (
              <button
                key={pri.id}
                type="button"
                className={`priority-filter-pill ${selectedPriority === pri.id ? 'active' : ''}`}
                onClick={() => setSelectedPriority(pri.id)}
              >
                {pri.label}
              </button>
            ))}
          </div>

          {/* Dynamic Assignee Dropdown Filter */}
          <div className="board-assignee-filter">
            <select
              value={selectedAssignee}
              onChange={(e) => setSelectedAssignee(e.target.value)}
              className="filter-select"
              style={{ height: '32px', fontSize: '0.775rem', borderRadius: 'var(--radius-full)' }}
            >
              <option value="all">All Assignees</option>
              {teamMembers &&
                teamMembers.map((m) => (
                  <option key={m.id || m.name} value={m.name}>
                    {m.name}
                  </option>
                ))}
            </select>
          </div>
        </div>

        <div className="toolbar-right">
          <span className="showing-tasks-count">
            Showing <strong>{filteredTasks.length}</strong> of {tasks.length} tasks
          </span>
        </div>
      </div>

      {/* Kanban Board Module */}
      <div className="kanban-board-container">
        <div className="kanban-board">
          {TASK_STATUSES.map((column) => {
            const columnTasks = filteredTasks.filter(
              (t) => t.status === column.id
            );

            return (
              <div key={column.id} className="kanban-column">
                {/* Column Header */}
                <div className="kanban-column-header">
                  <div className="column-header-title">
                    <span
                      className="column-indicator-dot"
                      style={{ backgroundColor: column.color }}
                    />
                    <h3 className="column-name">{column.label}</h3>
                    <span className="column-count-badge">
                      {columnTasks.length}
                    </span>
                  </div>

                  <button
                    type="button"
                    className="btn-icon column-add-btn"
                    onClick={onOpenCreateModal}
                    title={`Add task to ${column.label}`}
                    aria-label={`Add task to ${column.label}`}
                  >
                    <IconPlus size={16} />
                  </button>
                </div>

                {/* Column Task Cards */}
                <div className="kanban-column-body">
                  {columnTasks.length === 0 ? (
                    <div className="kanban-empty-state">
                      <p className="empty-state-text">No tasks in {column.label}</p>
                      <button
                        type="button"
                        className="btn-empty-add"
                        onClick={onOpenCreateModal}
                      >
                        + Add a task
                      </button>
                    </div>
                  ) : (
                    columnTasks.map((task) => (
                      <TaskCard
                        key={task.id}
                        task={task}
                        onView={onOpenViewModal}
                        onEdit={onOpenEditModal}
                        onDelete={onOpenDeleteConfirm}
                        onChangeStatus={onChangeStatus}
                      />
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
