import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
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

const GOV_FEES = {
  "Cairo": 85, "Giza": 85,
  "Alexandria": 90,
  "Dakahlia": 100, "Beheira": 100, "Gharbia": 100, "Menofia": 100, 
  "Qalyubia": 100, "Damietta": 100, "Sharqia": 100, "Ismailia": 100, "Suez": 100,
  "Port Said": 50,
  "Fayoum": 110, "Beni Suef": 110, "Minya": 110, "Assiut": 110, 
  "Sohag": 110, "Qena": 110, "Luxor": 110, "Aswan": 110, 
  "Red Sea": 110, "New Valley": 110, "North Sinai": 110, 
  "South Sinai": 110, "Matrouh": 110,
};

const Checkout = ({ language, cartItems, onClearCart }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const isRtl = language === "ar";
  
  const searchParams = new URLSearchParams(location.search);
  const orderId = searchParams.get("orderId");

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
  const [showReturnPolicy, setShowReturnPolicy] = useState(false);
  const [draftOrder, setDraftOrder] = useState(null);
  const [isLoadingDraft, setIsLoadingDraft] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    
    // Fetch draft order if orderId exists
    if (orderId) {
      setIsLoadingDraft(true);
      axios.get(`/api/orders/${orderId}`)
        .then(res => setDraftOrder(res.data.order))
        .catch(err => console.error("Failed to load draft order", err))
        .finally(() => setIsLoadingDraft(false));
    }
  }, [orderId]);

  const parsePrice = (price) => {
    if (typeof price === 'number') return price;
    const match = String(price).match(/[\d.]+/);
    return match ? parseFloat(match[0]) : 0;
  };

  const activeItems = draftOrder ? draftOrder.items : cartItems;
  const total = activeItems.reduce((sum, item) => sum + parsePrice(item.price) * (Number(item.quantity) || 1), 0);
  const deliveryFee = form.governorate ? (GOV_FEES[form.governorate] || 110) : 0;
  const finalTotal = total + deliveryFee;

  const validate = () => {
    const errs = {};
    if (!form.fullName.trim()) errs.fullName = isRtl ? "الاسم مطلوب" : "Full name is required";
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email))
      errs.email = isRtl ? "بريد إلكتروني غير صحيح" : "Valid email is required";
    if (!form.phone.trim() || form.phone.replace(/\D/g, "").length !== 11)
      errs.phone = isRtl ? "رقم هاتف غير صحيح" : "Valid phone number is required";
    if (!form.governorate) errs.governorate = isRtl ? "اختر المحافظة" : "Governorate is required";
    if (!form.address.trim()) errs.address = isRtl ? "العنوان مطلوب" : "Address is required";
    return errs;
  };

  const buildWhatsAppMessage = () => {
    const itemLines = activeItems
      .map(
        (item) =>
          `• ${item.name?.en || item.name} | Size: ${item.size} | Qty: ${item.quantity} | Price: ${item.price}`
      )
      .join("\n");

    const govLabel = form.governorate;
    const payment =
     paymentMethod === "cash"
  ? "Cash on Delivery"
  : <>Instapay (sent to{" "}
      <span
        onClick={() => {
          navigator.clipboard.writeText("01289527837");
          alert("Number copied!");
        }}
        style={{ cursor: "pointer", color: "#d6b15e", textDecoration: "underline" }}
      >
        01289527837
      </span>
    )</>

    let msgStr = `*${isRtl ? "طلب جديد من" : "New Order from"} ${form.fullName}*\n\n`;
    if (orderId) msgStr += `*Order ID:* ${orderId}\n\n`;
    
    return (
      msgStr +
      `*Contact:*\n📞 ${form.phone}\n📧 ${form.email}\n\n` +
      `*Address:*\n📍 ${govLabel}\n🏠 ${form.address}\n\n` +
      `📦 *Order Items*\n${itemLines}\n\n` +
      `💰 *Subtotal: LE ${total.toFixed(2)}*\n` +
      `🚚 *Delivery Fee: LE ${deliveryFee.toFixed(2)}*\n` +
      `💰 *Total: LE ${finalTotal.toFixed(2)}*\n` +
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
      if (orderId) {
        // Confirm existing draft
        await axios.put(`/api/orders/${orderId}/confirm`, {
          customer: {
            fullName: form.fullName,
            email: form.email,
            phone: form.phone,
            governorate: form.governorate,
            address: form.address,
          },
          total: finalTotal,
          paymentMethod,
        });
      } else {
        // Fallback: create fresh order if no orderId
        const orderItems = activeItems.map((item) => ({
          productId: item._id,
          name: item.name?.en || item.name,
          size: item.size,
          quantity: item.quantity,
          price: parsePrice(item.price),
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
          total: finalTotal,
          paymentMethod,
          userId: user?.id || null,
        });
      }
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
                  <option value="" style={{ color: "#000" }}>{isRtl ? "اختر المحافظة" : "Select governorate"}</option>
                  {govList.map((g, i) => (
                    <option key={i} value={GOVERNORATES[i]} style={{ color: "#000" }}>{g}</option>
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
  <strong
    onClick={() => {
      navigator.clipboard.writeText("01289527837");
      alert(isRtl ? "تم نسخ الرقم!" : "Number copied!");
    }}
    style={{ cursor: "pointer", color: "#d6b15e", textDecoration: "underline" }}
  >
    01289527837
  </strong>
</p>
<p className="co-instapay-screenshot">
  <i className="fa-solid fa-camera" />
  {" "}
  {isRtl
    ? <>التقط لقطة شاشة للدفع وأرسلها إلى واتساب{" "}
        <span
          onClick={() => {
            navigator.clipboard.writeText("01030799748");
            alert(isRtl ? "تم نسخ الرقم!" : "Number copied!");
          }}
          style={{ cursor: "pointer", color: "#d6b15e", textDecoration: "underline" }}
        >
          01030799748
        </span>
        {" "}لتأكيد الطلب.</>
    : <>Take a screenshot of the payment and send it to{" "}
        <span
          onClick={() => {
            navigator.clipboard.writeText("01030799748");
            alert(isRtl ? "تم نسخ الرقم!" : "Number copied!");
          }}
          style={{ cursor: "pointer", color: "#d6b15e", textDecoration: "underline" }}
        >
          01030799748
        </span>
        {" "}to confirm your order.</>}
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
                return (
                  <div key={`${item._id}-${item.size}`} className="co-summary-item">
                    <div className="co-summary-img-wrap">
                      {item.image ? (
                        <img src={item.image} alt={item.name[language] || item.name.en} loading="lazy" />
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
                      LE {(item.price * item.quantity).toFixed(2)}
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
            {deliveryFee === 0 && !form.governorate ? (
              <span className="co-free-tag" style={{ background: "rgba(255,255,255,0.1)", color: "#999", border: "none" }}>{isRtl ? "اختر المحافظة" : "Select Gov"}</span>
            ) : deliveryFee === 0 ? (
              <span className="co-free-tag">{isRtl ? "مجاني" : "Free"}</span>
            ) : (
              <span>LE {deliveryFee.toFixed(2)}</span>
            )}
          </div>

          <div className="co-summary-divider" />

          <div className="co-summary-row co-summary-total">
            <span>{isRtl ? "الإجمالي" : "Total"}</span>
            <span>LE {finalTotal.toFixed(2)}</span>
          </div>

          <div className="co-no-return-warning" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem" }}>
            لا يوجد استرجاع لاي منتج تحت اي ظرف
            <button 
              type="button" 
              onClick={() => setShowReturnPolicy(true)}
              style={{
                background: "transparent",
                border: "1px solid #ff4d4f",
                color: "#ff4d4f",
                borderRadius: "50%",
                width: "20px",
                height: "20px",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "0.75rem",
                fontWeight: "bold",
                cursor: "pointer",
                padding: 0,
                lineHeight: 1
              }}
              title={isRtl ? "عرض سياسة الاسترجاع" : "View Return Policy"}
            >
              ?
            </button>
          </div>
        </aside>
      </div>

      {showReturnPolicy && (
        <div className="return-policy-modal" style={{
          position: "fixed",
          top: 0, left: 0, right: 0, bottom: 0,
          background: "rgba(0,0,0,0.7)",
          zIndex: 9999,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "1rem"
        }}>
          <div className="return-policy-content" style={{
            background: "#1a1a24",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: "16px",
            padding: "1.5rem",
            maxWidth: "500px",
            width: "100%",
            position: "relative",
            direction: "rtl",
            textAlign: "right",
            boxShadow: "0 10px 30px rgba(0,0,0,0.5)"
          }}>
            <button 
              type="button" 
              onClick={() => setShowReturnPolicy(false)}
              style={{
                position: "absolute",
                top: "1rem",
                left: "1rem",
                background: "transparent",
                border: "none",
                color: "rgba(255,255,255,0.6)",
                fontSize: "1.25rem",
                cursor: "pointer"
              }}
            >
              <i className="fa-solid fa-xmark" />
            </button>
            <h3 style={{ color: "#d6b15e", marginTop: 0, marginBottom: "1rem", fontSize: "1.2rem" }}>سياسة الاسترجاع والاستبدال</h3>
            <div style={{ fontSize: "0.9rem", lineHeight: "1.6", color: "#f3f3f3" }}>
              <p style={{ marginBottom: "0.75rem" }}><strong>عميلنا العزيز،</strong> حرصاً منا على سلامتك العامة وطبقاً للاشتراطات الصحية المتبعة عالمياً وفي قانون حماية المستهلك المصري:</p>
              
              <p style={{ marginBottom: "0.75rem" }}>
                <strong style={{ color: "#ff4d4f" }}>المنتجات الشخصية:</strong> نعتذر عن استبدال أو استرجاع أي من قطع الملابس الداخلية (البوكسرات، الفانلات، الملابس الداخلية الحريمي) بمجرد استلامها وفتح الغلاف الخاص بها، وذلك لضمان أعلى معايير النظافة والصحة العامة لجميع عملائنا.
              </p>
              
              <p style={{ marginBottom: "0.75rem" }}>
                <strong style={{ color: "#d6b15e" }}>المعاينة عند الاستلام:</strong> يرجى التأكد من المقاس والنوع والعدد فور وصول المندوب وقبل فتح الغلاف الداخلي للمنتج. في حالة وجود أي اختلاف أو رغبة في التراجع، يمكنكم رفض الاستلام مع دفع مصاريف الشحن فقط.
              </p>
              
              <p style={{ marginBottom: "0.75rem" }}>
                <strong style={{ color: "#d6b15e" }}>عيوب الصناعة:</strong> في حالة وجود عيب صناعة واضح في المنتج، يتم التواصل معنا خلال 24 ساعة من الاستلام، وسنقوم باستبدال المنتج مجاناً دون تحملكم أي تكاليف إضافية (بشرط عدم استخدام المنتج).
              </p>
              
              <p style={{ margin: 0 }}>
                <strong style={{ color: "#d6b15e" }}>المقاسات:</strong> يرجى مراجعة "جدول المقاسات" الموضح في صفحة كل منتج بعناية قبل الطلب، حيث أن اختيار المقاس الخاطئ لا يمنح الحق في الاسترجاع بعد فتح المنتج.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Checkout;
