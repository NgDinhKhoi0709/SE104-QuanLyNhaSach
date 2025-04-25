import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check if user is logged in from localStorage
        const storedUser = localStorage.getItem('user');
        const token = localStorage.getItem('token');

        if (storedUser && token) {
            setUser(JSON.parse(storedUser));
        }

        setLoading(false);
    }, []);

    const login = async (username, password) => {
        try {
            console.log('Attempting login for user:', username);
            const response = await axios.post(`${API_URL}/auth/login`, {
                username,
                password
            });

            console.log('Login response:', response.data);
            const { user, token } = response.data;

            // Save to state
            setUser(user);

            // Save to localStorage
            localStorage.setItem('user', JSON.stringify(user));
            localStorage.setItem('token', token);

            return user;
        } catch (error) {
            console.error('Login error details:', {
                message: error.message,
                response: error.response?.data,
                status: error.response?.status
            });
            throw new Error(error.response?.data?.message || 'Đăng nhập thất bại');
        }
    };

    const logout = () => {
        // Clear user from state
        setUser(null);

        // Clear localStorage
        localStorage.removeItem('user');
        localStorage.removeItem('token');
    };

    const getRoleBasedRedirect = () => {
        if (!user) return '/';

        switch (user.role_id) {
            case 1:
                return '/admin';
            case 2:
                return '/sales';
            case 3:
                return '/warehouse';
            default:
                return '/dashboard';
        }
    };

    const value = {
        user,
        loading,
        login,
        logout,
        getRoleBasedRedirect,
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
