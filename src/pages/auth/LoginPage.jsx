import React from 'react';
import logo from '../../assets/img/logo.svg';
import LoginForm from '../../components/auth/LoginForm';
import '../../App.css'; // Sử dụng CSS hiện có

const LoginPage = () => {
  return (
    <>
      <header className="header-login">
        <div className="logo-container">
          <img src={logo} alt="Nhà sách Cánh Diều" className="logo-login" />
        </div>
      </header>

      <main className="main-content">
        <div className="login-card">
          <LoginForm />
        </div>
      </main>
    </>
  );
};

export default LoginPage;