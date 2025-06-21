const authService = require('../services/authService');

// Login controller
exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;
        
        // Kiểm tra input đầu vào
        if (!username || !password) {
            return res.status(400).json({ message: 'Vui lòng cung cấp tên đăng nhập và mật khẩu' });
        }
        
        const result = await authService.authenticateUser(username, password);

        // Gửi phản hồi với dữ liệu người dùng và token
        res.status(200).json({
            message: 'Đăng nhập thành công',
            user: result.user,
            token: result.token
        });    } catch (error) {
        // Xác định mã trạng thái HTTP dựa trên loại lỗi
        const statusCode = error.message.includes('Vui lòng cung cấp') ? 400 : 401;
        
        res.status(statusCode).json({ message: error.message });
    }
};

// Thêm endpoint để xác thực token 
exports.validateToken = async (req, res) => {
    try {
        // Token đã được xác thực qua middleware
        const userId = req.user.id;
        
        // Lấy thông tin user từ database (có thể chuyển vào service)
        const userModel = require('../models/userModel');
        const user = await userModel.getUserById(userId);
        
        if (!user) {
            return res.status(404).json({ message: 'Không tìm thấy thông tin người dùng' });
        }
        
        res.status(200).json({
            message: 'Token hợp lệ',
            user
        });    } catch (error) {
        res.status(500).json({ message: 'Lỗi xác thực token: ' + error.message });
    }
};

// Endpoint đăng xuất
exports.logout = async (req, res) => {
    // Trong thực tế, có thể thêm token vào blacklist ở đây
    try {
        res.status(200).json({ message: 'Đăng xuất thành công' });    } catch (error) {
        res.status(500).json({ message: 'Lỗi đăng xuất: ' + error.message });
    }
};