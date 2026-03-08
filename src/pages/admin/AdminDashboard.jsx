import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import AdminStats from "./AdminStats";
import AdminOrders from "./AdminOrders";
import AdminUsers from "./AdminUsers";
import AdminProducts from "./AdminProducts";

const tabs = [
  { id: "dashboard", icon: "fa-solid fa-chart-line", labelEn: "Dashboard", labelAr: "لوحة التحكم" },
  { id: "products", icon: "fa-solid fa-box-open", labelEn: "Products", labelAr: "المنتجات" },
  { id: "orders", icon: "fa-solid fa-bag-shopping", labelEn: "Orders", labelAr: "الطلبات" },
  { id: "users", icon: "fa-solid fa-users", labelEn: "Users", labelAr: "المستخدمين" },
];

const AdminDashboard = ({ language }) => {
  const isRtl = language === "ar";
  const { user, isAdmin, loading, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!loading && !isAdmin) {
      navigate("/login");
    }
  }, [loading, isAdmin, navigate]);

  if (loading) {
    return (
      <div className="admin-loading">
        <div className="admin-loading-spinner" />
      </div>
    );
  }

  if (!isAdmin) return null;

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <AdminStats language={language} />;
      case "products":
        return <AdminProducts language={language} />;
      case "orders":
        return <AdminOrders language={language} />;
      case "users":
        return <AdminUsers language={language} />;
      default:
        return <AdminStats language={language} />;
    }
  };

  return (
    <div className="admin-layout" dir={isRtl ? "rtl" : "ltr"}>
      {/* Mobile hamburger */}
      <button
        className="admin-hamburger"
        onClick={() => setSidebarOpen((p) => !p)}
        aria-label="Toggle sidebar"
      >
        <i className={sidebarOpen ? "fa-solid fa-xmark" : "fa-solid fa-bars"} />
      </button>

      {/* Sidebar overlay for mobile */}
      {sidebarOpen && (
        <div className="admin-sidebar-overlay" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`admin-sidebar ${sidebarOpen ? "is-open" : ""}`}>
        <div className="admin-sidebar-header">
          <div className="admin-sidebar-logo">
            <i className="fa-solid fa-shield-halved" />
          </div>
          <span className="admin-sidebar-brand">
            {isRtl ? "لوحة الإدارة" : "Admin Panel"}
          </span>
        </div>

        <nav className="admin-sidebar-nav">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`admin-nav-item ${activeTab === tab.id ? "is-active" : ""}`}
              onClick={() => { setActiveTab(tab.id); setSidebarOpen(false); }}
            >
              <i className={tab.icon} />
              <span>{isRtl ? tab.labelAr : tab.labelEn}</span>
            </button>
          ))}
        </nav>

        <div className="admin-sidebar-footer">
          <button className="admin-nav-item" onClick={() => navigate("/")} style={{ marginBottom: "0.5rem" }}>
            <i className="fa-solid fa-house" />
            <span>{isRtl ? "العودة للمتجر" : "Store Home"}</span>
          </button>
          <button className="admin-nav-item admin-logout-btn" onClick={handleLogout}>
            <i className="fa-solid fa-right-from-bracket" />
            <span>{isRtl ? "تسجيل خروج" : "Logout"}</span>
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="admin-main">
        <header className="admin-topbar">
          <div className="admin-welcome">
            <h1 className="admin-welcome-title">
              {isRtl
                ? <>أهلاً مجدداً، {user?.name || "Admin"} <i className="fa-solid fa-wand-magic-sparkles" style={{ color: "#d6b15e", fontSize: "1.2rem", marginLeft: "0.5rem" }}></i></>
                : <>Welcome back, {user?.name || "Admin"} <i className="fa-solid fa-wand-magic-sparkles" style={{ color: "#d6b15e", fontSize: "1.2rem", marginLeft: "0.5rem" }}></i></>}
            </h1>
            <p className="admin-welcome-sub">
              {isRtl
                ? "إليك ما يحدث في متجرك اليوم"
                : "Here's what's happening in your store today"}
            </p>
          </div>
        </header>

        <div className="admin-content">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
