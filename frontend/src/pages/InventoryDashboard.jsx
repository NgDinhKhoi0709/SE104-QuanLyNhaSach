import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBook,
  faListUl,
  faBuilding,
  faFileImport,
  faTruck
} from "@fortawesome/free-solid-svg-icons";
import Sidebar from "../components/common/Sidebar";
import Header from "../components/common/Header";
import BookTable from "../components/tables/BookTable";
import CategoryTable from "../components/tables/CategoryTable";
import PublisherTable from "../components/tables/PublisherTable";
import ImportTable from "../components/tables/ImportTable";
import SupplierTable from "../components/tables/SupplierTable";
import { useAuth } from "../contexts/AuthContext.jsx";  // Make sure the extension is .jsx
import "./Dashboard.css";
import "../styles/SearchBar.css";

// Dữ liệu menu sidebar cho nhân viên thủ kho - giới hạn quyền truy cập
const inventoryMenuItems = [
  {
    path: "/books",
    label: "Quản lý đầu sách",
    icon: <FontAwesomeIcon icon={faBook} />,
    showActions: true,
  },
  {
    path: "/categories",
    label: "Quản lý thể loại sách",
    icon: <FontAwesomeIcon icon={faListUl} />,
    showActions: true,
  },
  {
    path: "/publishers",
    label: "Quản lý nhà xuất bản",
    icon: <FontAwesomeIcon icon={faBuilding} />,
    showActions: true,
  },
  {
    path: "/imports",
    label: "Quản lý nhập sách",
    icon: <FontAwesomeIcon icon={faFileImport} />,
    showActions: true,
  },
  {
    path: "/suppliers",
    label: "Quản lý nhà cung cấp",
    icon: <FontAwesomeIcon icon={faTruck} />,
    showActions: true,
  }
];

const InventoryDashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  // Xác định trang hiện tại dựa trên URL
  const currentPath = location.pathname;
  // Đối với nhân viên thủ kho, mặc định hiển thị trang quản lý sách
  const currentRoute = currentPath === "/" ? "/books" : currentPath;
  const currentMenuItem =
    inventoryMenuItems.find((item) => item.path === currentRoute) || inventoryMenuItems[0];
  const pageTitle = currentMenuItem.label;
  const showHeaderActions = currentMenuItem.showActions;

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    // Kiểm tra xem người dùng có phải là nhân viên thủ kho không
    if (user.role_id !== 3) {
      // Chuyển hướng đến dashboard tương ứng với vai trò
      if (user.role_id === 1) {
        navigate('/admin-dashboard');
      } else if (user.role_id === 2) {
        navigate('/sales-dashboard');
      } else {
        navigate('/login');
      }
    }

    // Nếu đang ở trang gốc, chuyển hướng đến trang đầu tiên (Books)
    if (currentPath === '/' || currentPath === '/inventory-dashboard') {
      navigate('/books');
    }
  }, [user, navigate, currentPath]);

  // Các hàm xử lý chung cho tất cả các bảng
  const handleEdit = (item) => {
    alert(`Đang sửa ${JSON.stringify(item, null, 2)}`);
  };

  const handleDelete = (id) => {
    alert(`Đang xóa mục có ID: ${id}`);
  };

  const handleView = (item) => {
    alert(`Xem chi tiết: ${JSON.stringify(item, null, 2)}`);
  };

  // Render bảng dữ liệu tùy theo trang hiện tại
  const renderTable = () => {
    switch (currentRoute) {
      case "/books":
        return <BookTable onEdit={handleEdit} onDelete={handleDelete} onView={handleView} />;
      case "/categories":
        return <CategoryTable onEdit={handleEdit} onDelete={handleDelete} />;
      case "/publishers":
        return <PublisherTable onEdit={handleEdit} onDelete={handleDelete} />;
      case "/imports":
        return (
          <ImportTable
            onEdit={handleEdit}
            onDelete={handleDelete}
            onView={handleView}
          />
        );
      case "/suppliers":
        return <SupplierTable onEdit={handleEdit} onDelete={handleDelete} />;
      default:
        // Mặc định, chuyển hướng đến trang sách nếu đường dẫn không hợp lệ
        navigate('/books');
        return null;
    }
  };

  if (!user || user.role_id !== 3) {
    return null; // Không hiển thị nội dung nếu người dùng chưa đăng nhập hoặc không có quyền
  }

  return (
    <div className="dashboard">
      <Sidebar menuItems={inventoryMenuItems} />

      <div className="dashboard-content">
        <Header
          title={pageTitle}
          showActions={showHeaderActions}
          userRole="Nhân viên thủ kho"
        />

        <div className="content-wrapper">
          <div className="dashboard-heading">
            <h2 className="dashboard-title"></h2>
          </div>

          {renderTable()}
        </div>
      </div>
    </div>
  );
};

export default InventoryDashboard;