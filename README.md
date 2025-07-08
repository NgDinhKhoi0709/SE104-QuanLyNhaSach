# Phần Mềm Quản Lý Nhà Sách

> Đồ án cuối kỳ môn **Nhập môn Công nghệ Phần mềm (SE104)**

---

## Mục Lục

- [Giới Thiệu](#giới-thiệu)
- [Tính Năng Chính](#tính-năng-chính)
- [Công Nghệ Sử Dụng](#công-nghệ-sử-dụng)
- [Thành Viên Nhóm](#thành-viên-nhóm)
- [Hướng Dẫn Cài Đặt](#hướng-dẫn-cài-đặt)
- [Tài Khoản Hệ Thống](#tài-khoản-hệ-thống)
- [Đóng Góp](#đóng-góp)

---

## Giới Thiệu

Phần mềm **Quản Lý Nhà Sách** là một hệ thống quản lý toàn diện được phát triển nhằm hỗ trợ việc vận hành hiệu quả một cửa hàng sách. Hệ thống cung cấp các chức năng quản lý từ cơ bản đến nâng cao, giúp tối ưu hóa quy trình kinh doanh và nâng cao trải nghiệm người dùng.

### Mục Tiêu

- Số hóa quy trình quản lý nhà sách
- Tối ưu hóa việc quản lý kho hàng và bán hàng
- Cung cấp báo cáo thống kê chi tiết
- Hỗ trợ phân quyền người dùng linh hoạt

---

## Tính Năng Chính

### Quản Lý Sách và Danh Mục

- **Quản lý đầu sách**  
  Quản lý chi tiết thông tin sách: tiêu đề, tác giả, mô tả, hình ảnh bìa, giá cả và số lượng tồn kho

- **Quản lý thể loại sách**  
  Phân loại sách theo danh mục để dễ dàng sắp xếp, tìm kiếm và quản lý kho hàng

- **Quản lý nhà xuất bản**  
  Lưu trữ và cập nhật thông tin chi tiết về các nhà xuất bản cung cấp đầu sách

### Quản Lý Nhà Cung Cấp và Nhập Hàng

- **Quản lý nhà cung cấp**  
  Quản lý danh sách nhà cung cấp, thông tin liên hệ và lịch sử giao dịch

- **Quản lý nhập sách**  
  Theo dõi quy trình nhập hàng từ đặt hàng đến cập nhật tồn kho

### Quản Lý Bán Hàng và Khuyến Mãi

- **Quản lý hóa đơn**  
  Xử lý giao dịch bán hàng, in hóa đơn và theo dõi lịch sử mua hàng

- **Quản lý khuyến mãi**  
  Thiết lập và quản lý các chương trình giảm giá, ưu đãi đặc biệt

### Báo Cáo và Quản Trị

- **Báo cáo thống kê**  
  Báo cáo doanh thu, tồn kho, sách bán chạy và các chỉ số kinh doanh quan trọng

- **Quản lý tài khoản**  
  Phân quyền người dùng với 3 cấp độ: Admin, Nhân viên thủ kho, Nhân viên bán hàng

- **Thay đổi quy định**  
  Cập nhật các chính sách, quy định kinh doanh của nhà sách

- **Quên mật khẩu**  
  Hỗ trợ khôi phục mật khẩu thông qua email OTP

---

## Công Nghệ Sử Dụng

### Frontend
- **React 18+** - Thư viện UI hiện đại
- **Vite** - Build tool nhanh chóng
- **CSS3** - Styling và responsive design
- **Axios** - HTTP client

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MySQL** - Cơ sở dữ liệu quan hệ
- **JWT** - Xác thực và phân quyền

### Tools và Others
- **npm** - Package manager
- **Git** - Version control
- **ESLint** - Code linting

---

## Thành Viên Nhóm


| **Hà Xuân Bách** - 22520088 
| **Nguyễn Tường Vinh** - 22521679  
| **Nguyễn Đình Khôi** - 23520774 
| **Đoàn Thái Hoàng** - 23520514 
| **Ngô Minh Trí** - 23521640 

---

## Hướng Dẫn Cài Đặt

### Yêu Cầu Hệ Thống

Trước khi bắt đầu, hãy đảm bảo máy tính của bạn đã cài đặt:

- **Node.js** phiên bản 18.0.0 trở lên ([Tải tại đây](https://nodejs.org/))
- **MySQL** phiên bản 8.0 trở lên ([Tải tại đây](https://mysql.com/downloads/))
- **Git** ([Tải tại đây](https://git-scm.com/))

### Hướng Dẫn Cài Đặt Chi Tiết

#### Bước 1: Clone Repository

```bash
git clone https://github.com/NgDinhKhoi0709/SE104-QuanLyNhaSach.git
cd SE104-QuanLyNhaSach
```

#### Bước 2: Cài Đặt Dependencies

**Cài đặt cho toàn bộ project:**
```bash
npm install
```

**Hoặc cài đặt riêng từng phần:**
```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

#### Bước 3: Cấu Hình Database

1. Tạo database MySQL với tên `cnpm`
2. Import file SQL từ thư mục `database/` (nếu có)
3. Cấu hình kết nối database trong `backend/db.js`

#### Bước 4: Cấu Hình Email (OTP)

Tạo file `.env` trong thư mục `backend/` với nội dung sau để cấu hình email cho tính năng quên mật khẩu:

```properties
# Email configuration
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
NODE_ENV=production

# Database configuration
DB_HOST=localhost
DB_USER=root
DB_PASS=your_database_password
DB_NAME=cnpm
```

**Hướng dẫn cấu hình Gmail:**
1. Bật 2-Step Verification cho tài khoản Gmail
2. Tạo App Password cho ứng dụng:
   - Vào Google Account → Security → 2-Step Verification → App passwords
   - Chọn "Mail" và "Other" → Nhập tên ứng dụng
   - Sử dụng mật khẩu được tạo cho `EMAIL_PASS`
3. Thay thế `EMAIL_USER` bằng địa chỉ Gmail của bạn

#### Bước 5: Khởi Động Ứng Dụng

**Chạy toàn bộ hệ thống:**
```bash
npm run dev
```

**Hoặc chạy riêng từng phần:**

```bash
# Terminal 1 - Backend (Port 3000)
cd backend
npm start

# Terminal 2 - Frontend (Port 5173)
cd frontend
npm run dev
```

#### Bước 6: Truy Cập Ứng Dụng

Mở trình duyệt và truy cập: **http://localhost:5173**

---

## Tài Khoản Hệ Thống

Hệ thống hỗ trợ 3 loại tài khoản với các quyền hạn khác nhau:

| Loại Tài Khoản | Tên Đăng Nhập | Mật Khẩu | Quyền Hạn |
|----------------|---------------|----------|-----------|
| **Quản trị viên** | `admin` | `123456` | Toàn quyền quản lý hệ thống |
| **Nhân viên thủ kho** | `adminaaaa` | `12345678` | Quản lý sách, nhập hàng, nhà cung cấp |
| **Nhân viên bán hàng** | `tttttt` | `123456789` | Quản lý hóa đơn, khuyến mãi, báo cáo |

### Chi Tiết Phân Quyền

#### Quản Trị Viên
- Quản lý tất cả chức năng của hệ thống
- Quản lý tài khoản người dùng
- Thay đổi quy định hệ thống
- Xem tất cả báo cáo

#### Nhân Viên Thủ Kho
- Quản lý đầu sách và thông tin sách
- Quản lý thể loại sách
- Quản lý nhà xuất bản
- Quản lý nhà cung cấp
- Quản lý nhập sách và tồn kho

#### Nhân Viên Bán Hàng
- Quản lý hóa đơn bán hàng
- Quản lý chương trình khuyến mãi
- Xem báo cáo doanh thu và thống kê
- Tìm kiếm thông tin sách

---


## Đóng Góp

Chúng tôi hoan nghênh mọi đóng góp để cải thiện dự án!

### Cách Đóng Góp
1. Fork repository này
2. Tạo branch mới (`git checkout -b feature/AmazingFeature`)
3. Commit thay đổi (`git commit -m 'Add some AmazingFeature'`)
4. Push lên branch (`git push origin feature/AmazingFeature`)
5. Tạo Pull Request

### Báo Lỗi
Nếu bạn phát hiện lỗi, vui lòng tạo issue mới với:
- Mô tả chi tiết lỗi
- Các bước để tái hiện lỗi
- Screenshots (nếu có)
- Thông tin môi trường (OS, Browser, Node.js version)

---

## License

Dự án này được phát triển cho mục đích học tập trong khuôn khổ môn học **SE104 - Nhập môn Công nghệ Phần mềm**.

---

