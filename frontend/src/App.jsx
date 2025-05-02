import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext.jsx';
import LoginPage from './pages/auth/LoginPage';
import AdminDashboard from './pages/AdminDashboard';
import SalesDashboard from './pages/SalesDashboard';
import InventoryDashboard from './pages/InventoryDashboard';

// Protected route wrapper
const ProtectedRoute = ({ children, requiredRole }) => {
  const { user } = useAuth();

  console.log("Protected route check:", { user, requiredRole });

  if (!user) {
    console.log("No user, redirecting to login");
    return <Navigate to="/" replace />;
  }

  if (requiredRole && user.role_id !== requiredRole) {
    console.log("Wrong role, redirecting");
    // Redirect based on role
    if (user.role_id === 1) {
      return <Navigate to="/admin" replace />;
    } else if (user.role_id === 2) {
      return <Navigate to="/sales" replace />;
    } else if (user.role_id === 3) {
      return <Navigate to="/inventory" replace />;
    }
    return <Navigate to="/" replace />;
  }

  return children;
};

function App() {
  const { user } = useAuth();
  console.log("App rendering, current user:", user);

  return (
    <Routes>
      {/* Public route - login */}
      <Route path="/" element={user ? <Navigate to={`/${user.role_id === 1 ? 'admin' :
        user.role_id === 2 ? 'sales' :
          user.role_id === 3 ? 'inventory' : ''
        }`} replace /> : <LoginPage />} />

      <Route path="/login" element={<Navigate to="/" replace />} />

      {/* Role-specific routes */}
      <Route path="/admin/*" element={<ProtectedRoute requiredRole={1}><AdminDashboard /></ProtectedRoute>} />
      <Route path="/sales/*" element={<ProtectedRoute requiredRole={2}><SalesDashboard /></ProtectedRoute>} />
      <Route path="/inventory/*" element={<ProtectedRoute requiredRole={3}><InventoryDashboard /></ProtectedRoute>} />

      {/* Remove these redundant routes that may cause circular redirects */}
      {/* <Route path="/admin/books" element={<Navigate to="/admin/books" replace />} /> */}
      {/* <Route path="/admin/categories" element={<Navigate to="/admin/categories" replace />} /> */}
      {/* <Route path="/admin/publishers" element={<Navigate to="/admin/publishers" replace />} /> */}

      {/* Redirect all other URLs to login */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
