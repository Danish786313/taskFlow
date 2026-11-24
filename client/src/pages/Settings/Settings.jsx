import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTasks } from '../../context/TaskContext';
import './Settings.css';

export const Settings = () => {
  const { user, updateUserProfile } = useAuth();
  const { addToast } = useTasks();

  const [activeTab, setActiveTab] = useState('profile'); // 'profile' | 'notifications' | 'preferences'

  const [profileData, setProfileData] = useState({
    name: user?.name || 'Alex Morgan',
    email: user?.email || 'alex.morgan@taskflow.dev',
    role: user?.role || 'Frontend Lead & Admin',
    department: user?.department || 'Product Engineering',
    location: user?.location || 'San Francisco, CA',
    bio: user?.bio || 'Building intuitive digital experiences and robust frontend architectures.'
  });

  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || '',
        email: user.email || '',
        role: user.role || '',
        department: user.department || '',
        location: user.location || '',
        bio: user.bio || ''
      });
    }
  }, [user]);

  const [notifPreferences, setNotifPreferences] = useState({
    emailDueDates: true,
    taskAssigned: true,
    weeklyDigest: false,
    soundAlerts: true
  });

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({ ...prev, [name]: value }));
  };

  const handleToggleNotif = (key) => {
    setNotifPreferences((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await updateUserProfile(profileData);
      addToast('Profile settings saved successfully!', 'success');
    } catch (err) {
      addToast(err.message || 'Failed to update profile', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveNotifs = (e) => {
    e.preventDefault();
    addToast('Notification preferences updated!', 'success');
  };

  return (
    <div className="settings-page">
      <div className="settings-header">
        <h1 className="settings-title">Workspace Settings</h1>
        <p className="settings-subtitle">
          Manage your account profile, workspace preferences, and notification rules.
        </p>
      </div>

      {/* Tabs */}
      <div className="settings-tabs">
        <button
          type="button"
          className={`settings-tab-btn ${activeTab === 'profile' ? 'active' : ''}`}
          onClick={() => setActiveTab('profile')}
        >
          Profile
        </button>
        {/* <button
          type="button"
          className={`settings-tab-btn ${activeTab === 'notifications' ? 'active' : ''}`}
          onClick={() => setActiveTab('notifications')}
        >
          Notifications
        </button>
        <button
          type="button"
          className={`settings-tab-btn ${activeTab === 'preferences' ? 'active' : ''}`}
          onClick={() => setActiveTab('preferences')}
        >
          Workspace
        </button> */}
      </div>

      {/* Profile Tab */}
      {activeTab === 'profile' && (
        <div className="settings-card">
          <div className="settings-card-header">
            <h3 className="card-section-title">Personal Information</h3>
            <p className="card-section-sub">
              Update your public display information and identity details.
            </p>
          </div>

          <form onSubmit={handleSaveProfile} className="settings-form">
            <div className="profile-avatar-row">
              <div
                className="profile-avatar-large"
                style={{ backgroundColor: user?.avatarColor || 'var(--primary)' }}
              >
                {user?.initials || 'AM'}
              </div>
              <div className="profile-avatar-meta">
                <span className="avatar-meta-title">{profileData.name}</span>
                <span className="avatar-meta-sub">{profileData.role}</span>
              </div>
            </div>

            <div className="form-row-2">
              <div className="form-group">
                <label htmlFor="settings-name" className="form-label">
                  Full Name
                </label>
                <input
                  id="settings-name"
                  type="text"
                  name="name"
                  value={profileData.name}
                  onChange={handleProfileChange}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label htmlFor="settings-email" className="form-label">
                  Email Address
                </label>
                <input
                  id="settings-email"
                  type="email"
                  name="email"
                  value={profileData.email}
                  onChange={handleProfileChange}
                  className="form-input"
                />
              </div>
            </div>

            <div className="form-row-2">
              <div className="form-group">
                <label htmlFor="settings-role" className="form-label">
                  Role / Title
                </label>
                <input
                  id="settings-role"
                  type="text"
                  name="role"
                  value={profileData.role}
                  onChange={handleProfileChange}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label htmlFor="settings-department" className="form-label">
                  Department
                </label>
                <input
                  id="settings-department"
                  type="text"
                  name="department"
                  value={profileData.department}
                  onChange={handleProfileChange}
                  className="form-input"
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="settings-bio" className="form-label">
                Bio
              </label>
              <textarea
                id="settings-bio"
                name="bio"
                rows={3}
                value={profileData.bio}
                onChange={handleProfileChange}
                className="form-textarea"
              />
            </div>

            <div className="settings-actions">
              <button type="submit" className="btn btn-primary" disabled={isSaving}>
                {isSaving ? 'Saving Changes...' : 'Save Profile Changes'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Notifications Tab */}
      {activeTab === 'notifications' && (
        <div className="settings-card">
          <div className="settings-card-header">
            <h3 className="card-section-title">Notification Preferences</h3>
            <p className="card-section-sub">
              Control when and how you receive alerts and project updates.
            </p>
          </div>

          <form onSubmit={handleSaveNotifs} className="settings-form">
            <div className="preference-list">
              <label className="preference-item">
                <div className="preference-info">
                  <span className="preference-title">Task Due Date Alerts</span>
                  <span className="preference-sub">
                    Receive notifications 24 hours prior to a task deadline.
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={notifPreferences.emailDueDates}
                  onChange={() => handleToggleNotif('emailDueDates')}
                  className="preference-checkbox"
                />
              </label>

              <label className="preference-item">
                <div className="preference-info">
                  <span className="preference-title">Task Assignment</span>
                  <span className="preference-sub">
                    Notify when a teammate assigns a task to you.
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={notifPreferences.taskAssigned}
                  onChange={() => handleToggleNotif('taskAssigned')}
                  className="preference-checkbox"
                />
              </label>

              <label className="preference-item">
                <div className="preference-info">
                  <span className="preference-title">Weekly Sprint Digest</span>
                  <span className="preference-sub">
                    Summary of completed tasks sent every Monday morning.
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={notifPreferences.weeklyDigest}
                  onChange={() => handleToggleNotif('weeklyDigest')}
                  className="preference-checkbox"
                />
              </label>
            </div>

            <div className="settings-actions">
              <button type="submit" className="btn btn-primary">
                Save Preferences
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Workspace Tab */}
      {activeTab === 'preferences' && (
        <div className="settings-card">
          <div className="settings-card-header">
            <h3 className="card-section-title">Workspace Configuration</h3>
            <p className="card-section-sub">
              General display settings and integration contracts.
            </p>
          </div>

          <div className="settings-info-box">
            <h4>Backend Integration Readiness</h4>
            <p>
              This application has been structured with clean state management, modular components,
              and decoupled utility contracts. It is ready to connect with Node.js/Express,
              Prisma, or MongoDB backends.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
