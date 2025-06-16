const db = require('../db');
const bcrypt = require('bcrypt');
const userModel = require('../models/userModel');

// Controller to get all users (dùng async/await)
exports.getAllUsers = async (req, res) => {
    try {
        const users = await userModel.getAllUsers();
        // Map dữ liệu sang format frontend cần
        const mappedUsers = users.map(u => ({
            id: u.id,
            username: u.username,
            fullName: u.full_name,
            email: u.email,
            phone: u.phone,
            gender: u.gender,
            role: u.role_id === 1 ? 'admin' : u.role_id === 2 ? 'sales' : u.role_id === 3 ? 'warehouse' : 'unknown',
            status: u.is_active === 1 ? 'active' : 'inactive',
            createdAt: u.created_at,
            lastLogin: u.updated_at // hoặc trường last_login nếu có
        }));
        res.json(mappedUsers);
    } catch (err) {
        console.error('Error fetching users:', err);
        res.status(500).json({ error: 'Failed to fetch users' });
    }
};

exports.getUser = async (req, res) => {
    try {
        const { id } = req.params;
        console.log(`Fetching user details for ID: ${id}`);
        
        const user = await userModel.getUserById(id);
        if (!user) {
            console.log(`User with ID ${id} not found`);
            return res.status(404).json({ error: 'User not found' });
        }
        
        console.log("User data from database:", user);
        
        // Return fields with consistent naming for frontend
        // Ensure consistent data types and defaults
        const userData = {
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
        
        console.log("User data being returned to frontend:", userData);
        res.json(userData);
    } catch (err) {
        console.error('Error fetching user:', err);
        res.status(500).json({ error: 'Failed to fetch user' });
    }
};

// Controller to add a new user
exports.addUser = async (req, res) => {
    try {
        const { username, fullName, email, phone, gender, role, password } = req.body;

        // Mã hóa mật khẩu
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Chuyển đổi role thành role_id
        let role_id;
        switch (role) {
            case 'admin': role_id = 1; break;
            case 'sales': role_id = 2; break;
            case 'warehouse': role_id = 3; break;
            default: role_id = 2; // Mặc định là nhân viên bán hàng
        }

        // Mặc định is_active là 1 (kích hoạt)
        const is_active = 1;

        // Thêm người dùng vào database
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
        res.status(201).json({
            id: result.insertId,
            username,
            fullName,
            email,
            phone,
            gender,
            role,
            status: 'active'
        });
    } catch (err) {
        console.error('Error adding user:', err);

        // Xử lý lỗi trùng tên đăng nhập
        if (err.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ error: 'Tên đăng nhập đã tồn tại' });
        }

        res.status(500).json({ error: 'Không thể thêm tài khoản' });
    }
};

// Controller to update a user
exports.updateUser = async (req, res) => {
    try {
        console.log("Update user request:", { id: req.params.id, body: req.body });
        const { id } = req.params;
        let {
            username,
            fullName,
            email,
            phone,
            gender,
            role,
            is_active,
            password
        } = req.body;

        // Validate required fields
        if (!username || !fullName || !email || !phone || gender === undefined || gender === null || !role) {
            console.log("Missing fields:", { username, fullName, email, phone, gender, role });
            return res.status(400).json({ error: "Missing required fields" });
        }

        // Chuyển đổi role thành role_id
        let role_id;
        switch (role) {
            case 'admin': role_id = 1; break;
            case 'sales': role_id = 2; break;
            case 'warehouse': role_id = 3; break;
            default: role_id = 2;
        }

        // Chuyển đổi gender thành số (0=male, 1=female)
        let genderValue;
        if (gender === "male" || gender === 0 || gender === "0") genderValue = 0;
        else if (gender === "female" || gender === 1 || gender === "1") genderValue = 1;
        else {
            console.log("Invalid gender value:", gender);
            return res.status(400).json({ error: "Invalid gender value" });
        }

        // Nếu không truyền lên thì giữ nguyên trạng thái cũ
        if (typeof is_active === "undefined") is_active = 1;

        // Kiểm tra user tồn tại trước khi update - Sửa lỗi db.promise
        try {
            // Sửa: sử dụng db.query thay vì db.promise().query
            const [users] = await db.query('SELECT id FROM users WHERE id = ?', [id]);
            if (!users || users.length === 0) {
                return res.status(404).json({ error: "User not found" });
            }
        } catch (err) {
            console.error("Error checking user existence:", err);
            return res.status(500).json({ error: "Database error when checking user", details: err.message });
        }

        // Nếu có password mới thì mã hóa, nếu không thì không update password
        let query, params;
        try {
            if (password) {
                const saltRounds = 10;
                const hashedPassword = await bcrypt.hash(password, saltRounds);
                query = `UPDATE users SET username = ?, full_name = ?, email = ?, phone = ?, gender = ?, role_id = ?, is_active = ?, password = ? WHERE id = ?`;
                params = [username, fullName, email, phone, genderValue, role_id, is_active, hashedPassword, id];
            } else {
                query = `UPDATE users SET username = ?, full_name = ?, email = ?, phone = ?, gender = ?, role_id = ?, is_active = ? WHERE id = ?`;
                params = [username, fullName, email, phone, genderValue, role_id, is_active, id];
            }

            console.log("Update query:", { query, params });
            // Sửa: sử dụng db.query thay vì db.promise().query
            const [result] = await db.query(query, params);

            if (result.affectedRows === 0) {
                return res.status(500).json({ error: "Failed to update user (no rows affected)" });
            }

            res.status(200).json({
                id,
                username,
                fullName,
                email,
                phone,
                gender,
                role,
                is_active
            });
        } catch (err) {
            console.error("SQL error:", err);
            res.status(500).json({ error: 'Failed to update user', details: err.message, sqlState: err.sqlState });
        }
    } catch (err) {
        console.error('Error in updateUser:', err);
        res.status(500).json({ error: 'Server error in user update', details: err.message });
    }
};

