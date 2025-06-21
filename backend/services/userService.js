const db = require('../db');
const bcrypt = require('bcrypt');
const userModel = require('../models/userModel');

/**
 * Lấy danh sách tất cả người dùng
 * @returns {Promise<Array>} Danh sách người dùng đã được định dạng cho frontend
 */
const getAllUsers = async () => {
    const users = await userModel.getAllUsers();
    
    // Map dữ liệu sang format frontend cần
    return users.map(u => ({
        id: u.id,
        username: u.username,
        fullName: u.full_name,
        email: u.email,
        phone: u.phone,
        gender: u.gender,
        role: u.role_id === 1 ? 'admin' : u.role_id === 2 ? 'sales' : u.role_id === 3 ? 'warehouse' : 'unknown',
        status: u.is_active === 1 ? 'active' : 'inactive',
        createdAt: u.created_at,
        lastLogin: u.updated_at
    }));
};

/**
 * Lấy thông tin người dùng theo ID
 * @param {number} id - ID của người dùng
 * @returns {Promise<Object>} Thông tin người dùng
 */
const getUserById = async (id) => {
    const user = await userModel.getUserById(id);
    if (!user) {
        throw { status: 404, message: 'User not found' };
    }
    
    // Return fields with consistent naming for frontend
    // Ensure consistent data types and defaults
    return {
        id: user.id,
        username: user.username,
        full_name: user.full_name || "", // Default to empty string if null
        email: user.email || "",
        phone: user.phone || "",
        // Ensure gender is a number (0 or 1) or null if not set/invalid
        gender: (user.gender === 0 || user.gender === 1) ? Number(user.gender) : null,
        role_id: user.role_id,
        is_active: user.is_active,
        created_at: user.created_at || null, // Thêm ngày tạo
    };
};

/**
 * Thêm người dùng mới
 * @param {Object} userData - Thông tin người dùng mới
 * @returns {Promise<Object>} Thông tin người dùng đã thêm
 */
const addUser = async (userData) => {
    const { username, fullName, email, phone, gender, role } = userData;

    // Kiểm tra các trường bắt buộc
    if (!username || !fullName) {
        throw { status: 400, message: 'Username và fullName là bắt buộc' };
    }

    // Sử dụng mật khẩu mặc định "12345678"
    const defaultPassword = "12345678";
    
    // Mã hóa mật khẩu mặc định
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(defaultPassword, saltRounds);

    // Chuyển đổi role thành role_id
    let role_id;
    switch (role) {
        case 'admin': role_id = 1; break;
        case 'sales': role_id = 2; break;
        case 'warehouse': role_id = 3; break;
        default: role_id = 2; // Mặc định là nhân viên bán hàng
    }

    // Mặc định is_active là 1 (kích hoạt)
    const is_active = 1;    try {
        // Thêm người dùng vào database với mật khẩu mặc định đã mã hóa
        const result = await userModel.createUser({
            username,
            password: hashedPassword,
            full_name: fullName,
            email,
            phone,
            gender,
            role_id,
            is_active
        });

        // Trả về thông tin người dùng đã được thêm (không bao gồm password)
        return {
            id: result.insertId,
            username,
            fullName,
            email,
            phone,
            gender,
            role,
            status: 'active'
        };
    } catch (err) {
        // Xử lý lỗi trùng tên đăng nhập
        if (err.code === 'ER_DUP_ENTRY') {
            throw { status: 409, message: 'Tên đăng nhập đã tồn tại' };
        }
        throw err; // Ném lại lỗi để controller xử lý
    }
};

/**
 * Cập nhật thông tin người dùng
 * @param {number} id - ID của người dùng
 * @param {Object} userData - Thông tin người dùng cần cập nhật
 * @returns {Promise<Object>} Thông tin người dùng sau khi cập nhật
 */
const updateUser = async (id, userData) => {
    const { username, fullName, email, phone, gender, role, is_active, password } = userData;

    // Validate required fields
    if (!username || !fullName || !email || !phone || gender === undefined || gender === null || !role) {
        throw { status: 400, message: "Missing required fields" };
    }

    // Chuyển đổi role thành role_id
    let role_id;
    switch (role) {
        case 'admin': role_id = 1; break;
        case 'sales': role_id = 2; break;
        case 'warehouse': role_id = 3; break;
        default: role_id = 2;
    }    // Chuyển đổi gender thành số (0=male, 1=female)
    let genderValue;
    if (gender === "male" || gender === 0 || gender === "0") genderValue = 0;
    else if (gender === "female" || gender === 1 || gender === "1") genderValue = 1;
    else {
        throw { status: 400, message: "Invalid gender value" };
    }

    // Nếu không truyền lên thì giữ nguyên trạng thái cũ
    const activeStatus = typeof is_active === "undefined" ? 1 : is_active;

    // Kiểm tra user tồn tại trước khi update
    try {
        const [users] = await db.query('SELECT id FROM users WHERE id = ?', [id]);
        if (!users || users.length === 0) {
            throw { status: 404, message: "User not found" };
        }    } catch (err) {
        if (err.status) throw err;
        throw { status: 500, message: "Database error when checking user", details: err.message };
    }

    try {
        let query, params;
        
        // Nếu có password mới thì mã hóa, nếu không thì không update password
        if (password) {
            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(password, saltRounds);
            query = `UPDATE users SET username = ?, full_name = ?, email = ?, phone = ?, gender = ?, role_id = ?, is_active = ?, password = ? WHERE id = ?`;
            params = [username, fullName, email, phone, genderValue, role_id, activeStatus, hashedPassword, id];
        } else {
            query = `UPDATE users SET username = ?, full_name = ?, email = ?, phone = ?, gender = ?, role_id = ?, is_active = ? WHERE id = ?`;
            params = [username, fullName, email, phone, genderValue, role_id, activeStatus, id];
        }        const [result] = await db.query(query, params);

        if (result.affectedRows === 0) {
            throw { status: 500, message: "Failed to update user (no rows affected)" };
        }

        return {
            id,
            username,
            fullName,
            email,
            phone,
            gender,
            role,
            is_active: activeStatus
        };    } catch (err) {
        if (err.status) throw err;
        throw { status: 500, message: 'Failed to update user', details: err.message };
    }
};

