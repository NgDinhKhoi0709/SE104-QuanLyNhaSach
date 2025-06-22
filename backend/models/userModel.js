const db = require('../db');

const getAllUsers = async () => {
    const [rows] = await db.query(
        "SELECT id, username, full_name, email, phone, gender, role_id, is_active, created_at, updated_at FROM users"
    );
    return rows;
};

const createUser = async (userData) => {
    const { username, password, full_name, email, phone, gender, role_id, is_active } = userData;
    const [result] = await db.query(
        `INSERT INTO users (username, password, full_name, email, phone, gender, role_id, is_active) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [username, password, full_name, email, phone, gender, role_id, is_active]
    );

    return result;
};

const getUserById = async (id) => {
    try {
        const [rows] = await db.query(
            "SELECT id, username, full_name, email, phone, gender, role_id, is_active, created_at FROM users WHERE id = ?",
            [id]
        );
        
        if (rows.length === 0) {
            return null;
        }
        
        return rows[0];
    } catch (error) {
        throw error;
    }
};

module.exports = {
    getAllUsers,
    createUser,
    getUserById
};
