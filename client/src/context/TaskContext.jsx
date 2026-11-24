import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { taskApi, authApi } from '../services/api';
import { INITIAL_TASKS, TEAM_MEMBERS } from '../data/dummyTasks';
import { INITIAL_NOTIFICATIONS } from '../data/dummyUser';
import { useAuth } from './AuthContext';

const TaskContext = createContext();

export const TaskProvider = ({ children }) => {
  const { isAuthenticated, user } = useAuth();
  const [tasks, setTasks] = useState(INITIAL_TASKS);
  const [teamMembers, setTeamMembers] = useState(TEAM_MEMBERS);
  const [pagination, setPagination] = useState({
    totalItems: INITIAL_TASKS.length,
    currentPage: 1,
    pageSize: 10,
    totalPages: Math.ceil(INITIAL_TASKS.length / 10),
    hasNextPage: false,
    hasPrevPage: false
  });
  const [loading, setLoading] = useState(false);
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);
  const [searchQuery, setSearchQuery] = useState('');
  const [toasts, setToasts] = useState([]);

  // Toast notification management
  const addToast = (message, type = 'success', duration = 3500) => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    const newToast = { id, message, type };
    setToasts((prev) => [...prev, newToast]);

    setTimeout(() => {
      removeToast(id);
    }, duration);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Fetch tasks from API with filters and pagination
  const fetchTasks = useCallback(async (params = {}) => {
    setLoading(true);
    try {
      const res = await taskApi.getTasks(params);
      if (res && res.data) {
        // Normalize task tags
        const normalized = res.data.map((task) => ({
          ...task,
          tags: Array.isArray(task.tags)
            ? task.tags
            : typeof task.tags === 'string' && task.tags.trim()
            ? task.tags.split(',').map((t) => t.trim()).filter(Boolean)
            : []
        }));
        setTasks(normalized);

        if (res.pagination) {
          setPagination(res.pagination);
        }
      }
    } catch (err) {
      console.warn('API getTasks warning (using local tasks):', err.message);
      // Fallback to local tasks state
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch my tasks specifically
  const fetchMyTasks = useCallback(async (params = {}) => {
    setLoading(true);
    try {
      const res = await taskApi.getMyTasks(params);
      if (res && res.data) {
        const normalized = res.data.map((task) => ({
          ...task,
          tags: Array.isArray(task.tags)
            ? task.tags
            : typeof task.tags === 'string' && task.tags.trim()
            ? task.tags.split(',').map((t) => t.trim()).filter(Boolean)
            : []
        }));
        return { tasks: normalized, pagination: res.pagination };
      }
    } catch (err) {
      console.warn('API getMyTasks warning:', err.message);
    } finally {
      setLoading(false);
    }
    return null;
  }, []);

  // Fetch users/team members for dynamic assignee dropdowns
  const fetchUsers = useCallback(async () => {
    try {
      const res = await authApi.getUsers();
      if (res && res.data && res.data.length > 0) {
        setTeamMembers(res.data);
      }
    } catch (err) {
      console.warn('API getUsers warning (using default team members):', err.message);
    }
  }, []);

  // Initialize tasks and dynamic team members on mount or when user authenticates
  useEffect(() => {
    fetchUsers();
    if (isAuthenticated) {
      fetchTasks({ limit: 100 });
    }
  }, [isAuthenticated, fetchTasks, fetchUsers]);

  // Task CRUD operations with API integration
  const createTask = async (taskData) => {
    try {
      const payload = {
        ...taskData,
        assignedTo: taskData.assignedTo || user?.name || 'Unassigned',
        tags: Array.isArray(taskData.tags) ? taskData.tags.join(', ') : taskData.tags
      };

      const res = await taskApi.createTask(payload);
      if (res && res.data) {
        const newTask = {
          ...res.data,
          tags: Array.isArray(res.data.tags)
            ? res.data.tags
            : typeof res.data.tags === 'string'
            ? res.data.tags.split(',').map((t) => t.trim()).filter(Boolean)
            : []
        };
        setTasks((prev) => [newTask, ...prev]);
        addToast(`Task "${newTask.title}" created successfully!`, 'success');
        return newTask;
      }
    } catch (err) {
      console.warn('Backend createTask failed, falling back to local state:', err.message);
    }

    // Fallback local create
    const nextIdNumber = tasks.length > 0
      ? Math.max(...tasks.map((t) => parseInt(String(t.id).replace('TASK-', '') || 100, 10))) + 1
      : 101;

    const initials = taskData.assignedTo
      ? taskData.assignedTo.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
      : 'NA';

    const localNewTask = {
      ...taskData,
      id: `TASK-${nextIdNumber}`,
      assigneeInitials: initials,
      createdAt: new Date().toISOString().split('T')[0],
      tags: Array.isArray(taskData.tags)
        ? taskData.tags
        : typeof taskData.tags === 'string'
        ? taskData.tags.split(',').map((t) => t.trim()).filter(Boolean)
        : ['Task']
    };

    setTasks((prev) => [localNewTask, ...prev]);
    addToast(`Task "${localNewTask.title}" created successfully!`, 'success');
    return localNewTask;
  };

  const updateTask = async (id, updatedFields) => {
    try {
      const payload = {
        ...updatedFields,
        tags: Array.isArray(updatedFields.tags)
          ? updatedFields.tags.join(', ')
          : updatedFields.tags
      };
      await taskApi.updateTask(id, payload);
    } catch (err) {
      console.warn('Backend updateTask warning, updating locally:', err.message);
    }

    // Update local state
    setTasks((prev) =>
      prev.map((task) => {
        if (task.id === id) {
          const initials = updatedFields.assignedTo
            ? updatedFields.assignedTo.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
            : task.assigneeInitials;

          const tags = Array.isArray(updatedFields.tags)
            ? updatedFields.tags
            : typeof updatedFields.tags === 'string'
            ? updatedFields.tags.split(',').map((t) => t.trim()).filter(Boolean)
            : task.tags;

          return {
            ...task,
            ...updatedFields,
            assigneeInitials: initials,
            tags
          };
        }
        return task;
      })
    );
    addToast('Task updated successfully!', 'success');
  };

  const deleteTask = async (id) => {
    try {
      await taskApi.deleteTask(id);
    } catch (err) {
      console.warn('Backend deleteTask warning, deleting locally:', err.message);
    }

    const target = tasks.find((t) => t.id === id);
    setTasks((prev) => prev.filter((t) => t.id !== id));
    addToast(target ? `Task "${target.title}" was deleted.` : 'Task deleted.', 'info');
  };

  const updateTaskStatus = async (id, newStatus) => {
    try {
      await taskApi.updateTask(id, { status: newStatus });
    } catch (err) {
      console.warn('Backend status update warning, updating locally:', err.message);
    }

    setTasks((prev) =>
      prev.map((task) => {
        if (task.id === id) {
          return { ...task, status: newStatus };
        }
        return task;
      })
    );
    addToast(`Task status updated to ${newStatus.replace('_', ' ')}`, 'info');
  };

  // Notification management
  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  };

  const clearNotification = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const unreadCount = useMemo(() => {
    return notifications.filter((n) => n.unread).length;
  }, [notifications]);

  // Statistics calculation for Dashboard
  const stats = useMemo(() => {
    const total = tasks.length;
    const todo = tasks.filter((t) => t.status === 'todo').length;
    const inProgress = tasks.filter((t) => t.status === 'in_progress').length;
    const review = tasks.filter((t) => t.status === 'review').length;
    const completed = tasks.filter((t) => t.status === 'completed').length;
    const highPriority = tasks.filter((t) => t.priority === 'high').length;

    return {
      total,
      todo,
      inProgress,
      review,
      completed,
      highPriority,
      completionRate: total > 0 ? Math.round((completed / total) * 100) : 0
    };
  }, [tasks]);

  return (
    <TaskContext.Provider
      value={{
        tasks,
        loading,
        pagination,
        stats,
        searchQuery,
        setSearchQuery,
        teamMembers,
        fetchUsers,
        toasts,
        addToast,
        removeToast,
        fetchTasks,
        fetchMyTasks,
        createTask,
        updateTask,
        deleteTask,
        updateTaskStatus,
        notifications,
        unreadCount,
        markAllNotificationsRead,
        clearNotification
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};

export const useTasks = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTasks must be used within a TaskProvider');
  }
  return context;
};
