import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext.jsx";

const AccountInfoPage = () => {
    const { user, setUser } = useAuth();
    // Debug log
    console.log("AccountInfoPage user:", user);

    const [formData, setFormData] = useState({
        full_name: "",
        username: "",
        phone: "",
        address: "",
    });
    const [editMode, setEditMode] = useState(false);
    const [passwordMode, setPasswordMode] = useState(false);
    const [passwordData, setPasswordData] = useState({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
    });
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        if (user) {
            setFormData({
                full_name: user.full_name || "",
                username: user.username || "",
                phone: user.phone || "",
                address: user.address || "",
            });
        }
    }, [user]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handlePasswordChange = (e) => {
        setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setError("");
        setMessage("");
        try {
            const res = await fetch(`http://localhost:5000/api/users/${user.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });
            if (!res.ok) throw new Error("Cập nhật thông tin thất bại");
            const updated = await res.json();
            setUser(updated);
            setMessage("Cập nhật thông tin thành công!");
            setEditMode(false);
        } catch (err) {
            setError(err.message || "Có lỗi xảy ra");
        }
    };

    const handleChangePassword = async (e) => {
        e.preventDefault();
        setError("");
        setMessage("");
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setError("Mật khẩu mới không khớp");
            return;
        }
        try {
            const res = await fetch(`http://localhost:5000/api/users/${user.id}/password`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    oldPassword: passwordData.oldPassword,
                    newPassword: passwordData.newPassword,
                }),
            });
            if (!res.ok) throw new Error("Đổi mật khẩu thất bại");
            setMessage("Đổi mật khẩu thành công!");
            setPasswordMode(false);
            setPasswordData({ oldPassword: "", newPassword: "", confirmPassword: "" });
        } catch (err) {
            setError(err.message || "Có lỗi xảy ra");
        }
    };

    if (!user) {
        return (
            <div>
                Đang tải...<br />
                {/* Debug: */}
                <pre>{JSON.stringify(user, null, 2)}</pre>
            </div>
        );
    }

    return (
        <div className="account-info-page" style={{ maxWidth: 500, margin: "40px auto", background: "#fff", borderRadius: 8, boxShadow: "0 2px 8px #eee", padding: 32 }}>
            <h2>Thông tin tài khoản</h2>
            {/* Debug: */}
            <pre style={{ background: "#f5f5f5", fontSize: 12 }}>{JSON.stringify(user, null, 2)}</pre>
            {message && <div style={{ color: "green", marginBottom: 10 }}>{message}</div>}
            {error && <div style={{ color: "red", marginBottom: 10 }}>{error}</div>}
            {!editMode && !passwordMode && (
                <>
                    <div><b>Họ tên:</b> {user.full_name || user.name}</div>
                    <div><b>Tên đăng nhập:</b> {user.username}</div>
                    <div><b>Số điện thoại:</b> {user.phone || "Chưa cập nhật"}</div>
                    <div><b>Địa chỉ:</b> {user.address || "Chưa cập nhật"}</div>
                    <button onClick={() => setEditMode(true)} style={{ marginTop: 16 }}>Chỉnh sửa thông tin</button>
                    <button onClick={() => setPasswordMode(true)} style={{ marginLeft: 12, marginTop: 16 }}>Đổi mật khẩu</button>
                </>
            )}
            {editMode && (
                <form onSubmit={handleSave} style={{ marginTop: 16 }}>
                    <div>
                        <label>Họ tên:</label>
                        <input name="full_name" value={formData.full_name} onChange={handleChange} required />
                    </div>
                    <div>
                        <label>Tên đăng nhập:</label>
                        <input name="username" value={formData.username} onChange={handleChange} required />
                    </div>
                    <div>
                        <label>Số điện thoại:</label>
                        <input name="phone" value={formData.phone} onChange={handleChange} />
                    </div>
                    <div>
                        <label>Địa chỉ:</label>
                        <input name="address" value={formData.address} onChange={handleChange} />
                    </div>
                    <button type="submit">Lưu</button>
                    <button type="button" onClick={() => setEditMode(false)} style={{ marginLeft: 12 }}>Hủy</button>
                </form>
            )}
            {passwordMode && (
                <form onSubmit={handleChangePassword} style={{ marginTop: 16 }}>
                    <div>
                        <label>Mật khẩu cũ:</label>
                        <input name="oldPassword" value={passwordData.oldPassword} onChange={handlePasswordChange} type="password" required />
                    </div>
                    <div>
                        <label>Mật khẩu mới:</label>
                        <input name="newPassword" value={passwordData.newPassword} onChange={handlePasswordChange} type="password" required />
                    </div>
                    <div>
                        <label>Nhập lại mật khẩu mới:</label>
                        <input name="confirmPassword" value={passwordData.confirmPassword} onChange={handlePasswordChange} type="password" required />
                    </div>
                    <button type="submit">Đổi mật khẩu</button>
                    <button type="button" onClick={() => setPasswordMode(false)} style={{ marginLeft: 12 }}>Hủy</button>
                </form>
            )}
        </div>
    );
};

export default AccountInfoPage;
