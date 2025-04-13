import axios from 'axios';

// Cấu hình axios
const apiClient = axios.create({
  baseURL: 'https://api.example.com', // Thay đổi thành URL API thực tế của bạn
  headers: {
    'Content-Type': 'application/json',
  },
});

// Thêm interceptor để xử lý token trong header
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Mô phỏng người dùng cho môi trường phát triển
const mockUsers = {
  admin: {
    id: 1,
    username: 'admin',
    password: 'admin123',
    displayName: 'Quản trị viên',
    role: 'ADMIN',
    email: 'admin@example.com'
  },
  seller: {
    id: 2,
    username: 'seller',
    password: 'seller123',
    displayName: 'Nguyễn Văn Bán',
    role: 'SALESPERSON',
    email: 'seller@example.com'
  },
  inventory: {
    id: 3,
    username: 'inventory',
    password: 'inventory123',
    displayName: 'Trần Văn Kho',
    role: 'INVENTORY',
    email: 'inventory@example.com'
  }
};

const authService = {
  // Hàm đăng nhập
  login: async (username, password) => {
    try {
      // Trong môi trường thực tế, bạn sẽ gọi API thực sự
      // const response = await apiClient.post('/auth/login', { username, password });
      // return response.data;
      
      // Mô phỏng API call trong môi trường phát triển
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          // Tìm user trong danh sách mẫu
          const user = Object.values(mockUsers).find(
            user => user.username === username && user.password === password
          );
          
          if (user) {
            const { password, ...userWithoutPassword } = user;
            resolve({
              token: `fake-jwt-token-${username}-${Date.now()}`,
              user: userWithoutPassword,
            });
          } else {
            reject({ message: 'Tên đăng nhập hoặc mật khẩu không chính xác' });
          }
        }, 800); // Giả lập độ trễ mạng
      });
    } catch (error) {
      console.error('Đăng nhập thất bại:', error);
      throw error.response?.data || { message: 'Đăng nhập thất bại' };
    }
  },

  // Kiểm tra token có hợp lệ không
  validateToken: async (token) => {
    try {
      // Trong môi trường thực tế, bạn sẽ gọi API thực sự
      // const response = await apiClient.post('/auth/validate-token');
      // return response.data.user;
      
      // Mô phỏng API call trong môi trường phát triển
      return new Promise((resolve) => {
        setTimeout(() => {
          // Phân tích token giả để xác định người dùng
          // Format: fake-jwt-token-{username}-{timestamp}
          const username = token.split('-')[2];
          const user = mockUsers[username];
          
          if (user) {
            const { password, ...userWithoutPassword } = user;
            resolve(userWithoutPassword);
          } else {
            // Trả về admin nếu không tìm thấy (trường hợp mặc định trong môi trường phát triển)
            const { password, ...adminWithoutPassword } = mockUsers.admin;
            resolve(adminWithoutPassword);
          }
        }, 300);
      });
    } catch (error) {
      console.error('Kiểm tra token thất bại:', error);
      throw error.response?.data || { message: 'Token không hợp lệ' };
    }
  },

  // Đăng xuất (chỉ xử lý phía client, server sẽ blacklist token)
  logout: async () => {
    try {
      // Trong môi trường thực tế, bạn có thể muốn gọi API để blacklist token
      // await apiClient.post('/auth/logout');
      localStorage.removeItem('token');
      return true;
    } catch (error) {
      console.error('Đăng xuất thất bại:', error);
      throw error.response?.data || { message: 'Đăng xuất thất bại' };
    }
  },
};

export default authService;