import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  validateEmail,
  validatePassword,
  validateConfirmPassword,
  validateRequired
} from '../../utils/validators';
import { IconLogo } from '../../components/Icons/Icons';
import './Auth.css';

export const Signup = () => {
  const { signup, authLoading } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeTerms: true
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    const nameErr = validateRequired(formData.name, 'Full name');
    const emailErr = validateEmail(formData.email);
    const passErr = validatePassword(formData.password, 6);
    const confirmErr = validateConfirmPassword(formData.password, formData.confirmPassword);

    if (nameErr || emailErr || passErr || confirmErr) {
      setErrors({
        name: nameErr,
        email: emailErr,
        password: passErr,
        confirmPassword: confirmErr
      });
      return;
    }

    try {
      await signup(formData.name, formData.email, formData.password);
      navigate('/dashboard');
    } catch (err) {
      setFormError(err.message || 'Registration failed. Please check your information.');
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
        <h2 className="auth-title">Create your account</h2>
        <p className="auth-subtitle">
          Join thousands of developers and teams organizing their projects in TaskFlow.
        </p>
      </div>

      {formError && (
        <div className="form-error-banner" style={{ marginBottom: '1rem', color: '#dc2626', backgroundColor: '#fee2e2', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', fontSize: '0.85rem' }}>
          {formError}
        </div>
      )}

      <form onSubmit={handleSubmit} className="auth-form" noValidate>
        <div className="form-group">
          <label htmlFor="signup-name" className="form-label required">
            Full Name
          </label>
          <input
            id="signup-name"
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Sarah Chen"
            className={`form-input ${errors.name ? 'is-invalid' : ''}`}
            autoComplete="name"
          />
          {errors.name && <span className="form-error">{errors.name}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="signup-email" className="form-label required">
            Email address
          </label>
          <input
            id="signup-email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="sarah.chen@company.com"
            className={`form-input ${errors.email ? 'is-invalid' : ''}`}
            autoComplete="email"
          />
          {errors.email && <span className="form-error">{errors.email}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="signup-password" className="form-label required">
            Password (min. 6 characters)
          </label>
          <input
            id="signup-password"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="••••••••"
            className={`form-input ${errors.password ? 'is-invalid' : ''}`}
            autoComplete="new-password"
          />
          {errors.password && <span className="form-error">{errors.password}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="signup-confirmPassword" className="form-label required">
            Confirm Password
          </label>
          <input
            id="signup-confirmPassword"
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="••••••••"
            className={`form-input ${errors.confirmPassword ? 'is-invalid' : ''}`}
            autoComplete="new-password"
          />
          {errors.confirmPassword && (
            <span className="form-error">{errors.confirmPassword}</span>
          )}
        </div>

        <button
          type="submit"
          className="btn btn-primary auth-submit-btn"
          disabled={authLoading}
        >
          {authLoading ? 'Setting up workspace...' : 'Create Free Account'}
        </button>
      </form>

      <div className="auth-footer">
        Already have an account?{' '}
        <Link to="/login" className="auth-link">
          Sign in
        </Link>
      </div>
    </div>
  );
};
