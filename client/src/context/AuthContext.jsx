import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('nexstore_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('nexstore_token') || null);
  const [loading, setLoading] = useState(true);

  // Set default authorization header for axios whenever token changes
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      localStorage.setItem('nexstore_token', token);
    } else {
      delete axios.defaults.headers.common['Authorization'];
      localStorage.removeItem('nexstore_token');
    }
  }, [token]);

  // Verify stored token on initial app load
  useEffect(() => {
    const verifyUser = async () => {
      const storedToken = localStorage.getItem('nexstore_token');
      if (storedToken) {
        try {
          const res = await axios.get('/api/auth/me', {
            headers: { Authorization: `Bearer ${storedToken}` },
          });
          if (res.data?.success) {
            setUser(res.data.user);
            localStorage.setItem('nexstore_user', JSON.stringify(res.data.user));
          }
        } catch (error) {
          console.warn('[AuthContext] Session expired, clearing local credentials.');
          logout();
        }
      }
      setLoading(false);
    };

    verifyUser();
  }, []);

  /**
   * Log in user with email & password
   */
  const login = async (email, password) => {
    const res = await axios.post('/api/auth/login', { email, password });
    if (res.data?.success) {
      const { token: receivedToken, user: receivedUser } = res.data;
      setToken(receivedToken);
      setUser(receivedUser);
      localStorage.setItem('nexstore_token', receivedToken);
      localStorage.setItem('nexstore_user', JSON.stringify(receivedUser));
      return { success: true, user: receivedUser };
    }
    throw new Error(res.data?.message || 'Login failed');
  };

  /**
   * Register customer or vendor
   */
  const register = async (formData) => {
    const res = await axios.post('/api/auth/register', formData);
    if (res.data?.success) {
      const { token: receivedToken, user: receivedUser } = res.data;
      setToken(receivedToken);
      setUser(receivedUser);
      localStorage.setItem('nexstore_token', receivedToken);
      localStorage.setItem('nexstore_user', JSON.stringify(receivedUser));
      return { success: true, user: receivedUser };
    }
    throw new Error(res.data?.message || 'Registration failed');
  };

  /**
   * Log out user and wipe local storage
   */
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('nexstore_token');
    localStorage.removeItem('nexstore_user');
    delete axios.defaults.headers.common['Authorization'];
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        role: user?.role || null,
        loading,
        login,
        register,
        logout,
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

export default AuthContext;
