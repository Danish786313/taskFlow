import React, { useState, useMemo, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { useTasks } from '../../context/TaskContext';
import { TASK_STATUSES, TASK_PRIORITIES } from '../../data/dummyTasks';
import { formatDate, isOverdue } from '../../utils/dateUtils';
import { TaskCard } from '../../components/TaskCard/TaskCard';
import { Pagination } from '../../components/Pagination/Pagination';
import {
  IconSearch,
  IconClose,
  IconPlus,
  IconGrid,
  IconList,
  IconEye,
  IconEdit,
  IconTrash,
  IconCalendar,
  IconTasks
} from '../../components/Icons/Icons';
import './Tasks.css';

export const AllTasks = () => {
  const { tasks, loading, searchQuery, setSearchQuery, fetchTasks, teamMembers } = useTasks();
  const {
    onOpenCreateModal,
    onOpenEditModal,
    onOpenViewModal,
    onOpenDeleteConfirm,
    onChangeStatus
  } = useOutletContext();

  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [assigneeFilter, setAssigneeFilter] = useState('all');
  const [sortBy, setSortBy] = useState('dueDate');
  const [viewMode, setViewMode] = useState('table'); // 'table' | 'grid'

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Trigger API fetch when filters, sort, or pagination change
  useEffect(() => {
    fetchTasks({
      status: statusFilter !== 'all' ? statusFilter : undefined,
      priority: priorityFilter !== 'all' ? priorityFilter : undefined,
      assignedTo: assigneeFilter !== 'all' ? assigneeFilter : undefined,
      search: searchQuery || undefined,
      page: currentPage,
      limit: pageSize,
      sortBy
    });
  }, [statusFilter, priorityFilter, assigneeFilter, searchQuery, currentPage, pageSize, sortBy, fetchTasks]);

  // Filtering & Sorting (works seamlessly for both API returned and local state)
  const filteredAndSortedTasks = useMemo(() => {
    return tasks
      .filter((task) => {
        // Search query
        const query = searchQuery.toLowerCase().trim();
        const matchesQuery =
          !query ||
          task.title.toLowerCase().includes(query) ||
          (task.description && task.description.toLowerCase().includes(query)) ||
          (task.assignedTo && task.assignedTo.toLowerCase().includes(query)) ||
          (task.tags && task.tags.some((t) => t.toLowerCase().includes(query)));

        // Status filter
        const matchesStatus =
          statusFilter === 'all' || task.status === statusFilter;

        // Priority filter
        const matchesPriority =
          priorityFilter === 'all' || task.priority === priorityFilter;

        // Assignee filter
        const matchesAssignee =
          assigneeFilter === 'all' ||
          (task.assignedTo && task.assignedTo.toLowerCase() === assigneeFilter.toLowerCase());

        return matchesQuery && matchesStatus && matchesPriority && matchesAssignee;
      })
      .sort((a, b) => {
        if (sortBy === 'dueDate') {
          return new Date(a.dueDate || 0) - new Date(b.dueDate || 0);
        }
        if (sortBy === 'title') {
          return a.title.localeCompare(b.title);
        }
        if (sortBy === 'priority') {
          const weights = { high: 3, medium: 2, low: 1 };
          return (weights[b.priority] || 0) - (weights[a.priority] || 0);
        }
        return 0;
      });
  }, [tasks, searchQuery, statusFilter, priorityFilter, sortBy]);

  // Pagination slicing
  const totalPages = Math.ceil(filteredAndSortedTasks.length / pageSize) || 1;
  const paginatedTasks = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredAndSortedTasks.slice(startIndex, startIndex + pageSize);
  }, [filteredAndSortedTasks, currentPage, pageSize]);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handlePageSizeChange = (newSize) => {
    setPageSize(newSize);
    setCurrentPage(1);
  };

  return (
    <div className="tasks-page">
      {/* Page Header */}
      <div className="tasks-header">
        <div className="tasks-header-left">
          <div className="tasks-title">
            <span>All Tasks</span>
            <span className="tasks-count-pill">{tasks.length}</span>
          </div>
          <p className="tasks-subtitle">
            Manage, filter, and track deliverables across your active development cycle.
          </p>
        </div>

        <button
          type="button"
          className="btn btn-primary"
          onClick={onOpenCreateModal}
        >
          <IconPlus size={18} />
          <span>Create Task</span>
        </button>
      </div>

      {/* Filter and Control Bar */}
      <div className="tasks-controls-card">
        <div className="controls-top-row">
          {/* Live Search */}
          <div className="tasks-search-wrap">
            <IconSearch size={16} className="tasks-search-icon" />
            <input
              type="text"
              placeholder="Search by title, description, or tags..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="tasks-search-input"
            />
            {searchQuery && (
              <button
                type="button"
                className="tasks-search-clear"
                onClick={() => setSearchQuery('')}
                aria-label="Clear search"
              >
                <IconClose size={14} />
              </button>
            )}
          </div>

          {/* Filters & View Mode */}
          <div className="controls-filters-group">
            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="filter-select"
            >
              <option value="all">All Statuses</option>
              {TASK_STATUSES.map((st) => (
                <option key={st.id} value={st.id}>
                  {st.label}
                </option>
              ))}
            </select>

            {/* Priority Filter */}
            <select
              value={priorityFilter}
              onChange={(e) => {
                setPriorityFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="filter-select"
            >
              <option value="all">All Priorities</option>
              {TASK_PRIORITIES.map((pr) => (
                <option key={pr.id} value={pr.id}>
                  {pr.label}
                </option>
              ))}
            </select>

            {/* Assignee Filter */}
            <select
              value={assigneeFilter}
              onChange={(e) => {
                setAssigneeFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="filter-select"
            >
              <option value="all">All Assignees</option>
              {teamMembers &&
                teamMembers.map((member) => (
                  <option key={member.id || member.name} value={member.name}>
                    {member.name}
                  </option>
                ))}
            </select>

            {/* Sort Filter */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="filter-select"
            >
              <option value="dueDate">Sort by Due Date</option>
              <option value="priority">Sort by Priority</option>
              <option value="title">Sort by Title</option>
            </select>

            {/* View Mode Toggle */}
            <div className="view-mode-toggle">
              <button
                type="button"
                className={`view-toggle-btn ${viewMode === 'table' ? 'active' : ''}`}
                onClick={() => setViewMode('table')}
                title="Table View"
                aria-label="Table View"
              >
                <IconList size={18} />
              </button>
              <button
                type="button"
                className={`view-toggle-btn ${viewMode === 'grid' ? 'active' : ''}`}
                onClick={() => setViewMode('grid')}
                title="Grid Cards View"
                aria-label="Grid Cards View"
              >
                <IconGrid size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content: Table or Grid */}
      {loading && tasks.length === 0 ? (
        <div className="tasks-empty-card">
          <div
            style={{
              width: '36px',
              height: '36px',
              border: '3px solid #e2e8f0',
              borderTopColor: 'var(--primary)',
              borderRadius: '50%',
              animation: 'spin 0.8s linear infinite',
              marginBottom: '1rem'
            }}
          />
          <h3 className="empty-title">Loading workspace tasks...</h3>
          <p className="empty-sub">Connecting to the task management service.</p>
        </div>
      ) : filteredAndSortedTasks.length === 0 ? (
        <div className="tasks-empty-card">
          <div className="empty-icon-wrap">
            <IconTasks size={28} />
          </div>
          <h3 className="empty-title">No tasks found</h3>
          <p className="empty-sub">
            {searchQuery || statusFilter !== 'all' || priorityFilter !== 'all'
              ? 'Try modifying your search or filter criteria to see matching tasks.'
              : 'Get started by creating your very first task in this workspace.'}
          </p>
          <button
            type="button"
            className="btn btn-primary btn-sm"
            onClick={onOpenCreateModal}
          >
            <IconPlus size={16} />
            <span>Create New Task</span>
          </button>
        </div>
      ) : viewMode === 'table' ? (
        <div className="tasks-table-container">
          <div className="tasks-table-wrap">
            <table className="tasks-table">
              <thead>
                <tr>
                  <th>Task ID</th>
                  <th>Task Title</th>
                  <th>Status</th>
                  <th>Priority</th>
                  <th>Assignee</th>
                  <th>Due Date</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedTasks.map((task) => {
                  const overdue = isOverdue(task.dueDate) && task.status !== 'completed';

                  return (
                    <tr key={task.id}>
                      <td className="td-id">{task.id}</td>

                      <td className="td-title-cell">
                        <span
                          className="td-title"
                          onClick={() => onOpenViewModal(task)}
                        >
                          {task.title}
                        </span>
                        {task.description && (
                          <p className="td-desc-preview">{task.description}</p>
                        )}
                      </td>

                      <td>
                        <select
                          className={`status-dropdown-select badge-${task.status}`}
                          value={task.status}
                          onChange={(e) => onChangeStatus(task.id, e.target.value)}
                        >
                          {TASK_STATUSES.map((st) => (
                            <option key={st.id} value={st.id}>
                              {st.label}
                            </option>
                          ))}
                        </select>
                      </td>

                      <td>
                        <span className={`priority-badge priority-${task.priority}`}>
                          {task.priority}
                        </span>
                      </td>

                      <td>
                        <div className="td-assignee">
                          <div className="td-assignee-avatar">
                            {task.assigneeInitials || 'NA'}
                          </div>
                          <span>{task.assignedTo || 'Unassigned'}</span>
                        </div>
                      </td>

                      <td>
                        <div className={`td-due-cell ${overdue ? 'overdue' : ''}`}>
                          <IconCalendar size={14} />
                          <span>{formatDate(task.dueDate)}</span>
                        </div>
                      </td>

                      <td>
                        <div className="td-actions">
                          <button
                            type="button"
                            className="btn-icon"
                            onClick={() => onOpenViewModal(task)}
                            title="View Details"
                            aria-label="View Details"
                          >
                            <IconEye size={16} />
                          </button>
                          <button
                            type="button"
                            className="btn-icon"
                            onClick={() => onOpenEditModal(task)}
                            title="Edit Task"
                            aria-label="Edit Task"
                          >
                            <IconEdit size={16} />
                          </button>
                          <button
                            type="button"
                            className="btn-icon"
                            onClick={() => onOpenDeleteConfirm(task)}
                            title="Delete Task"
                            aria-label="Delete Task"
                          >
                            <IconTrash size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={filteredAndSortedTasks.length}
            pageSize={pageSize}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
          />
        </div>
      ) : (
        /* Grid Cards View */
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

          <div style={{ marginTop: '1.25rem' }}>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={filteredAndSortedTasks.length}
              pageSize={pageSize}
              onPageChange={handlePageChange}
              onPageSizeChange={handlePageSizeChange}
            />
          </div>
        </div>
      )}
    </div>
  );
};
