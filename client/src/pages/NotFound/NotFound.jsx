import React from 'react';
import { Link } from 'react-router-dom';
import { IconLogo, IconDashboard } from '../../components/Icons/Icons';
import './NotFound.css';

export const NotFound = () => {
  return (
    <div className="notfound-container">
      <div className="notfound-card">
        <IconLogo size={48} />
        <h1 className="notfound-code">404</h1>
        <h2 className="notfound-title">Page Not Found</h2>
        <p className="notfound-message">
          The page or route you requested could not be located in this application.
        </p>
        <Link to="/dashboard" className="btn btn-primary notfound-btn">
          <IconDashboard size={18} />
          <span>Return to Dashboard</span>
        </Link>
      </div>
    </div>
  );
};
