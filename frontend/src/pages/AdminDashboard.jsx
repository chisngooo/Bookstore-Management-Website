import React, { useEffect, useState } from "react";
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
import ImportTable from "../components/tables/ImportTable";
import SupplierTable from "../components/tables/SupplierTable";
import InvoiceTable from "../components/tables/InvoiceTable";
import PromotionTable from "../components/tables/PromotionTable";
import ReportStatistics from "../components/reports/ReportStatistics";
import RulesSettings from "../components/rules/RulesSettings";
import AccountsPage from "./accounts/AccountsPage";
import { useAuth } from "../contexts/AuthContext.jsx";  // Add .jsx extension
import "./Dashboard.css";
import "../styles/SearchBar.css";

// Dữ liệu menu sidebar cho quản trị viên - có thể truy cập tất cả chức năng
const adminMenuItems = [
  {
    path: "books",
    label: "Quản lý đầu sách",
    icon: <FontAwesomeIcon icon={faBook} />,
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
  },
  {
    path: "invoices",
    label: "Quản lý bán hàng", // Đổi từ "Quản lý hóa đơn" thành "Quản lý bán hàng"
    icon: <FontAwesomeIcon icon={faFileInvoice} />,
    showActions: true,
  },
  {
    path: "promotions",
    label: "Quản lý khuyến mãi",
    icon: <FontAwesomeIcon icon={faTag} />,
    showActions: true,
  },
  {
    path: "reports",
    label: "Báo cáo/ Thống kê",
    icon: <FontAwesomeIcon icon={faChartBar} />,
    showActions: false,
  },
  {
    path: "rules",
    label: "Thay đổi quy định",
    icon: <FontAwesomeIcon icon={faCog} />,
    showActions: false,
  },
  {
    path: "accounts",
    label: "Quản lý tài khoản",
    icon: <FontAwesomeIcon icon={faUser} />,
    showActions: true,
  },
];

const AdminDashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  console.log("AdminDashboard rendering with path:", location.pathname);

  // Fix path handling to work with /admin prefix
  const currentPath = location.pathname;

  // Extract the relevant part of the path by removing the /admin prefix
  let routePath = currentPath;
  if (currentPath === "/admin" || currentPath === "/admin/") {
    routePath = "books";  // Default to books if at root admin path
  } else if (currentPath.startsWith("/admin/")) {
    routePath = currentPath.replace("/admin/", "");
  }

  console.log("Resolved routePath:", routePath);

  // Find the matching menu item based on the extracted path
  const currentMenuItem = adminMenuItems.find((item) =>
    location.pathname.startsWith("/admin/" + item.path)
  ) || adminMenuItems[0];
  const pageTitle = currentMenuItem?.label || "Dashboard";
  const showHeaderActions = currentMenuItem?.showActions || false;

  useEffect(() => {
    if (!user) {
      console.log("No user found, redirecting to login");
      navigate('/');
      return;
    }

    // Check for admin role
    if (user.role_id !== 1) {
      console.log("Not admin, redirecting");
      // Chuyển hướng đến dashboard tương ứng với vai trò
      if (user.role_id === 2) {
        navigate('/sales-dashboard');
      } else if (user.role_id === 3) {
        navigate('/inventory-dashboard');
      } else {
        navigate('/login');
      }
    }

    // Handle navigation at admin root
    if (currentPath === "/admin" || currentPath === "/admin/") {
      console.log("At admin root, redirecting to books");
      navigate('/admin/books');
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
    // Remove leading slash for switch statement
    const route = routePath.replace(/^\//, "");

    console.log("Rendering table for route:", route);

    switch (route) {
      case "books":
        return <BookTable onEdit={handleEdit} onDelete={handleDelete} onView={handleView} />;
      case "imports":
        return (
          <ImportTable
            onEdit={handleEdit}
            onDelete={handleDelete}
            onView={handleView}
          />
        );
      case "suppliers":
        return <SupplierTable onEdit={handleEdit} onDelete={handleDelete} />;
      case "invoices":
        return (
          <InvoiceTable
            onEdit={handleEdit}
            onDelete={handleDelete}
            onView={handleView}
            onPrint={handlePrint}
          />
        );
      case "promotions":
        return (
          <PromotionTable
            onEdit={handleEdit}
            onDelete={handleDelete}
            onView={handleView}
          />
        );
      case "reports":
        return <ReportStatistics />;
      case "rules":
        return <RulesSettings />;
      case "accounts":
        return <AccountsPage sidebarCollapsed={sidebarCollapsed} />;
      default:
        console.log("No matching route found for:", route);
        return <div>Không tìm thấy nội dung cho đường dẫn này.</div>;
    }
  };

  if (!user || user.role_id !== 1) {
    console.log("Not rendering AdminDashboard - no user or not admin");
    return null;
  }

  console.log("Rendering full AdminDashboard");

  return (
    <div className="dashboard">
      <Sidebar menuItems={adminMenuItems} onCollapse={setSidebarCollapsed} />

      <div className={`dashboard-content${sidebarCollapsed ? ' collapsed' : ''}`}>
        {routePath !== 'accounts' && (
          <Header
            title={pageTitle}
            userRole="Quản trị viên"
            sidebarCollapsed={sidebarCollapsed}
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