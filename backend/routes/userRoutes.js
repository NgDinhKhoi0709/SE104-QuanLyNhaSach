const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Route to get all users
router.get('/', userController.getAllUsers);
router.get('/all', userController.getAllUsers);

// Đảm bảo route này được định nghĩa đúng
router.post('/', userController.addUser);

// Thêm route để cập nhật người dùng
router.put('/:id', userController.updateUser);

// Thêm route để xóa người dùng
router.delete('/:id', userController.deleteUser);

// Thêm route để thay đổi trạng thái người dùng (mở/khóa)
router.patch('/:id/status', userController.toggleAccountStatus);

module.exports = router;
