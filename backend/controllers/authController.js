const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../db'); // Adjust the path to your db connection file

// JWT Secret key - should be in environment variables in production
const JWT_SECRET = 'yoursecretkey123';

// Login controller
exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;
        console.log('Login attempt for user:', username);

        if (!username || !password) {
            return res.status(400).json({ message: 'Vui lòng cung cấp tên đăng nhập và mật khẩu' });
        }

        // Check if username exists
        const [users] = await db.query('SELECT * FROM users WHERE username = ?', [username]);

        console.log('Found users:', users.length);

        if (users.length === 0) {
            return res.status(401).json({ message: 'Tài khoản không tồn tại' });
        }

        const user = users[0];
        console.log('User found:', { username: user.username, role_id: user.role_id });

        // So sánh mật khẩu
        let isMatch;
        if (user.username === 'admin') {
            // Admin dùng mật khẩu plain text
            isMatch = password === user.password;
            console.log('Admin login, plain text compare:', isMatch);
        } else {
            // Các user khác dùng bcrypt
            isMatch = await bcrypt.compare(password, user.password);
            console.log('Password match (bcrypt):', isMatch);
        }

        if (!isMatch) {
            return res.status(401).json({ message: 'Mật khẩu không chính xác' });
        }

        // Generate JWT token
        const token = jwt.sign(
            { id: user.id, username: user.username, role_id: user.role_id },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        // Send response with user data and token
        res.status(200).json({
            message: 'Đăng nhập thành công',
            user: {
                id: user.id,
                username: user.username,
                full_name: user.full_name,
                role_id: user.role_id
            },
            token
        });
    } catch (error) {
        console.error('Login server error:', error);
        res.status(500).json({ message: 'Lỗi máy chủ: ' + error.message });
    }
};