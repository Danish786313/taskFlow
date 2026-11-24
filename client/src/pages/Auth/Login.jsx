import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { validateEmail, validatePassword } from '../../utils/validators';
import { IconLogo } from '../../components/Icons/Icons';
import './Auth.css';

export const Login = () => {
  const { login, authLoading } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: true
  });

  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
    if (formError) setFormError('');
  };

  const handleFillDemo = () => {
    setFormData({
      email: 'alex.morgan@taskflow.dev',
      password: 'password123',
      rememberMe: true
    });
    setErrors({});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const emailErr = validateEmail(formData.email);
    const passErr = validatePassword(formData.password, 6);

    if (emailErr || passErr) {
      setErrors({
        email: emailErr,
        password: passErr
      });
      return;
    }

    try {
      await login(formData.email, formData.password);
      navigate('/dashboard');
    } catch (err) {
      setFormError(err.message || 'Invalid email or password. Please try again.');
    }
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
        <h2 className="auth-title">Welcome back</h2>
        <p className="auth-subtitle">
          Enter your credentials to access your task dashboard and team workspace.
        </p>
      </div>

      {formError && (
        <div className="form-error-banner" style={{ marginBottom: '1rem', color: '#dc2626' }}>
          {formError}
        </div>
      )}

      <form onSubmit={handleSubmit} className="auth-form" noValidate>
        <div className="form-group">
          <label htmlFor="login-email" className="form-label required">
            Email address
          </label>
          <input
            id="login-email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="alex.morgan@company.com"
            className={`form-input ${errors.email ? 'is-invalid' : ''}`}
            autoComplete="email"
          />
          {errors.email && <span className="form-error">{errors.email}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="login-password" className="form-label required">
            Password
          </label>
          <input
            id="login-password"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="••••••••"
            className={`form-input ${errors.password ? 'is-invalid' : ''}`}
            autoComplete="current-password"
          />
          {errors.password && <span className="form-error">{errors.password}</span>}
        </div>

        <div className="auth-extra-row">
          <label className="auth-checkbox-label">
            <input
              type="checkbox"
              name="rememberMe"
              checked={formData.rememberMe}
              onChange={handleChange}
            />
            <span>Remember me for 30 days</span>
          </label>

          {/* <Link to="/forgot-password" className="auth-link">
            Forgot password?
          </Link> */}
        </div>

        <button
          type="submit"
          className="btn btn-primary auth-submit-btn"
          disabled={authLoading}
        >
          {authLoading ? 'Signing in...' : 'Sign in to Account'}
        </button>

        {/* Demo Credentials quick fill */}
        <div className="auth-divider">
          <span>Demo Access</span>
        </div>

        <div className="auth-demo-box">
          <div className="auth-demo-text">
            <strong>Quick Evaluation:</strong> Click below to populate demo account details instantly.
          </div>
          <button
            type="button"
            className="auth-demo-btn"
            onClick={handleFillDemo}
          >
            Auto Fill
          </button>
        </div>
      </form>

      <div className="auth-footer">
        Don&apos;t have an account yet?{' '}
        <Link to="/signup" className="auth-link">
          Create an account
        </Link>
      </div>
    </div>
  );
};
