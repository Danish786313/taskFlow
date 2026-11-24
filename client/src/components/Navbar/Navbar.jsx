import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTasks } from '../../context/TaskContext';
import {
  IconBell,
  IconSearch,
  IconMenu,
  IconClose,
  IconLogout,
  IconSettings,
  IconCheck,
  IconClock,
  IconPlus,
  IconLogo
} from '../Icons/Icons';
import './Navbar.css';

export const Navbar = ({ onToggleSidebar, onOpenCreateModal }) => {
  const { user, logout } = useAuth();
  const { notifications, unreadCount, markAllNotificationsRead, clearNotification, searchQuery, setSearchQuery } = useTasks();
  const navigate = useNavigate();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const notifRef = useRef(null);
  const userRef = useRef(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
      if (userRef.current && !userRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="navbar">
      <div className="navbar-left">
        {/* Mobile Sidebar Hamburger */}
        <button
          type="button"
          className="navbar-toggle-btn"
          onClick={onToggleSidebar}
          aria-label="Toggle navigation menu"
        >
          <IconMenu size={20} />
        </button>

        {/* Brand in Navbar for Mobile */}
        <div className="navbar-mobile-brand">
          <IconLogo size={24} />
          <span className="navbar-mobile-brand-title">TaskFlow</span>
        </div>

        {/* Global Search Bar */}
        {/* <div className="navbar-search">
          <IconSearch size={16} className="search-icon" />
          <input
            type="text"
            placeholder="Search tasks by title, tag, or assignee..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="navbar-search-input"
          />
          {searchQuery && (
            <button
              type="button"
              className="navbar-search-clear"
              onClick={() => setSearchQuery('')}
              aria-label="Clear search"
            >
              <IconClose size={14} />
            </button>
          )}
        </div> */}
      </div>

      <div className="navbar-right">
        {/* Fast Action Create Task Button */}
        <button
          type="button"
          className="btn btn-primary btn-sm navbar-create-btn"
          onClick={onOpenCreateModal}
        >
          <IconPlus size={16} />
          <span>New Task</span>
        </button>

        {/* Notifications Dropdown */}
        {/* <div className="navbar-dropdown-wrapper" ref={notifRef}>
          <button
            type="button"
            className="btn-icon navbar-notif-btn"
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowUserMenu(false);
            }}
            aria-label="Notifications"
          >
            <IconBell size={19} />
            {unreadCount > 0 && (
              <span className="navbar-notif-badge">{unreadCount}</span>
            )}
          </button>

          {showNotifications && (
            <div className="navbar-dropdown notif-panel">
              <div className="notif-header">
                <div>
                  <h4 className="notif-title">Notifications</h4>
                  <span className="notif-subtitle">{unreadCount} unread updates</span>
                </div>
                {unreadCount > 0 && (
                  <button
                    type="button"
                    className="notif-mark-read"
                    onClick={markAllNotificationsRead}
                  >
                    Mark all read
                  </button>
                )}
              </div>

              <div className="notif-list">
                {notifications.length === 0 ? (
                  <div className="notif-empty">No notifications yet</div>
                ) : (
                  notifications.map((item) => (
                    <div
                      key={item.id}
                      className={`notif-item ${item.unread ? 'unread' : ''}`}
                    >
                      <div className="notif-icon-wrap">
                        {item.type === 'review' && <IconClock size={16} color="#d97706" />}
                        {item.type === 'deadline' && <IconClock size={16} color="#e11d48" />}
                        {item.type === 'success' && <IconCheck size={16} color="#059669" />}
                      </div>
                      <div className="notif-item-body">
                        <div className="notif-item-title">{item.title}</div>
                        <div className="notif-item-msg">{item.message}</div>
                        <span className="notif-item-time">{item.time}</span>
                      </div>
                      <button
                        type="button"
                        className="notif-item-dismiss"
                        onClick={() => clearNotification(item.id)}
                        aria-label="Dismiss notification"
                      >
                        <IconClose size={12} />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div> */}

        {/* User Profile Dropdown */}
        <div className="navbar-dropdown-wrapper" ref={userRef}>
          <button
            type="button"
            className="navbar-profile-btn"
            onClick={() => {
              setShowUserMenu(!showUserMenu);
              setShowNotifications(false);
            }}
            aria-label="User menu"
          >
            <div className="navbar-avatar" style={{ backgroundColor: user?.avatarColor || 'var(--primary)' }}>
              {user?.initials || 'U'}
            </div>
            <div className="navbar-user-info">
              <span className="navbar-user-name">{user?.name || 'User'}</span>
              <span className="navbar-user-role">{user?.role || 'Member'}</span>
            </div>
          </button>

          {showUserMenu && (
            <div className="navbar-dropdown user-panel">
              <div className="user-panel-header">
                <p className="user-panel-name">{user?.name}</p>
                <p className="user-panel-email">{user?.email}</p>
              </div>

              <div className="user-panel-menu">
                {/* <button
                  type="button"
                  className="user-menu-item"
                  onClick={() => {
                    setShowUserMenu(false);
                    navigate('/settings');
                  }}
                >
                  <IconSettings size={16} />
                  <span>Account Settings</span>
                </button> */}
                {/* <div className="user-menu-divider" /> */}
                <button
                  type="button"
                  className="user-menu-item user-menu-logout"
                  onClick={handleLogout}
                >
                  <IconLogout size={16} />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