// Controller to delete a user
exports.deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        console.log(`Deleting user with ID: ${id}`);

        // Kiểm tra user tồn tại trước khi xóa - using db.query directly
        const [users] = await db.query('SELECT id FROM users WHERE id = ?', [id]);
        if (!users || users.length === 0) {
            return res.status(404).json({ error: "User not found" });
        }

        // Thực hiện xóa user - using db.query directly
        const [result] = await db.query('DELETE FROM users WHERE id = ?', [id]);

        if (result.affectedRows === 0) {
            return res.status(500).json({ error: "Failed to delete user (no rows affected)" });
        }

        res.status(200).json({ message: 'User deleted successfully' });
    } catch (err) {
        console.error('Error deleting user:', err);
        res.status(500).json({ error: 'Failed to delete user', details: err.message });
    }
};

exports.toggleAccountStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body; // Expect 'active' or 'inactive'

        console.log(`Toggling status for user ${id} to ${status}`);

        // Xác định giá trị is_active (1 = active, 0 = inactive)
        const is_active = status === 'active' ? 1 : 0;

        // Kiểm tra xem user này có phải admin không
        const [users] = await db.query('SELECT id, role_id FROM users WHERE id = ?', [id]);

        if (!users || users.length === 0) {
            return res.status(404).json({ error: "User not found" });
        }

        // Ngăn chặn việc khóa tài khoản admin
        if (users[0].role_id === 1) { // role_id = 1 là admin
            return res.status(403).json({ error: "Cannot change status of admin account" });
        }

        // Cập nhật trạng thái
        const [result] = await db.query('UPDATE users SET is_active = ? WHERE id = ?', [is_active, id]);

        if (result.affectedRows === 0) {
            return res.status(500).json({ error: "Failed to update account status" });
        }

        // Nếu thành công, trả về thông tin đã cập nhật - bao gồm thêm created_at
        const [updatedUser] = await db.query(
            'SELECT id, username, full_name, email, phone, gender, role_id, is_active, created_at, updated_at FROM users WHERE id = ?',
            [id]
        );

        if (!updatedUser || updatedUser.length === 0) {
            return res.status(404).json({ error: "Failed to retrieve updated user" });
        }

        const user = updatedUser[0];
        res.status(200).json({
            id: user.id,
            username: user.username,
            fullName: user.full_name,
            email: user.email,
            phone: user.phone,
            gender: user.gender,
            role: user.role_id === 1 ? 'admin' : user.role_id === 2 ? 'sales' : user.role_id === 3 ? 'warehouse' : 'unknown',
            status: user.is_active === 1 ? 'active' : 'inactive',
            createdAt: user.created_at, // Thêm trường này để hiển thị ngày tạo
        });
    } catch (err) {
        console.error('Error toggling account status:', err);
        res.status(500).json({ error: 'Failed to toggle account status', details: err.message });
    }
};

// Controller to change password
exports.changePassword = async (req, res) => {
    try {
        const { id } = req.params;
        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({ error: 'Current password and new password are required' });
        }

        // Get the user with their current password hash
        const [users] = await db.query(
            'SELECT id, password FROM users WHERE id = ?',
            [id]
        );

        if (!users || users.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        const user = users[0];

        // Verify current password
        const passwordMatches = await bcrypt.compare(currentPassword, user.password);
        if (!passwordMatches) {
            return res.status(401).json({ error: 'Current password is incorrect' });
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
            return res.status(500).json({ error: 'Failed to update password' });
        }

        res.status(200).json({ message: 'Password updated successfully' });
    } catch (err) {
        console.error('Error changing password:', err);
        res.status(500).json({ error: 'Server error when changing password', details: err.message });
    }
};
