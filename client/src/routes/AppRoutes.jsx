import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

import { DashboardLayout } from '../layouts/DashboardLayout';
import { AuthLayout } from '../layouts/AuthLayout';

import { Login } from '../pages/Auth/Login';
import { Signup } from '../pages/Auth/Signup';
import { ForgotPassword } from '../pages/Auth/ForgotPassword';

import { Dashboard } from '../pages/Dashboard/Dashboard';
import { AllTasks } from '../pages/Tasks/AllTasks';
import { MyTasks } from '../pages/Tasks/MyTasks';
import { CompletedTasks } from '../pages/Tasks/CompletedTasks';
import { Settings } from '../pages/Settings/Settings';
import { NotFound } from '../pages/NotFound/NotFound';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isInitializing } = useAuth();

  if (isInitializing) {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh',
          backgroundColor: 'var(--bg-app)',
          color: 'var(--text-secondary)',
          gap: '1rem'
        }}
      >
        <div
          style={{
            width: '40px',
            height: '40px',
            border: '3px solid #e2e8f0',
            borderTopColor: 'var(--primary)',
            borderRadius: '50%',
            animation: 'spin 0.8s linear infinite'
          }}
        />
        <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>
          Authenticating workspace...
        </span>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

// Route wrapper for public auth pages
const PublicRoute = ({ children }) => {
  const { isAuthenticated, isInitializing } = useAuth();

  if (isInitializing) {
    return null;
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Root redirect */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />

      {/* Public Auth Routes */}
      <Route
        element={
          <PublicRoute>
            <AuthLayout />
          </PublicRoute>
        }
      >
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
      </Route>

      {/* Protected Workspace / Dashboard Routes */}
      <Route
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/tasks" element={<AllTasks />} />
        <Route path="/my-tasks" element={<MyTasks />} />
        <Route path="/completed-tasks" element={<CompletedTasks />} />
        <Route path="/settings" element={<Settings />} />
      </Route>

      {/* 404 Catch-All */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};
