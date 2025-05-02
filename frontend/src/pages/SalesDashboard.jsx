import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFileInvoice,
  faTag,
  faChartBar
} from "@fortawesome/free-solid-svg-icons";
import Sidebar from "../components/common/Sidebar";
import Header from "../components/common/Header";
import InvoiceTable from "../components/tables/InvoiceTable";
import PromotionTable from "../components/tables/PromotionTable";
import ReportStatistics from "../components/reports/ReportStatistics";
import { useAuth } from "../contexts/AuthContext.jsx";  // Make sure the extension is .jsx
import "./Dashboard.css";
import "../styles/SearchBar.css";

// Dữ liệu menu sidebar cho nhân viên bán hàng - giới hạn quyền truy cập
const salesMenuItems = [
  {
    path: "/invoices",
    label: "Quản lý hóa đơn",
    icon: <FontAwesomeIcon icon={faFileInvoice} />,
    showActions: true,
  },
  {
    path: "/promotions",
    label: "Quản lý khuyến mãi",
    icon: <FontAwesomeIcon icon={faTag} />,
    showActions: true,
  },
  {
    path: "/reports",
    label: "Báo cáo/ Thống kê",
    icon: <FontAwesomeIcon icon={faChartBar} />,
    showActions: false,
  }
];

const SalesDashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  // Xác định trang hiện tại dựa trên URL
  const currentPath = location.pathname;
  // Đối với nhân viên bán hàng, mặc định hiển thị trang hóa đơn
  const currentRoute = currentPath === "/" ? "/invoices" : currentPath;
  const currentMenuItem =
    salesMenuItems.find((item) => item.path === currentRoute) || salesMenuItems[0];
  const pageTitle = currentMenuItem.label;
  const showHeaderActions = currentMenuItem.showActions;

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    // Kiểm tra xem người dùng có phải là nhân viên bán hàng không
    if (user.role_id !== 2) {
      // Chuyển hướng đến dashboard tương ứng với vai trò
      if (user.role_id === 1) {
        navigate('/admin-dashboard');
      } else if (user.role_id === 3) {
        navigate('/inventory-dashboard');
      } else {
        navigate('/login');
      }
    }

    // Nếu đang ở trang gốc, chuyển hướng đến trang đầu tiên (Invoices)
    if (currentPath === '/' || currentPath === '/sales-dashboard') {
      navigate('/invoices');
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

  const handlePrint = (item) => {
    alert(`In hóa đơn: ${JSON.stringify(item, null, 2)}`);
  };

  // Render bảng dữ liệu tùy theo trang hiện tại
  const renderTable = () => {
    switch (currentRoute) {
      case "/invoices":
        return (
          <InvoiceTable
            onEdit={handleEdit}
            onDelete={handleDelete}
            onView={handleView}
            onPrint={handlePrint}
          />
        );
      case "/promotions":
        return (
          <PromotionTable
            onEdit={handleEdit}
            onDelete={handleDelete}
            onView={handleView}
          />
        );
      case "/reports":
        return <ReportStatistics />;
      default:
        // Mặc định, chuyển hướng đến trang hóa đơn nếu đường dẫn không hợp lệ
        navigate('/invoices');
        return null;
    }
  };

  if (!user || user.role_id !== 2) {
    return null; // Không hiển thị nội dung nếu người dùng chưa đăng nhập hoặc không có quyền
  }

  return (
    <div className="dashboard">
      <Sidebar menuItems={salesMenuItems} />

      <div className="dashboard-content">
        <Header
          title={pageTitle}
          showActions={showHeaderActions}
          userRole="Nhân viên bán hàng"
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

export default SalesDashboard;