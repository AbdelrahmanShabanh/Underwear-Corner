import { useState, useEffect } from "react";
import axios from "axios";

const AdminStats = ({ language }) => {
  const isRtl = language === "ar";
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("/api/stats")
      .then((res) => setStats(res.data))
      .catch((err) => console.error("Stats error:", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="admin-stats-loading">
        <div className="admin-loading-spinner" />
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="admin-empty">
        <i className="fa-solid fa-chart-bar" />
        <p>{isRtl ? "لا توجد بيانات بعد" : "No data available yet"}</p>
      </div>
    );
  }

  const cards = [
    {
      icon: "fa-solid fa-coins",
      label: isRtl ? "إجمالي الإيرادات" : "Total Revenue",
      value: `LE ${stats.totalRevenue.toLocaleString()}`,
      color: "#d6b15e",
    },
    {
      icon: "fa-solid fa-bag-shopping",
      label: isRtl ? "إجمالي الطلبات" : "Total Orders",
      value: stats.totalOrders,
      color: "#6c9dff",
    },
    {
      icon: "fa-solid fa-calendar-week",
      label: isRtl ? "طلبات هذا الأسبوع" : "Orders This Week",
      value: stats.ordersThisWeek,
      color: "#4ade80",
    },
    {
      icon: "fa-solid fa-calendar",
      label: isRtl ? "طلبات هذا الشهر" : "Orders This Month",
      value: stats.ordersThisMonth,
      color: "#c084fc",
    },
  ];

  const revenueCards = [
    {
      label: isRtl ? "إيرادات الأسبوع" : "Revenue This Week",
      value: `LE ${stats.revenueThisWeek.toLocaleString()}`,
      icon: "fa-solid fa-chart-line",
    },
    {
      label: isRtl ? "إيرادات الشهر" : "Revenue This Month",
      value: `LE ${stats.revenueThisMonth.toLocaleString()}`,
      icon: "fa-solid fa-chart-area",
    },
    {
      label: isRtl ? "إيرادات السنة" : "Revenue This Year",
      value: `LE ${stats.revenueThisYear.toLocaleString()}`,
      icon: "fa-solid fa-chart-pie",
    },
  ];

  const statusData = stats.statusBreakdown;
  const statusTotal = statusData.pending + statusData.confirmed + statusData.delivered + statusData.cancelled || 1;

  return (
    <div className="admin-stats">
      {/* Main stat cards */}
      <div className="stats-cards-grid">
        {cards.map((card, i) => (
          <div key={i} className="stat-card">
            <div className="stat-card-icon" style={{ background: `${card.color}20`, color: card.color }}>
              <i className={card.icon} />
            </div>
            <div className="stat-card-info">
              <span className="stat-card-value">{card.value}</span>
              <span className="stat-card-label">{card.label}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Revenue breakdown */}
      <div className="stats-section">
        <h3 className="stats-section-title">
          <i className="fa-solid fa-money-bill-trend-up" />
          {isRtl ? " تفاصيل الإيرادات" : " Revenue Breakdown"}
        </h3>
        <div className="stats-revenue-grid">
          {revenueCards.map((r, i) => (
            <div key={i} className="revenue-card">
              <i className={r.icon} />
              <span className="revenue-card-value">{r.value}</span>
              <span className="revenue-card-label">{r.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Order status breakdown */}
      <div className="stats-section">
        <h3 className="stats-section-title">
          <i className="fa-solid fa-list-check" />
          {isRtl ? " حالة الطلبات" : " Order Status"}
        </h3>
        <div className="status-bars">
          {[
            { key: "pending", label: isRtl ? "قيد الانتظار" : "Pending", color: "#f59e0b" },
            { key: "confirmed", label: isRtl ? "مؤكد" : "Confirmed", color: "#6c9dff" },
            { key: "delivered", label: isRtl ? "تم التسليم" : "Delivered", color: "#4ade80" },
            { key: "cancelled", label: isRtl ? "ملغي" : "Cancelled", color: "#ef4444" },
          ].map((s) => (
            <div key={s.key} className="status-bar-row">
              <div className="status-bar-label">
                <span className="status-bar-dot" style={{ background: s.color }} />
                <span>{s.label}</span>
                <span className="status-bar-count">{statusData[s.key]}</span>
              </div>
              <div className="status-bar-track">
                <div
                  className="status-bar-fill"
                  style={{
                    width: `${(statusData[s.key] / statusTotal) * 100}%`,
                    background: s.color,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent orders */}
      {stats.recentOrders && stats.recentOrders.length > 0 && (
        <div className="stats-section">
          <h3 className="stats-section-title">
            <i className="fa-solid fa-clock-rotate-left" />
            {isRtl ? " آخر الطلبات" : " Recent Orders"}
          </h3>
          <div className="stats-recent-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>{isRtl ? "العميل" : "Customer"}</th>
                  <th>{isRtl ? "الإجمالي" : "Total"}</th>
                  <th>{isRtl ? "الحالة" : "Status"}</th>
                  <th>{isRtl ? "التاريخ" : "Date"}</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentOrders.map((order) => (
                  <tr key={order._id}>
                    <td>{order.customer?.fullName || "—"}</td>
                    <td>LE {order.total?.toLocaleString()}</td>
                    <td>
                      <span className={`order-status-badge status-${order.status}`}>
                        {order.status}
                      </span>
                    </td>
                    <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminStats;
