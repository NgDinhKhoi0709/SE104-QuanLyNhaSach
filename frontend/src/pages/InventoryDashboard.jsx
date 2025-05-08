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
    path: "books",
    label: "Quản lý đầu sách",
    icon: <FontAwesomeIcon icon={faBook} />,
    showActions: true,
  },
  {
    path: "categories",
    label: "Quản lý thể loại sách",
    icon: <FontAwesomeIcon icon={faListUl} />,
    showActions: true,
  },
  {
    path: "publishers",
    label: "Quản lý nhà xuất bản",
    icon: <FontAwesomeIcon icon={faBuilding} />,
    showActions: true,
  },
  {
    path: "imports",
    label: "Quản lý nhập sách",
    icon: <FontAwesomeIcon icon={faFileImport} />,
    showActions: true,
  },
  {
    path: "suppliers",
    label: "Quản lý nhà cung cấp",
    icon: <FontAwesomeIcon icon={faTruck} />,
    showActions: true,
  }
];

const InventoryDashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  // Lấy phần cuối của path để xác định bảng
  const route = location.pathname.split('/').pop() || "books";
  const currentMenuItem =
    inventoryMenuItems.find((item) => item.path === route) || inventoryMenuItems[0];
  const pageTitle = currentMenuItem.label;
  const showHeaderActions = currentMenuItem.showActions;

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    // Kiểm tra xem người dùng có phải là nhân viên thủ kho không
    if (user.role_id !== 3) {
      if (user.role_id === 1) {
        navigate('/admin');
      } else if (user.role_id === 2) {
        navigate('/sales');
      } else {
        navigate('/login');
      }
    }

    // Nếu đang ở trang gốc inventory, chuyển hướng đến trang đầu tiên (Books)
    if (location.pathname === '/inventory' || location.pathname === '/inventory/') {
      navigate('/inventory/books', { replace: true });
    }
  }, [user, navigate, location.pathname]);

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

  // Render bảng dữ liệu tùy theo route
  const renderTable = () => {
    switch (route) {
      case "books":
        return <BookTable onEdit={handleEdit} onDelete={handleDelete} onView={handleView} />;
      case "categories":
        return <CategoryTable onEdit={handleEdit} onDelete={handleDelete} />;
      case "publishers":
        return <PublisherTable onEdit={handleEdit} onDelete={handleDelete} />;
      case "imports":
        return <ImportTable onEdit={handleEdit} onDelete={handleDelete} onView={handleView} />;
      case "suppliers":
        return <SupplierTable onEdit={handleEdit} onDelete={handleDelete} />;
      default:
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