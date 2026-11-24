import React from 'react';
import './StatCard.css';

export const StatCard = ({
  title,
  value,
  icon,
  iconBg = 'var(--primary-light)',
  iconColor = 'var(--primary)',
  badgeText,
  badgeType = 'neutral', // 'success' | 'warning' | 'info' | 'neutral'
  subtitle
}) => {
  return (
    <div className="stat-card">
      <div className="stat-card-top">
        <span className="stat-card-title">{title}</span>
        <div
          className="stat-card-icon-wrap"
          style={{ backgroundColor: iconBg, color: iconColor }}
        >
          {icon}
        </div>
      </div>

      <div className="stat-card-main">
        <h3 className="stat-card-value">{value}</h3>
        {badgeText && (
          <span className={`stat-card-badge badge-${badgeType}`}>
            {badgeText}
          </span>
        )}
      </div>

      {subtitle && <p className="stat-card-subtitle">{subtitle}</p>}
    </div>
  );
};
