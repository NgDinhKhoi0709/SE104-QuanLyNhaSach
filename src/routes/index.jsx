import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from '../pages/auth/LoginPage';
import Dashboard from '../pages/Dashboard';
import Loading from '../components/common/Loading';
import { useAuth } from '../contexts/AuthContext';
import { useAuthorization } from '../contexts/AuthorizationContext';
import ProtectedRoute from '../components/auth/ProtectedRoute';

const AppRoutes = () => {
  const { user, loading } = useAuth();
  const { hasPermission, initialized } = useAuthorization();

  // Debug
  useEffect(() => {
    console.log("AppRoutes rendered - Auth state:", { user, loading });
    console.log("Authorization initialized:", initialized);
  }, [user, loading, initialized]);

  // Hiển thị loading nếu đang kiểm tra xác thực HOẶC nếu AuthorizationContext chưa được khởi tạo
  if (loading || !initialized) {
    return <Loading message="Đang khởi tạo ứng dụng..." />;
  }
  
  // Quyết định trang mặc định dựa trên vai trò
  const getDefaultRoute = () => {
    if (!user) return '/login';
    
    const role = user.role ? String(user.role).toUpperCase() : null;
    
    // Chuyển hướng dựa theo vai trò
    switch(role) {
      case 'ADMIN': 
        return '/books';
      case 'SALESPERSON': 
        return '/invoices'; // Nhân viên bán hàng đến trang hóa đơn theo mặc định
      case 'INVENTORY': 
        return '/books'; // Nhân viên thủ kho đến trang sách theo mặc định
      default:
        return '/books';
    }
  };

  // Đối với tất cả các điều kiện khác, chúng tôi đã sẵn sàng để render routes
  return (
    <Routes>
      {/* Route công khai - không cần xác thực */}
      <Route path="/login" element={
        user ? <Navigate to={getDefaultRoute()} replace /> : <LoginPage />
      } />

      {/* Route mặc định chuyển hướng tùy thuộc vào vai trò */}
      <Route path="/" element={
        user ? <Navigate to={getDefaultRoute()} replace /> : <Navigate to="/login" replace />
      } />
      
      {/* Routes cần xác thực và phân quyền */}
      <Route path="/books" element={
        <ProtectedRoute isAllowed={!!user && hasPermission('/books')}>
          <Dashboard />
        </ProtectedRoute>
      } />
      
      <Route path="/categories" element={
        <ProtectedRoute isAllowed={!!user && hasPermission('/categories')}>
          <Dashboard />
        </ProtectedRoute>
      } />
      
      <Route path="/publishers" element={
        <ProtectedRoute isAllowed={!!user && hasPermission('/publishers')}>
          <Dashboard />
        </ProtectedRoute>
      } />
      
      <Route path="/imports" element={
        <ProtectedRoute isAllowed={!!user && hasPermission('/imports')}>
          <Dashboard />
        </ProtectedRoute>
      } />
      
      <Route path="/suppliers" element={
        <ProtectedRoute isAllowed={!!user && hasPermission('/suppliers')}>
          <Dashboard />
        </ProtectedRoute>
      } />
      
      <Route path="/invoices" element={
        <ProtectedRoute isAllowed={!!user && hasPermission('/invoices')}>
          <Dashboard />
        </ProtectedRoute>
      } />
      
      <Route path="/promotions" element={
        <ProtectedRoute isAllowed={!!user && hasPermission('/promotions')}>
          <Dashboard />
        </ProtectedRoute>
      } />
      
      <Route path="/reports" element={
        <ProtectedRoute isAllowed={!!user && hasPermission('/reports')}>
          <Dashboard />
        </ProtectedRoute>
      } />
      
      <Route path="/rules" element={
        <ProtectedRoute isAllowed={!!user && hasPermission('/rules')}>
          <Dashboard />
        </ProtectedRoute>
      } />
      
      <Route path="/accounts" element={
        <ProtectedRoute isAllowed={!!user && hasPermission('/accounts')}>
          <Dashboard />
        </ProtectedRoute>
      } />

      {/* Fallback - nếu không khớp route nào */}
      <Route path="*" element={
        user ? <Navigate to={getDefaultRoute()} replace /> : <Navigate to="/login" replace />
      } />
    </Routes>
  );
};

export default AppRoutes;