/**
 * Xóa người dùng
 * @param {number} id - ID của người dùng cần xóa
 * @returns {Promise<Object>} Kết quả xóa
 */
const deleteUser = async (id) => {
    // Kiểm tra user tồn tại trước khi xóa
    const [users] = await db.query('SELECT id FROM users WHERE id = ?', [id]);
    if (!users || users.length === 0) {
        throw { status: 404, message: "User not found" };
    }

    // Thực hiện xóa user
    const [result] = await db.query('DELETE FROM users WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
        throw { status: 500, message: "Failed to delete user (no rows affected)" };
    }

    return { message: 'User deleted successfully' };
};

/**
 * Thay đổi trạng thái tài khoản
 * @param {number} id - ID của người dùng
 * @param {string} status - Trạng thái mới ('active' hoặc 'inactive')
 * @returns {Promise<Object>} Thông tin người dùng sau khi cập nhật
 */
const toggleAccountStatus = async (id, status) => {
    // Xác định giá trị is_active (1 = active, 0 = inactive)
    const is_active = status === 'active' ? 1 : 0;

    // Kiểm tra xem user này có phải admin không
    const [users] = await db.query('SELECT id, role_id FROM users WHERE id = ?', [id]);

    if (!users || users.length === 0) {
        throw { status: 404, message: "User not found" };
    }

    // Ngăn chặn việc khóa tài khoản admin
    if (users[0].role_id === 1) { // role_id = 1 là admin
        throw { status: 403, message: "Cannot change status of admin account" };
    }

    // Cập nhật trạng thái
    const [result] = await db.query('UPDATE users SET is_active = ? WHERE id = ?', [is_active, id]);

    if (result.affectedRows === 0) {
        throw { status: 500, message: "Failed to update account status" };
    }

    // Nếu thành công, trả về thông tin đã cập nhật - bao gồm thêm created_at
    const [updatedUser] = await db.query(
        'SELECT id, username, full_name, email, phone, gender, role_id, is_active, created_at, updated_at FROM users WHERE id = ?',
        [id]
    );

    if (!updatedUser || updatedUser.length === 0) {
        throw { status: 404, message: "Failed to retrieve updated user" };
    }

    const user = updatedUser[0];
    return {
        id: user.id,
        username: user.username,
        fullName: user.full_name,
        email: user.email,
        phone: user.phone,
        gender: user.gender,
        role: user.role_id === 1 ? 'admin' : user.role_id === 2 ? 'sales' : user.role_id === 3 ? 'warehouse' : 'unknown',
        status: user.is_active === 1 ? 'active' : 'inactive',
        createdAt: user.created_at, // Thêm trường này để hiển thị ngày tạo
    };
};

/**
 * Thay đổi mật khẩu người dùng
 * @param {number} id - ID của người dùng
 * @param {string} currentPassword - Mật khẩu hiện tại
 * @param {string} newPassword - Mật khẩu mới
 * @returns {Promise<Object>} Kết quả thay đổi mật khẩu
 */
const changePassword = async (id, currentPassword, newPassword) => {
    if (!currentPassword || !newPassword) {
        throw { status: 400, message: 'Current password and new password are required' };
    }

    // Get the user with their current password hash
    const [users] = await db.query(
        'SELECT id, password FROM users WHERE id = ?',
        [id]
    );

    if (!users || users.length === 0) {
        throw { status: 404, message: 'User not found' };
    }

    const user = users[0];

    // Verify current password
    const passwordMatches = await bcrypt.compare(currentPassword, user.password);
    if (!passwordMatches) {
        throw { status: 401, message: 'Current password is incorrect' };
    }

    // Hash the new password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    // Update the password
    const [result] = await db.query(
        'UPDATE users SET password = ? WHERE id = ?',
        [hashedPassword, id]
    );

    if (result.affectedRows === 0) {
        throw { status: 500, message: 'Failed to update password' };
    }
    
    return { message: 'Password updated successfully' };
};

module.exports = {
    getAllUsers,
    getUserById,
    addUser,
    updateUser,
    deleteUser,
    toggleAccountStatus,
    changePassword
};
