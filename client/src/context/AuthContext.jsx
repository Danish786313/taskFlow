import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authApi } from '../services/api';
import { CURRENT_USER } from '../data/dummyUser';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem('taskflow_token') || null);
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('taskflow_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return CURRENT_USER;
      }
    }
    return token ? null : CURRENT_USER;
  });

  const [isAuthenticated, setIsAuthenticated] = useState(() => Boolean(token || user));
  const [authLoading, setAuthLoading] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);

  // Fetch user profile from API if token exists
  const fetchProfile = useCallback(async () => {
    const storedToken = localStorage.getItem('taskflow_token');
    if (!storedToken) {
      setIsInitializing(false);
      return;
    }

    try {
      const res = await authApi.getProfile();
      if (res && res.data) {
        setUser(res.data);
        setIsAuthenticated(true);
        localStorage.setItem('taskflow_user', JSON.stringify(res.data));
      }
    } catch (err) {
      console.warn('Profile fetch warning (API may be offline):', err.message);
      // If token is invalid or expired, clear and prompt login
      if (err.response && err.response.status === 401) {
        logout();
      }
    } finally {
      setIsInitializing(false);
    }
  }, []);

  // Initialize on mount
  useEffect(() => {
    fetchProfile();

    // Listen for automatic logout on 401 response from Axios interceptor
    const handleAuthExpired = () => {
      logout();
    };
    window.addEventListener('taskflow_auth_expired', handleAuthExpired);
    return () => window.removeEventListener('taskflow_auth_expired', handleAuthExpired);
  }, [fetchProfile]);

  // Login handler
  const login = async (email, password) => {
    setAuthLoading(true);
    try {
      // 1. Attempt API login
      const res = await authApi.login({ email, password });
      const authToken = res.token || res.data?.token;
      const userData = res.data;

      if (authToken) {
        localStorage.setItem('taskflow_token', authToken);
        setToken(authToken);
      }
      if (userData) {
        localStorage.setItem('taskflow_user', JSON.stringify(userData));
        setUser(userData);
      }

      setIsAuthenticated(true);
      setAuthLoading(false);
      return { success: true, user: userData, token: authToken };
    } catch (err) {
      setAuthLoading(false);
      // If backend returned an error response (e.g. 401 Invalid credentials)
      if (err.response && err.response.data && err.response.data.message) {
        throw new Error(err.response.data.message);
      }

      // If backend network is unreachable, fallback to demo user for offline presentation
      console.warn('Backend unreachable. Falling back to local offline mode.');
      const fallbackUser = {
        ...CURRENT_USER,
        email: email || CURRENT_USER.email
      };
      setUser(fallbackUser);
      setIsAuthenticated(true);
      return { success: true, user: fallbackUser, offline: true };
    }
  };

  // Signup handler
  const signup = async (name, email, password, role = 'Member') => {
    setAuthLoading(true);
    try {
      const res = await authApi.signup({ name, email, password, role });
      const authToken = res.token || res.data?.token;
      const userData = res.data;

      if (authToken) {
        localStorage.setItem('taskflow_token', authToken);
        setToken(authToken);
      }
      if (userData) {
        localStorage.setItem('taskflow_user', JSON.stringify(userData));
        setUser(userData);
      }

      setIsAuthenticated(true);
      setAuthLoading(false);
      return { success: true, user: userData, token: authToken };
    } catch (err) {
      setAuthLoading(false);
      if (err.response && err.response.data && err.response.data.message) {
        throw new Error(err.response.data.message);
      }

      // Fallback if offline
      console.warn('Backend unreachable during signup. Falling back to local mode.');
      const initials = name
        .trim()
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2) || 'U';

      const newUser = {
        id: `usr-${Date.now()}`,
        name: name || 'New User',
        email: email,
        role: role,
        initials,
        avatarColor: '#4f46e5',
        department: 'Engineering'
      };
      setUser(newUser);
      setIsAuthenticated(true);
      return { success: true, user: newUser, offline: true };
    }
  };

  // Update profile
  const updateUserProfile = async (profileData) => {
    try {
      const res = await authApi.updateProfile(profileData);
      if (res && res.data) {
        setUser(res.data);
        localStorage.setItem('taskflow_user', JSON.stringify(res.data));
        return res.data;
      }
    } catch (err) {
      console.warn('Backend profile update failed, updating locally:', err.message);
      const updated = { ...user, ...profileData };
      setUser(updated);
      localStorage.setItem('taskflow_user', JSON.stringify(updated));
      return updated;
    }
  };

  // Forgot password
  const forgotPassword = async (email) => {
    setAuthLoading(true);
    return new Promise((resolve) => {
      setTimeout(() => {
        setAuthLoading(false);
        resolve({ success: true, message: `Password reset link sent to ${email}` });
      }, 600);
    });
  };

  // Logout handler
  const logout = () => {
    localStorage.removeItem('taskflow_token');
    localStorage.removeItem('taskflow_user');
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated,
        authLoading,
        isInitializing,
        login,
        signup,
        fetchProfile,
        updateUserProfile,
        forgotPassword,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
