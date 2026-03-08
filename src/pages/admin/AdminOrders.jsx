import { useState, useEffect } from "react";
import axios from "axios";
import html2pdf from "html2pdf.js";

const STATUS_OPTIONS = ["pending", "confirmed", "delivered", "cancelled"];

const STATUS_LABELS = {
  pending: { en: "Pending", ar: "قيد الانتظار" },
  confirmed: { en: "Confirmed", ar: "مؤكد" },
  delivered: { en: "Delivered", ar: "تم التسليم" },
  cancelled: { en: "Cancelled", ar: "ملغي" },
};

const AdminOrders = ({ language }) => {
  const isRtl = language === "ar";
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [filterStatus, setFilterStatus] = useState("all");

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = () => {
    setLoading(true);
    axios
      .get("/api/orders")
      .then((res) => setOrders(res.data.orders))
      .catch((err) => console.error("Orders error:", err))
      .finally(() => setLoading(false));
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const res = await axios.patch(`/api/orders/${orderId}/status`, { status: newStatus });
      setOrders((prev) =>
        prev.map((o) => (o._id === orderId ? res.data.order : o))
      );
    } catch (err) {
      console.error("Status update error:", err);
    }
  };

  const handleDownloadPDF = (order) => {
    const element = document.getElementById(`order-detail-${order._id}`);
    if (!element) return;
    
    element.classList.add("pdf-generating");
    
    const opt = {
      margin:       0.5,
      filename:     `Order_${order._id.slice(-6).toUpperCase()}.pdf`,
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2 },
      jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
    };
    
    html2pdf().set(opt).from(element).save().then(() => {
      element.classList.remove("pdf-generating");
    });
  };

  const filteredOrders =
    filterStatus === "all" ? orders : orders.filter((o) => o.status === filterStatus);

  if (loading) {
    return (
      <div className="admin-stats-loading">
        <div className="admin-loading-spinner" />
      </div>
    );
  }

  return (
    <div className="admin-orders">
      {/* Filter bar */}
      <div className="orders-filter-bar">
        <h2 className="orders-title">
          <i className="fa-solid fa-bag-shopping" />
          {isRtl ? ` الطلبات (${orders.length})` : ` Orders (${orders.length})`}
        </h2>
        <div className="orders-filter-pills">
          <button
            className={`filter-pill ${filterStatus === "all" ? "is-active" : ""}`}
            onClick={() => setFilterStatus("all")}
          >
            {isRtl ? "الكل" : "All"}
          </button>
          {STATUS_OPTIONS.map((s) => (
            <button
              key={s}
              className={`filter-pill filter-pill--${s} ${filterStatus === s ? "is-active" : ""}`}
              onClick={() => setFilterStatus(s)}
            >
              {isRtl ? STATUS_LABELS[s].ar : STATUS_LABELS[s].en}
            </button>
          ))}
        </div>
      </div>

      {filteredOrders.length === 0 ? (
        <div className="admin-empty">
          <i className="fa-solid fa-inbox" />
          <p>{isRtl ? "لا توجد طلبات" : "No orders found"}</p>
        </div>
      ) : (
        <div className="orders-list">
          {filteredOrders.map((order) => (
            <div key={order._id} className="order-card">
              {/* Order header */}
              <div
                className="order-card-header"
                onClick={() =>
                  setExpandedOrder(expandedOrder === order._id ? null : order._id)
                }
              >
                <div className="order-card-left">
                  <span className="order-card-id">#{order._id.slice(-6).toUpperCase()}</span>
                  <span className="order-card-customer">{order.customer?.fullName}</span>
                </div>
                <div className="order-card-right">
                  <span className="order-card-total">LE {order.total?.toLocaleString()}</span>
                  <span className={`order-status-badge status-${order.status}`}>
                    {isRtl ? STATUS_LABELS[order.status].ar : STATUS_LABELS[order.status].en}
                  </span>
                  <i
                    className={`fa-solid fa-chevron-${expandedOrder === order._id ? "up" : "down"} order-card-chevron`}
                  />
                </div>
              </div>

              {/* Expanded details */}
              {expandedOrder === order._id && (
                <div className="order-card-body" id={`order-detail-${order._id}`}>
                  {/* Customer info */}
                  <div className="order-detail-section">
                    <h4>
                      <i className="fa-solid fa-user" />
                      {isRtl ? " معلومات العميل" : " Customer Info"}
                    </h4>
                    <div className="order-detail-grid">
                      <div><strong>{isRtl ? "الاسم" : "Name"}:</strong> {order.customer?.fullName}</div>
                      <div><strong>{isRtl ? "البريد" : "Email"}:</strong> {order.customer?.email}</div>
                      <div><strong>{isRtl ? "الهاتف" : "Phone"}:</strong> {order.customer?.phone}</div>
                      <div><strong>{isRtl ? "المحافظة" : "Gov."}:</strong> {order.customer?.governorate}</div>
                      <div className="order-detail-full"><strong>{isRtl ? "العنوان" : "Address"}:</strong> {order.customer?.address}</div>
                    </div>
                  </div>

                  {/* Items */}
                  <div className="order-detail-section">
                    <h4>
                      <i className="fa-solid fa-boxes-stacked" />
                      {isRtl ? " المنتجات" : " Items"}
                    </h4>
                    <div className="order-items-list">
                      {order.items?.map((item, i) => (
                        <div key={i} className="order-item-row">
                          <div className="order-item-img-wrap">
                            {item.image ? (
                              <img src={item.image} alt={item.name} />
                            ) : (
                              <div className="order-item-img-placeholder">
                                <i className="fa-solid fa-shirt" />
                              </div>
                            )}
                          </div>
                          <div className="order-item-info">
                            <span className="order-item-name">{item.name}</span>
                            <span className="order-item-meta">
                              {isRtl ? "المقاس" : "Size"}: {item.size} · {isRtl ? "الكمية" : "Qty"}: {item.quantity}
                            </span>
                          </div>
                          <span className="order-item-price">LE {(item.price * item.quantity).toLocaleString()}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Status change */}
                  <div className="order-detail-section order-status-section">
                    <h4>
                      <i className="fa-solid fa-pen" />
                      {isRtl ? " تغيير الحالة" : " Change Status"}
                    </h4>
                    <div className="order-status-actions">
                      {STATUS_OPTIONS.map((s) => (
                        <button
                          key={s}
                          className={`order-status-btn status-btn--${s} ${order.status === s ? "is-current" : ""}`}
                          onClick={() => handleStatusChange(order._id, s)}
                          disabled={order.status === s}
                        >
                          {isRtl ? STATUS_LABELS[s].ar : STATUS_LABELS[s].en}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Meta */}
                  <div className="order-meta-row" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div style={{ display: "flex", gap: "1rem" }}>
                      <span>
                        <i className="fa-solid fa-credit-card" />{" "}
                        {order.paymentMethod === "cash"
                          ? isRtl ? "الدفع عند الاستلام" : "Cash on Delivery"
                          : "InstaPay"}
                      </span>
                      <span>
                        <i className="fa-solid fa-clock" />{" "}
                        {new Date(order.createdAt).toLocaleString()}
                      </span>
                    </div>
                    <button 
                      className="login-btn" 
                      style={{ padding: "0.4rem 0.8rem", width: "auto", margin: 0, fontSize: "0.85rem", background: "#d6b15e", color: "#111" }}
                      onClick={() => handleDownloadPDF(order)}
                    >
                      <i className="fa-solid fa-download" style={{ marginRight: isRtl ? 0 : "0.4rem", marginLeft: isRtl ? "0.4rem" : 0 }} />
                      {isRtl ? "تحميل PDF" : "Download PDF"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
