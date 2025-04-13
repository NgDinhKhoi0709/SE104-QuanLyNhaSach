import React, { useState, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faTimes, faEye, faEyeSlash, faUser, faEnvelope, 
  faPhone, faUserTag, faLock, faToggleOn 
} from "@fortawesome/free-solid-svg-icons";
import "./Modals.css";

const AccountForm = ({ account, onSave, onCancel }) => {
  const [showPassword, setShowPassword] = useState(false);

  // Schema validation với Formik và Yup
  const AccountSchema = Yup.object().shape({
    username: Yup.string()
      .min(3, "Tên đăng nhập phải có ít nhất 3 ký tự")
      .max(20, "Tên đăng nhập không được vượt quá 20 ký tự")
      .matches(/^[a-zA-Z0-9_]+$/, "Tên đăng nhập chỉ được chứa chữ cái, số và dấu gạch dưới")
      .required("Tên đăng nhập là bắt buộc"),
    fullName: Yup.string()
      .min(2, "Họ và tên phải có ít nhất 2 ký tự")
      .max(50, "Họ và tên không được vượt quá 50 ký tự")
      .required("Họ và tên là bắt buộc"),
    email: Yup.string()
      .email("Email không hợp lệ")
      .required("Email là bắt buộc"),
    phone: Yup.string()
      .matches(/^[0-9]{10,11}$/, "Số điện thoại phải có 10-11 chữ số")
      .required("Số điện thoại là bắt buộc"),
    role: Yup.string()
      .oneOf(["admin", "sales", "warehouse"], "Vui lòng chọn một vai trò")
      .required("Vai trò là bắt buộc"),
    password: Yup.string()
      .when('isNew', {
        is: true,
        then: () => Yup.string()
          .min(6, "Mật khẩu phải có ít nhất 6 ký tự")
          .required("Mật khẩu là bắt buộc"),
        otherwise: () => Yup.string().notRequired(),
      }),
    status: Yup.string()
      .oneOf(["active", "inactive"], "Vui lòng chọn trạng thái")
      .required("Trạng thái là bắt buộc"),
  });

  // Giá trị ban đầu của form
  const initialValues = {
    username: account ? account.username : "",
    fullName: account ? account.fullName : "",
    email: account ? account.email : "",
    phone: account ? account.phone : "",
    role: account ? account.role : "sales",
    password: "",
    status: account ? account.status : "active",
    isNew: !account,
  };

  const getRoleLabel = (role) => {
    switch(role) {
      case 'admin': return 'Quản trị viên';
      case 'sales': return 'Nhân viên bán hàng';
      case 'warehouse': return 'Nhân viên thủ kho';
      default: return '';
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-content account-form-modal">
        <div className="modal-header">
          <h3>
            <FontAwesomeIcon 
              icon={faUser} 
              style={{
                color: '#095e5a',
                marginRight: '10px'
              }} 
            />
            {account ? "Chỉnh sửa tài khoản" : "Thêm tài khoản mới"}
          </h3>
          <button className="close-button" onClick={onCancel} aria-label="Đóng">
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>

        <Formik
          initialValues={initialValues}
          validationSchema={AccountSchema}
          onSubmit={(values, { setSubmitting }) => {
            // Loại bỏ isNew trước khi gửi đi
            const { isNew, ...accountData } = values;
            
            // Nếu sửa và không thay đổi mật khẩu thì không gửi mật khẩu
            if (!isNew && !accountData.password) {
              delete accountData.password;
            }
            
            onSave(accountData);
            setSubmitting(false);
          }}
        >
          {({ isSubmitting, errors, touched, values }) => (
            <Form className="account-form">
              <div className="form-group">
                <label htmlFor="username">
                  <FontAwesomeIcon icon={faUser} style={{ marginRight: '8px', opacity: 0.7 }} />
                  Tên đăng nhập
                </label>
                <Field
                  type="text"
                  name="username"
                  id="username"
                  className={errors.username && touched.username ? "error" : ""}
                  disabled={account !== null} // Không cho phép sửa username nếu đang chỉnh sửa
                  placeholder="Nhập tên đăng nhập"
                />
                <ErrorMessage name="username" component="div" className="error-message" />
              </div>

              <div className="form-group">
                <label htmlFor="fullName">
                  <FontAwesomeIcon icon={faUser} style={{ marginRight: '8px', opacity: 0.7 }} />
                  Họ và tên
                </label>
                <Field
                  type="text"
                  name="fullName"
                  id="fullName"
                  className={errors.fullName && touched.fullName ? "error" : ""}
                  placeholder="Nhập họ và tên"
                />
                <ErrorMessage name="fullName" component="div" className="error-message" />
              </div>

              <div className="form-group">
                <label htmlFor="email">
                  <FontAwesomeIcon icon={faEnvelope} style={{ marginRight: '8px', opacity: 0.7 }} />
                  Email
                </label>
                <Field
                  type="email"
                  name="email"
                  id="email"
                  className={errors.email && touched.email ? "error" : ""}
                  placeholder="Nhập địa chỉ email"
                />
                <ErrorMessage name="email" component="div" className="error-message" />
              </div>

              <div className="form-group">
                <label htmlFor="phone">
                  <FontAwesomeIcon icon={faPhone} style={{ marginRight: '8px', opacity: 0.7 }} />
                  Số điện thoại
                </label>
                <Field
                  type="text"
                  name="phone"
                  id="phone"
                  className={errors.phone && touched.phone ? "error" : ""}
                  placeholder="Nhập số điện thoại"
                />
                <ErrorMessage name="phone" component="div" className="error-message" />
              </div>

              <div className="form-group">
                <label htmlFor="role">
                  <FontAwesomeIcon icon={faUserTag} style={{ marginRight: '8px', opacity: 0.7 }} />
                  Vai trò
                </label>
                <Field
                  as="select"
                  name="role"
                  id="role"
                  className={errors.role && touched.role ? "error" : ""}
                >
                  <option value="" disabled>Chọn vai trò</option>
                  <option value="admin">Quản trị viên</option>
                  <option value="sales">Nhân viên bán hàng</option>
                  <option value="warehouse">Nhân viên thủ kho</option>
                </Field>
                {values.role && (
                  <div style={{ 
                    fontSize: '13px', 
                    color: '#666', 
                    marginTop: '5px',
                    fontStyle: 'italic'
                  }}>
                    {getRoleLabel(values.role)} có quyền {
                      values.role === 'admin' 
                        ? 'quản lý toàn bộ hệ thống' 
                        : values.role === 'sales'
                        ? 'quản lý bán hàng và khuyến mãi' 
                        : 'quản lý kho và nhập sách'
                    }
                  </div>
                )}
                <ErrorMessage name="role" component="div" className="error-message" />
              </div>

              {!account && (
                <div className="form-group password-group">
                  <label htmlFor="password">
                    <FontAwesomeIcon icon={faLock} style={{ marginRight: '8px', opacity: 0.7 }} />
                    Mật khẩu
                  </label>
                  <div className="password-input-container">
                    <Field
                      type={showPassword ? "text" : "password"}
                      name="password"
                      id="password"
                      className={errors.password && touched.password ? "error" : ""}
                      placeholder="Nhập mật khẩu"
                    />
                    <button
                      type="button"
                      className="toggle-password"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                    >
                      <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                    </button>
                  </div>
                  <ErrorMessage name="password" component="div" className="error-message" />
                </div>
              )}

              <div className="form-group">
                <label htmlFor="status">
                  <FontAwesomeIcon icon={faToggleOn} style={{ marginRight: '8px', opacity: 0.7 }} />
                  Trạng thái
                </label>
                <Field
                  as="select"
                  name="status"
                  id="status"
                  className={errors.status && touched.status ? "error" : ""}
                >
                  <option value="active">Kích hoạt</option>
                  <option value="inactive">Khóa</option>
                </Field>
                <div style={{ 
                  fontSize: '13px', 
                  color: '#666', 
                  marginTop: '5px',
                  fontStyle: 'italic'
                }}>
                  {values.status === 'active' 
                    ? 'Tài khoản kích hoạt có thể đăng nhập và sử dụng hệ thống' 
                    : 'Tài khoản bị khóa không thể đăng nhập vào hệ thống'}
                </div>
                <ErrorMessage name="status" component="div" className="error-message" />
              </div>

              <div className="form-actions">
                <button
                  type="button"
                  className="cancel-button"
                  onClick={onCancel}
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="save-button"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Đang lưu..." : account ? "Cập nhật" : "Tạo tài khoản"}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default AccountForm;