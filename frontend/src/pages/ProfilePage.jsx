import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext.jsx";
import "../styles/ProfilePage.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faEdit, 
  faCheck, 
  faTimes, 
  faKey, 
  faSpinner, 
  faExclamationCircle 
} from "@fortawesome/free-solid-svg-icons";
import axios from "axios";

const ProfilePage = () => {
  const { user } = useAuth();
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [profileData, setProfileData] = useState({
    full_name: "",
    email: "",
    phone: "",
    gender: null
  });
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });
  const [passwordChanging, setPasswordChanging] = useState(false);

  // Add notification state
  const [notification, setNotification] = useState({ message: "", type: "" });

  // Fetch user data from database with better error handling
  const fetchUserData = async () => {
    if (!user || !user.id) return;
    
    setLoading(true);
    setError(null);
    
    try {
      console.log("Fetching user data for ID:", user.id);
      
      // Try with and without localhost prefix
      let response;
      try {
        // First try with localhost URL
        response = await axios.get(`http://localhost:5000/api/users/${user.id}`);
      } catch (localErr) {
        // If that fails, try relative URL
        console.log("Localhost API call failed, trying relative path");
        response = await axios.get(`/api/users/${user.id}`);
      }
      
      const userData = response.data;
      console.log("API Response Data:", userData);
      
      // Convert gender to number if it's a string
      let genderValue = userData.gender;
      if (genderValue !== null && genderValue !== undefined) {
        genderValue = Number(genderValue); // Ensure it's a number
      }
      
      // Update state with the received data, including created_at
      setProfileData({
        username: userData.username || user.username,
        full_name: userData.full_name || "",
        email: userData.email || "",
        phone: userData.phone || "",
        gender: genderValue,
        created_at: userData.created_at
      });
      
      console.log("Profile data set:", {
        username: userData.username || user.username,
        full_name: userData.full_name || "",
        email: userData.email || "",
        phone: userData.phone || "",
        gender: genderValue,
        created_at: userData.created_at
      });
    } catch (err) {
      console.error("Error fetching user data:", err.response || err);
      
      // More detailed error message
      let errorMessage = "Không thể tải thông tin người dùng. ";
      if (err.response) {
        errorMessage += `Lỗi ${err.response.status}: ${err.response.data?.error || 'Lỗi không xác định'}`;
      } else if (err.request) {
        errorMessage += "Không nhận được phản hồi từ máy chủ.";
      } else {
        errorMessage += err.message;
      }
      
      setError(errorMessage);
      
      // Fallback to context data if API fails
      if (user) {
        // Convert gender to number if it's a string
        let userGender = user.gender;
        if (userGender !== null && userGender !== undefined) {
          userGender = Number(userGender);
        }
        
        setProfileData({
          full_name: user.full_name || "",
          email: user.email || "",
          phone: user.phone || "",
          gender: userGender
        });
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchUserData();
    }
  }, [user]);

  const handleEditToggle = () => {
    setEditing(!editing);
    // Reset to original data if canceling edit
    if (editing) {
      fetchUserData();
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData({
      ...profileData,
      [name]: value,
    });
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData({
      ...passwordData,
      [name]: value,
    });
  };

  // Helper function to get notification icon
  const getNotificationIcon = (type) => {
    switch (type) {
      case "success":
        return faCheck;
      case "error":
        return faExclamationCircle;
      default:
        return faCheck;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user || !user.id) return;

    setSaving(true);
    setError(null);

    try {
      // Ensure gender is a number
      const genderValue = profileData.gender !== null && profileData.gender !== undefined 
        ? Number(profileData.gender) 
        : 0;
      
      // Map to backend expected format
      const updateData = {
        username: profileData.username, // Lấy username từ form thay vì user context
        fullName: profileData.full_name,
        email: profileData.email,
        phone: profileData.phone,
        gender: genderValue,
        role: user.role_id === 1 ? 'admin' : 
              user.role_id === 2 ? 'sales' : 
              user.role_id === 3 ? 'warehouse' : 'sales',
        is_active: 1 // Keep active
      };
      
      console.log("Updating user with data:", updateData);

      // Try with and without localhost prefix
      try {
        await axios.put(`http://localhost:5000/api/users/${user.id}`, updateData);
      } catch (localErr) {
        await axios.put(`/api/users/${user.id}`, updateData);
      }
      
      // Replace alert with notification
      setNotification({ message: "Thông tin đã được cập nhật thành công!", type: "success" });
      setTimeout(() => setNotification({ message: "", type: "" }), 5000);
      
      setEditing(false);
      
      // Refresh user data
      fetchUserData();
    } catch (err) {
      console.error("Error updating profile:", err);
      if (err.response && err.response.data) {
        setError(`Lỗi: ${err.response.data.error || 'Không thể cập nhật thông tin'}`);
        setNotification({ message: `Lỗi: ${err.response.data.error || 'Không thể cập nhật thông tin'}`, type: "error" });
        setTimeout(() => setNotification({ message: "", type: "" }), 5000);
      } else {
        setError("Không thể cập nhật thông tin. Vui lòng thử lại sau.");
        setNotification({ message: "Không thể cập nhật thông tin. Vui lòng thử lại sau.", type: "error" });
        setTimeout(() => setNotification({ message: "", type: "" }), 5000);
      }
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (!user || !user.id) return;

    if (passwordData.newPassword !== passwordData.confirmNewPassword) {
      // Replace alert with notification
      setNotification({ message: "Mật khẩu mới không khớp!", type: "error" });
      setTimeout(() => setNotification({ message: "", type: "" }), 5000);
      return;
    }

    setPasswordChanging(true);
    setError(null);

    try {
      await axios.post(`/api/users/${user.id}/change-password`, {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });
      
      // Replace alert with notification
      setNotification({ message: "Mật khẩu đã được thay đổi thành công!", type: "success" });
      setTimeout(() => setNotification({ message: "", type: "" }), 5000);
      
      setShowPasswordChange(false);
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmNewPassword: "",
      });
    } catch (err) {
      console.error("Error changing password:", err);
      
      if (err.response && err.response.data && err.response.data.error) {
        // Replace alert with notification
        setNotification({ message: `Lỗi: ${err.response.data.error}`, type: "error" });
        setTimeout(() => setNotification({ message: "", type: "" }), 5000);
      } else {
        setError("Không thể thay đổi mật khẩu. Vui lòng thử lại sau.");
        setNotification({ message: "Không thể thay đổi mật khẩu. Vui lòng thử lại sau.", type: "error" });
        setTimeout(() => setNotification({ message: "", type: "" }), 5000);
      }
    } finally {
      setPasswordChanging(false);
    }
  };

  if (!user) {
    return <div className="loading-text">Đang tải thông tin người dùng...</div>;
  }

  return (
    <div className="profile-container">
      {notification.message && (
        <div className={`notification ${notification.type === "error" ? "error" : ""}`}>
          <FontAwesomeIcon 
            icon={getNotificationIcon(notification.type)} 
            style={{ marginRight: "8px" }} 
          />
          <span className="notification-message">{notification.message}</span>
          <button
            className="notification-close"
            onClick={() => setNotification({ message: "", type: "" })}
            aria-label="Đóng thông báo"
          >
            &times;
          </button>
          <div className="progress-bar"></div>
        </div>
      )}
      
      <div className="profile-header">
        <h2>Thông tin tài khoản</h2>
        {!editing && !showPasswordChange && !loading && (
          <button 
            className="profile-edit-btn"
            onClick={handleEditToggle}
            title="Chỉnh sửa thông tin"
          >
            <FontAwesomeIcon icon={faEdit} /> Chỉnh sửa
          </button>
        )}
      </div>
      
      {error && (
        <div className="error-message">
          {error}
        </div>
      )}
      
      <div className="profile-card">
        <div className="profile-avatar-section">
          <div className="profile-avatar">
            {profileData.full_name ? profileData.full_name.charAt(0).toUpperCase() : "U"}
          </div>
          <span className="role-badge">
            {user.role_id === 1 ? "Admin" : 
             user.role_id === 2 ? "Nhân viên bán hàng" : 
             user.role_id === 3 ? "Nhân viên kho" : "Nhân viên"}
          </span>
        </div>

        {loading ? (
          <div className="loading-container">
            <FontAwesomeIcon icon={faSpinner} spin /> Đang tải thông tin...
          </div>
        ) : !showPasswordChange ? (
          <div className="profile-details">
            <form onSubmit={handleSubmit}>
              {/* New two-column layout wrapper */}
              <div className="profile-form-columns"> {/* This div will contain the two columns */}
                {/* Left Column */}
                <div className="profile-form-column">
                  <div className="form-row">
                    <label>Username:</label>
                    {editing ? (
                      <input
                        type="text"
                        name="username"
                        value={profileData.username || user.username}
                        onChange={handleChange}
                        required
                      />
                    ) : (
                      <span>{profileData.username || user.username || "Chưa cập nhật"}</span>
                    )}
                  </div>
                  
                  <div className="form-row">
                    <label>Số điện thoại:</label>
                    {editing ? (
                      <input
                        type="text"
                        name="phone"
                        value={profileData.phone}
                        onChange={handleChange}
                      />
                    ) : (
                      <span>{profileData.phone || "Chưa cập nhật"}</span>
                    )}
                  </div>

                  <div className="form-row">
                    <label>Email:</label>
                    {editing ? (
                      <input
                        type="email"
                        name="email"
                        value={profileData.email}
                        onChange={handleChange}
                        required
                      />
                    ) : (
                      <span>{profileData.email || "Chưa cập nhật"}</span>
                    )}
                  </div>
                </div>

                {/* Right Column */}
                <div className="profile-form-column">
                  <div className="form-row">
                    <label>Họ và tên:</label>
                    {/* Họ và tên không được chỉnh sửa, luôn hiển thị ở chế độ chỉ đọc */}
                    <span>{profileData.full_name || "Chưa cập nhật"}</span>
                  </div>

                  <div className="form-row">
                    <label>Giới tính:</label>
                    {editing ? (
                      <select 
                        name="gender" 
                        value={profileData.gender !== null && profileData.gender !== undefined ? profileData.gender : ""} 
                        onChange={handleChange}
                        required
                      >
                        <option value="">Chọn giới tính</option>
                        <option value="0">Nam</option>
                        <option value="1">Nữ</option>
                      </select>
                    ) : (
                      <span>
                        {profileData.gender === 0 ? "Nam" : 
                         profileData.gender === 1 ? "Nữ" : "Chưa cập nhật"}
                      </span>
                    )}
                  </div>

                  <div className="form-row">
                    <label>Ngày tạo:</label>
                    <span>
                      {profileData.created_at ? new Date(profileData.created_at).toLocaleDateString('vi-VN', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric'
                        // Đã xóa các tùy chọn hour và minute
                      }) : "Không có dữ liệu"}
                    </span>
                  </div>
                </div>
              </div> {/* End of profile-form-columns */}

              {editing && (
                <div className="profile-actions">
                  <button type="submit" className="save-btn" disabled={saving}>
                    {saving ? (
                      <>
                        <FontAwesomeIcon icon={faSpinner} spin /> Đang lưu...
                      </>
                    ) : (
                      <>
                        <FontAwesomeIcon icon={faCheck} /> Lưu
                      </>
                    )}
                  </button>
                  <button 
                    type="button" 
                    className="cancel-btn" 
                    onClick={handleEditToggle}
                    disabled={saving}
                  >
                    <FontAwesomeIcon icon={faTimes} /> Hủy
                  </button>
                </div>
              )}
            </form>

            {!editing && (
              <div className="change-password-section">
                <button 
                  className="change-password-btn"
                  onClick={() => setShowPasswordChange(true)}
                >
                  <FontAwesomeIcon icon={faKey} /> Đổi mật khẩu
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="password-change-form">
            <h3>Đổi mật khẩu</h3>
            <form onSubmit={handlePasswordSubmit}>
              <div className="form-row">
                <label>Mật khẩu hiện tại:</label>
                <input
                  type="password"
                  name="currentPassword"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                  required
                />
              </div>

              <div className="form-row">
                <label>Mật khẩu mới:</label>
                <input
                  type="password"
                  name="newPassword"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  required
                />
              </div>

              <div className="form-row">
                <label>Xác nhận mật khẩu mới:</label>
                <input
                  type="password"
                  name="confirmNewPassword"
                  value={passwordData.confirmNewPassword}
                  onChange={handlePasswordChange}
                  required
                />
              </div>

              <div className="profile-actions">
                <button type="submit" className="save-btn" disabled={passwordChanging}>
                  {passwordChanging ? (
                    <>
                      <FontAwesomeIcon icon={faSpinner} spin /> Đang xử lý...
                    </>
                  ) : (
                    <>
                      <FontAwesomeIcon icon={faCheck} /> Lưu
                    </>
                  )}
                </button>
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => {
                    setShowPasswordChange(false);
                    setPasswordData({
                      currentPassword: "",
                      newPassword: "",
                      confirmNewPassword: "",
                    });
                  }}
                  disabled={passwordChanging}
                >
                  <FontAwesomeIcon icon={faTimes} /> Hủy
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;

