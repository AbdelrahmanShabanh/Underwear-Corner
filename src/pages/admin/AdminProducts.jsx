import { useState, useEffect } from "react";
import axios from "axios";

const SIZES_LIST = ["S", "M", "L", "XL", "2XL", "3XL", "4XL", "5XL"];
const defaultSizeNumbers = {
  S: 2, M: 3, L: 4, XL: 5, "2XL": 6, "3XL": 7, "4XL": 8, "5XL": 9
};

const initialFormState = {
  nameEn: "",
  nameAr: "",
  descEn: "",
  descAr: "",
  price: "",
  category: "men",
  image: "",
  hasSizeNumbers: false,
  sizes: [],
  isOffer: false,
  oldPrice: "",
};

const AdminProducts = ({ language }) => {
  const isRtl = language === "ar";
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentProductId, setCurrentProductId] = useState(null);
  const [form, setForm] = useState(initialFormState);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await axios.get("/api/products");
      setProducts(res.data.products);
    } catch (err) {
      console.error("Failed to fetch products:", err);
      setError(isRtl ? "فشل تحميل المنتجات" : "Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (product = null) => {
    if (product) {
      setIsEditing(true);
      setCurrentProductId(product._id);
      setForm({
        nameEn: product.name.en,
        nameAr: product.name.ar,
        descEn: product.description.en,
        descAr: product.description.ar,
        price: product.price,
        category: product.category,
        image: product.image,
        hasSizeNumbers: product.hasSizeNumbers || false,
        sizes: product.sizes || [],
        isOffer: product.isOffer,
        oldPrice: product.oldPrice || "",
      });
    } else {
      setIsEditing(false);
      setCurrentProductId(null);
      setForm(initialFormState);
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setForm(initialFormState);
    setCurrentProductId(null);
    setIsEditing(false);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    const payload = {
      name: { en: form.nameEn, ar: form.nameAr },
      description: { en: form.descEn, ar: form.descAr },
      price: Number(form.price),
      category: form.category,
      image: form.image,
      hasSizeNumbers: form.hasSizeNumbers,
      sizes: form.sizes.map(s => ({
        name: s.name,
        stock: Number(s.stock) || 0,
        sizeNumber: form.hasSizeNumbers ? (Number(s.sizeNumber) || defaultSizeNumbers[s.name]) : undefined
      })),
      stock: form.sizes.reduce((sum, s) => sum + (Number(s.stock) || 0), 0),
      isOffer: form.isOffer,
    };

    if (form.isOffer && form.oldPrice) {
      payload.oldPrice = Number(form.oldPrice);
    }

    try {
      if (isEditing) {
        await axios.put(`/api/products/${currentProductId}`, payload);
      } else {
        await axios.post("/api/products", payload);
      }
      await fetchProducts();
      handleCloseModal();
    } catch (err) {
      console.error("Failed to save product:", err);
      alert(isRtl ? "حدث خطأ أثناء الحفظ" : "Error saving product");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm(isRtl ? "هل أنت متأكد من حذف هذا المنتج؟" : "Are you sure you want to delete this product?")) {
      return;
    }
    try {
      await axios.delete(`/api/products/${id}`);
      setProducts((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      console.error("Failed to delete product:", err);
      alert(isRtl ? "حدث خطأ أثناء الحذف" : "Error deleting product");
    }
  };

  const getStockStatus = (stock) => {
    if (stock === 0) return { label: isRtl ? "نفذت الكمية" : "Out of Stock", color: "#6b7280", bg: "rgba(107, 114, 128, 0.15)" }; // Gray
    if (stock > 7) return { label: isRtl ? "في المخزن" : "In Stock", color: "#4ade80", bg: "rgba(74, 222, 128, 0.15)" }; // Green
    if (stock > 2) return { label: isRtl ? "مخزون متوسط" : "Low Stock", color: "#facc15", bg: "rgba(250, 204, 21, 0.15)" }; // Yellow
    return { label: isRtl ? "على وشك النفاذ" : "Critical Stock", color: "#ef4444", bg: "rgba(239, 68, 68, 0.15)" }; // Red
  };

  if (loading) {
    return (
      <div className="admin-loading">
        <div className="admin-loading-spinner" />
      </div>
    );
  }

  return (
    <div>
      <div className="orders-filter-bar" style={{ marginBottom: "2rem" }}>
        <h2 className="orders-title">
          <i className="fa-solid fa-box-open" style={{ marginRight: isRtl ? 0 : "0.5rem", marginLeft: isRtl ? "0.5rem" : 0 }}></i>
          {isRtl ? "إدارة المنتجات" : "Products Management"}
        </h2>
        <button className="login-btn" style={{ width: "auto", padding: "0.6rem 1.25rem", margin: 0 }} onClick={() => handleOpenModal()}>
          <i className="fa-solid fa-plus"></i> {isRtl ? "إضافة منتج جديد" : "Add New Product"}
        </button>
      </div>

      {error ? (
        <div className="admin-empty">
          <i className="fa-solid fa-triangle-exclamation" style={{ color: "#ef4444" }}></i>
          <p>{error}</p>
        </div>
      ) : products.length === 0 ? (
        <div className="admin-empty">
          <i className="fa-solid fa-box-open"></i>
          <p>{isRtl ? "لا توجد منتجات حالياً. أضف منتجك الأول!" : "No products found. Add your first product!"}</p>
        </div>
      ) : (
        <div className="stats-section" style={{ padding: 0, overflow: "hidden" }}>
          <div className="stats-recent-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>{isRtl ? "المنتج" : "Product"}</th>
                  <th>{isRtl ? "السعر" : "Price"}</th>
                  <th>{isRtl ? "المخزون" : "Stock"}</th>
                  <th>{isRtl ? "القسم" : "Category"}</th>
                  <th>{isRtl ? "حالة العرض" : "Offer Status"}</th>
                  <th style={{ textAlign: "center" }}>{isRtl ? "إجراءات" : "Actions"}</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => {
                  const stockStatus = getStockStatus(product.stock);
                  return (
                    <tr key={product._id} style={product.stock === 0 ? { opacity: 0.6 } : {}}>
                      <td>
                        <div className="user-cell">
                          <img 
                            src={product.image || "/product-placeholder.jpg"} 
                            alt={product.name.en} 
                            style={{ width: "40px", height: "40px", borderRadius: "8px", objectFit: "cover" }} 
                            onError={(e) => { e.target.src = "/product-placeholder.jpg" }}
                          />
                          <div style={{ display: "flex", flexDirection: "column" }}>
                            <span style={{ fontWeight: 600 }}>{isRtl ? product.name.ar : product.name.en}</span>
                            <span style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.45)" }}>ID: {product._id.slice(-6)}</span>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div style={{ display: "flex", flexDirection: "column" }}>
                          <span style={{ fontWeight: 700, color: "#f3f3f3" }}>LE {product.price}</span>
                          {product.isOffer && product.oldPrice && (
                            <span style={{ fontSize: "0.75rem", color: "#ef4444", textDecoration: "line-through" }}>
                              LE {product.oldPrice}
                            </span>
                          )}
                        </div>
                      </td>
                      <td>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                          <span style={{ fontWeight: 700 }}>{product.stock}</span>
                          <span style={{
                            fontSize: "0.7rem",
                            padding: "0.2rem 0.5rem",
                            borderRadius: "999px",
                            backgroundColor: stockStatus.bg,
                            color: stockStatus.color,
                            fontWeight: 600,
                            whiteSpace: "nowrap"
                          }}>
                            {stockStatus.label}
                          </span>
                        </div>
                      </td>
                      <td style={{ textTransform: "capitalize" }}>
                        {product.category === "men" ? (isRtl ? "رجالي" : "Men") : 
                         product.category === "women" ? (isRtl ? "حريمي" : "Women") : 
                         (isRtl ? "أطفالي" : "Kids")}
                      </td>
                      <td>
                        {product.isOffer ? (
                          <span style={{ color: "#d6b15e", fontSize: "0.8rem", fontWeight: 600 }}>
                            <i className="fa-solid fa-tag" style={{ marginRight: "4px" }}></i> {isRtl ? "في العرض" : "Active Offer"}
                          </span>
                        ) : (
                          <span style={{ color: "rgba(255,255,255,0.3)" }}>—</span>
                        )}
                      </td>
                      <td style={{ textAlign: "center" }}>
                        <div style={{ display: "flex", gap: "0.5rem", justifyContent: "center" }}>
                          <button 
                            className="icon-button" 
                            title={isRtl ? "تعديل" : "Edit"}
                            onClick={() => handleOpenModal(product)}
                            style={{ width: "32px", height: "32px", background: "rgba(255,255,255,0.05)" }}
                          >
                            <i className="fa-solid fa-pen" style={{ fontSize: "0.8rem" }}></i>
                          </button>
                          <button 
                            className="icon-button" 
                            title={isRtl ? "حذف" : "Delete"}
                            onClick={() => handleDelete(product._id)}
                            style={{ width: "32px", height: "32px", background: "rgba(239, 68, 68, 0.1)", color: "#ef4444" }}
                          >
                            <i className="fa-solid fa-trash" style={{ fontSize: "0.8rem" }}></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Product Modal */}
      {isModalOpen && (
        <div className="product-modal-backdrop" onClick={handleCloseModal}>
          <div className="product-modal-content" onClick={(e) => e.stopPropagation()} dir={isRtl ? "rtl" : "ltr"}>
            <div className="product-modal-header">
              <h3>{isEditing ? (isRtl ? "تعديل المنتج" : "Edit Product") : (isRtl ? "إضافة منتج جديد" : "Add New Product")}</h3>
              <button className="icon-button" onClick={handleCloseModal}>
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="product-modal-form">
              <div className="form-row-2">
                <div className="login-field">
                  <label>{isRtl ? "الاسم (إنجليزي)" : "Name (English)"} *</label>
                  <input type="text" name="nameEn" value={form.nameEn} onChange={handleInputChange} required />
                </div>
                <div className="login-field">
                  <label>{isRtl ? "الاسم (عربي)" : "Name (Arabic)"} *</label>
                  <input type="text" name="nameAr" value={form.nameAr} onChange={handleInputChange} required dir="rtl" />
                </div>
              </div>

              <div className="form-row-2">
                <div className="login-field">
                  <label>{isRtl ? "الوصف (إنجليزي)" : "Description (English)"} *</label>
                  <textarea name="descEn" value={form.descEn} onChange={handleInputChange} required className="product-textarea"></textarea>
                </div>
                <div className="login-field">
                  <label>{isRtl ? "الوصف (عربي)" : "Description (Arabic)"} *</label>
                  <textarea name="descAr" value={form.descAr} onChange={handleInputChange} required dir="rtl" className="product-textarea"></textarea>
                </div>
              </div>

              <div className="form-row-3">
                <div className="login-field">
                  <label>{isRtl ? "السعر" : "Price"} *</label>
                  <input type="number" name="price" value={form.price} onChange={handleInputChange} required min="0" step="0.01" />
                </div>
                <div className="login-field">
                  <label>{isRtl ? "القسم" : "Category"} *</label>
                  <select name="category" value={form.category} onChange={handleInputChange} className="product-select">
                    <option value="men">{isRtl ? "رجالي" : "Men"}</option>
                    <option value="women">{isRtl ? "حريمي" : "Women"}</option>
                    <option value="kids">{isRtl ? "أطفالي" : "Kids"}</option>
                  </select>
                </div>
              </div>

              {/* SIZES SECTION */}
              <div className="sizes-admin-section" style={{ background: "rgba(255,255,255,0.03)", padding: "1rem", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.1)", marginBottom: "1rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                  <h4 style={{ margin: 0, fontSize: "1rem", fontWeight: 600 }}>{isRtl ? "المقاسات والمخزون" : "Sizes & Stock"}</h4>
                  <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer", margin: 0 }}>
                    <input 
                      type="checkbox" 
                      name="hasSizeNumbers"
                      checked={form.hasSizeNumbers}
                      onChange={handleInputChange}
                      style={{ width: "16px", height: "16px" }}
                    />
                    <span style={{ fontSize: "0.85rem", color: "#d6b15e" }}>{isRtl ? "إضافة أرقام للمقاسات (3, 4, 5...)" : "Add Size Numbers (3, 4, 5...)"}</span>
                  </label>
                </div>
                
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginBottom: "1rem" }}>
                  {SIZES_LIST.map(size => {
                    const isSelected = form.sizes.some(s => s.name === size);
                    return (
                      <button 
                        key={size}
                        type="button" 
                        onClick={() => {
                          setForm(prev => {
                            if (isSelected) {
                              return { ...prev, sizes: prev.sizes.filter(s => s.name !== size) };
                            } else {
                              return { ...prev, sizes: [...prev.sizes, { name: size, stock: 0, sizeNumber: defaultSizeNumbers[size] || "" }] };
                            }
                          });
                        }}
                        style={{
                          padding: "0.4rem 0.8rem",
                          borderRadius: "6px",
                          border: `1px solid ${isSelected ? "#d6b15e" : "rgba(255,255,255,0.2)"}`,
                          background: isSelected ? "rgba(214, 177, 94, 0.15)" : "transparent",
                          color: isSelected ? "#d6b15e" : "#fff",
                          cursor: "pointer",
                          fontWeight: 600
                        }}
                      >
                        {size}
                      </button>
                    )
                  })}
                </div>

                {form.sizes.length > 0 && (
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))", gap: "1rem" }}>
                    {form.sizes.map(s => (
                      <div key={s.name} style={{ background: "rgba(0,0,0,0.3)", padding: "0.75rem", borderRadius: "8px" }}>
                        <div style={{ fontWeight: 700, marginBottom: "0.5rem", textAlign: "center", color: "#f3f3f3" }}>{s.name}</div>
                        <div className="login-field" style={{ marginBottom: form.hasSizeNumbers ? "0.5rem" : "0" }}>
                          <label style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.6)" }}>{isRtl ? "المخزون" : "StockQty"}</label>
                          <input 
                            type="number" 
                            min="0"
                            value={s.stock}
                            onChange={(e) => setForm(prev => ({
                              ...prev,
                              sizes: prev.sizes.map(sz => sz.name === s.name ? { ...sz, stock: e.target.value } : sz)
                            }))}
                            style={{ padding: "0.4rem", fontSize: "0.85rem" }}
                            required
                          />
                        </div>
                        {form.hasSizeNumbers && (
                          <div className="login-field" style={{ marginBottom: 0 }}>
                            <label style={{ fontSize: "0.75rem", color: "#d6b15e" }}>{isRtl ? "رقم المقاس" : "Size Num"}</label>
                            <input 
                              type="number" 
                              value={s.sizeNumber}
                              onChange={(e) => setForm(prev => ({
                                ...prev,
                                sizes: prev.sizes.map(sz => sz.name === s.name ? { ...sz, sizeNumber: e.target.value } : sz)
                              }))}
                              style={{ padding: "0.4rem", fontSize: "0.85rem", borderColor: "rgba(214, 177, 94, 0.4)" }}
                            />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="login-field">
                <label>{isRtl ? "الصورة" : "Image"} *</label>
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        setForm(prev => ({ ...prev, image: reader.result }));
                      };
                      reader.readAsDataURL(file);
                    }
                  }} 
                  style={{ padding: "0.4rem", background: "rgba(255,255,255,0.05)", border: "1px dashed rgba(255,255,255,0.2)", borderRadius: "6px", cursor: "pointer" }}
                />
                {form.image && (
                  <div style={{ marginTop: "0.5rem", width: "60px", height: "60px", borderRadius: "8px", overflow: "hidden" }}>
                    <img src={form.image} alt="Preview" style={{ width: "100%", height: "100%", objectFit: "cover" }} onError={(e) => { e.target.src = "/product-placeholder.jpg" }} />
                  </div>
                )}
              </div>

              <div className="offer-section" style={{ background: "rgba(214, 177, 94, 0.05)", padding: "1rem", borderRadius: "12px", border: "1px solid rgba(214, 177, 94, 0.2)"}}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: form.isOffer ? "1rem" : 0 }}>
                  <input 
                    type="checkbox" 
                    id="isOfferCheckbox"
                    name="isOffer" 
                    checked={form.isOffer} 
                    onChange={handleInputChange} 
                    style={{ width: "18px", height: "18px", cursor: "pointer" }}
                  />
                  <label htmlFor="isOfferCheckbox" style={{ cursor: "pointer", fontWeight: 600, color: "#d6b15e", margin: 0 }}>
                    <i className="fa-solid fa-tag" style={{ marginRight: isRtl ? 0 : "0.5rem", marginLeft: isRtl ? "0.5rem" : 0 }}></i>
                    {isRtl ? "وضع هذا المنتج في عروض خاصة؟" : "Set this product as a special offer?"}
                  </label>
                </div>

                {form.isOffer && (
                  <div className="login-field">
                    <label style={{ color: "#d6b15e" }}>{isRtl ? "السعر القديم قبل العرض (اختياري)" : "Old Price before offer (Optional)"}</label>
                    <input type="number" name="oldPrice" value={form.oldPrice} onChange={handleInputChange} min="0" step="0.01" />
                    <small style={{ color: "rgba(255,255,255,0.4)" }}>
                      {isRtl ? "سيتم شطبه بجوار السعر الجديد" : "This will be crossed out next to the new price"}
                    </small>
                  </div>
                )}
              </div>

              <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
                <button type="submit" className="login-btn" disabled={saving}>
                  {saving ? <div className="login-spinner" style={{ borderColor: "#111", borderTopColor: "transparent" }}></div> : (isEditing ? (isRtl ? "تحديث المنتج" : "Update Product") : (isRtl ? "إضافة المنتج" : "Add Product"))}
                </button>
                <button type="button" className="login-btn" style={{ background: "rgba(255,255,255,0.1)", color: "#fff" }} onClick={handleCloseModal}>
                  {isRtl ? "إلغاء" : "Cancel"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;
