import React, { useState } from 'react';
import logo from '../../assets/img/logo.svg';
import LoginForm from '../../components/auth/LoginForm';
import ForgotPasswordForm from '../../components/auth/ForgotPasswordForm';
import '../../App.css'; // Sử dụng CSS hiện có

const LoginPage = () => {
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  const handleForgotPassword = () => {
    setShowForgotPassword(true);
  };

  const handleBackToLogin = () => {
    setShowForgotPassword(false);
  };

  const handleForgotPasswordSuccess = () => {
    setShowForgotPassword(false);
    // Có thể thêm thông báo thành công ở đây
  };

  return (
    <>
      <header className="header-login">
        <div className="logo-container">
          <img src={logo} alt="Nhà sách Cánh Diều" className="logo-login" />
        </div>
      </header>

      <main className="main-content">
        <div className="login-card">
          {showForgotPassword ? (
            <ForgotPasswordForm 
              onBack={handleBackToLogin}
              onSuccess={handleForgotPasswordSuccess}
            />
          ) : (
            <LoginForm onForgotPassword={handleForgotPassword} />
          )}
        </div>
      </main>
    </>
  );
};

export default LoginPage;