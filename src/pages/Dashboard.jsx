import React, { useState, useEffect } from "react";
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
import { useAuthorization } from "../contexts/AuthorizationContext";
import "./Dashboard.css";
import "../styles/SearchBar.css";

// Dữ liệu mẫu cho menu sidebar
const menuItems = [
  {
    path: "/books",
    label: "Quản lý đầu sách",
    icon: <FontAwesomeIcon icon={faBook} />,
    showActions: true, // Hiển thị các nút hành động
  },
  {
    path: "/categories",
    label: "Quản lý thể loại sách",
    icon: <FontAwesomeIcon icon={faListUl} />,
    showActions: true, // Hiển thị các nút hành động
  },
  {
    path: "/publishers",
    label: "Quản lý nhà xuất bản",
    icon: <FontAwesomeIcon icon={faBuilding} />,
    showActions: true, // Hiển thị các nút hành động
  },
  {
    path: "/imports",
    label: "Quản lý nhập sách",
    icon: <FontAwesomeIcon icon={faFileImport} />,
    showActions: true, // Hiển thị các nút hành động
  },
  {
    path: "/suppliers",
    label: "Quản lý nhà cung cấp",
    icon: <FontAwesomeIcon icon={faTruck} />,
    showActions: true, // Hiển thị các nút hành động
  },
  {
    path: "/invoices",
    label: "Quản lý hóa đơn",
    icon: <FontAwesomeIcon icon={faFileInvoice} />,
    showActions: true, // Hiển thị các nút hành động
  },
  {
    path: "/promotions",
    label: "Quản lý khuyến mãi",
    icon: <FontAwesomeIcon icon={faTag} />,
    showActions: true, // Hiển thị các nút hành động
  },
  {
    path: "/reports",
    label: "Báo cáo/ Thống kê",
    icon: <FontAwesomeIcon icon={faChartBar} />,
    showActions: false, // Không hiển thị nút hành động
  },
  {
    path: "/rules",
    label: "Thay đổi quy định",
    icon: <FontAwesomeIcon icon={faCog} />,
    showActions: false, // Không hiển thị nút hành động
  },
  {
    path: "/accounts",
    label: "Quản lý tài khoản",
    icon: <FontAwesomeIcon icon={faUser} />,
    showActions: true, // Hiển thị các nút hành động
  },
];

const Dashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { hasPermission } = useAuthorization();

  // Sửa lại useEffect để xử lý chuyển hướng đúng cách
  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  // Xác định trang hiện tại dựa trên URL
  const currentPath = location.pathname;
  const currentRoute = currentPath === "/" ? "/books" : currentPath;
  const currentMenuItem =
    menuItems.find((item) => item.path === currentRoute) || menuItems[0];
  const pageTitle = currentMenuItem.label;
  const showHeaderActions = currentMenuItem.showActions;

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
      // Các trang khác có thể được thêm vào đây khi cần
      default:
        return <div>Nội dung đang được phát triển...</div>;
    }
  };

  return (
    <div className="dashboard">
      <Sidebar menuItems={menuItems} />

      <div className="dashboard-content">
        {currentRoute !== '/accounts' && (
          <Header 
            title={pageTitle} 
            showActions={false}
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

export default Dashboard;
