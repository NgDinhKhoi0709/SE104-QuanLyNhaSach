import React, { createContext, useContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useAuth } from './AuthContext';

// Tạo context để quản lý phân quyền
const AuthorizationContext = createContext();

// Định nghĩa các vai trò và quyền truy cập tương ứng
const ROLE_PERMISSIONS = {
  ADMIN: {
    label: 'Quản trị viên',
    permissions: [
      '/books',
      '/categories',
      '/publishers',
      '/imports',
      '/suppliers',
      '/invoices',
      '/promotions',
      '/reports',
      '/rules',
      '/accounts'
    ]
  },
  SALESPERSON: {
    label: 'Nhân viên bán hàng',
    permissions: [
      '/invoices',
      '/promotions',
      '/reports'
    ]
  },
  INVENTORY: {
    label: 'Nhân viên thủ kho',
    permissions: [
      '/books',
      '/categories',
      '/publishers',
      '/imports',
      '/suppliers'
    ]
  }
};

export const AuthorizationProvider = ({ children }) => {
  const { user, loading } = useAuth();
  const [initialized, setInitialized] = useState(false);
  
  // Đảm bảo provider được khởi tạo chỉ một lần sau khi auth provider đã sẵn sàng
  useEffect(() => {
    if (!loading) {
      setInitialized(true);
    }
  }, [loading]);

  // Kiểm tra xem người dùng có quyền truy cập đường dẫn cụ thể không
  const hasPermission = (path) => {
    try {
      // Nếu đang loading hoặc chưa khởi tạo, cho phép tạm thời
      if (loading || !initialized) return true;
      
      // Nếu chưa đăng nhập, không có quyền truy cập
      if (!user) return false;
      
      // Kiểm tra vai trò người dùng
      const role = user.role ? String(user.role).toUpperCase() : null;
      
      // Nếu không có vai trò, không có quyền truy cập
      if (!role) return false;
      
      const rolePerm = ROLE_PERMISSIONS[role];
      if (!rolePerm) {
        console.warn(`Vai trò không được hỗ trợ: ${role}`);
        return false;
      }
      
      // Quản trị viên có quyền truy cập tất cả
      if (role === 'ADMIN') return true;
      
      // Kiểm tra quyền cụ thể
      return rolePerm.permissions.includes(path);
    } catch (error) {
      console.error("Lỗi kiểm tra quyền:", error);
      return false; // Trả về false nếu có lỗi để đảm bảo an toàn
    }
  };

  // Lấy danh sách các quyền truy cập của vai trò hiện tại
  const getPermissions = () => {
    try {
      if (loading || !initialized) return [];
      if (!user) return [];
      
      const role = user.role ? String(user.role).toUpperCase() : null;
      if (!role) return [];
      
      const rolePerm = ROLE_PERMISSIONS[role];
      return rolePerm ? rolePerm.permissions : [];
    } catch (error) {
      console.error("Lỗi lấy danh sách quyền:", error);
      return []; // Trả về mảng rỗng nếu có lỗi
    }
  };

  // Lấy tên hiển thị của vai trò
  const getRoleLabel = () => {
    try {
      if (loading || !initialized) return '';
      if (!user) return '';
      
      const role = user.role ? String(user.role).toUpperCase() : null;
      if (!role) return '';
      
      const rolePerm = ROLE_PERMISSIONS[role];
      return rolePerm ? rolePerm.label : '';
    } catch (error) {
      console.error("Lỗi lấy nhãn vai trò:", error);
      return ''; // Trả về chuỗi rỗng nếu có lỗi
    }
  };

  const value = {
    hasPermission,
    getPermissions,
    getRoleLabel,
    ROLE_PERMISSIONS,
    initialized
  };

  return (
    <AuthorizationContext.Provider value={value}>
      {children}
    </AuthorizationContext.Provider>
  );
};

AuthorizationProvider.propTypes = {
  children: PropTypes.node.isRequired
};

// Hook để sử dụng AuthorizationContext
export const useAuthorization = () => {
  try {
    const context = useContext(AuthorizationContext);
    if (context === undefined) {
      throw new Error('useAuthorization phải được sử dụng trong AuthorizationProvider');
    }
    return context;
  } catch (error) {
    console.error("Lỗi khi sử dụng useAuthorization hook:", error);
    // Trả về một đối tượng giả với các phương thức mà không gây ra lỗi
    return {
      hasPermission: () => false,
      getPermissions: () => [],
      getRoleLabel: () => '',
      ROLE_PERMISSIONS: {},
      initialized: false
    };
  }
};

export default AuthorizationContext;