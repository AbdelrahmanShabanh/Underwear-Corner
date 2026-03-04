import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { products, sizes } from "../data/products";
import { translations } from "../i18n";
import Reveal from "../components/Reveal";

const ProductDetail = ({ language, onAddToCart }) => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const t = translations[language];
  const isRtl = language === "ar";

  const [selectedSize, setSelectedSize] = useState("");
  const [sizeError, setSizeError] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [productId]);

  const product = products.find((p) => p.id === productId);

  if (!product) {
    return (
      <section className="page">
        <p>{language === "en" ? "Product not found." : "المنتج غير موجود."}</p>
      </section>
    );
  }

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
            <img src={product.image} alt={product.name[language]} />
          </div>
          <div className="product-detail-body">
            <h1>{product.name[language]}</h1>
            <p className="product-detail-description">
              {product.description[language]}
            </p>
            
            {product.isOffer ? (
              <div className="product-priceRow" style={{ marginBottom: "1rem" }}>
                <span className="product-oldPrice">{product.oldPrice}</span>
                <span className="product-newPrice" style={{ fontSize: "1.2rem", fontWeight: "800", marginLeft: isRtl ? "0" : "0.5rem", marginRight: isRtl ? "0.5rem" : "0", color: "#f3f3f3" }}>{product.price}</span>
                <span className="offer-badge" style={{ position: "relative", top: "auto", left: "auto", right: "auto", display: "inline-block", marginLeft: isRtl ? "0" : "0.5rem", marginRight: isRtl ? "0.5rem" : "0" }}>
                  {language === "en" ? "Special Offer" : "عرض خاص"}
                </span>
              </div>
            ) : (
              <div className="product-detail-price">{product.price}</div>
            )}

            {product.isSoldOut ? (
              <div className="product-detail-sold-out">
                {language === "en" ? "Currently Sold Out" : "نفدت الكمية حالياً"}
              </div>
            ) : (
              <>
                <div className="product-detail-sizes">
                  <span className="sizes-label">
                    {language === "en" ? "Sizes" : "المقاسات"}
                  </span>
                  <div className="sizes-grid">
                    {sizes.map((size) => (
                      <button
                        key={size}
                        type="button"
                        className={`size-pill ${selectedSize === size ? "is-selected" : ""}`}
                        style={selectedSize === size ? { background: '#f3f3f3', color: '#111' } : {}}
                        onClick={() => {
                          setSelectedSize(size);
                          setSizeError(false);
                        }}
                      >
                        {size}
                      </button>
                    ))}
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
              .filter((p) => p.category === product.category && p.id !== product.id)
              .slice(0, 3)
              .map((p) => (
                <article
                  key={p.id}
                  className="product-card"
                  onClick={() => navigate(`/product/${p.id}`)}
                >
                  <div className="product-media">
                    <img src={p.image} alt={p.name[language]} />
                  </div>
                  <div className="product-body">
                    <h3 className="product-title">{p.name[language]}</h3>
                    <p className="product-price">{p.price}</p>
                  </div>
                </article>
              ))}
          </div>
        </div>
      </section>
    </Reveal>
  );
};

export default ProductDetail;

