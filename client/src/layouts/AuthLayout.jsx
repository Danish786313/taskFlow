import React from 'react';
import { Outlet } from 'react-router-dom';
import { IconLogo, IconCheck } from '../components/Icons/Icons';
import './AuthLayout.css';

export const AuthLayout = () => {
  return (
    <div className="auth-layout">
      {/* Left decorative brand showcase panel */}
      <div className="auth-showcase-panel">
        <div className="showcase-content">
          <div className="showcase-brand">
            <IconLogo size={36} />
            <span className="showcase-brand-name">TaskFlow</span>
          </div>

          <div className="showcase-hero">
            <h1 className="showcase-heading">
              Streamline project workflows with clarity and precision.
            </h1>
            <p className="showcase-subheading">
              A modern frontend skeleton equipped with interactive Kanban boards,
              instant CRUD operations, and responsive task tracking.
            </p>

            <div className="showcase-feature-list">
              <div className="showcase-feature-item">
                <div className="feature-icon-circle">
                  <IconCheck size={16} />
                </div>
                <span>Intuitive Kanban boards with instant column movement</span>
              </div>
              <div className="showcase-feature-item">
                <div className="feature-icon-circle">
                  <IconCheck size={16} />
                </div>
                <span>Comprehensive task CRUD with priority and due date alerts</span>
              </div>
              <div className="showcase-feature-item">
                <div className="feature-icon-circle">
                  <IconCheck size={16} />
                </div>
                <span>Ready for backend REST or GraphQL API integration</span>
              </div>
            </div>
          </div>

          <div className="showcase-footer">
            <span>© 2026 TaskFlow Inc. Frontend Architecture Demo.</span>
          </div>
        </div>
      </div>

      {/* Right Form Container */}
      <div className="auth-form-panel">
        <div className="auth-card-wrapper">
          <Outlet />
        </div>
      </div>
    </div>
  );
};
