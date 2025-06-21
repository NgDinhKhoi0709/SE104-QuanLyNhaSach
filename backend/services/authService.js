const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../db');
const JWT_SECRET = 'yoursecretkey123';

/**
 * Xác thực người dùng dựa trên username và password
 * @param {string} username 
 * @param {string} password 
 * @returns {Object} 
 */
const authenticateUser = async (username, password) => {    if (!username || !password) {
        throw new Error('Vui lòng cung cấp tên đăng nhập và mật khẩu');
    }
    
    const [users] = await db.query('SELECT * FROM users WHERE username = ?', [username]);

    if (users.length === 0) {
        throw new Error('Tên đăng nhập và/hoặc mật khẩu không đúng');
    }
    const user = users[0];
    let isMatch;
    if (user.username === 'admin') {
        isMatch = password === user.password;
    } else {
        
        try {
            isMatch = await bcrypt.compare(password, user.password);
        } catch (err) {
            throw new Error('Lỗi xác thực: Định dạng mật khẩu không hợp lệ');
        }
    }

    if (!isMatch) {
        throw new Error('Tên đăng nhập và/hoặc mật khẩu không đúng');
    }

    const token = generateToken(user);

    return {
        user: {
            id: user.id,
            username: user.username,
            full_name: user.full_name,
            role_id: user.role_id
        },
        token
    };
};

/**
 * @param {Object} user - Đối tượng người dùng
 * @returns {string} - JWT token
 */
const generateToken = (user) => {
    return jwt.sign(
        { id: user.id, username: user.username, role_id: user.role_id },
        JWT_SECRET,
        { expiresIn: '24h' }
    );
};

/**
 * Xác thực token JWT
 * @param {string} token - JWT token cần xác thực
 * @returns {Object} - Dữ liệu đã giải mã từ token nếu hợp lệ
 */
const verifyToken = (token) => {
    if (!token) {
        throw new Error('Không tìm thấy token xác thực');
    }

    try {
        return jwt.verify(token, JWT_SECRET);
    } catch (error) {
        throw new Error('Token không hợp lệ hoặc đã hết hạn');
    }
};

module.exports = {
    authenticateUser,
    generateToken,
    verifyToken
};
