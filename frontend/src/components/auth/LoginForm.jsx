import React, { useState } from 'react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext.jsx';  // Make sure the extension is .jsx
import Input from '../common/Input';
import './LoginForm.css';

const LoginSchema = Yup.object().shape({
  username: Yup.string()
    .required('Vui lòng nhập tên đăng nhập')
    .min(3, 'Tên đăng nhập phải có ít nhất 3 ký tự')
    .matches(/^[a-zA-Z0-9_]+$/, 'Tên đăng nhập chỉ được chứa chữ cái, số và dấu gạch dưới'),
  password: Yup.string()
    .required('Vui lòng nhập mật khẩu')
    .min(6, 'Mật khẩu phải có ít nhất 6 ký tự')
    .matches(/\S+/, 'Mật khẩu không được chứa khoảng trắng'),
});

const LoginForm = () => {
  const { login, getRoleBasedRedirect } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Get the intended destination from location state or use role-based redirect
  const from = location.state?.from?.pathname || null;

  const handleSubmit = async (values, { setSubmitting, setFieldError }) => {
    setIsLoggingIn(true);
    setLoginError('');

    try {
      console.log("Submitting login:", values.username);
      const user = await login(values.username, values.password);
      console.log("Login successful:", user);

      // Chuyển hướng dựa vào role_id - match with App.jsx routes exactly
      if (user.role_id === 1) {
        navigate('/admin', { replace: true });
      } else if (user.role_id === 2) {
        navigate('/sales', { replace: true });
      } else if (user.role_id === 3) {
        navigate('/inventory', { replace: true });
      } else {
        setLoginError('Tài khoản không có quyền truy cập hệ thống.');
      }

    } catch (error) {
      console.error("Login error in form:", error);

      // Handle different error messages
      if (error.message.includes('không chính xác')) {
        setLoginError('Tên đăng nhập hoặc mật khẩu không chính xác');
      } else if (error.message.includes('khóa')) {
        setLoginError('Tài khoản của bạn đã bị khóa. Vui lòng liên hệ quản trị viên.');
      } else if (error.message.includes('kết nối')) {
        setLoginError('Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối mạng.');
      } else {
        setLoginError(error.message || 'Đăng nhập thất bại. Vui lòng thử lại sau.');
      }
    } finally {
      setIsLoggingIn(false);
      setSubmitting(false);
    }
  };

  return (
    <div className="login-form-container">
      <Formik
        initialValues={{ username: '', password: '' }}
        validationSchema={LoginSchema}
        onSubmit={handleSubmit}
        validateOnChange={true}
        validateOnBlur={true}
      >
        {({ errors, touched, values, handleChange, handleBlur, isSubmitting }) => (
          <Form className="login-form">
            <h1>Đăng nhập</h1>

            {loginError && <div className="login-error">{loginError}</div>}

            <Input
              type="text"
              id="username"
              label="Tên đăng nhập"
              name="username"
              placeholder="Nhập tên đăng nhập"
              required
              value={values.username}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.username}
              touched={touched.username}
            />

            <Input
              type="password"
              id="password"
              label="Mật khẩu"
              name="password"
              placeholder="Nhập mật khẩu"
              required
              value={values.password}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.password}
              touched={touched.password}
            />

            <button
              type="submit"
              className="login-button"
              disabled={isLoggingIn || isSubmitting}
            >
              {isLoggingIn ? 'Đang đăng nhập...' : 'Đăng nhập'}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default LoginForm;