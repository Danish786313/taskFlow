import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { validateEmail } from '../../utils/validators';
import { IconLogo, IconCheck } from '../../components/Icons/Icons';
import './Auth.css';

export const ForgotPassword = () => {
  const { forgotPassword, authLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const emailErr = validateEmail(email);
    if (emailErr) {
      setError(emailErr);
      return;
    }

    const res = await forgotPassword(email);
    setSuccessMessage(res.message);
  };

  return (
    <div className="auth-page">
      <div className="auth-mobile-header">
        <IconLogo size={32} />
        <span className="showcase-brand-name" style={{ color: 'var(--text-main)' }}>
          TaskFlow
        </span>
      </div>

      <div className="auth-header">
        <h2 className="auth-title">Reset your password</h2>
        <p className="auth-subtitle">
          Enter your registered email address and we will dispatch a password recovery link.
        </p>
      </div>

      {successMessage ? (
        <div>
          <div className="auth-alert-success">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem', fontWeight: 600 }}>
              <IconCheck size={18} /> Password Reset Dispatched!
            </div>
            {successMessage}
            <div style={{ marginTop: '0.5rem', fontSize: '0.8rem', color: '#047857' }}>
              In a production application, you will receive an email containing a secure token.
            </div>
          </div>

          <Link to="/login" className="btn btn-primary auth-submit-btn" style={{ textAlign: 'center' }}>
            Return to Login
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="auth-form" noValidate>
          <div className="form-group">
            <label htmlFor="reset-email" className="form-label required">
              Email address
            </label>
            <input
              id="reset-email"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (error) setError(null);
              }}
              placeholder="alex.morgan@company.com"
              className={`form-input ${error ? 'is-invalid' : ''}`}
            />
            {error && <span className="form-error">{error}</span>}
          </div>

          <button
            type="submit"
            className="btn btn-primary auth-submit-btn"
            disabled={authLoading}
          >
            {authLoading ? 'Processing Request...' : 'Send Password Reset Link'}
          </button>
        </form>
      )}

      <div className="auth-footer">
        Remembered your password?{' '}
        <Link to="/login" className="auth-link">
          Back to Login
        </Link>
      </div>
    </div>
  );
};
