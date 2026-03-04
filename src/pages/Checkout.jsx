import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const WHATSAPP_NUMBER = "201008872621"; // 010... with country code, no +

const GOVERNORATES = [
  "Cairo", "Giza", "Alexandria", "Dakahlia", "Red Sea", "Beheira",
  "Fayoum", "Gharbia", "Ismailia", "Menofia", "Minya", "Qalyubia",
  "New Valley", "North Sinai", "Port Said", "Damietta", "Sharqia",
  "South Sinai", "Suez", "Luxor", "Matrouh", "Qena", "Sohag", "Aswan", "Assiut", "Beni Suef",
];

const GOVERNORATES_AR = [
  "القاهرة", "الجيزة", "الإسكندرية", "الدقهلية", "البحر الأحمر", "البحيرة",
  "الفيوم", "الغربية", "الإسماعيلية", "المنوفية", "المنيا", "القليوبية",
  "الوادي الجديد", "شمال سيناء", "بورسعيد", "دمياط", "الشرقية",
  "جنوب سيناء", "السويس", "الأقصر", "مطروح", "قنا", "سوهاج", "أسوان", "أسيوط", "بني سويف",
];

const Checkout = ({ language, cartItems, onClearCart }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const isRtl = language === "ar";

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    governorate: "",
    address: "",
  });

  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const total = cartItems.reduce((sum, item) => {
    const n = parseFloat(item.price.replace(/[^\d.]/g, ""));
    return sum + n * item.quantity;
  }, 0);

  const validate = () => {
    const errs = {};
    if (!form.fullName.trim()) errs.fullName = isRtl ? "الاسم مطلوب" : "Full name is required";
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email))
      errs.email = isRtl ? "بريد إلكتروني غير صحيح" : "Valid email is required";
    if (!form.phone.trim() || form.phone.replace(/\D/g, "").length < 10)
      errs.phone = isRtl ? "رقم هاتف غير صحيح" : "Valid phone number is required";
    if (!form.governorate) errs.governorate = isRtl ? "اختر المحافظة" : "Governorate is required";
    if (!form.address.trim()) errs.address = isRtl ? "العنوان مطلوب" : "Address is required";
    return errs;
  };

  const buildWhatsAppMessage = () => {
    const itemLines = cartItems
      .map(
        (item) =>
          `• ${item.name["en"]} | Size: ${item.size} | Qty: ${item.quantity} | Price: ${item.price}`
      )
      .join("\n");

    const govLabel = form.governorate;
    const payment =
      paymentMethod === "cash"
        ? "Cash on Delivery"
        : "Instapay (sent to 01000000)";

    return (
      `🛍️ *New Order - Underwear Corner*\n\n` +
      `👤 *Customer Details*\n` +
      `Name: ${form.fullName}\n` +
      `Email: ${form.email}\n` +
      `Phone: ${form.phone}\n` +
      `Governorate: ${govLabel}\n` +
      `Address: ${form.address}\n\n` +
      `📦 *Order Items*\n${itemLines}\n\n` +
      `💰 *Total: LE ${total.toFixed(2)}*\n` +
      `💳 *Payment Method:* ${payment}`
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setErrors({});

    const message = buildWhatsAppMessage();
    const encoded = encodeURIComponent(message);
    const waUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encoded}`;
    window.open(waUrl, "_blank");

    // Save order to backend API
    try {
      const orderItems = cartItems.map((item) => ({
        productId: item.id,
        name: item.name?.en || item.name,
        size: item.size,
        quantity: item.quantity,
        price: parseFloat(item.price.replace(/[^\d.]/g, "")),
        image: item.image || "",
      }));

      await axios.post("/api/orders", {
        customer: {
          fullName: form.fullName,
          email: form.email,
          phone: form.phone,
          governorate: form.governorate,
          address: form.address,
        },
        items: orderItems,
        total,
        paymentMethod,
        userId: user?.id || null,
      });
    } catch (err) {
      console.error("Failed to save order to API:", err);
    }

    setSubmitted(true);
    if (onClearCart) onClearCart();

    setTimeout(() => {
      navigate("/");
    }, 4000);
  };

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const govList = isRtl ? GOVERNORATES_AR : GOVERNORATES;

  if (submitted) {
    return (
      <div className="checkout-success">
        <div className="checkout-success-card">
          <div className="checkout-success-icon">
            <i className="fa-solid fa-circle-check" />
          </div>
          <h2>
            {isRtl
              ? "تم تقديم الطلب!"
              : "Order Placed!"}
          </h2>
          <p>
            {isRtl
              ? "شكراً لك! ستتلقى قريباً رسالة منا لتأكيد طلبك."
              : "Thank you! You will soon receive a message from us to confirm your order."}
          </p>
          <span className="checkout-success-redirect">
            {isRtl ? "جارٍ تحويلك للصفحة الرئيسية…" : "Redirecting you to the home page…"}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page" dir={isRtl ? "rtl" : "ltr"}>
      <div className="checkout-container">

        {/* ── LEFT COLUMN: Form ── */}
        <form className="checkout-form" onSubmit={handleSubmit} noValidate>
          <h1 className="checkout-heading">
            {isRtl ? "استكمال الطلب" : "Checkout"}
          </h1>

          {/* Shipping Address */}
          <section className="checkout-section">
            <h3 className="checkout-section-title">
              <i className="fa-solid fa-location-dot" />
              {isRtl ? " عنوان الشحن" : " Shipping Address"}
            </h3>

            <div className="co-row co-row--2">
              <div className={`co-field ${errors.fullName ? "co-field--error" : ""}`}>
                <label>{isRtl ? "الاسم الكامل" : "Full Name"} *</label>
                <input
                  type="text"
                  placeholder={isRtl ? "محمد أحمد" : "John Doe"}
                  value={form.fullName}
                  onChange={handleChange("fullName")}
                />
                {errors.fullName && <span className="co-error">{errors.fullName}</span>}
              </div>

              <div className={`co-field ${errors.email ? "co-field--error" : ""}`}>
                <label>{isRtl ? "البريد الإلكتروني" : "Email Address"} *</label>
                <input
                  type="email"
                  placeholder={isRtl ? "example@mail.com" : "you@email.com"}
                  value={form.email}
                  onChange={handleChange("email")}
                />
                {errors.email && <span className="co-error">{errors.email}</span>}
              </div>
            </div>

            <div className="co-row co-row--2">
              <div className={`co-field ${errors.phone ? "co-field--error" : ""}`}>
                <label>{isRtl ? "رقم الهاتف" : "Phone Number"} *</label>
                <input
                  type="tel"
                  placeholder={isRtl ? "01XXXXXXXXX" : "01XXXXXXXXX"}
                  value={form.phone}
                  onChange={handleChange("phone")}
                />
                {errors.phone && <span className="co-error">{errors.phone}</span>}
              </div>

              <div className={`co-field ${errors.governorate ? "co-field--error" : ""}`}>
                <label>{isRtl ? "المحافظة" : "Governorate"} *</label>
                <select value={form.governorate} onChange={handleChange("governorate")}>
                  <option value="">{isRtl ? "اختر المحافظة" : "Select governorate"}</option>
                  {govList.map((g, i) => (
                    <option key={i} value={GOVERNORATES[i]}>{g}</option>
                  ))}
                </select>
                {errors.governorate && <span className="co-error">{errors.governorate}</span>}
              </div>
            </div>

            <div className={`co-field ${errors.address ? "co-field--error" : ""}`}>
              <label>{isRtl ? "العنوان بالتفصيل" : "Detailed Address"} *</label>
              <textarea
                rows={3}
                placeholder={
                  isRtl
                    ? "الشارع، المبنى، الشقة، علامة مميزة…"
                    : "Street, building, apartment, landmark…"
                }
                value={form.address}
                onChange={handleChange("address")}
              />
              {errors.address && <span className="co-error">{errors.address}</span>}
            </div>
          </section>

          {/* Payment Method */}
          <section className="checkout-section">
            <h3 className="checkout-section-title">
              <i className="fa-solid fa-credit-card" />
              {isRtl ? " طريقة الدفع" : " Payment Method"}
            </h3>

            <div className="co-payment-options">
              <label className={`co-payment-card ${paymentMethod === "cash" ? "is-selected" : ""}`}>
                <input
                  type="radio"
                  name="payment"
                  value="cash"
                  checked={paymentMethod === "cash"}
                  onChange={() => setPaymentMethod("cash")}
                />
                <span className="co-payment-icon">
                  <i className="fa-solid fa-money-bill-wave" />
                </span>
                <span className="co-payment-label">
                  {isRtl ? "الدفع عند الاستلام" : "Cash on Delivery"}
                </span>
              </label>

              <label className={`co-payment-card ${paymentMethod === "instapay" ? "is-selected" : ""}`}>
                <input
                  type="radio"
                  name="payment"
                  value="instapay"
                  checked={paymentMethod === "instapay"}
                  onChange={() => setPaymentMethod("instapay")}
                />
                <span className="co-payment-icon">
                  <i className="fa-solid fa-mobile-screen-button" />
                </span>
                <span className="co-payment-label">InstaPay</span>
              </label>
            </div>

            {/* Instapay instructions */}
            {paymentMethod === "instapay" && (
              <div className="co-instapay-info">
                <p className="co-instapay-number">
                  <i className="fa-solid fa-paper-plane" />
                  {" "}
                  {isRtl
                    ? "أرسل المبلغ إلى رقم InstaPay:"
                    : "Send the total amount to InstaPay number:"}
                  {" "}
                  <strong>01000000</strong>
                </p>
                <p className="co-instapay-screenshot">
                  <i className="fa-solid fa-camera" />
                  {" "}
                  {isRtl
                    ? "التقط لقطة شاشة للدفع وأرسلها إلى واتساب  01000000 لتأكيد الطلب."
                    : "Take a screenshot of the payment and send it to 01000000 to confirm your order."}
                </p>
              </div>
            )}
          </section>

          <div className="co-whatsapp-notice">
            <i className="fa-brands fa-whatsapp" />
            <p>
              {isRtl
                ? "بعد النقر على تأكيد الطلب، سيتم توجيهك إلى واتساب. يجب النقر على إرسال لتأكيد الطلب."
                : "After clicking on Continue to Payment you will be directed to WhatsApp. You must click Send to confirm the order."}
            </p>
          </div>

          <button type="submit" className="co-submit-btn">
            <i className="fa-solid fa-bag-shopping" />
            {" "}
            {isRtl ? "تأكيد الطلب" : "Continue to Payment"}
          </button>
        </form>

        {/* ── RIGHT COLUMN: Order Summary ── */}
        <aside className="checkout-summary">
          <h3 className="checkout-summary-title">
            {isRtl ? "ملخص الطلب" : "Your Cart"}
          </h3>

          <div className="co-summary-items">
            {cartItems.length === 0 ? (
              <p className="co-summary-empty">
                {isRtl ? "سلة التسوق فارغة" : "Your cart is empty"}
              </p>
            ) : (
              cartItems.map((item) => {
                const n = parseFloat(item.price.replace(/[^\d.]/g, ""));
                return (
                  <div key={`${item.id}-${item.size}`} className="co-summary-item">
                    <div className="co-summary-img-wrap">
                      {item.image ? (
                        <img src={item.image} alt={item.name[language] || item.name.en} />
                      ) : (
                        <div className="co-summary-img-placeholder">
                          <i className="fa-solid fa-shirt" />
                        </div>
                      )}
                      <span className="co-summary-qty">{item.quantity}</span>
                    </div>
                    <div className="co-summary-info">
                      <p className="co-summary-name">{item.name[language] || item.name.en}</p>
                      <p className="co-summary-meta">
                        {isRtl ? "المقاس" : "Size"}: {item.size}
                      </p>
                    </div>
                    <span className="co-summary-price">
                      LE {(n * item.quantity).toFixed(2)}
                    </span>
                  </div>
                );
              })
            )}
          </div>

          <div className="co-summary-divider" />

          <div className="co-summary-row">
            <span>{isRtl ? "المجموع الفرعي" : "Subtotal"}</span>
            <span>LE {total.toFixed(2)}</span>
          </div>
          <div className="co-summary-row">
            <span>{isRtl ? "الشحن" : "Shipping"}</span>
            <span className="co-free-tag">{isRtl ? "مجاني" : "Free"}</span>
          </div>

          <div className="co-summary-divider" />

          <div className="co-summary-row co-summary-total">
            <span>{isRtl ? "الإجمالي" : "Total"}</span>
            <span>LE {total.toFixed(2)}</span>
          </div>

          <div className="co-no-return-warning">
            لا يوجد استرجاع لاي منتج تحت اي ظرف
          </div>
        </aside>
      </div>
    </div>
  );
};

export default Checkout;
