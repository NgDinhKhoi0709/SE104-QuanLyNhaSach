import axios from 'axios';

// Cấu hình axios
const apiClient = axios.create({
  baseURL: 'https://api.example.com',
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

// Dữ liệu mẫu cho tài khoản
const sampleAccounts = [
  {
    id: 1,
    username: 'admin',
    fullName: 'Nguyễn Văn Admin',
    email: 'admin@example.com',
    phone: '0901234567',
    role: 'admin',
    status: 'active',
    createdAt: '01/01/2025',
    lastLogin: '13/04/2025'
  },
  {
    id: 2,
    username: 'nhanvien1',
    fullName: 'Trần Thị Hương',
    email: 'huong.tran@example.com',
    phone: '0912345678',
    role: 'sales',
    status: 'active',
    createdAt: '15/01/2025',
    lastLogin: '10/04/2025'
  },
  {
    id: 3,
    username: 'thukho1',
    fullName: 'Lê Văn Minh',
    email: 'minh.le@example.com',
    phone: '0923456789',
    role: 'warehouse',
    status: 'active',
    createdAt: '20/01/2025',
    lastLogin: '12/04/2025'
  },
  {
    id: 4,
    username: 'nhanvien2',
    fullName: 'Phạm Thị Mai',
    email: 'mai.pham@example.com',
    phone: '0934567890',
    role: 'sales',
    status: 'inactive',
    createdAt: '10/02/2025',
    lastLogin: '01/03/2025'
  },
  {
    id: 5,
    username: 'thukho2',
    fullName: 'Hoàng Đức Thắng',
    email: 'thang.hoang@example.com',
    phone: '0945678901',
    role: 'warehouse',
    status: 'active',
    createdAt: '15/02/2025',
    lastLogin: '11/04/2025'
  },
  {
    id: 6,
    username: 'nhanvien3',
    fullName: 'Vũ Thị Hà',
    email: 'ha.vu@example.com',
    phone: '0956789012',
    role: 'sales',
    status: 'active',
    createdAt: '01/03/2025',
    lastLogin: '12/04/2025'
  }
];

const accountService = {
  // Lấy danh sách tài khoản
  getAccounts: async () => {
    try {
      // Trong môi trường thực tế, sẽ gọi API
      // const response = await apiClient.get('/accounts');
      // return response.data;
      
      // Mô phỏng API call trong môi trường phát triển
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(sampleAccounts);
        }, 500);
      });
    } catch (error) {
      console.error('Lấy danh sách tài khoản thất bại:', error);
      throw error.response?.data || { message: 'Lấy danh sách tài khoản thất bại' };
    }
  },

  // Lấy thông tin tài khoản theo ID
  getAccountById: async (id) => {
    try {
      // Trong môi trường thực tế, sẽ gọi API
      // const response = await apiClient.get(`/accounts/${id}`);
      // return response.data;
      
      // Mô phỏng API call trong môi trường phát triển
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          const account = sampleAccounts.find(acc => acc.id === id);
          if (account) {
            resolve(account);
          } else {
            reject({ message: 'Không tìm thấy tài khoản' });
          }
        }, 300);
      });
    } catch (error) {
      console.error('Lấy thông tin tài khoản thất bại:', error);
      throw error.response?.data || { message: 'Lấy thông tin tài khoản thất bại' };
    }
  },

  // Thêm tài khoản mới
  createAccount: async (accountData) => {
    try {
      // Trong môi trường thực tế, sẽ gọi API
      // const response = await apiClient.post('/accounts', accountData);
      // return response.data;
      
      // Mô phỏng API call trong môi trường phát triển
      return new Promise((resolve) => {
        setTimeout(() => {
          const newAccount = {
            id: Math.max(...sampleAccounts.map(acc => acc.id)) + 1,
            ...accountData,
            createdAt: new Date().toLocaleDateString('vi-VN'),
            lastLogin: '-'
          };
          sampleAccounts.push(newAccount);
          resolve(newAccount);
        }, 500);
      });
    } catch (error) {
      console.error('Thêm tài khoản thất bại:', error);
      throw error.response?.data || { message: 'Thêm tài khoản thất bại' };
    }
  },

  // Cập nhật thông tin tài khoản
  updateAccount: async (id, accountData) => {
    try {
      // Trong môi trường thực tế, sẽ gọi API
      // const response = await apiClient.put(`/accounts/${id}`, accountData);
      // return response.data;
      
      // Mô phỏng API call trong môi trường phát triển
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          const index = sampleAccounts.findIndex(acc => acc.id === id);
          if (index !== -1) {
            const updatedAccount = {
              ...sampleAccounts[index],
              ...accountData,
              id: id // đảm bảo id không bị thay đổi
            };
            sampleAccounts[index] = updatedAccount;
            resolve(updatedAccount);
          } else {
            reject({ message: 'Không tìm thấy tài khoản' });
          }
        }, 500);
      });
    } catch (error) {
      console.error('Cập nhật tài khoản thất bại:', error);
      throw error.response?.data || { message: 'Cập nhật tài khoản thất bại' };
    }
  },

  // Thay đổi trạng thái tài khoản (kích hoạt/vô hiệu hóa)
  toggleAccountStatus: async (id) => {
    try {
      // Trong môi trường thực tế, sẽ gọi API
      // const response = await apiClient.patch(`/accounts/${id}/toggle-status`);
      // return response.data;
      
      // Mô phỏng API call trong môi trường phát triển
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          const index = sampleAccounts.findIndex(acc => acc.id === id);
          if (index !== -1) {
            const newStatus = sampleAccounts[index].status === 'active' ? 'inactive' : 'active';
            sampleAccounts[index] = {
              ...sampleAccounts[index],
              status: newStatus
            };
            resolve(sampleAccounts[index]);
          } else {
            reject({ message: 'Không tìm thấy tài khoản' });
          }
        }, 300);
      });
    } catch (error) {
      console.error('Thay đổi trạng thái tài khoản thất bại:', error);
      throw error.response?.data || { message: 'Thay đổi trạng thái tài khoản thất bại' };
    }
  },

  // Xóa tài khoản
  deleteAccount: async (id) => {
    try {
      // Trong môi trường thực tế, sẽ gọi API
      // const response = await apiClient.delete(`/accounts/${id}`);
      // return response.data;
      
      // Mô phỏng API call trong môi trường phát triển
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          const index = sampleAccounts.findIndex(acc => acc.id === id);
          if (index !== -1) {
            sampleAccounts.splice(index, 1);
            resolve({ success: true, message: 'Xóa tài khoản thành công' });
          } else {
            reject({ message: 'Không tìm thấy tài khoản' });
          }
        }, 500);
      });
    } catch (error) {
      console.error('Xóa tài khoản thất bại:', error);
      throw error.response?.data || { message: 'Xóa tài khoản thất bại' };
    }
  },
  
  // Đặt lại mật khẩu
  resetPassword: async (id) => {
    try {
      // Trong môi trường thực tế, sẽ gọi API
      // const response = await apiClient.post(`/accounts/${id}/reset-password`);
      // return response.data;
      
      // Mô phỏng API call trong môi trường phát triển
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          const account = sampleAccounts.find(acc => acc.id === id);
          if (account) {
            // Mật khẩu mặc định khi reset là "password123"
            resolve({ 
              success: true, 
              message: 'Đặt lại mật khẩu thành công',
              defaultPassword: 'password123'
            });
          } else {
            reject({ message: 'Không tìm thấy tài khoản' });
          }
        }, 400);
      });
    } catch (error) {
      console.error('Đặt lại mật khẩu thất bại:', error);
      throw error.response?.data || { message: 'Đặt lại mật khẩu thất bại' };
    }
  },
  
  // Tìm kiếm tài khoản
  searchAccounts: async (searchTerm) => {
    try {
      // Trong môi trường thực tế, sẽ gọi API
      // const response = await apiClient.get(`/accounts/search?term=${searchTerm}`);
      // return response.data;
      
      // Mô phỏng API call trong môi trường phát triển
      return new Promise((resolve) => {
        setTimeout(() => {
          const searchTermLower = searchTerm.toLowerCase();
          const results = sampleAccounts.filter(account => 
            account.username.toLowerCase().includes(searchTermLower) ||
            account.fullName.toLowerCase().includes(searchTermLower) ||
            account.email.toLowerCase().includes(searchTermLower) ||
            account.phone.includes(searchTerm)
          );
          resolve(results);
        }, 300);
      });
    } catch (error) {
      console.error('Tìm kiếm tài khoản thất bại:', error);
      throw error.response?.data || { message: 'Tìm kiếm tài khoản thất bại' };
    }
  }
};

export default accountService;