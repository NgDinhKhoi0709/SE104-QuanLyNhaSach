import React, { useState } from 'react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
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
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Lấy đường dẫn từ location state hoặc mặc định là /dashboard
  const from = location.state?.from?.pathname || '/dashboard';

  const handleSubmit = async (values, { setSubmitting, setFieldError }) => {
    setIsLoggingIn(true);
    setLoginError('');

    try {
      await login(values.username, values.password);
      // Chuyển hướng đến trang dashboard sau khi đăng nhập thành công
      navigate(from, { replace: true });
    } catch (error) {
      // Xử lý các loại lỗi cụ thể
      if (error.message.includes('không chính xác')) {
        setLoginError('Tên đăng nhập hoặc mật khẩu không chính xác');
      } else if (error.message.includes('không tồn tại')) {
        setFieldError('username', 'Tài khoản không tồn tại');
      } else if (error.message.includes('khóa')) {
        setLoginError('Tài khoản của bạn đã bị khóa. Vui lòng liên hệ quản trị viên.');
      } else {
        setLoginError('Đăng nhập thất bại. Vui lòng thử lại sau.');
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
        validateOnChange={true} // Validate khi người dùng gõ
        validateOnBlur={true} // Validate khi người dùng rời khỏi trường
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