import React, { createContext, useContext, useState, useEffect } from 'react';
import authService from '../services/authService';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);    // Load user from localStorage on mount
    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        const storedToken = localStorage.getItem('token');
        
        if (storedUser) {
            try {
                const parsed = JSON.parse(storedUser);
                // Kiểm tra có phải object user hợp lệ không
                if (parsed && typeof parsed === "object" && (parsed.id || parsed.username)) {
                    // Nếu có token, kiểm tra trạng thái tài khoản trên server
                    if (storedToken) {
                        authService.validateToken()
                            .then(serverUser => {
                                // Nếu tài khoản đã bị khóa, đăng xuất
                                if (serverUser.is_active === 0) {
                                    localStorage.removeItem('user');
                                    localStorage.removeItem('token');
                                    setUser(null);
                                    alert('Tài khoản của bạn đã bị khóa. Vui lòng liên hệ quản trị viên.');
                                } else {
                                    setUser(parsed);
                                }
                            })
                            .catch(() => {
                                // Nếu không thể xác thực, giữ nguyên thông tin user đã có
                                setUser(parsed);
                            })
                            .finally(() => {
                                setLoading(false);
                            });
                    } else {
                        setUser(parsed);
                        setLoading(false);
                    }
                } else {
                    // Nếu không hợp lệ (có thể là HTML), xóa đi
                    localStorage.removeItem('user');
                    localStorage.removeItem('token');
                    setUser(null);
                    setLoading(false);
                }
            } catch (e) {
                // Nếu parse lỗi (có thể là HTML), xóa đi
                localStorage.removeItem('user');
                localStorage.removeItem('token');
                setUser(null);
                setLoading(false);
            }
        } else {
            setLoading(false);
        }
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
    };    // Login function
    const login = async (username, password) => {
        try {
            // Real API authentication
            console.log("Attempting login to API via authService");
            const response = await authService.login(username, password);

            if (!response) {
                throw new Error('No data received from server');
            }

            const userData = response.user || response;
            // Kiểm tra userData hợp lệ
            if (!userData || typeof userData !== "object" || (!userData.id && !userData.username)) {
                throw new Error('Dữ liệu người dùng không hợp lệ');
            }
            
            // Kiểm tra tài khoản có bị khóa không
            if (userData.is_active === 0) {
                throw new Error('Tài khoản của bạn đã bị khóa. Vui lòng liên hệ quản trị viên.');
            }
            
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