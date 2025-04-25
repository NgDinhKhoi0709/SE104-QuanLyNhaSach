import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBook,
  faListUl,
  faBuilding,
  faFileImport,
  faTruck,
  faFileInvoice,
  faTag,
  faChartBar,
  faCog,
  faUser
} from "@fortawesome/free-solid-svg-icons";
import Sidebar from "../components/common/Sidebar";
import Header from "../components/common/Header";
import BookTable from "../components/tables/BookTable";
import CategoryTable from "../components/tables/CategoryTable";
import PublisherTable from "../components/tables/PublisherTable";
import ImportTable from "../components/tables/ImportTable";
import SupplierTable from "../components/tables/SupplierTable";
import InvoiceTable from "../components/tables/InvoiceTable";
import PromotionTable from "../components/tables/PromotionTable";
import ReportStatistics from "../components/reports/ReportStatistics";
import RulesSettings from "../components/rules/RulesSettings";
import AccountsPage from "./accounts/AccountsPage";
import { useAuth } from "../contexts/AuthContext";
import "./Dashboard.css";
import "../styles/SearchBar.css";

// Dữ liệu menu sidebar cho quản trị viên - có thể truy cập tất cả chức năng
const adminMenuItems = [
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
  },
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
  },
  {
    path: "/rules",
    label: "Thay đổi quy định",
    icon: <FontAwesomeIcon icon={faCog} />,
    showActions: false,
  },
  {
    path: "/accounts",
    label: "Quản lý tài khoản",
    icon: <FontAwesomeIcon icon={faUser} />,
    showActions: true,
  },
];

const AdminDashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // Xác định trang hiện tại dựa trên URL
  const currentPath = location.pathname;
  const currentRoute = currentPath === "/" ? "/books" : currentPath;
  const currentMenuItem =
    adminMenuItems.find((item) => item.path === currentRoute) || adminMenuItems[0];
  const pageTitle = currentMenuItem.label;
  const showHeaderActions = currentMenuItem.showActions;

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    // Kiểm tra xem người dùng có phải là quản trị viên không
    if (user.role !== 'ADMIN') {
      // Chuyển hướng đến dashboard tương ứng với vai trò
      if (user.role === 'SALESPERSON') {
        navigate('/sales-dashboard');
      } else if (user.role === 'INVENTORY') {
        navigate('/inventory-dashboard');
      } else {
        navigate('/login');
      }
    }
    
    // Nếu đang ở trang gốc, chuyển hướng đến trang đầu tiên (Books)
    if (currentPath === '/' || currentPath === '/admin-dashboard') {
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

  const handlePrint = (item) => {
    alert(`In hóa đơn: ${JSON.stringify(item, null, 2)}`);
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
      case "/rules":
        return <RulesSettings />;
      case "/accounts":
        return <AccountsPage />;
      default:
        return <div>Nội dung đang được phát triển...</div>;
    }
  };

  if (!user || user.role !== 'ADMIN') {
    return null; // Không hiển thị nội dung nếu người dùng chưa đăng nhập hoặc không có quyền
  }

  return (
    <div className="dashboard">
      <Sidebar menuItems={adminMenuItems} />

      <div className="dashboard-content">
        {currentRoute !== '/accounts' && (
          <Header 
            title={pageTitle} 
            showActions={showHeaderActions}
            userRole="Quản trị viên"
          />
        )}

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

export default AdminDashboard;