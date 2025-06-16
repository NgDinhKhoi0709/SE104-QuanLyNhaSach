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

// Thêm hàm lấy thông tin người dùng theo ID
const getUserById = async (id) => {
    try {
        console.log(`Getting user data for ID: ${id}`);
        
        // Get all relevant user data including created_at
        const [rows] = await db.query(
            "SELECT id, username, full_name, email, phone, gender, role_id, is_active, created_at FROM users WHERE id = ?",
            [id]
        );
        
        if (rows.length === 0) {
            console.log(`No user found with ID: ${id}`);
            return null;
        }
        
        // Log found user data for debugging
        console.log("User data retrieved from database:", rows[0]);
        
        // Return the first (and only) result
        return rows[0];
    } catch (error) {
        console.error('Error in getUserById:', error);
        throw error;
    }
};

module.exports = {
    getAllUsers,
    createUser,
    getUserById
};
