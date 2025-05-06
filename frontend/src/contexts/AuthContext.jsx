import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

// Create Axios instance with base URL and defaults
const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
    headers: {
        'Content-Type': 'application/json'
    }
});

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Load user from localStorage on mount
    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    // Function to determine redirect path based on role_id
    const getRoleBasedRedirect = () => {
        if (!user) return '/';

        // Check role_id or role property
        const roleId = user.role_id || (user.role === 'ADMIN' ? 1 : user.role === 'SALESPERSON' ? 2 : user.role === 'INVENTORY' ? 3 : 0);

        switch (roleId) {
            case 1:
                return '/admin'; // Admin dashboard
            case 2:
                return '/sales'; // Sales dashboard
            case 3:
                return '/inventory'; // Inventory dashboard
            default:
                return '/'; // Default to login page
        }
    };

    // Add this function to get a human-readable role label
    const getRoleLabel = (roleId) => {
        switch (roleId) {
            case 1:
                return 'Quản trị viên';
            case 2:
                return 'Nhân viên bán hàng';
            case 3:
                return 'Nhân viên thủ kho';
            default:
                return 'Người dùng';
        }
    };

    // Login function
    const login = async (username, password) => {
        try {
            // For testing purpose - mock auth
            if (username === 'admin' && password === 'admin123') {
                const userData = {
                    id: 1,
                    username: 'admin',
                    full_name: 'Administrator',
                    role_id: 1
                };
                console.log("Mock login as admin successful");
                localStorage.setItem('user', JSON.stringify(userData));
                setUser(userData);
                return userData;
            } else if (username === 'sales' && password === 'sales123') {
                const userData = {
                    id: 2,
                    username: 'sales',
                    full_name: 'Sales Staff',
                    role_id: 2
                };
                console.log("Mock login as sales successful");
                localStorage.setItem('user', JSON.stringify(userData));
                setUser(userData);
                return userData;
            } else if (username === 'inventory' && password === 'inventory123') {
                const userData = {
                    id: 3,
                    username: 'inventory',
                    full_name: 'Inventory Staff',
                    role_id: 3
                };
                console.log("Mock login as inventory successful");
                localStorage.setItem('user', JSON.stringify(userData));
                setUser(userData);
                return userData;
            }

            // Real API authentication
            console.log("Attempting login to API");
            const response = await api.post('/auth/login', { username, password });

            if (!response.data) {
                throw new Error('No data received from server');
            }

            const userData = response.data.user || response.data;
            console.log("Login successful, user data:", userData);

            localStorage.setItem('user', JSON.stringify(userData));
            setUser(userData);

            return userData;
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    };

    // Logout function
    const logout = () => {
        localStorage.removeItem('user');
        setUser(null);
    };

    const value = {
        user,
        loading,
        login,
        logout,
        getRoleBasedRedirect,
        getRoleLabel // Add this to the context value
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export default AuthContext;