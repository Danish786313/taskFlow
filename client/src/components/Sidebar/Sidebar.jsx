import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTasks } from '../../context/TaskContext';
import {
  IconDashboard,
  IconTasks,
  IconMyTasks,
  IconCompleted,
  IconSettings,
  IconPlus,
  IconLogout,
  IconLogo,
  IconClose
} from '../Icons/Icons';
import { ConfirmDialog } from '../ConfirmDialog/ConfirmDialog';
import './Sidebar.css';

export const Sidebar = ({ isOpen, onCloseMobile, onOpenCreateModal }) => {
  const { user, logout } = useAuth();
  const { stats, tasks } = useTasks();
  const navigate = useNavigate();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  // Compute counts for active badges
  const myTasksCount = tasks.filter(
    (t) => t.assignedTo && user?.name && t.assignedTo.toLowerCase() === user.name.toLowerCase()
  ).length;

  const handleConfirmLogout = () => {
    setShowLogoutConfirm(false);
    logout();
    navigate('/login');
  };

  const navItems = [
    {
      to: '/dashboard',
      label: 'Dashboard',
      icon: <IconDashboard size={19} />,
      badge: null
    },
    {
      to: '/tasks',
      label: 'All Tasks',
      icon: <IconTasks size={19} />,
      badge: stats.total
    },
    {
      to: '/my-tasks',
      label: 'My Tasks',
      icon: <IconMyTasks size={19} />,
      badge: myTasksCount
    },
    {
      to: '/completed-tasks',
      label: 'Completed Tasks',
      icon: <IconCompleted size={19} />,
      badge: stats.completed
    },
    {
      to: '/settings',
      label: 'Settings',
      icon: <IconSettings size={19} />,
      badge: null
    }
  ];

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpen && <div className="sidebar-mobile-overlay" onClick={onCloseMobile} />}

      <aside className={`sidebar ${isOpen ? 'sidebar-open' : ''}`}>
        {/* Brand Header */}
        <div className="sidebar-brand-wrapper">
          <div className="sidebar-brand">
            <IconLogo size={32} />
            <div className="sidebar-brand-text">
              <span className="sidebar-brand-name">TaskFlow</span>
              <span className="sidebar-brand-tagline">Project Workspace</span>
            </div>
          </div>
          <button
            type="button"
            className="sidebar-close-btn"
            onClick={onCloseMobile}
            aria-label="Close sidebar"
          >
            <IconClose size={20} />
          </button>
        </div>

        {/* Quick Action Button */}
        <div className="sidebar-action-wrap">
          <button
            type="button"
            className="btn btn-primary sidebar-new-task-btn"
            onClick={() => {
              if (onCloseMobile) onCloseMobile();
              onOpenCreateModal();
            }}
          >
            <IconPlus size={18} />
            <span>Create New Task</span>
          </button>
        </div>

        {/* Navigation Links */}
        <div className="sidebar-nav-section">
          <span className="sidebar-section-title">Navigation</span>
          <nav className="sidebar-nav">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={onCloseMobile}
                className={({ isActive }) =>
                  `sidebar-link ${isActive ? 'active' : ''}`
                }
              >
                <span className="sidebar-link-icon">{item.icon}</span>
                <span className="sidebar-link-label">{item.label}</span>
                {item.badge !== null && (
                  <span className="sidebar-link-badge">{item.badge}</span>
                )}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Sidebar Summary Card */}
        {/* <div className="sidebar-summary-card">
          <div className="summary-card-header">
            <span className="summary-card-title">Sprint Progress</span>
            <span className="summary-card-percent">{stats.completionRate}%</span>
          </div>
          <div className="summary-progress-bar">
            <div
              className="summary-progress-fill"
              style={{ width: `${stats.completionRate}%` }}
            />
          </div>
          <span className="summary-card-sub">
            {stats.completed} of {stats.total} tasks completed
          </span>
        </div> */}

        {/* User Mini Bar & Logout */}
        <div className="sidebar-footer">
          <div className="sidebar-user">
            <div
              className="sidebar-user-avatar"
              style={{ backgroundColor: user?.avatarColor || 'var(--primary)' }}
            >
              {user?.initials || 'U'}
            </div>
            <div className="sidebar-user-details">
              <span className="sidebar-user-name">{user?.name || 'Guest'}</span>
              <span className="sidebar-user-email">{user?.email || 'guest@demo.com'}</span>
            </div>
          </div>
          <button
            type="button"
            className="sidebar-logout-btn"
            onClick={() => setShowLogoutConfirm(true)}
            title="Sign Out"
            aria-label="Sign Out"
          >
            <IconLogout size={18} />
          </button>
        </div>
      </aside>

      {/* Logout Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showLogoutConfirm}
        title="Sign Out of TaskFlow?"
        message="You will be returned to the login screen. Any unsaved changes in active forms will be discarded."
        confirmText="Sign Out"
        confirmVariant="danger"
        onConfirm={handleConfirmLogout}
        onCancel={() => setShowLogoutConfirm(false)}
      />
    </>
  );
};
