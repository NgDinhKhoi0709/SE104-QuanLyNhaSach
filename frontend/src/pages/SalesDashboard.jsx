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
    path: "/sales/invoices",
    label: "Quản lý hóa đơn",
    icon: <FontAwesomeIcon icon={faFileInvoice} />,
    showActions: true,
  },
  {
    path: "/sales/promotions",
    label: "Quản lý khuyến mãi",
    icon: <FontAwesomeIcon icon={faTag} />,
    showActions: true,
  },
  {
    path: "/sales/reports",
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
  const currentRoute = currentPath === "/" ? "/sales/invoices" : currentPath;
  const currentMenuItem =
    salesMenuItems.find((item) => item.path === currentRoute) || salesMenuItems[0];
  const pageTitle = currentMenuItem.label;
  const showHeaderActions = currentMenuItem.showActions;

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    // Chỉ chuyển hướng nếu KHÔNG phải nhân viên bán hàng
    if (user.role_id !== 2) {
      if (user.role_id === 1) {
        navigate('/admin-dashboard');
      } else if (user.role_id === 3) {
        navigate('/inventory-dashboard');
      } else {
        navigate('/login');
      }
    }
    // Nếu đang ở trang gốc, sales-dashboard hoặc route không hợp lệ, chuyển hướng đến /sales/invoices
    const validPaths = ["/sales/invoices", "/sales/promotions", "/sales/reports"];
    if (
      currentPath === '/sales' ||
      currentPath === '/sales-dashboard' ||
      !validPaths.includes(currentPath)
    ) {
      navigate('/sales/invoices', { replace: true });
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
      case "/sales/invoices":
        return (
          <InvoiceTable
            onEdit={handleEdit}
            onDelete={handleDelete}
            onView={handleView}
            onPrint={handlePrint}
          />
        );
      case "/sales/promotions":
        return (
          <PromotionTable
            onEdit={handleEdit}
            onDelete={handleDelete}
            onView={handleView}
          />
        );
      case "/sales/reports":
        return <ReportStatistics />;
      default:
        return null; // Không gọi navigate ở đây!
    }
  };

  if (!user) {
    return <div style={{ textAlign: 'center', marginTop: 60, fontSize: 18 }}>Đang tải thông tin người dùng...</div>;
  }
  if (user.role_id !== 2) {
    return <div style={{ textAlign: 'center', marginTop: 60, fontSize: 18, color: '#d32f2f' }}>Bạn không có quyền truy cập trang này.</div>;
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