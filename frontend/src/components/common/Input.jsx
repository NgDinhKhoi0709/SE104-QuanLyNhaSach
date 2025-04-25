import React, { useState } from "react";
import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-regular-svg-icons";

const Input = ({ 
  type, 
  id, 
  label, 
  name, 
  placeholder, 
  required,
  value,
  onChange,
  onBlur,
  error,
  touched
}) => {
  const [currentType, setCurrentType] = useState(type);

  const togglePasswordVisibility = () => {
    if (type === "password") {
      setCurrentType((prevType) =>
        prevType === "password" ? "text" : "password"
      );
    }
  };

  return (
    <div className="input-group">
      <label htmlFor={id}>{label} {required && <span className="required">*</span>}</label>
      <div className="input-wrapper">
        <input
          type={currentType}
          id={id}
          name={name}
          placeholder={placeholder}
          required={required}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          className={touched && error ? "error" : ""}
          autoComplete="off" // Tắt gợi ý tự động điền
        />
        {type === "password" && (
          <FontAwesomeIcon
            icon={currentType === "password" ? faEyeSlash : faEye}
            className="eye-icon"
            onClick={togglePasswordVisibility}
            role="button"
            aria-label={
              currentType === "password" ? "Hiện mật khẩu" : "Ẩn mật khẩu"
            }
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ")
                togglePasswordVisibility();
            }}
          />
        )}
      </div>
      {touched && error && <div className="error-message">{error}</div>}
    </div>
  );
};

Input.propTypes = {
  type: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  required: PropTypes.bool,
  value: PropTypes.string,
  onChange: PropTypes.func,
  onBlur: PropTypes.func,
  error: PropTypes.string,
  touched: PropTypes.bool
};

Input.defaultProps = {
  placeholder: "",
  required: false,
  type: "text"
};

export default Input;