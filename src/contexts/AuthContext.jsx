import React, { createContext, useContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService';

// Tạo context để quản lý authentication
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Kiểm tra nếu người dùng đã đăng nhập trước đó
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        
        if (token) {
          // Kiểm tra token có hợp lệ không
          const userData = await authService.validateToken(token);
          console.log("Token validation result:", userData);
          setUser(userData);
        }
      } catch (err) {
        console.error("Token validation error:", err);
        localStorage.removeItem('token');
        setError(err.message || "Lỗi xác thực");
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  // Function đăng nhập
  const login = async (username, password) => {
    setError(null);
    try {
      setLoading(true);
      const response = await authService.login(username, password);
      console.log("Login response:", response);
      localStorage.setItem('token', response.token);
      setUser(response.user);
      navigate('/books');
      return response.user;
    } catch (err) {
      console.error("Login error:", err);
      setError(err.message || 'Đăng nhập thất bại');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Function đăng xuất
  const logout = () => {
    try {
      localStorage.removeItem('token');
      setUser(null);
      navigate('/login');
    } catch (err) {
      console.error("Logout error:", err);
      setError(err.message || 'Đăng xuất thất bại');
    }
  };

  // Debug
  useEffect(() => {
    console.log("Auth state updated:", { user, loading, error });
  }, [user, loading, error]);

  const value = {
    user,
    loading,
    error,
    login,
    logout,
    isAuthenticated: !!user
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired
};

// Hook để sử dụng AuthContext
export const useAuth = () => {
  try {
    const context = useContext(AuthContext);
    if (context === undefined) {
      throw new Error('useAuth phải được sử dụng trong AuthProvider');
    }
    return context;
  } catch (error) {
    console.error("Error using auth context:", error);
    // Fallback để tránh crash ứng dụng
    return {
      user: null,
      loading: false,
      error: error.message,
      login: () => Promise.reject(error),
      logout: () => {},
      isAuthenticated: false
    };
  }
};

export default AuthContext;