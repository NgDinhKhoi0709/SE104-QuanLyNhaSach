const db = require('../db');

const getAllUsers = async () => {
    const [rows] = await db.query(
        "SELECT id, username, full_name, email, phone, gender, role_id, is_active, created_at, updated_at FROM users"
    );
    return rows;
};

// Thêm hàm tạo mới người dùng
const createUser = async (userData) => {
    const { username, password, full_name, email, phone, gender, role_id, is_active } = userData;

    const [result] = await db.query(
        `INSERT INTO users (username, password, full_name, email, phone, gender, role_id, is_active) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [username, password, full_name, email, phone, gender, role_id, is_active]
    );

    return result;
};

module.exports = { getAllUsers, createUser };
