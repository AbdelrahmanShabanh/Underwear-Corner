import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
const fallbackSizes = ["S", "M", "L", "XL", "2XL", "3XL"];
import { translations } from "../i18n";
import Reveal from "../components/Reveal";

const ProductDetail = ({ language, onAddToCart }) => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const t = translations[language];
  const isRtl = language === "ar";

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState("");
  const [sizeError, setSizeError] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get("/api/products");
        setProducts(res.data.products);
      } catch (err) {
        console.error("Failed to load products:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
    setSelectedSize("");
    setSizeError(false);
  }, [productId]);

  const product = products.find((p) => p._id === productId);

  if (loading) {
    return (
      <section className="page product-detail">
        <div className="product-detail-layout">
          <div className="product-detail-media">
            <div className="skeleton-shimmer" style={{ width: "100%", height: "400px", borderRadius: "16px", backgroundColor: "rgba(255,255,255,0.06)" }} />
          </div>
          <div className="product-detail-body">
            <div className="skeleton-shimmer" style={{ width: "70%", height: "28px", borderRadius: "8px", backgroundColor: "rgba(255,255,255,0.06)", marginBottom: "1rem" }} />
            <div className="skeleton-shimmer" style={{ width: "100%", height: "16px", borderRadius: "6px", backgroundColor: "rgba(255,255,255,0.06)", marginBottom: "0.6rem" }} />
            <div className="skeleton-shimmer" style={{ width: "85%", height: "16px", borderRadius: "6px", backgroundColor: "rgba(255,255,255,0.06)", marginBottom: "1.5rem" }} />
            <div className="skeleton-shimmer" style={{ width: "35%", height: "22px", borderRadius: "8px", backgroundColor: "rgba(255,255,255,0.06)", marginBottom: "2rem" }} />
            <div style={{ display: "flex", gap: "0.5rem" }}>
              {[1,2,3,4].map(i => (
                <div key={i} className="skeleton-shimmer" style={{ width: "48px", height: "48px", borderRadius: "12px", backgroundColor: "rgba(255,255,255,0.06)" }} />
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (!product) {
    return (
      <section className="page">
        <p style={{ textAlign: "center", padding: "4rem" }}>{language === "en" ? "Product not found." : "المنتج غير موجود."}</p>
      </section>
    );
  }

  const isSoldOut = product.stock === 0;

  const handleAddClick = () => {
    if (!selectedSize) {
      setSizeError(true);
      return;
    }
    setSizeError(false);
    onAddToCart({ ...product, size: selectedSize });
  };

  const handleCheckoutClick = () => {
    if (!selectedSize) {
      setSizeError(true);
      return;
    }
    setSizeError(false);
    onAddToCart({ ...product, size: selectedSize });
    navigate("/checkout");
  };

  return (
    <Reveal>
      <section className="page product-detail">
        <button
          type="button"
          className="back-link"
          onClick={() => navigate(-1)}
        >
          {language === "en" ? "Back" : "رجوع"}
        </button>

        <div className="product-detail-layout">
          <div className="product-detail-media">
            <img src={product.image || "/product-placeholder.jpg"} alt={product.name[language]} loading="lazy" />
          </div>
          <div className="product-detail-body">
            <h1>{product.name[language]}</h1>
            <p className="product-detail-description">
              {product.description[language]}
            </p>
            
            {product.isOffer ? (
              <div className="product-priceRow" style={{ marginBottom: "1rem", display: "flex", alignItems: "baseline" }}>
                {product.oldPrice && (
                  <span className="product-oldPrice" style={{ color: "#ef4444", textDecoration: "line-through", fontSize: "1rem" }}>
                    LE {product.oldPrice.toFixed(2)}
                  </span>
                )}
                <span className="product-newPrice" style={{ fontSize: "1.2rem", fontWeight: "800", marginLeft: isRtl ? "0" : "0.5rem", marginRight: isRtl ? "0.5rem" : "0", color: "#f3f3f3" }}>
                  LE {product.price.toFixed(2)}
                </span>
                <span className="offer-badge" style={{ position: "relative", top: "auto", left: "auto", right: "auto", display: "inline-block", marginLeft: isRtl ? "0" : "0.5rem", marginRight: isRtl ? "0.5rem" : "0" }}>
                  {language === "en" ? "Special Offer" : "عرض خاص"}
                </span>
              </div>
            ) : (
              <div className="product-detail-price" style={{ fontSize: "1.2rem", fontWeight: "800", marginBottom: "1rem" }}>
                LE {product.price.toFixed(2)}
              </div>
            )}

            {isSoldOut ? (
              <div className="product-detail-sold-out">
                {language === "en" ? "Currently Sold Out" : "نفدت الكمية حالياً"}
              </div>
            ) : (
              <>
                <div className="product-detail-sizes">
                  <span className="sizes-label">
                    {language === "en" ? "Sizes" : "المقاسات"}
                  </span>
                  <div className="sizes-grid" style={{ alignItems: "flex-start" }}>
                    {(product.sizes && product.sizes.length > 0 ? product.sizes : fallbackSizes).map((s) => {
                      const szName = typeof s === 'string' ? s : s.name;
                      const szStock = typeof s === 'string' ? 1 : s.stock; 
                      const szNum = typeof s === 'string' ? null : s.sizeNumber;
                      const isSzSoldOut = szStock === 0;

                      return (
                        <div key={szName} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.25rem" }}>
                          <button
                            type="button"
                            disabled={isSzSoldOut}
                            className={`size-pill ${selectedSize === szName ? "is-selected" : ""} ${isSzSoldOut ? "is-disabled" : ""}`}
                            style={selectedSize === szName ? { background: '#f3f3f3', color: '#111' } : (isSzSoldOut ? { opacity: 0.3, cursor: 'not-allowed', textDecoration: 'line-through' } : {})}
                            onClick={() => {
                              if (isSzSoldOut) return;
                              setSelectedSize(szName);
                              setSizeError(false);
                            }}
                          >
                            {szName}
                          </button>
                          {szNum && product.hasSizeNumbers && (
                            <span style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.5)", background: "rgba(255,255,255,0.05)", width: "22px", height: "22px", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "50%" }}>
                              {szNum}
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                  {sizeError && (
                    <div style={{ color: "#ff6b6b", fontSize: "0.85rem", marginTop: "0.5rem" }}>
                      {language === "en" ? "Please select a size first." : "برجاء اختيار المقاس أولاً."}
                    </div>
                  )}
                </div>

                <div className="product-detail-actions">
                  <button
                    type="button"
                    className="hero-cta"
                    onClick={handleAddClick}
                  >
                    {language === "en" ? "Add to cart" : "أضف إلى السلة"}
                  </button>
                  <button
                    type="button"
                    className="secondary-cta"
                    onClick={handleCheckoutClick}
                  >
                    {language === "en" ? "Checkout" : "إتمام الشراء"}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        <div className="product-detail-featured">
          <h2>{t.youMayAlsoLike}</h2>
          <div className="products-grid">
            {products
              .filter((p) => p.category === product.category && p._id !== product._id)
              .slice(0, 3)
              .map((p) => {
                const isItemSoldOut = p.stock === 0;
                return (
                  <article
                    key={p._id}
                    className={`product-card ${isItemSoldOut ? "is-sold-out" : ""}`}
                    onClick={() => navigate(`/product/${p._id}`)}
                    style={{ cursor: "pointer" }}
                  >
                    <div className="product-media">
                      {p.isOffer && (
                        <span className="offer-badge" style={{ position: "absolute", top: "10px", right: "10px", zIndex: 2, background: "#d6b15e", color: "#111", padding: "0.2rem 0.5rem", borderRadius: "6px", fontSize: "0.75rem", fontWeight: "700" }}>
                          {language === "en" ? "Offer" : "عرض"}
                        </span>
                      )}
                      {isItemSoldOut && (
                        <div className="sold-out-badge">
                          {language === "en" ? "Sold Out" : "نفدت الكمية"}
                        </div>
                      )}
                      <img src={p.image || "/product-placeholder.jpg"} alt={p.name[language]} loading="lazy" />
                    </div>
                    <div className="product-body">
                      <h3 className="product-title">{p.name[language]}</h3>
                      <div className="product-priceRow" style={{ display: "flex", alignItems: "baseline", gap: "0.5rem" }}>
                        {p.isOffer && p.oldPrice && (
                         <span className="product-oldPrice" style={{ color: "#ef4444", textDecoration: "line-through", fontSize: "0.85rem" }}>
                           LE {p.oldPrice.toFixed(2)}
                         </span>
                        )}
                        <p className="product-price" style={{ margin: 0 }}>LE {p.price.toFixed(2)}</p>
                      </div>
                    </div>
                  </article>
                );
              })}
          </div>
        </div>
      </section>
    </Reveal>
  );
};

export default ProductDetail;

